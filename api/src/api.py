import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, shippers, users, shipments, items, quotes,\
    notifications, messages, locations, websockets
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
api.include_router(
    messages.router,
    tags=['messages'],
    prefix='/messages'
)
api.include_router(
    locations.router,
    tags=['locations'],
    prefix='/locations'
)
api.include_router(
    websockets.router,
    tags=['websockets']
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
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
        reload=True,
        reload_dirs=['src']
    )