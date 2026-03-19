# ---------- Base Stage ----------
FROM oven/bun:1 AS base

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome"

# Install Chrome + deps
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://dl-ssl.google.com/linux/linux_signing_key.pub \
        | gpg --dearmor -o /etc/apt/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
        > /etc/apt/sources.list.d/google-chrome.list \
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

# Install deps
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN bun run build


# ---------- Production Stage ----------
FROM base AS production

USER root
WORKDIR /app

# Clean unnecessary files
RUN rm -rf src \
    && rm -rf node_modules/.cache \
    && rm -f tsconfig.json \
    && rm -f bun.lockb \
    && rm -rf /var/tmp/*

# Create non-root user
RUN groupadd -r appuser \
    && useradd -r -g appuser -m -d /home/appuser -s /bin/bash appuser

# Create required dirs for Chrome
RUN mkdir -p /home/appuser/.config \
    && mkdir -p /home/appuser/.cache \
    && mkdir -p /home/appuser/.local/share \
    && mkdir -p /tmp/chrome-data

# Fix permissions
RUN chown -R appuser:appuser /home/appuser \
    && chown -R appuser:appuser /app \
    && chmod -R 755 /home/appuser \
    && chmod -R 777 /tmp \
    && chmod -R 777 /tmp/chrome-data

# Env vars (CRITICAL for Chrome)
ENV HOME=/home/appuser
ENV XDG_CONFIG_HOME=/home/appuser/.config
ENV XDG_CACHE_HOME=/home/appuser/.cache

USER appuser

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]