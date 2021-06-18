from typing import List
from fastapi import WebSocket

from schemas.message import MessageRead

class Connection:
    def __init__(self, websocket: WebSocket, user_uuid: str):
        self.websocket = websocket
        self.user_uuid = user_uuid

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[Connection] = []

    async def connect(self, conn: Connection):
        await conn.websocket.accept()
        self.active_connections.append(conn)

    def disconnect(self, conn: Connection):
        self.active_connections.remove(conn)

    async def send_message(self, message: MessageRead):
        dst_conn = [c for c in self.active_connections if c.user_uuid == message.dst_user_uuid]
        if dst_conn:
            await dst_conn[0].websocket.send_text(message.json())

    async def broadcast(self, message: str, ignore: List[Connection] = None):
        connections = self.active_connections
        if ignore:
            connections = [c for c in connections if c not in ignore]
        for c in connections:
            await c.websocket.send_text(message)

manager = ConnectionManager()