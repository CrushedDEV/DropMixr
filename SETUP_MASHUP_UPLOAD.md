# 📋 Guía de Configuración - Sistema de Subida de Mashups

## ✅ Lo que hemos completado

### 1. **Página de Explorador** (`explore.tsx`)
- ✨ Barra de búsqueda avanzada
- 🔍 Filtros por BPM y ordenamiento
- 📱 Sidebar responsive con navegación
- 👤 Menú de usuario con opción de logout
- ➕ Botón para crear nuevo mashup
- 📄 Paginación inteligente

### 2. **Página de Creación de Mashups** (`mashups/Create.tsx`)
- 📝 Formulario completo con validación
- 🎵 Upload de archivos de audio (MP3, WAV, OGG)
- 🖼️ Upload de portada (JPG, PNG, WebP)
- 👀 Preview en tiempo real de archivos
- ⚠️ Validación de tamaños (Audio: 50MB, Imagen: 5MB)
- ✔️ Estados de éxito/error
- 💡 Barra lateral con consejos

### 3. **Backend - Controlador** (`MashupController.php`)
- ✅ Validación de archivos con reglas Laravel
- 💾 Almacenamiento en disco público
- 🔐 Autenticación y verificación de email requerida
- 📋 Retorna mashups públicos y aprobados
- ❌ Manejo de errores y limpieza de archivos

### 4. **Backend - Modelo** (`Mashup.php`)
- ✅ Campo `image_path` agregado a fillable
- 🔗 Relación con User

### 5. **Backend - Política de Autorización** (`MashupPolicy.php`)
- 🔐 Solo propietario puede editar su mashup
- 🗑️ Solo propietario puede eliminar su mashup
- ✅ Cualquier usuario autenticado puede crear

### 6. **Base de Datos**
- ✅ Migración creada para agregar `image_path`
- 📊 Tabla lista para almacenar mashups con imágenes

### 7. **Rutas** (`web.php`)
- 🔓 GET `/mashups` - Pública (lista de mashups)
- 🔓 GET `/mashups/{id}` - Pública (detalle del mashup)
- 🔒 GET `/explore` - Protegida
- 🔒 POST `/mashups` - Crear mashup (auth + verified)
- 🔒 GET `/mashups/create` - Formulario (auth + verified)
- 🔒 GET/PUT/DELETE `/mashups/{id}` - Editar/eliminar (auth + propietario)

---

## 🚀 Pasos para Poner en Funcionamiento

### 1. Ejecutar la migración
```bash
php artisan migrate
```

### 2. Crear el enlace simbólico para storage
```bash
php artisan storage:link
```

### 3. Verificar permisos de carpeta
```bash
# En Windows, asegúrate de que storage/app/public sea accesible
chmod -R 755 storage/app/public
```

### 4. Compilar assets (si es necesario)
```bash
npm run dev
# O en producción:
npm run build
```

---

## 📝 Archivos Creados/Modificados

### Creados:
- ✨ `resources/js/pages/mashups/Create.tsx` - Página de creación
- ✨ `app/Policies/MashupPolicy.php` - Política de autorización
- ✨ `database/migrations/2025_03_27_094425_add_image_path_to_mashups_table.php` - Migración

### Modificados:
- 📝 `resources/js/pages/explore.tsx` - Agregados botones y funcionalidad
- 📝 `app/Http/Controllers/MashupController.php` - Manejo de uploads
- 📝 `app/Models/Mashup.php` - Agregado `image_path` a fillable
- 📝 `app/Providers/AppServiceProvider.php` - Registrada Policy
- 📝 `routes/web.php` - Rutas protegidas y públicas

---

## 🎯 Flujo de Usuario

1. **Usuario no autenticado:**
   - Ve la página `/explore`
   - Puede ver mashups públicos aprobados
   - Puede filtrar y buscar
   - No puede crear mashups

2. **Usuario autenticado y verificado:**
   - Ve botón "Crear Mashup" en explore
   - Accede a `/mashups/create`
   - Completa el formulario y sube archivos
   - El mashup se crea con estado `pending` (no aprobado)
   - Recibe confirmación de éxito

3. **Admin/Moderador (futuro):**
   - Podrá aprobar mashups pendientes
   - Cambiar estado de `pending` a `approved`

---

## 🔒 Seguridad Implementada

✅ **Autenticación**: Solo usuarios verificados pueden crear/editar/eliminar
✅ **Autorización**: Solo el propietario puede editar su mashup
✅ **Validación**: Validación de tipos y tamaños de archivos
✅ **Almacenamiento**: Archivos almacenados en `storage/app/public`
✅ **Limpieza**: Si falla la creación, se eliminan los archivos subidos

---

## 🐛 Pruebas Recomendadas

1. Probar upload de mashup completo
2. Verificar que solo propietario puede editar
3. Probar búsqueda y filtros
4. Verificar que archivos se guardan en `storage/app/public`
5. Validar que no autenticados no pueden crear
6. Probar con archivos grandes (>50MB para audio)

---

## 📚 Endpoints de API

### Obtener todos los mashups públicos
```
GET /mashups
Response: Array de mashups con URLs de archivos
```

### Crear nuevo mashup
```
POST /mashups
Content-Type: multipart/form-data
Body:
- title: string (requerido)
- description: string (opcional)
- bpm: integer (opcional)
- key: string (opcional)
- is_public: boolean (default: true)
- file_path: file (requerido - audio)
- image_path: file (requerido - imagen)
```

---

## 🎨 Variables de Tailwind Personalizadas

- Color principal: `pink-500` a `purple-600` (gradiente)
- Tema: Dark (fondo negro/gris oscuro)
- Iconos: Lucide React

---

## 📞 Soporte Futuro

Para agregar funcionalidades adicionales:
- Editar mashups existentes
- Panel de administrador para aprobar mashups
- Comentarios y ratings
- Sistema de descargas
- Analytics
