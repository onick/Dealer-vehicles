#!/bin/bash
# Script para iniciar la API REST del servidor MCP

export PATH="$HOME/.bun/bin:$PATH" 
cd "$(dirname "$0")"

# Verificar si Bun está instalado
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun no está instalado. Instálalo con: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Puerto configurable
PORT=${1:-3000}
export PORT=$PORT

echo "🚗 Iniciando API REST del Servidor MCP en el puerto $PORT..."
bun run src/api.ts
