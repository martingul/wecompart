import stripe

from storage import DatabaseSession
from schemas.service import ServiceCreate
from models.service import Service

def create_service(db: DatabaseSession, service: ServiceCreate):
    try:
        service_db = Service(
            **service.dict()
        )
        db.add(service_db)
        db.flush()

        product_stripe = stripe.Product.create(
            name=service.name,
            shippable=False
        )
        service_db.stripe_product_id = product_stripe['id']

        db.commit()
        db.refresh(service_db)

        return service_db
    except Exception as e:
        print(e)
        raise e