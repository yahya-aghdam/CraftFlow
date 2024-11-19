# Make dev app
FROM node:22-alpine AS development

WORKDIR /usr/src/app/gAuthCraft

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Optimize app for production
FROM node:22-alpine AS production

WORKDIR /usr/src/app/gAuthCraft

COPY package*.json .

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/gAuthCraft/dist ./dist

CMD ["node","dist/index.js"]