FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for PDF processing and other dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Create database directory
RUN mkdir -p /app/data

# Expose port
EXPOSE $PORT

# Run the application with proper host binding
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]