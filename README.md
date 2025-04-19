Okay, here is a comprehensive README.md file suitable for your project's current state. It includes a description, features, technology stack, setup instructions, and how to run the application.

Copy and paste the following into a file named README.md in the root directory of your MindMapAI project (MindMapAI/README.md).

# MindMapAI 💡🧠

MindMapAI is a web application designed to help you visualize and expand ideas using Artificial Intelligence. Enter a central concept, and the application leverages a Hugging Face Language Model via its Inference API to generate related keywords or concepts, displaying them as an interactive force-directed mind map.

This project features a React frontend and a Python Django backend.

## Core Technologies

*   **Frontend:**
    *   React (v18+)
    *   Vite (Build Tool)
    *   D3.js (v7+) (Data Visualization & Force Simulation)
    *   React Router DOM (v6+) (Routing)
    *   CSS (Styling)
*   **Backend:**
    *   Python (3.x)
    *   Django (v5+)
    *   Django REST Framework (DRF) (API Development)
    *   `huggingface_hub` (Hugging Face API Interaction)
    *   `python-dotenv` (Environment Variables)
    *   `django-cors-headers` (Handling CORS)
*   **Database:** None (Current state is stateless)
*   **AI Service:** Hugging Face Inference API

## Current Features

*   **Landing Page:** Simple interface to input a central idea/prompt.
*   **Dynamic Mind Map Generation:**
    *   Submits the central idea to the Django backend upon navigation.
    *   Backend API endpoint calls the Hugging Face Inference API with the idea.
    *   Generates (up to) 5 related keywords/concepts using a specified LLM (e.g., gpt2).
    *   Returns the central idea and generated keywords structured as nodes and links.
*   **Interactive Visualization:**
    *   Displays the nodes and links as a force-directed graph using D3.js within a React component.
    *   Nodes can be dragged and repositioned.
    *   Basic loading and error states handled on the frontend.

## Project Structure


mindmapai/
├── backend/ # Django backend application
│ ├── api/ # Django app containing API logic (views, urls)
│ ├── mindmap_project/ # Django project settings & main urls
│ ├── venv/ # Python virtual environment (ignored by git)
│ ├── .env # Environment variables (API keys - IMPORTANT: add to .gitignore!)
│ ├── manage.py # Django management script
│ └── requirements.txt # Python dependencies (you should generate this)
│
├── frontend/ # React frontend application
│ ├── public/ # Static assets
│ ├── src/ # React source code (components, pages, etc.)
│ ├── node_modules/ # Node.js dependencies (ignored by git)
│ ├── .gitignore
│ ├── index.html # Main HTML entry point
│ ├── package.json # Frontend dependencies and scripts
│ └── vite.config.js # Vite configuration (including dev proxy)
│
├── .gitignore # Root gitignore covering both frontend and backend
└── README.md # This file

## Setup Instructions

Follow these steps to set up and run the project locally.

**Prerequisites:**

*   Git
*   Python 3.8+ and Pip
*   Node.js (v18+) and npm

**1. Clone the Repository:**

```bash
git clone <your-repository-url> MindMapAI
cd MindMapAI
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
IGNORE_WHEN_COPYING_END

2. Backend Setup:

# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv
# On macOS/Linux:
source venv/bin/activate
# On Windows (Git Bash):
# source venv/Scripts/activate
# On Windows (Command Prompt/PowerShell):
# .\venv\Scripts\activate

# Install Python dependencies
# (Recommended: Create requirements.txt first via `pip freeze > requirements.txt`)
pip install django djangorestframework python-dotenv huggingface_hub requests django-cors-headers

# Create the .env file for API keys
# Create a file named '.env' in the 'backend/' directory
# Add your Hugging Face API token to it:
# HF_ACCESS_TOKEN=your_hugging_face_api_token_here

# IMPORTANT: Ensure '.env' is listed in your main .gitignore file!

# Apply Django database migrations (for built-in apps)
python manage.py migrate
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

3. Frontend Setup:

# Navigate to the frontend directory from the root
cd ../frontend
# Or if you are in backend/: cd ../frontend

# Install Node.js dependencies
npm install
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END
Running the Application

You need to run both the backend and frontend servers simultaneously.

1. Start the Backend Server:

Open a terminal window.

Navigate to the MindMapAI/backend/ directory.

Activate the virtual environment (if not already active): source venv/bin/activate (or equivalent for your OS).

Start the Django development server:

python manage.py runserver
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

The backend server will typically run on http://127.0.0.1:8000/. Keep this terminal running.

2. Start the Frontend Server:

Open a new terminal window.

Navigate to the MindMapAI/frontend/ directory.

Start the Vite development server:

npm run dev
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
Bash
IGNORE_WHEN_COPYING_END

The frontend server will typically run on http://localhost:5173/ (Vite will indicate the exact address).

Open your web browser and navigate to the frontend address provided (e.g., http://localhost:5173).

You should now be able to use the application! Enter an idea on the landing page and see the mind map generated.

Configuration

Backend: Requires a Hugging Face Access Token with read permissions. This must be placed in the backend/.env file as HF_ACCESS_TOKEN.

Frontend: The fetch call in src/pages/MindMap.jsx currently points directly to http://localhost:8000/api/generate-ideas/. The Vite proxy in vite.config.js is configured but not actively used by this specific fetch call (due to the absolute URL). CORS is handled by django-cors-headers on the backend.

Future Plans (Roadmap)

Implement node expansion (click a node to generate further related ideas).

Add manual node editing and creation capabilities.

Integrate a database (e.g., PostgreSQL/SQLite) via Django models to save and load mind maps.

Refine UI/UX, including better error handling and loading states.

Improve graph visualization (custom node styles, edge labels).

Explore different LLMs and prompt engineering techniques.

Add user authentication.

Deployment configuration (Gunicorn, Nginx, Docker).
