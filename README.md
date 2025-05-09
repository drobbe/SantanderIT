# SantanderIT

Este proyecto permite cargar, procesar y visualizar información de candidatos a partir de archivos Excel. Consta de un frontend en Angular y un backend en NestJS, organizados como workspaces de npm.

## Requisitos previos

- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI
- NestJS CLI

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Navega a la carpeta raíz del proyecto:

```bash
cd candidate-backend
```

3. Asegúrate de que los `package.json` dentro de `back` y `front` tengan nombres únicos:

- `back/package.json` → "name": "candidate-backend"
- `front/package.json` → "name": "candidate-frontend"

4. Instala todas las dependencias con un solo comando:

```bash
npm install
```

> Gracias a `npm workspaces`, este comando instalará las dependencias en `back/` y `front/` automáticamente.

## Ejecutar el proyecto (frontend + backend)

Desde la carpeta raíz del proyecto:

```bash
npm run start:all
```

Esto levantará:

- Backend NestJS en: `http://localhost:3000`
- Frontend Angular en: `http://localhost:4200`

## Ejecutar pruebas unitarias

### Backend (NestJS)

Desde la raíz del proyecto:

```bash
npm run test --workspace=candidate-backend
```

Esto ejecutará las pruebas definidas en el backend. Los archivos de prueba se encuentran principalmente en:

```
back/src/candidates/*.spec.ts
```

### Frontend (Angular)

Desde la raíz del proyecto:

```bash
npm run test --workspace=candidate-frontend
```

Esto abrirá el entorno de pruebas de Angular y mostrará los resultados en la terminal o navegador según configuración.

## Scripts disponibles

En el archivo `package.json` de la raíz:

```json
"scripts": {
  "start:all": "concurrently \"npm run start --workspace=candidate-backend\" \"npm run start --workspace=candidate-frontend\""
}
```

## Estructura del proyecto

```
/candidate-backend
│
├── back/         # Backend NestJS ("candidate-backend")
│   └── src/
│       └── candidates/   # Módulo principal para gestionar candidatos
│
├── front/        # Frontend Angular ("candidate-frontend")
│
├── example.xlsx  # Archivo de Excel de prueba para cargar candidatos
│
├── package.json  # Configuración principal y workspaces
```

## Observaciones

- El backend procesa archivos Excel subidos desde el frontend.
- El archivo debe contener exactamente una fila.
- Si ocurre un error de validación, el backend enviará un mensaje claro: `Validation error: ...`
- Se incluye un archivo de prueba `example.xlsx` en la raíz del proyecto para facilitar la carga de datos.
- El backend y frontend cuentan con pruebas unitarias que validan el comportamiento de sus componentes y servicios.

---
