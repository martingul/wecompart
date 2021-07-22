import stripe
import config
from tests import utils

config.load_credentials()
stripe.api_key = config.credentials.get('stripe_test_key')

def test_create_account():
    try:
        account_token = stripe.Token.create(account={
            'business_type': 'company',
            'tos_shown_and_accepted': True
        })
        account = stripe.Account.create(
            type='custom',
            country='FR',
            capabilities={
                'transfers': {
                    'requested': True
                },
                'card_payments': {
                    'requested': True
                }
            },
            account_token=account_token,
            business_profile={
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
            },
            # tos_acceptance={
            #     'service_agreement': 'recipient'
            # }
        )
        external_account = stripe.Account.create_external_account(
            account['id'],
            external_account={
                'object': 'bank_account',
                'country': 'US',
                'currency': 'usd',
                'routing_number': '110000000',
                'account_number': '000123456789',
            }
        )
        
        # random_address = utils.random_address()
        random_address = utils.french_address()
        account_token = stripe.Token.create(account={
            'company': {
                'address': {
                    'city': random_address['city'],
                    'line1': random_address['address1'], # 'address_full_match'
                    'postal_code': random_address['postalCode'],
                    # 'state': random_address['state']
                },
                'name': utils.fake.company(),
                'phone': '0000000000', # utils.fake.phone_number()
                'tax_id': '000000000',
            }
        })
        account = stripe.Account.modify(
            account['id'],
            account_token=account_token,
            business_profile={
                'url': f'https://{utils.fake.domain_name()}'
            },
        )

        # random_address = utils.random_address()
        person_representative = stripe.Account.create_person(
            account['id'],
            first_name=utils.fake.first_name(),
            last_name=utils.fake.last_name(),
            email=utils.fake.company_email(),
            phone='0000000000', #utils.fake.phone_number()
            id_number='000000000',
            address={
                'city': random_address['city'],
                'line1': random_address['address1'], # 'address_full_match'
                'postal_code': random_address['postalCode'],
                # 'state': random_address['state']
            },
            dob={
                'day': 1,
                'month': 1,
                'year': 1901
            },
            relationship={
                'representative': True,
                'executive': True,
                'title': 'Employee'
            }
        )

        person_owner = stripe.Account.create_person(
            account['id'],
            first_name=utils.fake.first_name(),
            last_name=utils.fake.last_name(),
            email=utils.fake.company_email(),
            address={
                'city': random_address['city'],
                'line1': random_address['address1'], # 'address_full_match'
                'postal_code': random_address['postalCode'],
                # 'state': random_address['state']
            },
            dob={
                'day': 1,
                'month': 1,
                'year': 1901
            },
            relationship={
                'owner': True,
                'director': True,
                'executive': True,
                'title': 'CEO'
            }
        )


        account_token = stripe.Token.create(account={
            'company': {
                'owners_provided': True,
                'directors_provided': True,
                'executives_provided': True
            }
        })
        stripe.Account.modify(
            account['id'],
            account_token=account_token,
        )

        account = stripe.Account.retrieve(account['id'])
        print(account)
    except Exception as e:
        print(e)
        raise e