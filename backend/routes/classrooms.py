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

# Allow teachers to create a sign up code for their classroom
@classrooms_bp.route('/api/classrooms', methods=['POST'])
def create_classroom():
    """
    Create a new classroom and generate a join link.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            teacher_id:
              type: string
              example: "123e4567-e89b-12d3-a456-426614174000"
            name:
              type: string
              example: "Period 1 Biology"
    responses:
      201:
        description: Classroom created successfully
      400:
        description: Missing data or database error
    """
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


# Allows the student to join the class using the sign-up code
@classrooms_bp.route('/api/join/<join_slug>', methods=['POST'])
def join_classroom(join_slug):
    data = request.json
    student_id = data.get('student_id')

    if not student_id:
        return jsonify({"error": "student_id is required."}), 400

    try:
        classroom_response = supabase.table("Classrooms").select("id, name").eq("join_slug", join_slug).execute()

        if not classroom_response.data:
            return jsonify({"error": "Invalid join link or classroom does not exist."}), 404

        classroom_id = classroom_response.data[0]['id']
        classroom_name = classroom_response.data[0]['name']


        supabase.table("Rosters").insert({
            "classroom_id": classroom_id,
            "student_id": student_id
        }).execute()

        return jsonify({
            "message": f"Successfully joined {classroom_name}!",
            "classroom_id": classroom_id
        }), 200

    except Exception as e:
        error_message = str(e)
        if "duplicate key value" in error_message or "23505" in error_message:
            return jsonify({"error": "You are already enrolled in this class."}), 400

        return jsonify({"error": error_message}), 400

# Allows a teacher to assign a deck to all students in the class
@classrooms_bp.route('/api/assignments', methods=['POST'])
def assign_deck():
    data = request.json
    classroom_id = data.get('classroom_id')
    deck_id = data.get('deck_id')

    if not classroom_id or not deck_id:
        return jsonify({"error": "Both classroom_id and deck_id are required."}), 400

    try:
        response = supabase.table("Assignments").insert({
            "classroom_id": classroom_id,
            "deck_id": deck_id
        }).execute()

        return jsonify({
            "message": "Deck successfully assigned to the classroom!",
            "assignment": response.data[0]
        }), 201

    except Exception as e:
        error_message = str(e)
        if "duplicate key value" in error_message or "23505" in error_message:
            return jsonify({"error": "This deck is already assigned to this class."}), 400

        return jsonify({"error": error_message}), 400


@classrooms_bp.route('/api/student/<student_id>/decks', methods=['GET'])
def get_student_decks(student_id):
    try:
        rosters = supabase.table("Rosters").select("classroom_id").eq("student_id", student_id).execute()

        if not rosters.data:
            return jsonify({"decks": []}), 200

        classroom_ids = [r['classroom_id'] for r in rosters.data]
        assignments = supabase.table("Assignments").select("deck_id").in_("classroom_id", classroom_ids).execute()

        if not assignments.data:
            return jsonify({"decks": []}), 200

        deck_ids = [a['deck_id'] for a in assignments.data]

        decks = supabase.table("Decks").select("*").in_("id", deck_ids).execute()

        return jsonify({"decks": decks.data}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
