import stripe

def create_account(country: str, email: str):
    # TODO move this call on frontend with collected info
    try:
        account_details = {
            'tos_shown_and_accepted': True
        }
        account_token = stripe.Token.create(account=account_details)
        capabilities = {
            'transfers': {
                'requested': True
            },
            'card_payments': {
                'requested': True
            }
        }
        business_profile = {
            # full list: https://stripe.com/docs/connect/setting-mcc#list
            # MCC could also be:
            # - "Motor Freight Carriers and Trucking - Local and Long Distance,
            #   Moving and Storage Companies, and Local Delivery Services"
            #   `motor_freight_carriers_and_trucking` (4214)
            # - "Airlines, Air Carriers"
            #   `airlines_air_carriers` (4511)
            # MCC currently is:
            # "Transportation Services (Not Elsewhere Classified)"
            # `transportation_services` (4789)
            'mcc': '4789'
        }
        account = stripe.Account.create(
            type='custom',
            country=country,
            email=email,
            capabilities=capabilities,
            account_token=account_token,
            business_profile=business_profile
        )
        return account['id']
    except Exception as e:
        print(e)
        raise e

def create_account_link(account_id: str):
    try:
        account_link = stripe.AccountLink.create(
            account=account_id,
            refresh_url='http://localhost:8080/#!/',
            return_url='http://localhost:8080/#!/',
            type='account_onboarding',
            collect='currently_due',
        )
        return account_link['url']
    except Exception as e:
        print(e)
        raise e

def create_checkout_url(name: str, amount: int):
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': name,
                },
                'unit_amount': int(amount),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
    )
    return checkout_session.url