import os
import sys

# Add the current directory to Python path for imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app.base import create_app

app = create_app()

# Vercel serverless function handler
def handler(event, context):
    return app