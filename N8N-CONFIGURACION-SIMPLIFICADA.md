# Configuración Simplificada para n8n

Este documento explica cómo configurar el servidor MCP del concesionario en n8n utilizando el método simplificado similar a AirBnB.

## Configuración en n8n

Cuando quieras conectar el MCP en n8n, puedes usar esta configuración simplificada:

### Campos a completar en n8n:

1. **Command**: `npx`
2. **Arguments**: `-y dealer-mcp-server --ignore-robots-txt`

¡Eso es todo! No se necesitan rutas complejas ni configuraciones adicionales.

## Instalación previa (solo una vez)

Para que esto funcione, primero necesitas publicar el paquete npm. Hay dos opciones:

### Opción 1: Instalar desde paquete local (para pruebas)

```bash
# Crear el paquete
cd /ruta/a/Dealer-vehicles
npm pack

# Instalar globalmente (solo necesario una vez)
npm install -g ./dealer-mcp-server-0.1.0.tgz
```

### Opción 2: Publicar en npm (para uso en producción)

```bash
# Iniciar sesión en npm
npm login

# Publicar el paquete
npm publish
```

## Uso en n8n

Una vez configurado el nodo MCP en n8n con esta configuración simplificada, podrás:

1. Usar todas las herramientas disponibles (inventory, financing, testDrive, quotation, invoice)
2. Seleccionar cualquier método de cada herramienta
3. Pasar parámetros en formato JSON

### Ejemplo de flujo en n8n:

1. Añadir un nodo MCP
2. Configurar con Command: `npx` y Arguments: `-y dealer-mcp-server --ignore-robots-txt`
3. En la configuración del nodo específico:
   - Tool: `inventory`
   - Method: `searchInventory`
   - Parameters: `{"brand":"Toyota"}`

## Ventajas de esta configuración

- No requiere especificar rutas completas
- Funciona en cualquier entorno donde esté instalado Node.js
- Es portable y fácil de configurar
- Similar a otros servicios MCP como AirBnB

## Solución de problemas

Si encuentras algún problema, asegúrate de:

1. Tener Node.js instalado
2. Haber instalado globalmente el paquete dealer-mcp-server
3. Tener permisos para ejecutar npx

Para cualquier problema, puedes ejecutar manualmente el comando para verificar que funciona:

```bash
npx dealer-mcp-server --tool inventory --method searchInventory --params '{"brand":"Toyota"}'
```
