import sys
import os

# Add the backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', '..', 'backend')
sys.path.insert(0, backend_path)

try:
    from app.base import create_app
    app = create_app()
except Exception as e:
    print(f"Error importing app: {e}")
    # Fallback to a simple Flask app if import fails
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/api/health')
    def health():
        return jsonify({"status": "Backend import failed", "error": str(e)})

# Vercel handler
def handler(request, response):
    return app(request.environ, response)