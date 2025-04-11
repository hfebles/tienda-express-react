
# Tienda Online E-commerce

Este es un proyecto de tienda online desarrollado con React, TypeScript y MySQL.

## Requisitos

- Node.js (v18 o superior)
- MySQL (v8 o superior)

## Configuración inicial

### 1. Configuración de la base de datos

1. Crear la base de datos y las tablas:

```bash
mysql -u [usuario] -p < db/schema.sql
```

2. Cargar los datos iniciales:

```bash
mysql -u [usuario] -p < db/seed.sql
```

### 2. Configuración del entorno

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales de MySQL y otras configuraciones.

### 3. Instalación de dependencias

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

## Estructura del proyecto

```
/
├── db/                    # Scripts SQL para la base de datos
├── src/
│   ├── components/        # Componentes de React
│   ├── contexts/          # Contextos de React (Auth, Cart)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilidades y configuraciones
│   ├── pages/             # Páginas de la aplicación
│   ├── services/          # Servicios para comunicación con la BD
│   └── types/             # Definiciones de tipos TypeScript
└── README.md
```

## Características principales

- Autenticación de usuarios
- Catálogo de productos con categorías y variantes
- Carrito de compras
- Proceso de checkout
- Panel de administración
- Gestión de pedidos
- Pagos por transferencia y pago móvil

## Usuarios de prueba

**Administrador:**
- Email: admin@example.com
- Contraseña: admin123

**Cliente:**
- Email: cliente@example.com
- Contraseña: cliente123
