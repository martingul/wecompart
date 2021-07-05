from typing import List
import urllib
import config

def generate_map_url(path: List[str]) -> str:
    # FIXME this method leaks the api key, better design is to:
    # store the image on cloud (e.g. S3 bucket), return the url to it,
    # and check permissions on image access
    # TODO return itinerary (ground + aerial) instead of geodesic path
    api_url = f'{config.google_maps_api_url}staticmap'
    key = config.credentials.get('google_maps_key')
    map_id = '3af1c97252ddb98f'
    format = 'jpg'
    size='500x500'
    type='roadmap'
    path_color = '0x6366F1'
    path_weight = '5'
    path_geodesic = 'true'
    marker_size = 'tiny'

    url = f'{api_url}?size={size}&format={format}&type={type}&key={key}&map_id={map_id}'

    if path:
        url += f'&markers=color:{path_color}|size:{marker_size}'
        for p in path:
            url += f'|{urllib.parse.quote(p)}'
        url += f'&path=color:{path_color}|weight:{path_weight}|geodesic:{path_geodesic}'
        for p in path:
            url += f'|{urllib.parse.quote(p)}'

    return url
