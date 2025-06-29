# ---- BACKEND BUILD STAGE ----
FROM python:3.12-slim AS backend

WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

# ---- FRONTEND BUILD STAGE ----
FROM node:20-alpine AS frontend

WORKDIR /app/frontend

ENV NODE_OPTIONS=--max-old-space-size=256

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ---- FINAL STAGE ----
FROM python:3.12-slim

# Install nginx
RUN apt-get update && \
    apt-get install -y nginx && \
    rm -rf /var/lib/apt/lists/*

# Copy Python packages from backend stage
COPY --from=backend /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=backend /usr/local/bin /usr/local/bin

# Set working directory
WORKDIR /app

# Copy built frontend
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html

# Copy backend code
COPY --from=backend /app/backend /app/backend

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Run Gunicorn and Nginx
CMD sh -c "gunicorn app:app --chdir backend -w 4 -b 0.0.0.0:8080 & nginx -g 'daemon off;'"
