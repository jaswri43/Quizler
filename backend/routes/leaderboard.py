from flask import Blueprint, jsonify
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

leaderboard_bp = Blueprint('leaderboard', __name__)

# Returns top 10 users sorted by level
@leaderboard_bp.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        response = supabase.table('Users').select('username, xp, level').eq('role', 'student').order('xp', desc=True).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
