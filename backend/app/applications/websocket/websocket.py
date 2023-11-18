import asyncio
import anyio
from typing import List

from fastapi import APIRouter, WebSocket, Depends, Request, HTTPException
from fastapi.websockets import WebSocketState, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from pydantic import UUID4
from broadcaster import Broadcast

from app.core.auth.utils.contrib import get_current_user
from app.applications.websocket.base import ConnectionManager, manager
from app.applications.users.models import User
# from app.applications.homework.schemas import BaseHomeworkOut, BaseHomeworkUpdate
from app.applications.homework.models import Homework
from app.settings.config import settings


broadcast = Broadcast(f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}")
templates = Jinja2Templates("templates")
router = APIRouter()


class HomeworkEditConnectionManager(ConnectionManager):
    def __init__(self, *args, **kwargs):
        self.active_connections: List[dict] = []

    async def connect(self, 
                      websocket: WebSocket, 
                      homework_id: str, 
                      current_user: User = Depends(get_current_user)
    ):
        if self.check_connection(websocket):
            raise HTTPException(status_code=503, detail="Connection if busy")
        await websocket.accept()
        self.active_connections.append({"websocket": websocket,
                                        "homework_id": homework_id,
                                        "user": current_user})

    async def disconnect(self, websocket: WebSocket):
        for items in self.active_connections:
            if websocket == items["websocket"]:
                del self.active_connections[items]

    async def check_connection(self, homework_id: str):
        for items in self.active_connections:
            if homework_id in items["homework_id"]:
                return True
        return False
    

HEART_BEAT_INTERVAL = 5
async def is_websocket_active(ws: WebSocket) -> bool:
    if not (ws.application_state == WebSocketState.CONNECTED and ws.client_state == WebSocketState.CONNECTED):
        return False
    try:
        await asyncio.wait_for(ws.send_json({'type': 'ping'}), HEART_BEAT_INTERVAL)
        message = await asyncio.wait_for(ws.receive_json(), HEART_BEAT_INTERVAL)
        assert message['type'] == 'pong'
    except BaseException:  # asyncio.TimeoutError and ws.close()
        return False
    return True


homework_manager = HomeworkEditConnectionManager()


@router.get("/")
async def homepage(request: Request):
    template = "app/applications/websocket/index.html"
    context = {"request": request}
    return templates.TemplateResponse(template, context)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    homework_id: UUID4,
    current_user: User = Depends(get_current_user),
):
    await homework_manager.connect(websocket, homework_id, current_user)
    try:
        data = await Homework.get_or_none(uuid=homework_id)
        if not data:
            raise HTTPException(status_code=404, detail="The homework with this uuid does not exist")
        while True:
            data.text = await websocket.receive_text()
            if not is_websocket_active(websocket):
                await data.save()
    except WebSocketDisconnect:
        await data.save()
        homework_manager.disconnect(websocket)

