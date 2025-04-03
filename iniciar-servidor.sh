#!/bin/bash
# Script para iniciar el servidor MCP del concesionario
export PATH="$HOME/.bun/bin:$PATH" 
cd "$(dirname "$0")"
echo "🚀 Iniciando Servidor MCP del Concesionario..."
bun run start
