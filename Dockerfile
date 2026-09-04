# Monorepo container runner
# For full multi-container deployment, run: docker compose up --build
# Sub-services also have dedicated Dockerfiles:
# - Frontend: frontend/Dockerfile (Port 3000)
# - Backend:  backend/Dockerfile (Port 5000)

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install
RUN npm --prefix frontend install
RUN npm --prefix backend install

COPY . .

ENV NODE_ENV=production
EXPOSE 3000 5000

CMD ["npm", "run", "dev"]
