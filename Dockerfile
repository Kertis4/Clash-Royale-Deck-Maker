# ---- FRONTEND BUILD STAGE ----
FROM node:20-alpine AS frontend

WORKDIR /app/frontend

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


# ---- FINAL STAGE: NGINX + GUNICORN ----
FROM nginx:alpine

# Copy built frontend from frontend stage
COPY --from=frontend /app/frontend/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy backend app and install Gunicorn
COPY --from=backend /app/backend /app/backend
RUN apk add --no-cache python3 py3-pip && \
    pip install gunicorn

# Expose the default HTTP port
EXPOSE 80

# Start both: nginx and gunicorn using a shell
CMD sh -c "gunicorn -w 4 -b 0.0.0.0:8080 app:app --chdir /app/backend & nginx -g 'daemon off;'"
