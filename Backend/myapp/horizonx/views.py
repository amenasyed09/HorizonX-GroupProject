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
    try:
        data = {
            "name" : "Rishi",
            "username" : "Temp",
            "password" : "123",
            "email" : "temp@gmail.com",
            "phone" : "123456789",
        }
        # data = json.loads(request.body)
        password = data['password']

        if users_collection.find_one({"username": data['username']}):
            return "username already exists"
            # return JsonResponse({"error": "Username already exists"}, status=400)

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        data['password'] = hashed_password
        users_collection.insert_one(data)
    except json.JSONDecodeError:
        return "invalid data"
        # return JsonResponse({"error": "Invalid data"}, status=400)

# @csrf_exempt
# @require_http_methods(["POST"])
def login():
    try:
        data = {
            "username" : "Temp",
            "password" : "123",
        }
        # data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = users_collection.find_one({"username": username})

        if user:
            if bcrypt.checkpw(password.encode("utf-8"), user["password"]):
                return "Login success"
                # return JsonResponse(
                #     {"message": "Login successful", "username": username}, status=200
                # )
            else:
                return "Invalid"
                # return JsonResponse(
                #     {"error": "Invalid username or password"}, status=400
                # )
        else:
            return "Invalid"
            # return JsonResponse({"error": "Invalid username or password"}, status=400)

    except json.JSONDecodeError:
        return "Invalid data"
        # return JsonResponse({"error": "Invalid data"}, status=400)
    except Exception as e:
        return "Error"
        # return JsonResponse({"error": "An error occurred during login"}, status=500)

print(login())