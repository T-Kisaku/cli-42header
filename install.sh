#!/bin/bash

set -e

REPO="T-Kisaku/cli-42header"
PROJECT_ENV_URL="https://raw.githubusercontent.com/${REPO}/main/project.env"
BIN_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}"
LATEST_VERSION=$(curl -sL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | cut -d '"' -f 4)
INSTALL_DIR="${HOME}/.local/bin"

set -a
source < "$(curl -fsSL ${PROJECT_ENV_URL})"
set +a

echo "Downloading ${BINARY_NAME} ${LATEST_VERSION}..."
curl -fsSL -o "${BINARY_NAME}" "${BIN_URL}"
chmod +x "${BINARY_NAME}"
mv "${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"

echo "✅ ${BINARY_NAME} installed successfully!"
