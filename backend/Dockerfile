FROM python:3.9-slim-bookworm

# Ultra-Lean dependencies for 512MB Droplet
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    git \
    unzip \
    build-essential \
    openjdk-17-jre-headless \
    maven \
    golang-go \
    ruby \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables for memory tuning
ENV MAVEN_OPTS="-Xmx256m"
ENV JAVA_OPTS="-Xmx256m"
ENV NODE_OPTIONS="--max-old-space-size=512"

# Expose port
EXPOSE 8000

# Start application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
