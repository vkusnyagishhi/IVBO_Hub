from uuid import UUID
import json

def exclude_keys(d, keys):
    return {x: d[x] for x in d if x not in keys}


class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            # if the obj is uuid, we simply return the value of uuid
            return obj.hex
        return json.JSONEncoder.default(self, obj)