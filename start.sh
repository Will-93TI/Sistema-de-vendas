#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"

echo "Iniciando Sistema de Gestão Administrativa em http://localhost:${PORT}"
echo "Pressione Ctrl+C para encerrar."

python3 -m http.server "${PORT}"
