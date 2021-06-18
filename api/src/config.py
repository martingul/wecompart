import json

db_host = 'localhost'
db_port = 5432

http_host: str = '0.0.0.0'
http_port: int = 5000

smtp_host: str = 'mail.privateemail.com'
smtp_port: int = 465

google_places_api_url: str = 'https://maps.googleapis.com/maps/api/place/'

def load_credentials():
    with open('credentials.json', 'r') as credentials_file:
        global credentials
        credentials = json.load(credentials_file)
