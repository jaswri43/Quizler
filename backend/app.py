# Main Flask Application - Quizler API Server
# Features: Authentication, flashcard management, leaderboard, classrooms
from flask import Flask, request, jsonify
from flasgger import Swagger
import os
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
from routes.flashcards import cards_bp
from routes.authentication import auth_bp
from routes.leaderboard import leaderboard_bp
from routes.classrooms import classrooms_bp

load_dotenv()
app = Flask(__name__)
CORS(app)
swagger = Swagger(app)  # API documentation

# Register route blueprints
app.register_blueprint(cards_bp)  # Flashcard and deck endpoints
app.register_blueprint(auth_bp)  # Login/register endpoints
app.register_blueprint(leaderboard_bp)  # Leaderboard endpoints
app.register_blueprint(classrooms_bp)  # Classroom management endpoints


@app.get("/health")
def health():
    """
    Health check
    ---
    responses:
      200:
        description: API is healthy
    """
    return {"status": "ok"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)


