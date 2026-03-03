@app.route('/api/add-card', methods=['POST'])
def add_card():
    # 1. Get the data sent from the React frontend
    data = request.json
    front_text = data.get('front')
    back_text = data.get('back')
    deck_id = data.get('deck_id')

    # 2. Validation (The "Brain" part of the backend)
    if not front_text or not back_text:
        return jsonify({"error": "Cards must have both a front and a back!"}), 400

    # 3. Send it to Supabase
    response = supabase.table("cards").insert({
        "front": front_text,
        "back": back_text,
        "deck_id": deck_id
    }).execute()

    # 4. Tell the frontend it worked
    return jsonify({"message": "Card added successfully!", "data": response.data}), 201
