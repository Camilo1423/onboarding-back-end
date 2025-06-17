# Documentación del Proyecto

## Requisitos Previos
- Node.js
- npm
- Docker (opcional, para entorno de producción)
- PostgreSQL (si no se usa Docker)

## Configuración del Proyecto

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_PROYECTO]
```

2. Instalar dependencias
```bash
npm install
```

3. Configuración de variables de entorno
- Copiar el archivo `.env.example` a `.env`
- Configurar las variables de entorno según sea necesario

## Base de Datos

### Usando Prisma
1. Ejecutar las migraciones de Prisma
```bash
npx prisma migrate dev
```

2. Generar el cliente de Prisma
```bash
npx prisma generate
```

## Ejecutar el Proyecto

### Desarrollo Local
Para ejecutar el proyecto en modo desarrollo:
```bash
npm run start:dev
```

### Producción con Docker
Para ejecutar el proyecto en modo producción usando Docker:
```bash
docker compose up --build -d
```

**Nota importante para Docker:**
Si utiliza Docker, asegúrese de configurar las variables de entorno de la base de datos con los valores correspondientes del archivo `docker-compose.yml`:
- Host
- Usuario
- Contraseña
- Nombre de la base de datos

## Estructura del Proyecto
[Agregar aquí la estructura básica del proyecto si es necesario]

## Scripts Disponibles
- `npm run start:dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila el proyecto
- `npm run start`: Inicia el servidor en modo producción
