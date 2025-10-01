#!/usr/bin/env bash
set -euo pipefail

REPO="T-Kisaku/42header-cli"
PROJECT_ENV_URL="https://raw.githubusercontent.com/${REPO}/main/project.env"
API_BASE="https://api.github.com/repos/${REPO}"
INSTALL_DIR="${HOME}/.local/bin"

# --- Load env from remote project.env ----------------------------------------
if curl -fsSL "$PROJECT_ENV_URL" >/dev/null; then
  # project.env is expected to define BINARY_NAME, etc.
  # shellcheck disable=SC1090
  source <(curl -fsSL "$PROJECT_ENV_URL")
else
  echo "Failed to fetch project.env: $PROJECT_ENV_URL" >&2
  exit 1
fi

: "${BINARY_NAME:?BINARY_NAME must be defined in project.env}"

# --- Detect OS/CPU -> TARGET --------------------------------------------------
uname_s=$(uname -s | tr '[:upper:]' '[:lower:]')
uname_m=$(uname -m)

TARGET=""
ext=""
case "$uname_s" in
  darwin)
    case "$uname_m" in
      arm64)   TARGET="aarch64-apple-darwin" ;;
      x86_64)  TARGET="x86_64-apple-darwin" ;;
      *) echo "Unsupported arch: $uname_m on macOS" >&2; exit 1 ;;
    esac
    ;;
  linux)
    case "$uname_m" in
      aarch64|arm64) TARGET="aarch64-unknown-linux-gnu" ;;
      x86_64|amd64)  TARGET="x86_64-unknown-linux-gnu" ;;
      *) echo "Unsupported arch: $uname_m on Linux" >&2; exit 1 ;;
    esac
    ;;
  mingw*|msys*|cygwin*)
    case "$uname_m" in
      x86_64|amd64) TARGET="x86_64-pc-windows-msvc" ;;
      *) echo "Unsupported arch: $uname_m on Windows" >&2; exit 1 ;;
    esac
    ext=".exe"
    ;;
  *)
    echo "Unsupported OS: $uname_s" >&2
    exit 1
    ;;
esac

# --- Determine version (override with VERSION env) ----------------------------
if [[ -n "${VERSION:-}" ]]; then
  TAG="$VERSION"
else
  TAG=$(curl -fsSL -H 'Accept: application/vnd.github+json' \
    "${API_BASE}/releases/latest" | grep -oE '"tag_name"\s*:\s*"[^"]+"' | cut -d '"' -f4)
  if [[ -z "$TAG" ]]; then
    echo "Failed to fetch latest release tag" >&2
    exit 1
  fi
fi

# --- Expected asset name: BINARY_NAME-TARGET[.exe] ----------------------------
ASSET_NAME="${BINARY_NAME}-${TARGET}${ext}"
BIN_URL="https://github.com/${REPO}/releases/download/${TAG}/${ASSET_NAME}"

echo "Install plan:"
echo "  REPO   : $REPO"
echo "  TAG    : $TAG"
echo "  TARGET : $TARGET"
echo "  ASSET  : $ASSET_NAME"
echo "  DEST   : $INSTALL_DIR"
echo

# --- Prepare destination ------------------------------------------------------
mkdir -p "$INSTALL_DIR"

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

echo "Downloading ${ASSET_NAME} from ${BIN_URL} ..."
if ! curl -fL -o "${tmpdir}/${ASSET_NAME}" "${BIN_URL}"; then
  echo "Download failed. The asset for this target may not exist." >&2
  echo "URL: ${BIN_URL}" >&2
  exit 1
fi

chmod +x "${tmpdir}/${ASSET_NAME}"
mv "${tmpdir}/${ASSET_NAME}" "${INSTALL_DIR}/${BINARY_NAME}${ext}"

echo "✅ Installed: ${INSTALL_DIR}/${BINARY_NAME}${ext}"

# Suggest PATH update if needed
case ":${PATH}:" in
  *:"${INSTALL_DIR}":*) ;;
  *)
    echo
    echo "⚠️  ${INSTALL_DIR} is not in PATH. Add this to your shell rc:"
    echo "    export PATH=\"${INSTALL_DIR}:\$PATH\""
    ;;
esac
