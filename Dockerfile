# Multi-stage Dockerfile

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Serve Backend and Frontend Static Files
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies for GIS
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn whitenoise

# Copy project files
COPY backend/ ./backend/
COPY users/ ./users/
COPY manage.py .

# Copy built frontend assets to static/
COPY --from=frontend-builder /app/frontend/dist/ ./static/

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

# Expose port
EXPOSE 8000

# Start command (Collect static, Migrate, then Start Gunicorn)
CMD python manage.py collectstatic --noinput && \
    python manage.py migrate --noinput && \
    gunicorn backend.wsgi:application --bind 0.0.0.0:8000
