#!/bin/bash
# Kandra Production Deployment & 1GB Optimization Script
# Optimized for Hackathon Demo on a single Droplet

set -e

echo "🚀 Starting Kandra Production Deployment..."

# 1. SWAP MANAGEMENT (Crucial for 1GB RAM)
echo "💾 Configuring 4GB Swap File for memory stability..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ Swap configured successfully."
else
    echo "ℹ️ Swap file already exists."
fi

# 2. SYSTEM UPDATES & CORE TOOLS
echo "🛠️ Installing core system dependencies..."
sudo apt-get update
sudo apt-get install -y \
    curl \
    git \
    unzip \
    build-essential \
    nginx \
    docker.io \
    docker-compose \
    python3-venv \
    python3-pip

# 3. UNIVERSAL RUNTIME INSTALLATION (Big Five)
echo "☕ Installing Java 17 & Maven..."
sudo apt-get install -y openjdk-17-jdk maven

echo "🟢 Installing Node.js (LTS)..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "🐹 Installing Go..."
sudo apt-get install -y golang-go

echo "💎 Installing Ruby..."
sudo apt-get install -y ruby-full

# 4. MEMORY TUNING (Safety Limits)
echo "📉 Applying memory constraints for 1GB Droplet..."
# Add to .bashrc for future sessions
if ! grep -q "MAVEN_OPTS" ~/.bashrc; then
    echo 'export MAVEN_OPTS="-Xmx256m"' >> ~/.bashrc
    echo 'export JAVA_OPTS="-Xmx256m"' >> ~/.bashrc
    echo 'export NODE_OPTIONS="--max-old-space-size=512"' >> ~/.bashrc
fi

# Export for current session
export MAVEN_OPTS="-Xmx256m"
export JAVA_OPTS="-Xmx256m"
export NODE_OPTIONS="--max-old-space-size=512"

# 5. DOCKER SETUP
echo "🐳 Starting Docker services..."
sudo systemctl enable docker
sudo systemctl start docker

# 6. NGINX CONFIGURATION (API & WS Proxy)
echo "🌐 Configuring Nginx for Backend API & WebSocket..."
cat <<EOF | sudo tee /etc/nginx/sites-available/kandra
server {
    listen 80;
    server_name _;

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend WebSocket
    location /ws {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/kandra /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Deployment Environment Ready!"
echo "------------------------------------------------"
echo "Next Steps:"
echo "1. Push this code to GitHub."
echo "2. Pull it on your Droplet."
echo "3. Run: docker-compose up -d --build"
echo "4. Connect your Vercel frontend to http://your-droplet-ip"
echo "------------------------------------------------"
