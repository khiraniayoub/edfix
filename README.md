# EVC - EDfix 🛠️📱

[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-FF00C8?style=for-the-badge&logo=framer-motion)](https://www.framer.com/motion/)
[![EmailJS](https://img.shields.io/badge/EmailJS-4.4-orange?style=for-the-badge)](https://www.emailjs.com/)

**EVC - EDfix** es una plataforma web moderna, interactiva y con estética Cyberpunk/Neón diseñada para el taller físico de reparaciones tecnológicas de **EVCanal** en Málaga. La aplicación combina la captación de clientes mediante presupuestos interactivos con la divulgación de contenido tecnológico.

---

## ✨ Características Principales

*   **Estética Visual Premium:** Fondo matricial interactivo (`MatrixBackground`), animaciones suaves con Framer Motion, efecto *glassmorphism* y gradientes de luces de neón.
*   **Formulario de Presupuesto Automatizado:** Un flujo de solicitud interactivo en 2 pasos conectado con **EmailJS** para enviar solicitudes de presupuesto de reparación directamente al correo del taller.
*   **Feed de Noticias en Tiempo Real:** Integración con la API de **GNews** para mostrar las últimas novedades tecnológicas en España, con soporte para noticias de respaldo (fallback) automáticas.
*   **Hub de YouTube Integrado:** Panel interactivo en forma de monitor clásico para visualizar el último vídeo de **EVCanal** (con más de 11.9k suscriptores) y enlace de suscripción rápida.
*   **Recomendaciones de Gadgets:** Sección de herramientas del taller y gadgets recomendados con enlaces de afiliación de Amazon.
*   **Reseñas de Google Integradas:** Panel con la calificación actual de 5.0 estrellas del taller basada en las opiniones de clientes en Málaga.
*   **Sección de Tarifas Transparentes:** Tabla detallada de precios base para mantenimiento y reparaciones comunes en consolas, informática y gestiones.

---

## 🛠️ Tecnologías Utilizadas

*   **React 19 (Hooks, State, Refs)** - Biblioteca principal para la interfaz de usuario.
*   **Vite 8** - Herramienta de compilación rápida y entorno de desarrollo.
*   **Framer Motion 12** - Animaciones dinámicas de entrada, transiciones y micro-interacciones.
*   **Lucide React & React Icons** - Paquete de iconos vectoriales modernos.
*   **EmailJS** - Servicio integrado en el cliente para el envío de formularios de contacto por correo electrónico sin backend propio.
*   **GNews API** - Consumo de titulares de noticias tecnológicas de actualidad.

---

## 🚀 Instalación y Configuración Local

Sigue estos pasos para arrancar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/khiraniayoub/edfix.git
cd evc-edfix
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar API Keys
Abre el archivo [App.jsx](file:///c:/Users/Ayoub/.gemini/antigravity/scratch/evc-edfix/src/App.jsx) y edita las siguientes constantes con tus credenciales:

*   **EmailJS** (Crea una cuenta gratuita en [EmailJS](https://www.emailjs.com/)):
    ```javascript
    const EMAILJS_SERVICE_ID = 'tu_service_id';
    const EMAILJS_TEMPLATE_ID = 'tu_template_id';
    const EMAILJS_PUBLIC_KEY = 'tu_public_key';
    ```
    *Asegúrate de definir en tu plantilla de EmailJS las siguientes variables: `{{device}}`, `{{model}}`, `{{problem}}` y `{{client_email}}`.*

*   **GNews API** (Obtén tu API key gratuita en [GNews.io](https://gnews.io/)):
    ```javascript
    const GNEWS_API_KEY = 'tu_api_key';
    ```

### 4. Servidor de Desarrollo
Para levantar el servidor local con Hot Module Replacement (HMR):
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

### 5. Compilación para Producción
Para generar los archivos listos para desplegar en tu hosting:
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `/dist`.

---

## 📁 Estructura del Proyecto

```text
evc-edfix/
├── public/                 # Recursos estáticos (Logos, imágenes de gadgets, etc.)
├── src/
│   ├── assets/             # Recursos adicionales de estilo y medios
│   ├── components/         # Componentes modulares
│   │   └── MatrixBackground.jsx # Efecto visual de fondo de matriz de código lluvia
│   ├── App.css             # Estilos CSS generales y variables de diseño
│   ├── App.jsx             # Estructura principal y lógica de negocio
│   ├── index.css           # Estilos base y de reset
│   └── main.jsx            # Punto de entrada de React
├── index.html              # Estructura base del HTML con SEO local optimizado
├── package.json            # Scripts y dependencias del proyecto
└── vite.config.js          # Configuración del empaquetador Vite
```

---

## 📝 SEO Local Optimizado
El archivo [index.html](file:///c:/Users/Ayoub/.gemini/antigravity/scratch/evc-edfix/index.html) está preconfigurado para optimizar la indexación en motores de búsqueda, apuntando a palabras clave de alto rendimiento como:
*   *Reparaciones tecnológicas en Málaga*
*   *Taller experto de reparaciones de móviles, consolas, tablets y ordenadores*
*   *EVCanal Málaga*


