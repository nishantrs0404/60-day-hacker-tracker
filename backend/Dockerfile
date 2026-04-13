FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for psycopg2 and building
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run seed script then start server via a shell script wrapper or directly
# In production, alembic migrations should be used. For this project, passing CREATE_ALL in app solves it.
EXPOSE 8000

# Start script
CMD ["sh", "-c", "echo 'Waiting for database...' && for i in $(seq 1 30); do python -c \"import psycopg2; psycopg2.connect(dsn='$DATABASE_URL')\" 2>/dev/null && echo 'DB is ready!' && break || (echo \"DB not ready, retrying ($i/30)...\" && sleep 2); done && python scripts/seed.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
