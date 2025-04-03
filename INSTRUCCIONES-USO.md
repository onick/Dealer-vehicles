# Instrucciones para usar el Servidor MCP del Concesionario

## Formas de iniciar el servidor

### Opción 1: Usando el script de inicio
```bash
# Navega al directorio del proyecto
cd ~/Documents/Projects/MCP/dealler

# Ejecuta el script de inicio
./iniciar-servidor.sh
```

### Opción 2: Usando Bun directamente
```bash
# Navega al directorio del proyecto
cd ~/Documents/Projects/MCP/dealler

# Asegúrate que Bun está en tu PATH
export PATH="$HOME/.bun/bin:$PATH"

# Inicia el servidor
bun run start
```

### Opción 3: Ejecutando la versión compilada
```bash
# Navega al directorio del proyecto
cd ~/Documents/Projects/MCP/dealler

# Asegúrate que Bun está en tu PATH
export PATH="$HOME/.bun/bin:$PATH"

# Ejecuta la versión compilada
bun dist/main.js
```

## Funcionalidades disponibles

1. **Gestión de Inventario**: Añadir, listar y buscar vehículos
2. **Calculadora de Financiamiento**: Calcular pagos mensuales
3. **Pruebas de Manejo**: Programar, listar y actualizar pruebas de manejo

## Conexión con otras aplicaciones

Para usar este MCP server con Claude u otras aplicaciones, asegúrate de que:
1. El servidor esté en ejecución
2. Utilices la ruta correcta al servidor en tus comandos MCP
