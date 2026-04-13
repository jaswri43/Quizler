from flask import Blueprint, request, jsonify
import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

auth_bp = Blueprint('auth', __name__)

# Registers a new user with email, password, and username
@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    if not email or not password or not username:
        return jsonify({"error": "Email, password and username are required"}), 400

    try:
        auth_response = supabase.auth.sign_up({"email": email, "password": password})
        user_id = auth_response.user.id

        supabase.table("Users").insert({
            "id": user_id,
            "username": username
        }).execute()

        return jsonify({"message": "Registration successful!", "user": email}), 201
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
        # 1. Authenticate the user
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        user_id = response.user.id

        # --- BEGIN STREAK LOGIC ---
        # 2. Get today's date
        today_str = datetime.now().strftime('%Y-%m-%d')
        today_date = datetime.strptime(today_str, '%Y-%m-%d').date()

        # 3. Fetch the user's current streak and last_login from the database
        user_record_response = supabase.table("Users").select("streak, last_login").eq("id", user_id).execute()

        if user_record_response.data:
            user_record = user_record_response.data[0]
            current_streak = user_record.get('streak') or 0
            last_login_str = user_record.get('last_login')

            new_streak = current_streak

            if last_login_str:
                last_login_date = datetime.strptime(last_login_str, '%Y-%m-%d').date()
                days_passed = (today_date - last_login_date).days

                if days_passed == 1:
                    new_streak = current_streak + 1
                elif days_passed > 1:
                    new_streak = 1

            else:
                new_streak = 1

            supabase.table("Users").update({
                "streak": new_streak,
                "last_login": today_str
            }).eq("id", user_id).execute()

        return jsonify({
            "message": "Login successful!",
            "access_token": response.session.access_token,
            "user": response.user.email,
            "user_id": user_id,
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

#Fetches the users profile from the database
@auth_bp.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        response = supabase.table("Users").select("*").eq("id", user_id).execute()

        if not response.data:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"status": "success", "data": response.data[0]}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Returns a user's profile data by their user ID
@auth_bp.route('/api/users/<user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        response = supabase.table("Users").select("username, xp, level, streak").eq("id", user_id).execute()

        if not response.data:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"status": "success", "data": response.data[0]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Updates a user's XP and recalculates their level
@auth_bp.route('/api/users/<user_id>/xp', methods=['PUT'])
def update_xp(user_id):
    data = request.json
    xp_gained = data.get('xp_gained')

    if not xp_gained:
        return jsonify({"error": "xp_gained is required"}), 400

    try:
        current = supabase.table("Users").select("xp, level").eq("id", user_id).execute()

        if not current.data:
            return jsonify({"error": "User not found"}), 404

        new_xp = current.data[0]['xp'] + xp_gained
        new_level = (new_xp // 100) + 1

        supabase.table("Users").update({
            "xp": new_xp,
            "level": new_level
        }).eq("id", user_id).execute()

        return jsonify({
            "message": "XP updated!",
            "xp": new_xp,
            "level": new_level
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
