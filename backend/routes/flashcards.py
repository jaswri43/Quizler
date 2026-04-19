# Flashcard and Deck Routes - Create/read/update/delete decks and cards
from flask import Blueprint, request, jsonify
import os
from supabase import create_client, Client
from dotenv import load_dotenv;

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

cards_bp = Blueprint('cards', __name__)

# Create new flashcard deck
@cards_bp.route('/api/decks', methods=['POST'])
def create_deck():
    """
    Create a new flashcard deck.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: "AP US History"
    responses:
      201:
        description: Deck created successfully
      400:
        description: Missing title
      500:
        description: Server error
    """
    data = request.json
    title = data.get('title')
    user_id = data.get('user_id')


    if not title:
        return jsonify({"error": "Deck title is required"}), 400

    try:
        response = supabase.table("Decks").insert({
            "title": title,
            "created_by": user_id
        }).execute()
        return jsonify({"message": "Deck created successfully!", "data": response.data}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# Adds a card to a deck
@cards_bp.route('/api/add-card', methods=['POST'])
def add_card():
    """
    Add a new flashcard to a specific deck.
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            front:
              type: string
              example: "What year was the War of 1812?"
            back:
              type: string
              example: "1812"
            deck_id:
              type: string
              example: "deck-uuid-here"
    responses:
      201:
        description: Card added successfully
      400:
        description: Missing front or back text
    """
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
    """
    Delete a specific flashcard.
    ---
    parameters:
      - name: card_id
        in: path
        type: integer
        required: true
        description: The ID of the card to delete
    responses:
      200:
        description: Card deleted successfully
      404:
        description: Card not found
      500:
        description: Server error
    """
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
    """
    Get all flashcards for a specific deck.
    ---
    parameters:
      - name: deck_id
        in: path
        type: string
        required: true
        description: The UUID of the deck
    responses:
      200:
        description: Returns a list of cards
      500:
        description: Server error
    """
    user_id = request.args.get('user_id')

    try:
        response = supabase.table("Flashcards").select("*").eq("deck_id", deck_id).execute()
        return jsonify({"status": "success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

#Updates the flashcard data
@cards_bp.route('/api/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    """
    Update the front and back text of a specific flashcard.
    ---
    parameters:
      - name: card_id
        in: path
        type: integer
        required: true
        description: The ID of the card to update
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            front:
              type: string
              example: "Updated front text"
            back:
              type: string
              example: "Updated back text"
    responses:
      200:
        description: Card updated successfully
      404:
        description: Card not found
      500:
        description: Server error
    """
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
    user_id = request.args.get('user_id')

    try:
        query = supabase.table("Decks").select("*")
        if user_id:
            query = query.eq("created_by", user_id)

        response = query.execute();
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



# Fetches all globally assigned decks
@cards_bp.route('/api/assigned-decks/<user_id>', methods=['GET'])
def get_assigned_decks(user_id):
    try:
        # Grab ALL rows from the Assignments table
        assignments = supabase.table("Assignments").select("deck_id").execute()

        if not assignments.data:
            return jsonify({"status": "success", "data": []}), 200

        # Extract the list of deck IDs
        deck_ids = [item['deck_id'] for item in assignments.data]

        # Fetch the actual deck details for those IDs
        assigned_decks = supabase.table("Decks").select("*").in_("id", deck_ids).execute()

        return jsonify({"status": "success", "data": assigned_decks.data}), 200
    except Exception as e:
        print("Crash error:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

# Assigns a deck globally to all students
@cards_bp.route('/api/assign-deck', methods=['POST'])
def assign_deck():
    data = request.json
    deck_id = data.get('deck_id')

    if not deck_id:
        return jsonify({"error": "Deck ID is required"}), 400

    try:
        response = supabase.table("Assignments").insert({
            "deck_id": deck_id
        }).execute()

        return jsonify({"message": "Deck assigned to all students!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Removes a deck from the global assignments
@cards_bp.route('/api/unassign-deck/<deck_id>', methods=['DELETE'])
def unassign_deck(deck_id):
    try:
    
        response = supabase.table("Assignments").delete().eq("deck_id", deck_id).execute()

        return jsonify({"message": "Deck unassigned successfully!"}), 200
    except Exception as e:
        print(f"Unassign Error: {e}")
        return jsonify({"error": str(e)}), 500
