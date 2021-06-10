import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, shippers, users, shipments, items, quotes, notifications
import config

api = FastAPI()

api.include_router(
    auth.router,
    tags=['auth'],
    prefix='/auth'
)
api.include_router(
    shippers.router,
    tags=['shippers'],
    prefix='/shippers'
)
api.include_router(
    users.router,
    tags=['users'],
    prefix='/users'
)
api.include_router(
    shipments.router,
    tags=['shipments'],
    prefix='/shipments'
)
api.include_router(
    items.router,
    tags=['items'],
    prefix='/shipments'
)
api.include_router(
    quotes.router,
    tags=['quotes'],
    prefix='/shipments'
)
api.include_router(
    notifications.router,
    tags=['notifications'],
    prefix='/notifications'
)

origins = [
    'http://localhost:8080',
    'http://127.0.0.1:8080',
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@api.on_event('startup')
async def startup():
    config.load_credentials()

def serve():
    uvicorn.run(
        'api:api',
        host=config.http_host,
        port=config.http_port,
        reload=True
    )