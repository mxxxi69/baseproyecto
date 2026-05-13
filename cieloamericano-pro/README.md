# CieloTec Soluciones — Web Corporativa

Página web profesional para empresa especialista en provisión e instalación de cielo americano para proyectos corporativos en Chile.

---

## 📁 Estructura del proyecto

```
cieloamericano-pro/
│
├── index.html                  ← Página principal (único archivo HTML)
├── README.md                   ← Este archivo
│
└── assets/
    ├── css/
    │   ├── main.css            ← Variables, reset, navbar, hero, footer, botones
    │   ├── components.css      ← Secciones: nosotros, servicios, proyectos, clientes, contacto
    │   └── animations.css      ← Keyframes y animaciones de scroll
    │
    ├── js/
    │   ├── main.js             ← Lógica: navbar, menú, scroll, contadores, filtros, carrusel
    │   └── form.js             ← Validación y envío del formulario de contacto
    │
    └── images/
        ├── hero-bg.jpg         ← AGREGAR: foto de fondo del hero (1920x1080 mínimo)
        ├── nosotros.jpg        ← AGREGAR: foto del equipo o instalación en proceso
        ├── og-image.jpg        ← AGREGAR: imagen para compartir en redes (1200x630)
        ├── favicon.svg         ← AGREGAR: ícono del sitio
        ├── projects/           ← AGREGAR: fotos de proyectos realizados
        │   ├── proyecto-1.jpg
        │   ├── proyecto-2.jpg
        │   └── ...
        └── clients/            ← AGREGAR: logos de clientes (PNG transparente)
            ├── logo-clinica.png
            ├── logo-banco.png
            └── ...
```

---

## 🚀 Cómo abrir el proyecto en VSCode

Este proyecto NO necesita Node.js ni npm. Es HTML + CSS + JS puro.

### Paso 1: Abrir en VSCode
```
File → Open Folder → Selecciona la carpeta "cieloamericano-pro"
```

### Paso 2: Instalar extensión Live Server
1. En VSCode, ve a Extensions (Ctrl+Shift+X)
2. Busca "Live Server" (autor: Ritwick Dey)
3. Instalar
4. Clic derecho en `index.html` → "Open with Live Server"
5. Se abre automáticamente en el navegador con recarga en vivo

---

## ✏️ Cómo personalizar el contenido

### Cambiar nombre de empresa
Busca y reemplaza "CieloTec" y "cielotec" en `index.html` con el nombre real.

### Cambiar datos de contacto
En `index.html`, busca:
- `+56 9 1234 5678` → tu teléfono real
- `contacto@cielotec.cl` → tu correo real
- `Av. Principal 1234, Santiago` → tu dirección real
- `56912345678` en los links de WhatsApp → tu número sin el +

### Cambiar colores
En `assets/css/main.css`, modifica las variables CSS al inicio del archivo:
```css
--color-accent: #C9A84C;    /* Dorado → cambia por tu color de marca */
--color-bg:     #0a0a0a;    /* Fondo negro → puedes hacerlo más oscuro/claro */
```

### Agregar fotos reales
1. **Hero**: Guarda tu foto como `assets/images/hero-bg.jpg`
2. **Nosotros**: Guarda como `assets/images/nosotros.jpg`
   - En `index.html`, busca `nosotros__image-placeholder` y reemplaza todo el div por:
   ```html
   <img src="assets/images/nosotros.jpg" alt="Equipo CieloTec" class="nosotros__image" loading="lazy" />
   ```
3. **Proyectos**: Guarda las fotos en `assets/images/projects/`
   - En cada `project-card`, reemplaza el `project-image-placeholder` por:
   ```html
   <img src="assets/images/projects/nombre.jpg" alt="Descripción" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
   ```
4. **Clientes**: Guarda logos en `assets/images/clients/`
   - Reemplaza cada `logo-placeholder` por:
   ```html
   <img src="assets/images/clients/nombre.png" alt="Empresa" loading="lazy" />
   ```

### Agregar proyectos
Copia y pega un bloque `<article class="project-card">` en la sección proyectos y modifica el contenido.

---

## 📧 Activar el formulario de contacto

El formulario necesita un servicio externo para enviar emails.

### Opción recomendada: Formspree (gratis, fácil)
1. Regístrate en [formspree.io](https://formspree.io)
2. Crea un formulario
3. Copia tu endpoint (ej: `https://formspree.io/f/abc123`)
4. En `assets/js/form.js`, cambia:
   ```javascript
   submitUrl: 'https://formspree.io/f/TU_ID_AQUI',
   ```
   por tu endpoint real.

### Opción alternativa: Web3Forms (100% gratis)
1. Ve a [web3forms.com](https://web3forms.com)
2. Ingresa tu correo
3. Recibirás un Access Key
4. Agrega en el formulario HTML (dentro del `<form>`):
   ```html
   <input type="hidden" name="access_key" value="TU_ACCESS_KEY" />
   ```
5. Cambia submitUrl a: `https://api.web3forms.com/submit`

---

## 🔼 Subir a GitHub

### Primera vez (crear repositorio)
```bash
# 1. Instala Git desde git-scm.com si no lo tienes
# 2. Abre la terminal en la carpeta del proyecto

git init
git add .
git commit -m "Primer commit: web corporativa CieloTec"
git branch -M main

# 3. Crea un repositorio vacío en github.com
# 4. Copia la URL del repositorio y ejecuta:
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

### Actualizaciones futuras
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

---

## 🌐 Hosting gratuito: GitHub Pages

GitHub Pages permite hospedar el sitio gratis con tu repositorio.

1. En GitHub, ve a tu repositorio
2. Settings → Pages
3. En "Source", selecciona `Deploy from a branch`
4. Branch: `main`, carpeta: `/ (root)`
5. Save
6. En unos minutos, tu sitio estará en: `https://tu-usuario.github.io/tu-repositorio/`

---

## 🌍 Dominio propio (cuando estés listo)

### Opción 1: NIC Chile (.cl) - Recomendado para empresas chilenas
- Ve a [nic.cl](https://www.nic.cl)
- Los dominios .cl cuestan aprox. $10.000 CLP/año
- Ventaja: transmite más confianza a clientes chilenos

### Opción 2: Namecheap (.com)
- Ve a [namecheap.com](https://www.namecheap.com)
- Dominios .com desde ~$10 USD/año

### Conectar dominio con GitHub Pages
1. Compra el dominio
2. En el panel del dominio, agrega un registro DNS tipo CNAME:
   - Name: `www`
   - Value: `tu-usuario.github.io`
3. Agrega registros A apuntando a las IPs de GitHub Pages:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. En GitHub Pages settings, ingresa tu dominio en "Custom domain"
5. Espera hasta 48 horas para que propague el DNS

---

## ⚡ Checklist antes de lanzar

- [ ] Cambiar nombre de empresa en todo el HTML
- [ ] Actualizar todos los datos de contacto (teléfono, email, dirección)
- [ ] Actualizar links de WhatsApp con número real
- [ ] Agregar foto del hero (hero-bg.jpg)
- [ ] Agregar foto de nosotros (nosotros.jpg)
- [ ] Agregar fotos de proyectos reales
- [ ] Agregar logos de clientes reales
- [ ] Activar formulario de contacto (Formspree o Web3Forms)
- [ ] Actualizar meta description con descripción real
- [ ] Agregar og-image.jpg (1200x630px para redes sociales)
- [ ] Subir a GitHub
- [ ] Activar GitHub Pages (hosting gratuito)
- [ ] Comprar dominio .cl
- [ ] Conectar dominio al hosting
- [ ] Verificar en móvil (iPhone y Android)
- [ ] Probar el formulario en producción

---

## 🛠️ Tecnologías usadas

| Tecnología | Por qué |
|------------|---------|
| HTML5 semántico | Estructura, SEO, accesibilidad |
| CSS3 puro | Sin framework = carga instantánea |
| Variables CSS | Diseño consistente y fácil de cambiar |
| JavaScript ES6+ | Sin dependencias = sin vulnerabilidades |
| IntersectionObserver | Animaciones de scroll sin librerías |
| Google Fonts | Tipografía profesional (Bebas Neue + DM Sans) |

---

Desarrollado con ❤️ para PYME chilena.
