# ---- FRONTEND BUILD STAGE ----
FROM node:20-alpine AS frontend

WORKDIR /app/frontend
ENV NODE_OPTIONS=--max-old-space-size=256

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# ---- BACKEND BUILD STAGE ----
FROM python:3.12-slim AS backend

WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./


# ---- FINAL STAGE: GUNICORN + NGINX ----
FROM python:3.12-slim

# Install Nginx and Gunicorn
RUN apt-get update && \
    apt-get install -y nginx && \
    pip install gunicorn && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built frontend to Nginx root
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html

# Copy backend
COPY --from=backend /app/backend /app/backend

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Gunicorn + Nginx
CMD sh -c "gunicorn app:app --chdir backend -w 4 -b 0.0.0.0:8080 & nginx -g 'daemon off;'"
