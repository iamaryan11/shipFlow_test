FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dependencies
RUN npm ci

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]