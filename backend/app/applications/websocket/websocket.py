import asyncio
from typing import List

from fastapi import APIRouter, WebSocket, Depends
from fastapi.websockets import WebSocketState
from fastapi.responses import HTMLResponse
from fastapi import HTTPException

from app.core.auth.utils.contrib import get_current_user
from app.applications.users.models import User

router = APIRouter()

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8083/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

    async def check_connection(self, websocket: WebSocket):
        if websocket in self.active_connections:
            return True
        return False


manager = ConnectionManager()


# HEART_BEAT_INTERVAL = 5

# async def is_websocket_active(
#         ws: WebSocket
# ):
#     if not(ws.application_state == WebSocketState.CONNECTED and ws.client_state == WebSocketState.CONNECTED):
#         return False
#     try:
#         await asyncio.wait_for(ws.send_json({'type': 'ping'}), HEART_BEAT_INTERVAL)
#         message = await asyncio.wait_for(ws.receive_json(), HEART_BEAT_INTERVAL)
#         assert message['type'] == 'pong'
#     except BaseException:
#         return False
#     return True


@router.get("/")
async def get():
    return HTMLResponse(html)


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket
):
    if await manager.check_connection(websocket):
        raise HTTPException(status_code=503, detail="Connetion is busy")
    await manager.connect(websocket)
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"send: {data}")