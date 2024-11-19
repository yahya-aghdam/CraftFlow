# Make dev app
FROM node:22-alpine as development

WORKDIR /usr/src/app/gAuthCraft

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# Optimize app for production
FROM node:22-alpine as production

WORKDIR /usr/src/app/gAuthCraft

COPY package*.json .

RUN npm ci --only=production

COPY --from=development /usr/src/app/gAuthCraft/dist ./dist

CMD ["node","dist/index.js"]