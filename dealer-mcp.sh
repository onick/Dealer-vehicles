#!/bin/bash
# Script para usar el servidor MCP del concesionario
export PATH="$HOME/.bun/bin:$PATH" 
cd "$(dirname "$0")"

# Verificar si Bun está instalado
if ! command -v bun &> /dev/null; then
    echo "❌ Error: Bun no está instalado. Instálalo con: curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

# Ejecutar el CLI con los argumentos proporcionados
bun run src/cli.ts "$@"
