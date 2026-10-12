# Multi-stage production-ready Dockerfile
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    COMMIT_SHA=0a745422cd3a2c56976110332581d8721b2cc5da

# Install dependencies first for efficient layer caching
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy required application source files
COPY server.js ./
COPY index.html ./
COPY html/ ./html/
COPY css/ ./css/
COPY script/ ./script/

# Execute project build step
RUN npm run build

# Set file permissions for the non-root node user
RUN chown -R node:node /app

# Run as non-root user
USER node

# Expose application port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

# Start application using existing npm start command
CMD ["npm", "start"]
