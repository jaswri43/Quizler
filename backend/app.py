from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv()
app = Flask(__name__)
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


@app.route('/api/add-card', methods=['POST'])
def add_card():
    data = request.json
    front_text = data.get('front')
    back_text = data.get('back')
    deck_id = data.get('deck_id')

    if not front_text or not back_text:
        return jsonify({"error": "Cards must have both a front and a back!"}), 400

    response = supabase.table("Flashcards").insert({
        "front": front_text,
        "back": back_text,
        "deck_id": deck_id
    }).execute()

    return jsonify({"message": "Card added successfully!", "data": response.data}), 201

@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        response = supabase.table("Flashcards").select("*").limit(1).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/api/cards/<deck_id>', methods=['GET'])
def get_cards(deck_id):
    try:
        response = supabase.table("Flashcards").select("*").eq("deck_id", deck_id).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

 
if __name__ == '__main__':
    app.run(debug=True, port=5000)


