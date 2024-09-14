from django.shortcuts import render
from jsonschema import ValidationError
from pymongo import MongoClient
from django.http import HttpResponse, JsonResponse
import bcrypt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.utils.dateparse import parse_datetime
from bson import ObjectId




client = MongoClient("mongodb://localhost:27017")
db = client.horizonx
users_collection = db.users
property_collection=db.properties

@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    try:
        data = json.loads(request.body)
        password = data['password']

        if users_collection.find_one({"username": data['username']}):
            return JsonResponse({"error": "Username already exists"}, status=400)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        data['password'] = hashed_password
        users_collection.insert_one(data)
        return JsonResponse({"message" : "User created successfully "} , status = 201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = users_collection.find_one({"username": username})

        if user:
            if bcrypt.checkpw(password.encode("utf-8"), user["password"]):
                return JsonResponse(
                    {"message": "Login successful", "username": username}, status=200
                )
            else:
                return JsonResponse(
                    {"error": "Invalid username or password"}, status=400
                )
        else:
            return JsonResponse({"error": "Invalid username or password"}, status=400)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": "An error occurred during login"}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_property(request):
    try:
        if request.content_type.startswith('multipart/form-data'):
            data = request.POST.dict()
            id = users_collection.find_one({"username": data["username"]})["_id"]
            del data["username"]
            data["user_id"] = id

            images = request.FILES.getlist('images')
            virtual_tour = request.FILES.get('virtual_tour')
            if 'listing_date' in data:
                data['listing_date'] = parse_datetime(data.get('listing_date'))
            data['images'] = [image.name for image in images]
            if virtual_tour:
                data['virtual_tour'] = virtual_tour.name
            property_collection.insert_one(data)

        return JsonResponse({"message": "Property created successfully"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_http_methods(["GET"])
def get_all_properties_by_search(request, search_term=None):

    if search_term == 'all' or search_term is None:
 
        properties = list(property_collection.find({}))
    else:
 
        query = {
            '$or': [
                {'title': {'$regex': search_term, '$options': 'i'}},
                {'city': {'$regex': search_term, '$options': 'i'}},
                {'state': {'$regex': search_term, '$options': 'i'}},
                {'country': {'$regex': search_term, '$options': 'i'}}
            ]
        }
      
        properties = list(property_collection.find(query))
    for property in properties:
        property['_id'] = str(property['_id'])
        property['user_id'] = str(property['user_id'])

    return JsonResponse(properties, safe=False)

@require_http_methods(["GET"])
def get_all_properties_by_filters(request):
    square_feet_min = int(request.GET.get('squareFeetMin', 0))
    square_feet_max = int(request.GET.get('squareFeetMax', 10000))
    bedrooms_max = int(request.GET.get('bedroomsMax', 1))
    bathrooms_max = int(request.GET.get('bathroomsMax', 1))
    rating_max = int(request.GET.get('ratingMax', 1))
    amenities = request.GET.getlist('amenities')
    
    print('square_feet_min:', square_feet_min)
    print('square_feet_max:', square_feet_max)
    print('bedrooms_max:', bedrooms_max)
    print('bathrooms_max:', bathrooms_max)
    print('rating_max:', rating_max)
    
    query = {
        'square_feet': {'$gte': square_feet_min, '$lte': square_feet_max},
        'bedrooms': {'$lte': bedrooms_max},
        'bathrooms': {'$lte': bathrooms_max},
        'rating': {'$lte': rating_max},
    }
    
    if amenities:
        query['amenities'] = {'$all': amenities}
    
    pipeline = [
        {
            '$addFields': {
                'square_feet': {'$toInt': '$square_feet'},
                'bedrooms': {'$toInt': '$bedrooms'},
                'bathrooms': {'$toInt': '$bathrooms'},
                'rating': {'$toInt': '$rating'}
            }
        },
        {'$match': query}
    ]
    
    print('--------------------------- Pipeline is :', pipeline)
    
    properties = list(property_collection.aggregate(pipeline))
    
    # Convert ObjectId to string
    for property in properties:
        if '_id' in property:
            property['_id'] = str(property['_id'])
    
    print('--------------------------- Properties:', properties)
    
    return JsonResponse(properties, safe=False)

