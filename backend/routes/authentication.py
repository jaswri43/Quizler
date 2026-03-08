from flask import Blueprint, request, jsonify
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

auth_bp = Blueprint('auth', __name__)

# Registers a new user
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        return jsonify({"message": "Registration successful!", "user": response.user.email}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Logs in an existing user and returns an access token
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return jsonify({
            "message": "Login successful!",
            "access_token": response.session.access_token,
            "user": response.user.email
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# Logs out the user
@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    try:
        supabase.auth.sign_out()
        return jsonify({"message": "Logged out successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400