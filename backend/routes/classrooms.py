import os
import random
import string
from flask import Blueprint, request, jsonify
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

classrooms_bp = Blueprint('classrooms', __name__)

@classrooms_bp.route('/api/classrooms', methods=['POST'])
def create_classroom():
    data = request.json
    teacher_id = data.get('teacher_id')
    name = data.get('name')

    if not teacher_id or not name:
        return jsonify({"error": "Both teacher_id and name are required."}), 400


    join_slug = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    try:
        response = supabase.table("Classrooms").insert({
            "teacher_id": teacher_id,
            "name": name,
            "join_slug": join_slug
        }).execute()

        return jsonify({
            "message": "Classroom created successfully!",
            "classroom": response.data[0]
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400
