/* ============================================================
   form.js
   Validación y envío del formulario de contacto.
   
   IMPORTANTE PARA PRODUCCIÓN:
   Este formulario está preparado para conectarse con un
   servicio backend. Las opciones recomendadas (gratis) son:
   
   1. Formspree (formspree.io) - Más fácil, gratis hasta 50/mes
   2. EmailJS (emailjs.com) - Envía directo desde JS
   3. Web3Forms (web3forms.com) - Gratis, sin límite
   
   Ver instrucciones al final de este archivo.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  initContactForm(form);
});


/* ── CONFIGURACIÓN ──────────────────────────────────────────
   Cambia aquí la URL del servicio que uses para recibir emails.
   ─────────────────────────────────────────────────────────── */
const FORM_CONFIG = {
  // Opción 1: Formspree (recomendado para empezar)
  // 1. Registrate en formspree.io
  // 2. Crea un formulario y copia el endpoint
  // 3. Reemplaza la URL de abajo
  submitUrl: 'https://formspree.io/f/TU_ID_AQUI',

  // Mensajes de feedback al usuario
  messages: {
    success: '✅ Mensaje enviado correctamente. Nos contactaremos en menos de 24 horas.',
    error:   '❌ Hubo un problema al enviar el mensaje. Por favor intente nuevamente o contáctenos por WhatsApp.',
    sending: 'Enviando...',
  },
};


/* ── FUNCIÓN PRINCIPAL ──────────────────────────────────────── */
function initContactForm(form) {
  const submitBtn    = document.getElementById('submitBtn');
  const submitText   = document.getElementById('submitText');
  const submitLoader = document.getElementById('submitLoader');
  const feedback     = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar recarga de página

    // ── 1. Verificar honeypot antispam ───────────────────
    const honeypot = form.querySelector('[name="website"]');
    if (honeypot && honeypot.value) {
      // Es un bot: simular éxito sin hacer nada
      console.log('Spam detectado, ignorando.');
      return;
    }

    // ── 2. Validar campos ────────────────────────────────
    const isValid = validateForm(form);
    if (!isValid) return;

    // ── 3. Estado de envío ───────────────────────────────
    setSubmitting(true, submitBtn, submitText, submitLoader);
    hideFeedback(feedback);

    // ── 4. Preparar datos del formulario ─────────────────
    const formData = new FormData(form);

    try {
      // ── 5. Enviar al backend ──────────────────────────
      const response = await fetch(FORM_CONFIG.submitUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Éxito
        showFeedback(feedback, FORM_CONFIG.messages.success, 'success');
        form.reset();
        clearAllErrors(form);
        // Scroll hasta el mensaje de éxito
        feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Error del servidor
        const data = await response.json();
        const errorMsg = data.errors
          ? data.errors.map(err => err.message).join(', ')
          : FORM_CONFIG.messages.error;
        showFeedback(feedback, errorMsg, 'error');
      }

    } catch (err) {
      // Error de red
      console.error('Error al enviar formulario:', err);
      showFeedback(feedback, FORM_CONFIG.messages.error, 'error');
    } finally {
      // Restaurar botón pase lo que pase
      setSubmitting(false, submitBtn, submitText, submitLoader);
    }
  });

  // Limpiar errores al comenzar a escribir
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => clearError(input));
    input.addEventListener('change', () => clearError(input));
  });
}


/* ── VALIDACIÓN ─────────────────────────────────────────────
   Reglas de validación para cada campo del formulario.
   ─────────────────────────────────────────────────────────── */
const VALIDATION_RULES = {
  nombre: {
    required: true,
    minLength: 2,
    pattern: null,
    messages: {
      required:  'El nombre es obligatorio.',
      minLength: 'El nombre debe tener al menos 2 caracteres.',
    },
  },
  email: {
    required: true,
    minLength: null,
    // Regex básico de email (RFC 5322 simplificado)
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'El correo electrónico es obligatorio.',
      pattern:  'Ingrese un correo electrónico válido.',
    },
  },
  servicio: {
    required: true,
    minLength: null,
    pattern: null,
    messages: {
      required: 'Seleccione el tipo de proyecto.',
    },
  },
  mensaje: {
    required: true,
    minLength: 20,
    pattern: null,
    messages: {
      required:  'El mensaje es obligatorio.',
      minLength: 'Describa brevemente el proyecto (mínimo 20 caracteres).',
    },
  },
};


/**
 * Valida todos los campos del formulario.
 * @param {HTMLFormElement} form
 * @returns {boolean} true si todo es válido
 */
function validateForm(form) {
  let isValid = true;

  Object.entries(VALIDATION_RULES).forEach(([fieldName, rules]) => {
    const input = form.querySelector(`[name="${fieldName}"]`);
    if (!input) return;

    const value = input.value.trim();
    let errorMessage = '';

    // Verificar campo requerido
    if (rules.required && !value) {
      errorMessage = rules.messages.required;
    }
    // Verificar longitud mínima
    else if (rules.minLength && value.length < rules.minLength) {
      errorMessage = rules.messages.minLength;
    }
    // Verificar patrón (regex)
    else if (rules.pattern && !rules.pattern.test(value)) {
      errorMessage = rules.messages.pattern;
    }

    if (errorMessage) {
      showError(input, errorMessage, form);
      isValid = false;
    } else {
      clearError(input);
    }
  });

  // Hacer foco en el primer campo con error
  if (!isValid) {
    const firstError = form.querySelector('.form-input.error');
    if (firstError) {
      firstError.focus();
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return isValid;
}


/* ── HELPERS DE UI ──────────────────────────────────────────── */

/**
 * Muestra un error en un campo del formulario.
 */
function showError(input, message, form) {
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');

  const errorId = `${input.id}Error`;
  const errorEl = form ? form.querySelector(`#${errorId}`) : null;
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * Limpia el error de un campo.
 */
function clearError(input) {
  input.classList.remove('error');
  input.removeAttribute('aria-invalid');

  // Buscar el elemento de error asociado
  const errorId = `${input.id}Error`;
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
}

/**
 * Limpia todos los errores del formulario.
 */
function clearAllErrors(form) {
  form.querySelectorAll('.form-input').forEach(input => clearError(input));
}

/**
 * Cambia el estado del botón de envío.
 */
function setSubmitting(isSubmitting, btn, textEl, loaderEl) {
  if (!btn || !textEl || !loaderEl) return;

  btn.disabled = isSubmitting;

  if (isSubmitting) {
    btn.classList.add('btn--sending');
    textEl.style.display = 'none';
    loaderEl.style.display = 'inline-flex';
  } else {
    btn.classList.remove('btn--sending');
    textEl.style.display = 'inline';
    loaderEl.style.display = 'none';
  }
}

/**
 * Muestra el mensaje de feedback del formulario.
 */
function showFeedback(el, message, type) {
  if (!el) return;
  el.textContent = message;
  el.className = `form-feedback ${type}`;
}

/**
 * Oculta el mensaje de feedback.
 */
function hideFeedback(el) {
  if (!el) return;
  el.className = 'form-feedback';
  el.textContent = '';
}


/* ============================================================
   INSTRUCCIONES PARA ACTIVAR EL FORMULARIO EN PRODUCCIÓN
   ============================================================

   OPCIÓN 1: FORMSPREE (recomendado, gratis)
   ─────────────────────────────────────────
   1. Ve a https://formspree.io
   2. Crea una cuenta gratuita
   3. Crea un nuevo formulario
   4. Copia el endpoint que te dan (ej: https://formspree.io/f/abc123)
   5. Reemplaza FORM_CONFIG.submitUrl arriba con ese endpoint
   6. ¡Listo! Recibirás emails al correo que registraste

   OPCIÓN 2: WEB3FORMS (100% gratis, sin límite)
   ─────────────────────────────────────────────
   1. Ve a https://web3forms.com
   2. Ingresa tu correo y recibirás un Access Key
   3. Agrega en el form HTML: <input type="hidden" name="access_key" value="TU_KEY">
   4. Cambia submitUrl a: https://api.web3forms.com/submit

   OPCIÓN 3: EMAILJS (envío directo sin backend)
   ─────────────────────────────────────────────
   1. Ve a https://www.emailjs.com
   2. Configura un servicio de email
   3. Instala: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   4. Usa emailjs.sendForm() en lugar del fetch
   
   ============================================================ */
