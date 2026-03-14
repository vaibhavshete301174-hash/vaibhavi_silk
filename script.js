/* ═══════════════════════════════════════
   PRIYA SAREES — Main JavaScript
   Orders: WhatsApp (text) + Email (screenshot)
═══════════════════════════════════════ */

// ── CONFIG — Edit these 4 values before uploading ───────────
const CONFIG = {
  whatsappNumber: '918830354532',      // Your WhatsApp with country code (91 for India)
  upiId:          'vaibhavishete2788k@kotak',   // Your UPI ID
  shopName:       'Vaibhavi Silk',      // Your shop name
  ownerEmail:     'vaibhavishete@gmail.com', // ← CHANGE THIS to your email address
};
// ─────────────────────────────────────────────────────────────
// HOW EMAIL WORKS (FormSubmit.co — free, no signup):
//   First time an order is submitted, FormSubmit will send you
//   a confirmation email. Click the link in that email ONCE.
//   After that, every order with screenshot arrives in your inbox.
// ─────────────────────────────────────────────────────────────

let selectedSaree = null;


// ═══ 1. FILTER BUTTONS ═══════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});


// ═══ 2. SEND ORDER (used by both modal and main form) ════════
async function sendOrder({ name, phone, city, orderType, sareeDetails, notes,
                           paymentFile, sareeImageFile,
                           sareeeName, sareePrice, sareeType }) {

  // ── Email with screenshot via FormSubmit.co ───────────────
  const formData = new FormData();
  formData.append('_subject',  `New Order from ${name} — ${CONFIG.shopName}`);
  formData.append('_template', 'table');
  formData.append('_captcha',  'false');
  formData.append('Customer Name',  name);
  formData.append('Phone Number',   phone);
  if (city)         formData.append('City',           city);
  formData.append('Order Type',     orderType);
  if (sareeeName)   formData.append('Saree Name',     sareeeName);
  if (sareePrice)   formData.append('Saree Price',    sareePrice);
  if (sareeType)    formData.append('Saree Type',     sareeType);
  if (sareeDetails) formData.append('Saree Details',  sareeDetails);
  if (notes)        formData.append('Special Notes',  notes);

  if (paymentFile) {
    formData.append('payment_screenshot', paymentFile, paymentFile.name || 'payment.jpg');
    formData.append('Payment Status', 'Screenshot attached in this email');
  } else {
    formData.append('Payment Status', 'WARNING — no screenshot uploaded by customer');
  }

  if (sareeImageFile) {
    formData.append('saree_image', sareeImageFile, sareeImageFile.name || 'saree_reference.jpg');
  }

  let emailSent = false;
  try {
    const res = await fetch(`https://formsubmit.co/${CONFIG.ownerEmail}`, {
      method: 'POST',
      body: formData,
    });
    emailSent = res.ok;
  } catch (err) {
    console.warn('Email failed:', err);
  }

  // ── WhatsApp text message ─────────────────────────────────
  const lines = [
    `*New Order — ${CONFIG.shopName}*`,
    ``,
    sareeeName   ? `*Saree:* ${sareeeName}`      : '',
    sareePrice   ? `*Price:* ${sareePrice}`      : '',
    sareeType    ? `*Type:* ${sareeType}`         : '',
    sareeDetails ? `*Details:* ${sareeDetails}`  : '',
    ``,
    `*Customer:* ${name}`,
    `*Phone:* ${phone}`,
    city         ? `*City:* ${city}`             : '',
    `*Order Type:* ${orderType}`,
    notes        ? `*Notes:* ${notes}`           : '',
    ``,
    paymentFile
      ? `✅ Payment screenshot sent to your email`
      : `⚠️ No payment screenshot — please confirm with customer`,
    emailSent
      ? `📧 Full order details emailed to you`
      : `📧 Email may have failed — check spam folder`,
  ].filter(Boolean).join('\n');

  return {
    waUrl: `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(lines)}`,
    emailSent,
  };
}


// ═══ 3. MODAL — "Order this saree" card button ═══════════════
function openOrderFromCard(name, price, imgSrc, type) {
  selectedSaree = { name, price, imgSrc, type };

  document.getElementById('modal-saree-name').textContent  = name;
  document.getElementById('modal-saree-price').textContent = price;
  document.getElementById('modal-saree-type').textContent  = type;

  const img = document.getElementById('modal-img');
  img.src = imgSrc;
  img.style.display = 'block';

  document.getElementById('modal-name').value       = '';
  document.getElementById('modal-phone').value      = '';
  document.getElementById('modal-qty').value        = '';
  document.getElementById('modal-order-type').value = 'retail';
  document.getElementById('modal-success').style.display    = 'none';
  document.getElementById('modal-submit-btn').style.display = 'block';
  document.getElementById('modal-submit-btn').disabled      = false;
  document.getElementById('modal-submit-text').textContent  = 'Submit Order';
  removeModalPayment();

  document.getElementById('order-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('order-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('order-modal')) closeModal();
}


// ═══ 4. MODAL SUBMIT ══════════════════════════════════════════
async function submitModalOrder() {
  const name      = document.getElementById('modal-name').value.trim();
  const phone     = document.getElementById('modal-phone').value.trim();
  const qty       = document.getElementById('modal-qty').value.trim();
  const orderType = document.getElementById('modal-order-type').value;

  if (!name)  { alert('Please enter your name.'); return; }
  if (!phone || phone.length !== 10) { alert('Please enter a valid 10-digit phone number.'); return; }

  const paymentFile = document.getElementById('modal-payment').files[0];
  if (!paymentFile) {
    if (!confirm('You have not uploaded a payment screenshot. Submit anyway?')) return;
  }

  const btn = document.getElementById('modal-submit-btn');
  btn.disabled = true;
  document.getElementById('modal-submit-text').textContent = 'Sending…';

  const { waUrl, emailSent } = await sendOrder({
    name, phone, orderType,
    sareeDetails: qty,
    sareeeName:   selectedSaree.name,
    sareePrice:   selectedSaree.price,
    sareeType:    selectedSaree.type,
    paymentFile,
  });

  btn.style.display = 'none';
  const successEl = document.getElementById('modal-success');
  successEl.style.display = 'block';
  successEl.querySelector('p').textContent = emailSent
    ? '✓ Order received! Screenshot emailed to shop. We will call to confirm.'
    : '✓ Order received! Please also send payment screenshot on WhatsApp.';

  setTimeout(() => { window.open(waUrl, '_blank'); }, 500);
}


// ═══ 5. MAIN FORM SUBMIT ══════════════════════════════════════
document.getElementById('main-order-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const name         = document.getElementById('cust-name').value.trim();
  const phone        = document.getElementById('cust-phone').value.trim();
  const city         = document.getElementById('cust-city').value.trim();
  const orderType    = document.getElementById('order-type').value;
  const sareeDetails = document.getElementById('saree-details').value.trim();
  const notes        = document.getElementById('notes').value.trim();

  let valid = true;
  if (!name)                         { markInvalid('cust-name',     'Please enter your name');        valid = false; }
  if (!phone || phone.length !== 10) { markInvalid('cust-phone',    'Enter 10-digit phone number');   valid = false; }
  if (!orderType)                    { markInvalid('order-type',    'Select order type');             valid = false; }
  if (!sareeDetails)                 { markInvalid('saree-details', 'Tell us which saree you want');  valid = false; }
  if (!valid) return;

  const paymentFile    = document.getElementById('payment-input').files[0];
  const sareeImageFile = document.getElementById('saree-img-input').files[0];

  if (!paymentFile) {
    if (!confirm('You have not uploaded a payment screenshot. Continue anyway?')) return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  document.getElementById('submit-text').textContent = 'Sending order…';

  const { waUrl, emailSent } = await sendOrder({
    name, phone, city, orderType, sareeDetails, notes,
    paymentFile, sareeImageFile,
    sareeeName: selectedSaree ? selectedSaree.name  : null,
    sareePrice: selectedSaree ? selectedSaree.price : null,
    sareeType:  selectedSaree ? selectedSaree.type  : null,
  });

  this.style.display = 'none';
  const successEl = document.getElementById('success-msg');
  successEl.style.display = 'block';
  successEl.querySelector('p').textContent = emailSent
    ? 'Thank you! Your order and payment screenshot have been received. We will contact you shortly.'
    : 'Thank you! Order received. Please also send your payment screenshot on WhatsApp to confirm.';

  setTimeout(() => { window.open(waUrl, '_blank'); }, 600);
});


// ═══ 6. IMAGE PREVIEWS ═══════════════════════════════════════
function previewSareeImage(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('saree-img-thumb').src = e.target.result;
    document.getElementById('saree-img-preview').style.display = 'flex';
    document.getElementById('saree-upload-zone').style.display = 'none';
  };
  reader.readAsDataURL(file);
}
function removeSareeImage() {
  document.getElementById('saree-img-input').value = '';
  document.getElementById('saree-img-preview').style.display = 'none';
  document.getElementById('saree-upload-zone').style.display = 'block';
}
function previewPayment(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('payment-thumb').src = e.target.result;
    document.getElementById('payment-preview').style.display = 'flex';
    document.getElementById('payment-upload-zone').style.display = 'none';
  };
  reader.readAsDataURL(file);
}
function removePayment() {
  document.getElementById('payment-input').value = '';
  document.getElementById('payment-preview').style.display = 'none';
  document.getElementById('payment-upload-zone').style.display = 'block';
}
function previewModalPayment(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('modal-payment-thumb').src = e.target.result;
    document.getElementById('modal-payment-preview').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}
function removeModalPayment() {
  document.getElementById('modal-payment').value = '';
  document.getElementById('modal-payment-preview').style.display = 'none';
}


// ═══ 7. HELPERS ═══════════════════════════════════════════════
function markInvalid(id, msg) {
  const el = document.getElementById(id);
  el.classList.add('invalid');
  const prev = el.parentNode.querySelector('.error-msg');
  if (prev) prev.remove();
  const err = document.createElement('span');
  err.className = 'error-msg';
  err.textContent = msg;
  el.parentNode.appendChild(err);
  el.addEventListener('input', () => {
    el.classList.remove('invalid');
    const e = el.parentNode.querySelector('.error-msg');
    if (e) e.remove();
  }, { once: true });
}

function clearSelection() {
  selectedSaree = null;
  document.getElementById('selected-banner').style.display = 'none';
  document.getElementById('image-upload-block').style.display = 'block';
}

function resetForm() {
  document.getElementById('main-order-form').reset();
  document.getElementById('main-order-form').style.display = 'block';
  document.getElementById('success-msg').style.display = 'none';
  document.getElementById('submit-btn').disabled = false;
  document.getElementById('submit-text').textContent = 'Submit Order';
  clearSelection();
  removePayment();
  removeSareeImage();
}

function copyUPI() {
  navigator.clipboard.writeText(CONFIG.upiId).then(() => {
    document.querySelectorAll('.copy-btn, .copy-btn-sm').forEach(btn => {
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = prev; }, 2000);
    });
  });
}


// ═══ 8. SCROLL + DRAG & DROP ══════════════════════════════════
window.addEventListener('scroll', () => {
  document.getElementById('site-header').style.boxShadow =
    window.scrollY > 40 ? '0 2px 20px rgba(74,17,87,0.25)' : 'none';
});

['saree-upload-zone', 'payment-upload-zone'].forEach(zoneId => {
  const zone = document.getElementById(zoneId);
  if (!zone) return;
  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const inputId = zoneId === 'saree-upload-zone' ? 'saree-img-input' : 'payment-input';
    const dt = new DataTransfer();
    dt.items.add(file);
    document.getElementById(inputId).files = dt.files;
    if (inputId === 'saree-img-input') previewSareeImage(document.getElementById(inputId));
    else previewPayment(document.getElementById(inputId));
  });
});

// Init
document.getElementById('upi-display').textContent = CONFIG.upiId;
document.getElementById('modal-upi').textContent   = CONFIG.upiId;
