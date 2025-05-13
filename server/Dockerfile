FROM --platform=linux/arm64 jrottenberg/ffmpeg:7.1-ubuntu2404-edge

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    # libgl1 and libgl1-mesa-glx removed as they caused issues
    # Install Node.js and yarn
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .
# Ensure server.js is copied. If it's in a subdirectory, COPY . . will handle it.
# If server.js is at the root and you prefer explicit, you can keep:
# COPY server.js .

EXPOSE 5555

ENTRYPOINT [""]
# Ensure your package.json has a "start" script, e.g., "start": "node server.js"
CMD ["yarn", "start"]