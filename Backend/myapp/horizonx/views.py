import random
from django.shortcuts import render
# from jsonschema import ValidationError
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
@csrf_exempt
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
        # Convert propertyId to ObjectId
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
        # Convert propertyId to ObjectId
        object_id = ObjectId(propertyId)
        property = property_collection.find_one({"_id": object_id})
        
        if property:
            # Convert ObjectId to string for JSON response
            property["_id"] = str(property["_id"])
            property["user_id"] = str(property["user_id"])  # Include if needed

            return JsonResponse(property, safe=False, status=200)
        else:
            return JsonResponse({"error": "Property not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@require_http_methods(['PUT'])
def update_property(request,propertyId):
    try:
        # Convert propertyId to ObjectId
        object_id = ObjectId(propertyId)
        property = property_collection.update_one({"_id": object_id})
        
        if property:
            # Convert ObjectId to string for JSON response
            property["_id"] = str(property["_id"])
            property["user_id"] = str(property["user_id"])  # Include if needed

            return JsonResponse(property, safe=False, status=200)
        else:
            return JsonResponse({"error": "Property not found"}, status=404)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
    
@csrf_exempt
@require_http_methods(['POST'])
def upload_property(request):
    if request.method == 'POST':
        # Get property details from the request
        data = request.POST
        username = data.get("user")
        sale_type = data.get("saleType")  # Get saleType from the request
        
        # Find the user by username in the users collection
        user = users_collection.find_one({"username": username})
        if user is None:
            return JsonResponse({"error": "User not found"}, status=404)
        
        # Get the user's ID and attach it to the property data
        user_id = user["_id"]

        # Get uploaded images
        images = request.FILES.getlist('images')
        
        # Prepare the property data
        property_data = {
            'title': data.get('title'),
            'description': data.get('description'),
            'price': data.get('price'),
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
            'saleType': sale_type,  # Add saleType to the property data
            'images': [image.name for image in images],  # Store the image paths
            'user_id': user_id,  # Store the user_id in the property data
            'stories':data.get('stories'),
            'main_road':data.get('main_road'),
            'guest_room':data.get('guest_room'),
            'basement':data.get('basement'),
            'hotwater_heating':data.get('hotwater_heating'),
            'airconditioning':data.get('airconditioning'),
            'parking':data.get('parking'),
            'prefarea':data.get('prefarea')
        }
        
        # pf=PolynomialFeatures()
        # X_Test Parameters for our Regression Model.
        Model_parameters=[property_data["square_feet"],property_data['bedrooms'],property_data["bathrooms"],property_data["stories"],property_data["main_road"],property_data["guest_room"],property_data['basement'],property_data['hotwater_heating'],property_data['airconditioning'],property_data['parking'],property_data['prefarea']]
        Model_parameters=pd.Series(Model_parameters)
        Model_parameters=pd.to_numeric(Model_parameters)
        # Model_parameters=np.array(pf.fit_transform(Model_parameters), dtype=np.float64)
        # for i in range(len(Model_parameters)):
        #     Model_parameters[i]=int(Model_parameters[i])
        
        # y = ''.join(map(str, Model_parameters))
        # for i in range(len(y)):
        #     Model_parameters[i]=int(float(y[i]))
        # Model_parameters = int(float(y))
        PriceModel=joblib.load("C:/Users/jaypa/OneDrive/Desktop/HorizonX-Group/HorizonX-GroupProject/Backend/myapp/horizonx/saved-models/Horizon_Model.joblib")
        modelSellPrice=PriceModel.predict([Model_parameters])
        modelSellPrice=int(modelSellPrice)
        # Insert the property data into MongoDB
        property_collection.insert_one(property_data)

        return JsonResponse({'message': 'Property uploaded successfully!','priceHelp':modelSellPrice}, status=200)


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



