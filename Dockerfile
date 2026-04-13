FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Copy only backend requirements first for caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend folder content to /app
COPY backend/ .

# Expose port (HF uses 7860 by default if not specified, 
# but we will specify 8000 in README metadata)
EXPOSE 8000

# Start script with DB check and seeding
CMD ["sh", "-c", "echo 'Waiting for database...' && for i in $(seq 1 30); do python -c \"import psycopg2; psycopg2.connect(dsn='$DATABASE_URL')\" 2>/dev/null && echo 'DB is ready!' && break || (echo \"DB not ready, retrying ($i/30)...\" && sleep 2); done && python scripts/seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
