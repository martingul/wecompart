import stripe
from fastapi import APIRouter, Request, Depends, HTTPException, status

from storage import db_session, DatabaseSession
from lib import shipments
from schemas.shipment import ShipmentUpdate

router = APIRouter()

@router.post('/stripe')
async def stripe_webhook(request: Request,
    db: DatabaseSession = Depends(db_session)):
    event = None
    try:
        payload_json = await request.json()
        event = stripe.Event.construct_from(
            payload_json, stripe.api_key
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    if event.type == 'invoice.paid':
        try:
            invoice = event.data.object
            shipment_id = invoice['metadata']['shipment_id']
            shipment_db = shipments.read_shipment(db, shipment_id)
            patch = ShipmentUpdate(status='booked')
            shipment_db = shipments.update_shipment(db, shipment_db, patch)
        except Exception as e:
            print(e)
            raise e