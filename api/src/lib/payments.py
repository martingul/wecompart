import stripe
import config

stripe.api_key = config.credentials.get('stripe_test_key')

def create_account(country: str, email: str, role: str):
    business_type = 'individual'
    capabilities = {}
    individual = {}

    if role == 'shipper':
        business_type = 'company'
        capabilities['transfers'] = { 'requested': True }
        capabilities['card_payments'] = { 'requested': True }

    if role == 'standard':
        individual['email'] = email

    account = stripe.Account.create(
        type='express',
        country=country,
        email=email,
        business_type=business_type,
        capabilities=capabilities,
    )

    return account['id']

def create_account_links(account_id: str):
    account_links = stripe.AccountLink.create(
        account=account_id,
        refresh_url='http://localhost:8080/#!/',
        return_url='http://localhost:8080/#!/',
        type='account_onboarding'
    )
    return account_links['url']

def create_checkout_url(name: str, amount: int):
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': name,
                },
                'unit_amount': amount,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
    )
    print(checkout_session)
    return checkout_session.url