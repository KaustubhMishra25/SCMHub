from flask import Blueprint, request, jsonify
from bson.errors import BSONError# for handling potential MongoDB errors
from bson import json_util
import json
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()


# Assuming your User model is defined in models.py
from models.user import User

auth = Blueprint('auth', __name__)


client = MongoClient(os.environ.get('MONGODB_URI'))
db = client.scmhub
users_collection = db.users  

@auth.route('/auth/signup/', methods=['POST'])
def signup():
  try:
    # Extract user data from request
    data = dict(
      email = request.json.get('email'),
      password = request.json.get('password'),
      business_details = request.json.get('businessDetails')
    )
    # Create new user
    User.create_user(client=client,data=data)

    return jsonify({'success': True, 'message': 'User account created successfully'}), 201
  except BSONError as error:
    # Handle potential MongoDB errors
    print(f"Error creating user: {error}")
    return jsonify({'success': False, 'message': 'Error creating user account'}), 500

@auth.route('/auth/login/', methods=['POST'])
def login():
  try:
    # Extract login data from request
    email = request.json.get('email')
    password = request.json.get('password')
    # Find user by email
    user_data = User.find_user_by_email(client=client, email=email, password=password)

    if not user_data:
      return jsonify({'success': False, 'message': 'User does not exist!'}), 401

    print(user_data)
    # Validate password
    if not User.verify_password(db_password=user_data['password'],candidate_password=password):
      return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    # Login successful, return user data
    return jsonify({'success': True, 'message': 'Login successful', 'user': json.loads(json_util.dumps(user_data))}), 200
  except Exception as error:
    # Handle any other errors
    print(f"Error logging in: {error}")
    return jsonify({'success': False, 'message': 'Login failed'}), 500
