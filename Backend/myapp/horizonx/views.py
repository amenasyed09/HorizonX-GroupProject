from django.shortcuts import render
from pymongo import MongoClient
from django.http import JsonResponse
import bcrypt
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017")
db = client.horizonx
users_collection = db.users

# @csrf_exempt
# @require_http_methods(["POST"])
def signup():
    data = {
        "name" : "Rishi",
        "username" : "Temp",
        "password" : "123",
        "email" : "temp@gmail.com",
        "phone" : "123456789",
    }
    password = data['password']

    if users_collection.find_one({"username": data['username']}):
        return JsonResponse({"error": "Username already exists"}, status=400)

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    data['password'] = hashed_password
    users_collection.insert_one(data)

# @csrf_exempt
# @require_http_methods(["POST"])
def login(request):
    pass

print(signup())