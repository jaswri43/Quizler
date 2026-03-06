from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from routes.flashcards import cards_bp

load_dotenv()
app = Flask(__name__)
CORS(app)

app.register_blueprint(cards_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)


