#!/bin/sh
# TODO:

set -e

REPO="T-Kisaku/nikki-cli"
INSTALL_DIR="$HOME/.local/bin"

# Fetch latest version
VERSION=$(curl -sL "https://api.github.com/repos/$REPO/releases/latest" | grep '"tag_name":' | cut -d '"' -f 4)

# TODO: change nik to 42hdr
BIN_URL="https://github.com/$REPO/releases/download/$VERSION/nik"

echo "Downloading nik $VERSION..."
curl -fsSL -o nik "$BIN_URL"
chmod +x nik
sudo mv nik "$INSTALL_DIR/nik"

echo "✅ nik installed successfully!"
