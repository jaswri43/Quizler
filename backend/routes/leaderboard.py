from flask import Blueprint, jsonify
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

leaderboard_bp = Blueprint('leaderboard', __name__)

# Returns top 10 users sorted by level (mock data until Users table is set up)
@leaderboard_bp.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        mock_data = [
            {"username": "StudyMaster", "level": 25, "xp": 5000},
            {"username": "QuizKing", "level": 24, "xp": 4800},
            {"username": "LearningLion", "level": 23, "xp": 4600},
            {"username": "BrainBoss", "level": 22, "xp": 4400},
            {"username": "KnowledgeKnight", "level": 21, "xp": 4200},
        ]
        return jsonify({"status": "success", "data": mock_data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500