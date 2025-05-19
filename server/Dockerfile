FROM postgres:17

ENV DEBIAN_FRONTEND=noninteractive

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
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
RUN yarn install

# Copy the rest of the application code
COPY . .

EXPOSE 5555

# Set entrypoint to null (empty array) to override postgres default entrypoint
ENTRYPOINT []
# Start the application with yarn
CMD ["yarn", "start"]