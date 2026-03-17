FROM oven/bun:1 as base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        google-chrome-stable \
        fonts-liberation \
        libappindicator3-1 \
        libasound2 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libxss1 \
        libxtst6 \
        xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage - use the same base image to avoid Chrome reinstallation
FROM base as production

# Remove development dependencies and clean up
RUN rm -rf node_modules/.cache \
    && rm -rf /tmp/* \
    && rm -rf /var/tmp/*

WORKDIR /app

# Keep only production files
RUN rm -rf src \
    && rm -rf node_modules \
    && rm -f tsconfig.json \
    && rm -f bun.lockb

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]