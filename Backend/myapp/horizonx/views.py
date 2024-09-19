import os
import random
from django.conf import settings
from django.shortcuts import render
from pymongo import MongoClient
from django.http import HttpResponse, JsonResponse
import bcrypt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.utils.dateparse import parse_datetime
from bson import ObjectId

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import joblib
import pandas as pd
import logging

logger = logging.getLogger(__name__)

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
@require_http_methods(["GET"])
def get_all_properties_by_search(request, sale_type, search_term=None):
    if sale_type == 'all':
        query = {}  # Fetch all properties regardless of saleType
    else:
        query = {'saleType': sale_type}
    
    if search_term and search_term != 'all':
        # Extend the query to include search terms
        search_query = {
            '$or': [
                {'title': {'$regex': search_term, '$options': 'i'}},
                {'city': {'$regex': search_term, '$options': 'i'}},
                {'state': {'$regex': search_term, '$options': 'i'}},
                {'country': {'$regex': search_term, '$options': 'i'}}
            ]
        }
        query.update(search_query)
    properties = list(property_collection.find(query))

    for property in properties:
        property['_id'] = str(property['_id'])
        property['user_id'] = str(property['user_id'])

    return JsonResponse(properties, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def get_all_properties_by_filters(request, sale_type):
    square_feet_min = int(request.GET.get('squareFeetMin', 0))
    square_feet_max = int(request.GET.get('squareFeetMax', 10000))
    bedrooms_max = int(request.GET.get('bedroomsMax', 1))
    bathrooms_max = int(request.GET.get('bathroomsMax', 1))
    rating_max = int(request.GET.get('ratingMax', 1))
    stories_max = int(request.GET.get('stories', 1)) 
    query = {
        'saleType': sale_type,
        'square_feet': {'$gte': square_feet_min, '$lte': square_feet_max},
        'bedrooms': {'$lte': bedrooms_max},
        'bathrooms': {'$lte': bathrooms_max},
        'rating': {'$lte': rating_max},
        'stories': {'$lte': stories_max}
    }

    pipeline = [
        {
            '$addFields': {
                'square_feet': {'$toInt': '$square_feet'},
                'bedrooms': {'$toInt': '$bedrooms'},
                'bathrooms': {'$toInt': '$bathrooms'},
                'rating': {'$toInt': '$rating'},
                'stories': {'$toInt': '$stories'}
            }
        },
        {'$match': query}
    ]

    properties = list(property_collection.aggregate(pipeline))

    print(f"Query: {query}")
    print(f"Pipeline: {pipeline}")
    print(f"Properties fetched: {properties}")
    for property in properties:
        property['_id'] = str(property['_id'])
        property['user_id'] = str(property['user_id'])

    return JsonResponse(properties, safe=False)

@csrf_exempt
@require_http_methods(["GET"])
def get_all_properties_by_username(request,username):
    id = users_collection.find_one({"username": username})["_id"]
    if not id:
            return JsonResponse({"error": "User not found"}, status=404)

    user_properties = list(property_collection.find({"user_id": ObjectId(id)}))
    for property in user_properties:
                property["_id"] = str(property["_id"])
                property["user_id"]=str(property["user_id"])

    return JsonResponse({"properties": user_properties}, status=200)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_property(request, propertyId):
    try:
        object_id = ObjectId(propertyId)
        result = property_collection.delete_one({"_id": object_id})
        print(result)
        if result.deleted_count > 0:
            return JsonResponse({"message": "Property deleted successfully"}, status=200)
        else:
            return JsonResponse({"message": "Property not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    

@csrf_exempt
@require_http_methods(["GET"])
def get_property_by_id(request, propertyId):
    try:

        object_id = ObjectId(propertyId)
        property = property_collection.find_one({"_id": object_id})
        
        if property:
    
            property["_id"] = str(property["_id"])
            property["user_id"] = str(property["user_id"])  
            return JsonResponse(property, safe=False, status=200)
        else:
            return JsonResponse({"error": "Property not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(['PATCH'])
def update_property_images(request, propertyId):
    if request.method == 'PATCH':
        logger.info('Request received for propertyId: %s', propertyId)
        if 'images' in request.FILES:
            images = request.FILES.getlist('images')
            image_urls = []
            for image in images:
                file_name = default_storage.save('property_images/' + image.name, ContentFile(image.read()))
                image_url = default_storage.url(file_name)
                image_urls.append(image_url)
                logger.info('Image saved: %s', image_url)
        if 'removedImages' in request.POST:
            removed_images = json.loads(request.POST.get('removedImages'))
            for image_path in removed_images:
                file_path = os.path.join(settings.MEDIA_ROOT, image_path)
                try:
                    os.remove(file_path)
                    logger.info('Removed image: %s', file_path)
                except FileNotFoundError:
                    logger.warning('Image not found for removal: %s', file_path)

        return JsonResponse({'message': 'Images updated successfully'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@require_http_methods(['PATCH'])
def update_property(request, propertyId):
    try:
        property_id = ObjectId(propertyId)
        property_obj = property_collection.find_one({"_id": property_id})
        
        if not property_obj:
            return JsonResponse({"error": "Property not found"}, status=404)
        data = json.loads(request.body)

        if 'user_id' in data:
            try:
                data['user_id'] = ObjectId(data['user_id'])
            except Exception:
                return JsonResponse({"error": "Invalid user_id format"}, status=400)
        update_fields = {k: v for k, v in data.items() if k != '_id'}
        
        property_collection.update_one({"_id": property_id}, {"$set": update_fields})
        
        return JsonResponse({"message": "Property updated successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(['POST'])
def upload_property(request):
    if request.method == 'POST':
        data = request.POST
        sale_type = data.get("saleType") 
        if(data.get("user")):
            username = data.get("user")
            user = users_collection.find_one({"username": username})
            if user is None:
                return JsonResponse({"error": "User not found"}, status=404)

            user_id = user["_id"]
        else:
            user_id = data.get("user_id")
        images = request.FILES.getlist('images')
        image_urls = []
        for image in images:
            file_name = default_storage.save('property_images/' + image.name, ContentFile(image.read()))
            image_url = default_storage.url(file_name)
            image_urls.append(image_url)

        property_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'property_type': data.get('property_type'),
            'bedrooms': data.get('bedrooms'),
            'bathrooms': data.get('bathrooms'),
            'square_feet': data.get('square_feet'),
            'listing_date': data.get('listing_date'),
            'amenities': data.get('amenities'),
            'rating': data.get('rating'),
            'address': data.get('address'),
            'city': data.get('city'),
            'state': data.get('state'),
            'country': data.get('country'),
            'saleType': sale_type,  
            'images': image_urls, 
            'user_id': user_id,  
            'stories':data.get('stories'),
            'main_road':data.get('main_road'),
            'guest_room':data.get('guest_room'),
            'basement':data.get('basement'),
            'hotwater_heating':data.get('hotwater_heating'),
            'airconditioning':data.get('airconditioning'),
            'parking':data.get('parking'),
            'prefarea':data.get('prefarea')
        }
        if(data.get('price')):
            property_data['price'] = data.get("price")
            property_collection.insert_one(property_data)
            return JsonResponse({'message': 'Property uploaded successfully!'}, status=201)
        else:

            Model_parameters=[property_data["square_feet"],property_data['bedrooms'],property_data["bathrooms"],property_data["stories"],property_data["main_road"],property_data["guest_room"],property_data['basement'],property_data['hotwater_heating'],property_data['airconditioning'],property_data['parking'],property_data['prefarea']]
            Model_parameters=pd.Series(Model_parameters)
            Model_parameters=pd.to_numeric(Model_parameters)


            PriceModel=joblib.load("horizonx\saved-models\Horizon_Model.joblib")
            modelSellPrice=PriceModel.predict([Model_parameters])
            modelSellPrice=int(modelSellPrice)
            
            property_data['user_id'] = str(property_data['user_id'])
            return JsonResponse({'message': 'Property uploaded successfully!','priceHelp':modelSellPrice, 'property_data':property_data}, status=200)


    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
@require_http_methods(["GET"])
def get_random_properties(request):
    all_properties = list(property_collection.find({}))

    random_properties = random.sample(all_properties, min(8, len(all_properties)))

    for property in random_properties:
        property['_id'] = str(property['_id'])
        property['user_id'] = str(property['user_id'])
    return JsonResponse(random_properties, safe=False)



