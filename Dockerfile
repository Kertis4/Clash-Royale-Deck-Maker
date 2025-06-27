# ---- FINAL STAGE ----
FROM python:3.12-slim

# Install nginx and gunicorn
RUN apt-get update && \
    apt-get install -y nginx && \
    pip install gunicorn && \
    rm -rf /var/lib/apt/lists/*

# Set working directory at /app
WORKDIR /app

# Copy built frontend
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html

FROM node:20-alpine AS frontend

WORKDIR /app/frontend

ENV NODE_OPTIONS=--max-old-space-size=256

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build
# Copy backend
COPY --from=backend /app/backend /app/backend

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# THIS is the correct Gunicorn command
CMD sh -c "gunicorn app:app --chdir backend -w 4 -b 0.0.0.0:8080 & nginx -g 'daemon off;'"
