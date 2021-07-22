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
        db.commit()
        db.refresh(service_db)

        service_db.stripe_product_id = stripe.Product.create(
            name=service.name,
            shippable=False
        )

        db.commit()
        db.refresh(service_db)

        return service_db
    except Exception as e:
        print(e)
        raise e