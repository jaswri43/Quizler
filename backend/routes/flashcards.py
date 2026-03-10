from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
from dotenv import load_dotenv;

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

cards_bp = Blueprint('cards', __name__)

#Creates a new deck
@cards_bp.route('/api/decks', methods=['POST'])
def create_deck():
    data = request.json
    title = data.get('title')

    if not title:
        return jsonify({"error": "Deck title is required"}), 400

    try:
        response = supabase.table("Decks").insert({"title": title}).execute()
        return jsonify({"message": "Deck created successfully!", "data": response.data}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Adds a card to a deck
@cards_bp.route('/api/add-card', methods=['POST'])
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

# Deletes the selected card from the deck/database
@cards_bp.route('/api/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    try:
        # The .delete() method removes the row where the 'id' column matches the card_id we sent
        response = supabase.table("Flashcards").delete().eq("id", card_id).execute()

        # Check if any data was actually returned (to verify a card was deleted)
        if not response.data:
            return jsonify({"error": "Card not found"}), 404

        return jsonify({"message": "Card deleted successfully!", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#Returns the card data from the database
@cards_bp.route('/api/cards/<deck_id>', methods=['GET'])
def get_cards(deck_id):
    try:
        response = supabase.table("Flashcards").select("*").eq("deck_id", deck_id).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#Updates the flashcard data
@cards_bp.route('/api/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.json
    front_text = data.get('front')
    back_text = data.get('back')

    try:
        response = supabase.table("Flashcards").update({
            "front": front_text,
            "back": back_text
        }).eq("id", card_id).execute()

        if not response.data:
            return jsonify({"error": "Card not found"}), 404

        return jsonify({"message": "Card updated successfully!", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#Rename the deck
@cards_bp.route('/api/decks/<deck_id>', methods=['PUT'])
def rename_deck(deck_id):
    data = request.json
    new_title = data.get('title')

    if not new_title:
        return jsonify({"error": "New title is required"}), 400

    try:
        response = supabase.table("Decks").update({"title": new_title}).eq("id", deck_id).execute()

        if not response.data:
            return jsonify({"error": "Deck not found"}), 404

        return jsonify({"message": "Deck renamed successfully!", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




#Deck Stuff Below This Line

#Returns a list of Flashcard Decks
@cards_bp.route('/api/decks', methods=['GET'])
def get_decks():
    try:
        response = supabase.table("Decks").select("*").execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@cards_bp.route('/api/decks/<deck_id>', methods=['DELETE'])
def delete_deck(deck_id):
    try:
        response = supabase.table("Decks").delete().eq("id", deck_id).execute()

        if not response.data:
            return jsonify({"error": "Deck not found"}), 404

        return jsonify({"message": "Deck and all its cards deleted successfully!", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


#Pulls a single deck from the database
@cards_bp.route('/api/decks/<deck_id>', methods=['GET'])
def get_single_deck(deck_id):
    try:
        response = supabase.table("Decks").select("*").eq("id", deck_id).execute()

        if not response.data:
            return jsonify({"error": "Deck not found"}), 404


        return jsonify({"status": "success", "data": response.data[0]}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
