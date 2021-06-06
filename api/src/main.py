import config
config.load_credentials()

from api import serve

if __name__ == '__main__':
    serve()
