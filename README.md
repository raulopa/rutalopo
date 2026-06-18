<div align="center">
  <img src="assets/rutalopo.svg" alt="La Rutalopó Logo" width="150" />
  <h1>La Rutalopó</h1>
  <p><strong>Cultura, Muntanya i Llengua</strong></p>
</div>

---

## 🏔️ Sobre el proyecto

La Rutalopó es una plataforma interactiva diseñada para promover el patrimonio natural, cultural y lingüístico mediante rutas de senderismo y gamificación (Passaloport digital). Desarrollada con tecnologías web modernas para ofrecer una experiencia inmersiva.

## 🚀 Tecnologías

*   **Frontend:** React 19, Vite, Tailwind CSS 4, Motion (Animaciones), Lucide React
*   **Backend & Auth:** Supabase
*   **Lenguajes:** TypeScript, HTML5, CSS3

## ⚙️ Configuración y Ejecución Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina:

### 1. Prerrequisitos
Asegúrate de tener instalado **Node.js** en tu sistema.

### 2. Instalación de dependencias
Abre tu terminal en la raíz del proyecto y ejecuta:
```bash
npm install
```

### 3. Variables de Entorno
Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`) y asegúrate de configurar tus claves. Si utilizas la integración con Gemini o Supabase, asegúrate de colocar las variables correspondientes, por ejemplo:
```env
GEMINI_API_KEY=tu_api_key_de_gemini
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Iniciar el servidor de desarrollo
Para arrancar el proyecto localmente, ejecuta:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000` o en el puerto indicado por Vite.

## 📦 Construcción para Producción (Deploy)

Para generar la versión optimizada lista para producción, ejecuta:
```bash
npm run build
```
Esto creará una carpeta `dist` que puedes subir fácilmente a plataformas de despliegue estático como Vercel, Netlify o Cloudflare Pages.
