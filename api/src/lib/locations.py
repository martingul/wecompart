import requests

import config

def read_locations(q: str):
    api_url = f'{config.google_maps_api_url}place/autocomplete/json'

    params = {
        'input': q,
        'types': 'address',
        'key': config.credentials.get('google_maps_key')
    }

    # TODO handle errors
    try:
        r = requests.get(api_url, params=params)
        predictions = r.json()['predictions'][:5]

        locations = [{'address_id': p['place_id'],
                'address_long': p['description'],
                'address_short': p['structured_formatting']['secondary_text']}
                for p in predictions]
    except Exception as e:
        print('error read_locations')
        print(vars(e))

    return locations

def read_location(id: str):
    api_url = f'{config.google_maps_api_url}place/details/json'
    key = config.credentials.get('google_maps_key')

    # TODO handle errors
    res = requests.get(api_url, params={'place_id': id, 'key': key})
    res_json = res.json()
    r = res_json['result']

    print(r)

    city = list(filter(lambda x: any(t in x['types'] for t in ['postal_town', 'locality', 'administrative_area_level_3']), r['address_components']))
    if len(city) > 0:
        city = city[0]['long_name']
    else:
        city = list(filter(lambda x: any(t in x['types'] for t in ['administrative_area_level_2']), r['address_components']))
        if len(city) > 0:
            city = city[0]['long_name']

    country = list(filter(lambda x: any(t in x['types'] for t in ['country']), r['address_components']))
    country_long = ''
    country_short = ''
    if len(country) > 0:
        country_long = country[0]['long_name']
        country_short = country[0]['short_name']

    location_long = r['formatted_address']
    location_short = f'{city}, {country_short}'

    return {
        'long': location_long,
        'short': location_short,
        'country': country_long
    }