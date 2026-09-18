FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4173

COPY dev-server.mjs ./
COPY dist ./dist

RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 4173

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:4173/ || exit 1

CMD ["node", "dev-server.mjs"]
