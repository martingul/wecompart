import os

db_host = os.environ.get('DB_HOST')
db_port = os.environ.get('DB_PORT')
db_name: str = os.environ.get('DB_NAME')
db_password: str = os.environ.get('DB_PASSWORD')

http_host: str = '0.0.0.0'
http_port: int = 5000

smtp_host: str = 'mail.privateemail.com'
smtp_port: int = 465
smtp_user: str = os.environ.get('SMTP_USER')
smtp_password: str = os.environ.get('SMTP_PASSWORD')

google_maps_api_url: str = 'https://maps.googleapis.com/maps/api/'
google_maps_id: str = '3af1c97252ddb98f'
google_maps_key: str = os.environ.get('GOOGLE_MAPS_KEY')

ipwhois_api_url: str = 'https://ipwhois.app/json/'

stripe_test_key: str = os.environ.get('STRIPE_TEST_KEY')