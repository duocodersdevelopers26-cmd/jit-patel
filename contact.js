/* ================================================
   JITPATEL WEB DEV — CONTACT JAVASCRIPT
   Handles: Form Validation & Submission to Backend
   ================================================ */

'use strict';

const form = document.getElementById('inquiryForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const formError = document.getElementById('formError');

/* ---- VALIDATION ---- */
function validateField(id, errorId, condition, message) {
  const el = document.getElementById(id);
  const err = document.getElementById(errorId);
  if (!el) return true;
  if (condition(el.value.trim())) {
    el.style.borderColor = '';
    if (err) err.textContent = '';
    return true;
  } else {
    el.style.borderColor = '#ff2d78';
    if (err) err.textContent = message;
    return false;
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm() {
  const nameOk = validateField('name', 'nameError', v => v.length >= 2, 'Please enter your full name.');
  const emailOk = validateField('email', 'emailError', v => isValidEmail(v), 'Please enter a valid email address.');
  const msgOk = validateField('message', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');
  return nameOk && emailOk && msgOk;
}

// Real-time validation
['name', 'email', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      if (id === 'name') validateField('name', 'nameError', v => v.length >= 2, 'Please enter your full name.');
      if (id === 'email') validateField('email', 'emailError', v => isValidEmail(v), 'Please enter a valid email address.');
      if (id === 'message') validateField('message', 'messageError', v => v.length >= 10, 'Message must be at least 10 characters.');
    });
  }
});

/* ---- FORM SUBMISSION ---- */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // UI: loading state
    if (submitBtn) {
      submitBtn.querySelector('.btn-text').style.display = 'none';
      submitBtn.querySelector('.btn-loader').style.display = 'inline';
      submitBtn.querySelector('.btn-arrow').style.display = 'none';
      submitBtn.disabled = true;
    }
    if (formError) formError.style.display = 'none';

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone')?.value.trim() || '',
      service: document.getElementById('service')?.value || '',
      message: document.getElementById('message').value.trim(),
    };

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        form.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      // Show error message with fallback info
      if (formError) {
        formError.innerHTML = `
          <p>Could not send message automatically. Please call directly:<br>
          <a href="tel:9687991925" style="color: #00d4ff; font-weight: 700;">📞 +91 9687991925</a><br>
          <small style="color: #8899bb; font-size: 0.8rem;">Or ensure the backend server is running.</small></p>
        `;
        formError.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        submitBtn.querySelector('.btn-arrow').style.display = 'inline';
        submitBtn.disabled = false;
      }
    }
  });
}
