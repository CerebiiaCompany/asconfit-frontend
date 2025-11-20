# ASCONFIT - Frontend

## Instalación

### 1. Clonar el Repositorio

```bash
cd C:\Users\USUARIO\Documents\GitHub\asconfit

git clone https://github.com/CerebiiaCompany/asconfit-frontend.git

git clone https://github.com/CerebiiaCompany/asconfit-backend.git
```

### 2. Instalar Dependencias del Frontend

```bash
cd asconfit-frontend
npm install
```

### 3. Instalar Dependencias del Backend

```bash
cd ..\asconfit-backend
composer install
```

---

## ⚙️ Configuración

### Frontend

1. **No requiere archivo `.env` por defecto**

   - La URL del backend está configurada en los archivos de servicio
   - Por defecto apunta a: `http://localhost:8000/api`

### Backend

1. **Copiar el archivo de configuración:**

   ```bash
   cd asconfit-backend
   copy .env.example .env
   ```

2. **Configurar la base de datos en `.env`:**

   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=asconfit
   DB_USERNAME=postgres
   DB_PASSWORD=12345678
   ```

3. **Generar la clave de aplicación:**

   ```bash
   php artisan key:generate
   ```

4. **Crear la base de datos:**

   ```sql
   CREATE DATABASE asconfit CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Ejecutar las migraciones:**

   ```bash
   php artisan migrate
   ```

6. **Ejecutar los seeders:**
   ```bash
   php artisan db:seed
   ```

---

## 🎯 Ejecución del Proyecto Completo

### Opción 1: Ejecutar Backend y Frontend Por Separado

#### Terminal 1 - Backend (Laravel)

```bash
cd C:\Users\USUARIO\Documents\GitHub\asconfit\asconfit-backend
php artisan serve
```

El backend estará disponible en: `http://localhost:8000`

#### Terminal 2 - Frontend (React)

```bash
cd C:\Users\USUARIO\Documents\GitHub\asconfit\asconfit-frontend
npm start
```

El frontend se abrirá automáticamente en: `http://localhost:3000`
