from fastapi import APIRouter, WebSocket, Depends
from fastapi.responses import HTMLResponse

from app.core.auth.utils.contrib import get_current_user
from app.applications.users.models import User

router = APIRouter()


@router.get("/")
async def get():
    return HTMLResponse(html)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    current_user: User = Depends(get_current_user)
):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"{current_user.username} send: {data}")