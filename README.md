# Quizler

Quizler is a gamified flashcard-based studying application designed to help users stay motivated and consistent while learning. By incorporating game-inspired elements such as XP, levels, streaks, and achievements, the app makes studying progress visible and rewarding.

## How to run frontend
### First time setup
- Install Node.js
- Test it's are installed by running 'node -v' and 'npm -v' in command line
- If you get a problem with 'npm -v' then open powershell as administrator and run 'Set-ExecutionPolicy RemoteSigned'
- Open a terminal in the frontend file (.../Quizler/frontend)
- Type npm install
### Every time setup
- Type npm run dev
- Click the localhost link
- Updates made in code will automatically appear on the site

## How to run backend
### First time setup
- Open a terminal in the backend file (.../Quizler/backend)
- Run 'pip install -r requirements.txt'
### Every time setup
- Run 'python app.py' from backend file

## Features
- User authentication with role-based access (user & admin)
- Create and study flashcard decks
- XP, levels, and daily streak tracking
- Achievements and progress visualization
- Dynamic, responsive UI with real-time feedback

## Motivation
Many students struggle to stay consistent because studying often lacks clear feedback or a sense of accomplishment. Quizler addresses this by turning studying into a progression-based experience similar to games like Duolingo.

## Tech Stack
- **Frontend:** React + Typescript
- **Backend:** Python, Flask
- **Database & Auth:** Supabase
- **API:** RESTful communication between frontend, backend, and database

## Core Functionality
- User registration and login
- Flashcard deck management
- Study sessions that update XP, streaks, and achievements
- Admin tools for managing global content

## Status
This project is currently under active development as part of a course project focused on gamification, dynamic data, and full-stack system design.
