// Right Printers | رايت للطباعة - Digital Printing Estimator JavaScript Logic

// --- DEFAULT SYSTEM PRICING DATA ---
const DEFAULT_PRICING = {
  // Section 5: Standard Paper GSM rates (per sheet size in SR)
  paperGsmRates: {
    '350': { '100x70': 1.52, '90x64': 1.26, '50x70': 1.10, '70x33': 6.00, '50x33': 5.00, 'A3': 4.50, 'A4': 2.50, 'backSide': 2.50 },
    '300': { '100x70': 1.26, '90x64': 1.05, '50x70': 0.95, '70x33': 5.50, '50x33': 4.50, 'A3': 4.00, 'A4': 2.00, 'backSide': 2.00 },
    '250': { '100x70': 1.05, '90x64': 0.90, '50x70': 0.80, '70x33': 5.00, '50x33': 4.50, 'A3': 3.50, 'A4': 2.50, 'backSide': 2.00 },
    '150': { '100x70': 0.85, '90x64': 0.75, '50x70': 0.65, '70x33': 4.00, '50x33': 3.50, 'A3': 3.00, 'A4': 2.00, 'backSide': 1.50 },
    '100': { '100x70': 0.70, '90x64': 0.60, '50x70': 0.50, '70x33': 3.00, '50x33': 2.50, 'A3': 2.50, 'A4': 2.00, 'backSide': 1.50 }
  },


  // Section 6: Sticker rates per sheet size in SR
  // Paper Sticker, PVC White, PVC Transparent. Colors: CMYK vs CMYK+White (5 Color) vs Clear Color
  stickerRates: {
    'paper': {
      'cymk': { '100x70': 24.00, '90x64': 20.00, '50x70': 16.00, '70x33': 12.00, '50x33': 9.00, 'A3': 6.00, 'A4': 4.00 },
      'cymk_white': { '100x70': 32.00, '90x64': 26.00, '50x70': 20.00, '70x33': 16.00, '50x33': 12.00, 'A3': 8.00, 'A4': 5.00 },
      'clear_color': { '100x70': 28.00, '90x64': 22.00, '50x70': 18.00, '70x33': 14.00, '50x33': 10.50, 'A3': 7.00, 'A4': 4.50 }
    },
    'pvc_white': {
      'cymk': { '100x70': 48.00, '90x64': 40.00, '50x70': 32.00, '70x33': 24.00, '50x33': 18.00, 'A3': 12.00, 'A4': 8.00 },
      'cymk_white': { '100x70': 56.00, '90x64': 46.00, '50x70': 36.00, '70x33': 28.00, '50x33': 21.00, 'A3': 14.00, 'A4': 10.00 },
      'clear_color': { '100x70': 52.00, '90x64': 42.00, '50x70': 34.00, '70x33': 26.00, '50x33': 19.50, 'A3': 13.00, 'A4': 9.00 }
    },
    'pvc_transparent': {
      'cymk': { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 },
      'cymk_white': { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 },
      'clear_color': { '100x70': 60.00, '90x64': 50.00, '50x70': 40.00, '70x33': 30.00, '50x33': 22.50, 'A3': 15.00, 'A4': 10.00 }
    }
  },

  // Section 7: Lamination cost per sheet size in SR
  laminationRates: {
    '100x70': 1.20,
    '90x64': 1.00,
    '50x70': 0.80,
    '70x33': 0.40,
    '50x33': 0.25,
    'A3': 0.20,
    'A4': 0.15
  },

  // Section 8: Plotter Cut cost per sheet size in SR
  plotterRates: {
    '100x70': 3.00,
    '90x64': 2.50,
    '50x70': 2.50,
    '70x33': 2.00,
    '50x33': 1.50,
    'A3': 1.00,
    'A4': 0.50
  },




  // Section 8 & 9: Fixed services cost in SR
  fixedRates: {
    folding: 0.25,   // per piece
    pasting: 0.25,   // per piece
    rope: 0.12,      // per piece
    packing: 0.50,   // per 100 pieces packet
    businessCardPrint: 0.012, // per piece
    businessCardA3SheetPrice: 0.75, // A3 sheet price specifically for business card jobs
    businessCardPolarCutPrice: 0.50, // Polar Cutting cost per sheet for business cards
    dieCylinder: 0.30, // Cylinder Die Cutting cost per sheet
    dieManual: 0.15    // Manual Die Cutting cost per sheet
  },

  // T-Shirt & Cup rates in SR
  tshirtLaserRates: {
    'A3': 50.00,
    'A4': 30.00
  },
  tshirtSizeRates: {
    'S': 20.00,
    'M': 25.00,
    'L': 30.00,
    'XL': 35.00,
    'XXL': 40.00,
    'XXXL': 45.00
  },
  tshirtClothSizeRates: {
    'cotton': { 'S': 20.00, 'M': 25.00, 'L': 30.00, 'XL': 35.00, 'XXL': 40.00, 'XXXL': 45.00 },
    'polyester': { 'S': 15.00, 'M': 18.00, 'L': 22.00, 'XL': 26.00, 'XXL': 30.00, 'XXXL': 35.00 },
    'linen': { 'S': 25.00, 'M': 30.00, 'L': 35.00, 'XL': 40.00, 'XXL': 45.00, 'XXXL': 50.00 },
    'flannel': { 'S': 22.00, 'M': 27.00, 'L': 32.00, 'XL': 37.00, 'XXL': 42.00, 'XXXL': 47.00 },
    'silk': { 'S': 35.00, 'M': 42.00, 'L': 50.00, 'XL': 58.00, 'XXL': 65.00, 'XXXL': 75.00 },
    'blends': { 'S': 18.00, 'M': 22.00, 'L': 26.00, 'XL': 30.00, 'XXL': 35.00, 'XXXL': 40.00 }
  },
  tshirtTransferRates: {
    'A3': 25.00,
    'A4': 20.00,
    'A5': 15.00,
    'A6': 10.00
  },
  cupBaseRate: 15.00,
  cupTransferRates: {
    'FULL_PART': 15.00,
    'SMALL': 18.00
  },

  // Section 6: Discount Tiers (based on printed sheets)
  discountTiers: [
    { min: 0, max: 100, discount: 0 },
    { min: 101, max: Infinity, discount: 5 }
  ],

  // Quantity Multipliers & Volume Discount Tiers (based on 100 Pcs base rate)
  quantityTiers: [
    { min: 1, max: 3, multiplier: 2.5 },
    { min: 4, max: 10, multiplier: 2.0 },
    { min: 11, max: 25, multiplier: 1.8 },
    { min: 26, max: 50, multiplier: 1.5 },
    { min: 51, max: 75, multiplier: 1.3 },
    { min: 76, max: 99, multiplier: 1.1 },
    { min: 100, max: 249, multiplier: 1.0 },
    { min: 250, max: 500, multiplier: 0.95 },
    { min: 501, max: 1000, multiplier: 0.90 },
    { min: 1001, max: 5000, multiplier: 0.85 },
    { min: 5001, max: Infinity, multiplier: 0.80 }
  ]
};


// Available sizes definitions (with default landscape values)
const DEFAULT_PAPER_SIZES = [
  { id: 'size_100_70', name: '100x70 cm', w: 100, h: 70 },
  { id: 'size_90_64', name: '90x64 cm', w: 90, h: 64 },
  { id: 'size_50_70', name: '50x70 cm', w: 70, h: 50 },
  { id: 'size_70_33', name: '70x33 cm', w: 70, h: 33 },
  { id: 'size_50_33', name: '50x33 cm', w: 50, h: 33 },
  { id: 'size_a3', name: 'A3 Size', w: 42, h: 29.7, alias: 'A3' },
  { id: 'size_a4', name: 'A4 Size', w: 29.7, h: 21, alias: 'A4' }
];


// Active State
let currentPricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
let currentJobType = 'paper'; // 'paper' or 'sticker'
let selectedPaperSizeId = 'size_70_33';
let selectedGsm = '350';
let isPortraitOrientation = false;
let userForcedOrientation = null; // 'horizontal' or 'vertical' (if null, auto-select best)

// OTP Verification state variables
let pendingUserRole = null;
let currentOtpCode = null;
let otpTimer = null;

// --- SECURITY CREDENTIALS HELPERS ---
function getSalesPassword() {
  return localStorage.getItem('sales_password') || '2000';
}

function getAdminPassword() {
  return '1969';
}

function checkAppAuthentication() {
  return sessionStorage.getItem('isAppUnlocked') === 'true';
}

function checkAdminAuthentication() {
  return sessionStorage.getItem('isAdminAuthenticated') === 'true';
}

// --- OTP AUTHENTICATION HELPERS ---
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendSmsCode(code) {
  const isEnabled = localStorage.getItem('sms_otp_enabled') !== 'false';
  if (!isEnabled) return true;

  const phone = '+966539044608';
  const message = `Right Printers Estimator Verification Code: ${code}`;
  const provider = localStorage.getItem('sms_otp_provider') || 'simulation';

  console.log(`[SMS Gateway] Sending OTP ${code} to ${phone} using provider: ${provider}`);

  // Clear previous errors
  const otpErrorMsg = document.getElementById('otpErrorMsg');
  if (otpErrorMsg) otpErrorMsg.innerText = '';

  if (provider === 'simulation') {
    const toast = document.getElementById('smsNotificationToast');
    const toastCode = document.getElementById('smsToastCode');
    if (toast && toastCode) {
      toastCode.innerText = code;
      toast.classList.remove('hidden');
      // Hide automatically after 8 seconds
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 8000);
    }
    return true;
  }

  try {
    if (provider === 'twilio') {
      const sid = localStorage.getItem('twilio_sid') || '';
      const token = localStorage.getItem('twilio_auth_token') || '';
      const from = localStorage.getItem('twilio_from') || '';

      if (!sid || !token || !from) {
        throw new Error('Twilio config is incomplete.');
      }

      const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
      const auth = btoa(`${sid}:${token}`);
      const body = new URLSearchParams();
      body.append('To', phone);
      body.append('From', from);
      body.append('Body', message);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Twilio response error: ${response.status} - ${errText}`);
      }
    } else if (provider === 'unifonic') {
      const appSid = localStorage.getItem('unifonic_app_sid') || '';
      const sender = localStorage.getItem('unifonic_sender') || '';

      if (!appSid) {
        throw new Error('Unifonic config is incomplete. AppSid is required.');
      }

      const url = 'https://api.unifonic.com/rest/SMS/Messages/Send';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          AppSid: appSid,
          Recipient: phone.replace('+', ''),
          Body: message,
          SenderID: sender || undefined
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Unifonic response error: ${response.status} - ${errText}`);
      }
    } else if (provider === 'custom') {
      const customUrl = localStorage.getItem('custom_sms_url') || '';
      const customMethod = localStorage.getItem('custom_sms_method') || 'GET';
      const customHeadersStr = localStorage.getItem('custom_sms_headers') || '{}';
      const customPayloadStr = localStorage.getItem('custom_sms_payload') || '';

      if (!customUrl) {
        throw new Error('Custom API endpoint URL is required.');
      }

      let headers = {};
      try {
        headers = JSON.parse(customHeadersStr);
      } catch (e) {
        console.error('Failed to parse custom headers JSON', e);
      }

      const parsedMessage = encodeURIComponent(message);
      const parsedPhone = encodeURIComponent(phone);

      if (customMethod === 'GET') {
        let finalUrl = customUrl
          .replace('{phone}', parsedPhone)
          .replace('{message}', parsedMessage);

        const response = await fetch(finalUrl, {
          method: 'GET',
          headers: headers
        });

        if (!response.ok) {
          throw new Error(`Custom GET gateway returned status ${response.status}`);
        }
      } else {
        let finalHeaders = {
          'Content-Type': 'application/json',
          ...headers
        };

        let bodyData = customPayloadStr
          .replace(/{phone}/g, phone)
          .replace(/{message}/g, message);

        const response = await fetch(customUrl, {
          method: 'POST',
          headers: finalHeaders,
          body: bodyData
        });

        if (!response.ok) {
          throw new Error(`Custom POST gateway returned status ${response.status}`);
        }
      }
    }
    return true;
  } catch (error) {
    console.error('[SMS Gateway Error]', error);
    if (otpErrorMsg) {
      otpErrorMsg.innerText = `Error sending SMS: ${error.message}. Please check logs or config. Code printed in console/toast for fallback.`;
    }
    // Show toast as developer fallback even on real API failures so users don't get locked out due to configuration errors
    const toast = document.getElementById('smsNotificationToast');
    const toastCode = document.getElementById('smsToastCode');
    if (toast && toastCode) {
      toastCode.innerText = `${code} (Fallback)`;
      toast.classList.remove('hidden');
    }
    return false;
  }
}

async function sendEmailCode(email, code) {
  const isEnabled = localStorage.getItem('email_otp_enabled') !== 'false';
  if (!isEnabled) return true;

  const targetEmail = email || localStorage.getItem('email_otp_recipient') || 'sypsalim@gmail.com';
  const message = `Right Printers Estimator Verification Code: ${code}`;
  const provider = localStorage.getItem('email_otp_provider') || 'simulation';

  console.log(`[Email Gateway] Sending OTP ${code} to ${targetEmail} using provider: ${provider}`);

  // Clear previous errors
  const otpErrorMsg = document.getElementById('otpErrorMsg');
  if (otpErrorMsg) otpErrorMsg.innerText = '';

  if (provider === 'simulation') {
    const toast = document.getElementById('smsNotificationToast');
    const toastCode = document.getElementById('smsToastCode');
    if (toast && toastCode) {
      toastCode.innerText = code;
      const bodyText = toast.querySelector('.sms-toast-body');
      if (bodyText) {
        bodyText.innerHTML = `Message to <strong>${targetEmail}</strong> & <strong>+966539044608</strong>: Verification code is <span class="sms-toast-code">${code}</span>`;
      }
      toast.classList.remove('hidden');
    }
    return true;
  }

  try {
    if (provider === 'web3forms') {
      const accessKey = localStorage.getItem('web3forms_access_key') || '';
      if (!accessKey) {
        throw new Error('Web3Forms Access Key is missing.');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: 'Right Printers Estimator',
          email: 'no-reply@rightprinters.com',
          subject: 'Right Printers Estimator Login Verification Code',
          message: `Dear User,\n\nYour one-time login verification code is: ${code}\n\nThis code will expire in 5 minutes.\n\nRegards,\nRight Printers Team`,
          to_email: targetEmail
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Web3Forms error: ${response.status} - ${errText}`);
      }
    } else if (provider === 'emailjs') {
      const serviceId = localStorage.getItem('emailjs_service_id') || '';
      const templateId = localStorage.getItem('emailjs_template_id') || '';
      const publicKey = localStorage.getItem('emailjs_public_key') || '';

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is incomplete.');
      }

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            to_email: targetEmail,
            otp_code: code,
            message: message
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`EmailJS error: ${response.status} - ${errText}`);
      }
    } else if (provider === 'custom') {
      const customUrl = localStorage.getItem('custom_email_url') || '';
      const customHeadersStr = localStorage.getItem('custom_email_headers') || '{}';
      const customPayloadStr = localStorage.getItem('custom_email_payload') || '';

      if (!customUrl) {
        throw new Error('Custom Email API endpoint URL is required.');
      }

      let headers = {};
      try {
        headers = JSON.parse(customHeadersStr);
      } catch (e) {
        console.error('Failed to parse custom headers JSON', e);
      }

      let finalHeaders = {
        'Content-Type': 'application/json',
        ...headers
      };

      let bodyData = customPayloadStr
        .replace(/{email}/g, targetEmail)
        .replace(/{message}/g, message);

      const response = await fetch(customUrl, {
        method: 'POST',
        headers: finalHeaders,
        body: bodyData
      });

      if (!response.ok) {
        throw new Error(`Custom Email API returned status ${response.status}`);
      }
    }
    console.log('[Email Gateway] Verification email sent successfully.');
    return true;
  } catch (error) {
    console.error('[Email Gateway Error]', error);
    if (otpErrorMsg) {
      otpErrorMsg.innerText = `Error sending email: ${error.message}. Simulated fallback displayed.`;
    }
    const toast = document.getElementById('smsNotificationToast');
    const toastCode = document.getElementById('smsToastCode');
    if (toast && toastCode) {
      toastCode.innerText = `${code} (Fallback)`;
      toast.classList.remove('hidden');
    }
    return false;
  }
}

function updateEmailFieldsVisibility() {
  const providerSelect = document.getElementById('emailOtpProvider');
  if (!providerSelect) return;
  
  const provider = providerSelect.value;
  const configFields = document.getElementById('emailConfigFields');
  if (!configFields) return;
  
  document.querySelectorAll('.email-fields-group').forEach(el => el.classList.add('hidden'));

  if (provider === 'simulation') {
    configFields.classList.add('hidden');
  } else {
    configFields.classList.remove('hidden');
    if (provider === 'web3forms') {
      const field = document.getElementById('emailFieldsWeb3forms');
      if (field) field.classList.remove('hidden');
    } else if (provider === 'emailjs') {
      const field = document.getElementById('emailFieldsEmailjs');
      if (field) field.classList.remove('hidden');
    } else if (provider === 'custom') {
      const field = document.getElementById('emailFieldsCustom');
      if (field) field.classList.remove('hidden');
    }
  }
}

function startOtpCountdown() {
  const countdownEl = document.getElementById('otpCountdown');
  const secondsEl = document.getElementById('countdownSeconds');
  const resendBtn = document.getElementById('resendOtpBtn');

  if (otpTimer) clearInterval(otpTimer);

  if (countdownEl && secondsEl && resendBtn) {
    countdownEl.classList.remove('hidden');
    resendBtn.classList.add('hidden');

    let secondsLeft = 60;
    secondsEl.innerText = secondsLeft;

    otpTimer = setInterval(() => {
      secondsLeft--;
      secondsEl.innerText = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(otpTimer);
        countdownEl.classList.add('hidden');
        resendBtn.classList.remove('hidden');
      }
    }, 1000);
  }
}

function initOtpInputs() {
  const digits = document.querySelectorAll('.otp-digit');
  const combined = document.getElementById('lockOtpCombined');

  digits.forEach((input, index) => {
    // Input digits validation and auto-jump
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (!/^[0-9]$/.test(val)) {
        e.target.value = '';
        return;
      }

      if (index < digits.length - 1) {
        digits[index + 1].disabled = false;
        digits[index + 1].focus();
      }

      updateCombinedOtpValue();
    });

    // Handle delete/backspace
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (input.value === '') {
          if (index > 0) {
            digits[index].disabled = true;
            digits[index - 1].focus();
            digits[index - 1].value = '';
          }
        } else {
          input.value = '';
        }
        updateCombinedOtpValue();
      }
    });

    // Handle paste
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').trim();
      if (/^[0-9]{4}$/.test(pasteData)) {
        digits.forEach((digitInput, idx) => {
          digitInput.disabled = false;
          digitInput.value = pasteData[idx];
        });
        digits[digits.length - 1].focus();
        updateCombinedOtpValue();
      }
    });
  });

  function updateCombinedOtpValue() {
    let code = '';
    digits.forEach(input => {
      code += input.value;
    });
    if (combined) combined.value = code;
  }
}

function resetOtpDigits() {
  const digits = document.querySelectorAll('.otp-digit');
  const combined = document.getElementById('lockOtpCombined');
  digits.forEach((input, index) => {
    input.value = '';
    input.disabled = index > 0;
  });
  if (combined) combined.value = '';
}

function transitionToOtp(role) {
  pendingUserRole = role;
  currentOtpCode = generateOtp();

  const titleEl = document.getElementById('lockCardTitle');
  const subtitleEl = document.getElementById('lockCardSubtitle');
  const credForm = document.getElementById('lockScreenForm');
  const otpForm = document.getElementById('lockOtpForm');

  if (titleEl) titleEl.innerText = 'Verification Required / رمز التحقق';
  
  const smsProvider = localStorage.getItem('sms_otp_provider') || 'simulation';
  const emailProvider = localStorage.getItem('email_otp_provider') || 'simulation';
  const targetEmail = localStorage.getItem('email_otp_recipient') || 'sypsalim@gmail.com';
  const isSmsEnabled = localStorage.getItem('sms_otp_enabled') !== 'false';
  const isEmailEnabled = localStorage.getItem('email_otp_enabled') !== 'false';

  if (subtitleEl) {
    let destinations = [];
    if (isSmsEnabled) destinations.push('+966539044608');
    if (isEmailEnabled) destinations.push(targetEmail);
    const destStr = destinations.join(' / ');

    if ((isSmsEnabled && smsProvider === 'simulation') || (isEmailEnabled && emailProvider === 'simulation')) {
      subtitleEl.innerHTML = `Enter the code sent to ${destStr} / أدخل رمز التحقق المرسل<br><span style="color: var(--primary-gold-light); font-weight: 700; font-size: 1.1rem; margin-top: 8px; display: inline-block;">[Simulated Code: ${currentOtpCode}]</span>`;
    } else {
      subtitleEl.innerText = `Enter the code sent to ${destStr} / أدخل رمز التحقق المرسل`;
    }
  }
  
  if (credForm) credForm.classList.add('hidden');
  if (otpForm) otpForm.classList.remove('hidden');

  resetOtpDigits();
  startOtpCountdown();
  
  if (isSmsEnabled) sendSmsCode(currentOtpCode);
  if (isEmailEnabled) sendEmailCode(targetEmail, currentOtpCode);

  setTimeout(() => {
    const firstDigit = document.querySelector('.otp-digit');
    if (firstDigit) firstDigit.focus();
  }, 100);
}

function transitionToCredentials() {
  pendingUserRole = null;
  currentOtpCode = null;
  if (otpTimer) clearInterval(otpTimer);

  const titleEl = document.getElementById('lockCardTitle');
  const subtitleEl = document.getElementById('lockCardSubtitle');
  const credForm = document.getElementById('lockScreenForm');
  const otpForm = document.getElementById('lockOtpForm');

  if (titleEl) titleEl.innerText = 'Estimator Lock Screen / شاشة قفل الحاسبة';
  if (subtitleEl) subtitleEl.innerText = 'Please enter credentials to unlock the Cost Estimator.';
  
  if (credForm) credForm.classList.remove('hidden');
  if (otpForm) otpForm.classList.add('hidden');

  const userField = document.getElementById('lockUsername');
  if (userField) userField.focus();
}

function updateSmsFieldsVisibility() {
  const providerSelect = document.getElementById('smsOtpProvider');
  if (!providerSelect) return;
  
  const provider = providerSelect.value;
  const configFields = document.getElementById('smsConfigFields');
  if (!configFields) return;
  
  document.querySelectorAll('.sms-fields-group').forEach(el => el.classList.add('hidden'));

  if (provider === 'simulation') {
    configFields.classList.add('hidden');
  } else {
    configFields.classList.remove('hidden');
    if (provider === 'twilio') {
      const field = document.getElementById('smsFieldsTwilio');
      if (field) field.classList.remove('hidden');
    } else if (provider === 'unifonic') {
      const field = document.getElementById('smsFieldsUnifonic');
      if (field) field.classList.remove('hidden');
    } else if (provider === 'custom') {
      const field = document.getElementById('smsFieldsCustom');
      if (field) field.classList.remove('hidden');
    }
  }
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  loadPricingFromStorage();
  initUI();
  applyAppLockStatus();
  calculateAndUpdate();
});

function applyAppLockStatus() {
  const lockScreen = document.getElementById('appLockScreen');
  if (lockScreen) {
    if (checkAppAuthentication()) {
      lockScreen.classList.remove('open');
    } else {
      lockScreen.classList.add('open');
      const input = document.getElementById('lockUsername');
      if (input) input.focus();
    }
  }
}

function updateJobTypeTabVisibility() {
  const paperSizesCard = document.getElementById('paperSizesCard');
  const gsmCard = document.getElementById('gsmCard');
  const stickerCard = document.getElementById('stickerCard');
  const tshirtCupCard = document.getElementById('tshirtCupCard');
  const cutSizeCard = document.getElementById('cutSizeCard');
  const finishingCard = document.getElementById('finishingCard');
  
  const paperLayoutPreviewCard = document.getElementById('paperLayoutPreviewCard');
  const paperComparisonCard = document.getElementById('paperComparisonCard');
  const tshirtCupPreviewCard = document.getElementById('tshirtCupPreviewCard');

  const tabPaper = document.getElementById('tabPaper');
  const tabSticker = document.getElementById('tabSticker');
  const tabTshirt = document.getElementById('tabTshirt');

  // Reset active classes
  tabPaper.classList.remove('active');
  tabSticker.classList.remove('active');
  tabTshirt.classList.remove('active');

  if (currentJobType === 'paper') {
    tabPaper.classList.add('active');
    
    if (paperSizesCard) paperSizesCard.classList.remove('hidden');
    if (gsmCard) gsmCard.classList.remove('hidden');
    if (stickerCard) stickerCard.classList.add('hidden');
    if (tshirtCupCard) tshirtCupCard.classList.add('hidden');
    if (cutSizeCard) cutSizeCard.classList.remove('hidden');
    if (finishingCard) finishingCard.classList.remove('hidden');

    if (paperLayoutPreviewCard) paperLayoutPreviewCard.classList.remove('hidden');
    if (paperComparisonCard) paperComparisonCard.classList.remove('hidden');
    if (tshirtCupPreviewCard) tshirtCupPreviewCard.classList.add('hidden');
  } else if (currentJobType === 'sticker') {
    tabSticker.classList.add('active');
    
    if (paperSizesCard) paperSizesCard.classList.remove('hidden');
    if (gsmCard) gsmCard.classList.add('hidden');
    if (stickerCard) stickerCard.classList.remove('hidden');
    if (tshirtCupCard) tshirtCupCard.classList.add('hidden');
    if (cutSizeCard) cutSizeCard.classList.remove('hidden');
    if (finishingCard) finishingCard.classList.remove('hidden');

    if (paperLayoutPreviewCard) paperLayoutPreviewCard.classList.remove('hidden');
    if (paperComparisonCard) paperComparisonCard.classList.remove('hidden');
    if (tshirtCupPreviewCard) tshirtCupPreviewCard.classList.add('hidden');
  } else if (currentJobType === 'tshirt') {
    tabTshirt.classList.add('active');
    
    if (paperSizesCard) paperSizesCard.classList.add('hidden');
    if (gsmCard) gsmCard.classList.add('hidden');
    if (stickerCard) stickerCard.classList.add('hidden');
    if (tshirtCupCard) tshirtCupCard.classList.remove('hidden');
    if (cutSizeCard) cutSizeCard.classList.add('hidden');
    if (finishingCard) finishingCard.classList.add('hidden');

    // Visibility of paperLayoutPreviewCard is managed dynamically in calculateTshirtCupAndUpdate()
    if (paperComparisonCard) paperComparisonCard.classList.add('hidden');
    if (tshirtCupPreviewCard) tshirtCupPreviewCard.classList.remove('hidden');

    // Reset visibility of sub-groups depending on product selection
    const prodVal = document.getElementById('tshirtCupProduct').value;
    const isCup = prodVal === 'cup';
    const tshirtClothGroup = document.getElementById('tshirtClothGroup');
    const tshirtSizeGroup = document.getElementById('tshirtSizeGroup');
    const tshirtPrintGroup = document.getElementById('tshirtPrintGroup');
    const cupGroup = document.getElementById('cupGroup');

    if (isCup) {
      if (tshirtClothGroup) tshirtClothGroup.classList.add('hidden');
      tshirtSizeGroup.classList.add('hidden');
      tshirtPrintGroup.classList.add('hidden');
      cupGroup.classList.remove('hidden');
    } else {
      if (tshirtClothGroup) tshirtClothGroup.classList.remove('hidden');
      tshirtSizeGroup.classList.remove('hidden');
      tshirtPrintGroup.classList.remove('hidden');
      cupGroup.classList.add('hidden');
    }
    updateLaserUps();
  }
}

// --- LOAD/SAVE LOCAL STORAGE ---
function loadPricingFromStorage() {
  const stored = localStorage.getItem('right_printers_pricing_v4');
  if (stored) {
    try {
      currentPricing = JSON.parse(stored);
      // Fallback check in case stored structure lacks new fields
      if (!currentPricing.discountTiers) {
        currentPricing.discountTiers = JSON.parse(JSON.stringify(DEFAULT_PRICING.discountTiers));
      }
      if (!currentPricing.quantityTiers) {
        currentPricing.quantityTiers = JSON.parse(JSON.stringify(DEFAULT_PRICING.quantityTiers));
      }

      if (currentPricing.paperGsmRates) {
        Object.keys(DEFAULT_PRICING.paperGsmRates).forEach(gsm => {
          if (!currentPricing.paperGsmRates[gsm]) {
            currentPricing.paperGsmRates[gsm] = JSON.parse(JSON.stringify(DEFAULT_PRICING.paperGsmRates[gsm]));
          } else {
            Object.keys(DEFAULT_PRICING.paperGsmRates[gsm]).forEach(sz => {
              if (currentPricing.paperGsmRates[gsm][sz] === undefined || currentPricing.paperGsmRates[gsm][sz] >= 6.00) {
                currentPricing.paperGsmRates[gsm][sz] = DEFAULT_PRICING.paperGsmRates[gsm][sz];
              }
            });
          }
        });
      }

      if (currentPricing.stickerRates) {
        Object.keys(DEFAULT_PRICING.stickerRates).forEach(mat => {
          if (!currentPricing.stickerRates[mat]) {
            currentPricing.stickerRates[mat] = JSON.parse(JSON.stringify(DEFAULT_PRICING.stickerRates[mat]));
          } else {
            Object.keys(DEFAULT_PRICING.stickerRates[mat]).forEach(col => {
              if (!currentPricing.stickerRates[mat][col]) {
                currentPricing.stickerRates[mat][col] = JSON.parse(JSON.stringify(DEFAULT_PRICING.stickerRates[mat][col]));
              } else {
                Object.keys(DEFAULT_PRICING.stickerRates[mat][col]).forEach(sz => {
                  if (currentPricing.stickerRates[mat][col][sz] === undefined) {
                    currentPricing.stickerRates[mat][col][sz] = DEFAULT_PRICING.stickerRates[mat][col][sz];
                  }
                });
              }
            });
          }
        });
      } else {
        currentPricing.stickerRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.stickerRates));
      }
      if (currentPricing.fixedRates) {
        if (currentPricing.fixedRates.businessCardPrint === undefined || currentPricing.fixedRates.businessCardPrint === 0.048 || currentPricing.fixedRates.businessCardPrint === 0.12) {
          currentPricing.fixedRates.businessCardPrint = 0.012;
        }
        if (currentPricing.fixedRates.businessCardA3SheetPrice === undefined || currentPricing.fixedRates.businessCardA3SheetPrice === 0.50 || currentPricing.fixedRates.businessCardA3SheetPrice === 0.60 || currentPricing.fixedRates.businessCardA3SheetPrice === 0.75 || currentPricing.fixedRates.businessCardA3SheetPrice === 1.00 || currentPricing.fixedRates.businessCardA3SheetPrice === 2.50) {
          currentPricing.fixedRates.businessCardA3SheetPrice = 0.75;
        }
        if (currentPricing.fixedRates.businessCardPolarCutPrice === undefined || currentPricing.fixedRates.businessCardPolarCutPrice === 0.75) {
          currentPricing.fixedRates.businessCardPolarCutPrice = 0.50;
        }
        if (currentPricing.fixedRates.packing === undefined || currentPricing.fixedRates.packing === 5.00) {
          currentPricing.fixedRates.packing = 0.50;
        }
        if (currentPricing.fixedRates.dieCylinder === undefined) {
          currentPricing.fixedRates.dieCylinder = 0.30;
        }
        if (currentPricing.fixedRates.dieManual === undefined) {
          currentPricing.fixedRates.dieManual = 0.15;
        }
      }
      if (!currentPricing.plotterRates) {
        currentPricing.plotterRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.plotterRates));
      } else {
        Object.keys(DEFAULT_PRICING.plotterRates).forEach(sz => {
          if (currentPricing.plotterRates[sz] === undefined || currentPricing.plotterRates[sz] >= 3.50) {
            currentPricing.plotterRates[sz] = DEFAULT_PRICING.plotterRates[sz];
          }
        });
      }
      if (!currentPricing.laminationRates) {
        currentPricing.laminationRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.laminationRates));
      } else {
        Object.keys(DEFAULT_PRICING.laminationRates).forEach(sz => {
          if (currentPricing.laminationRates[sz] === undefined) {
            currentPricing.laminationRates[sz] = DEFAULT_PRICING.laminationRates[sz];
          }
        });
      }

      if (!currentPricing.tshirtLaserRates) {
        currentPricing.tshirtLaserRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.tshirtLaserRates));
      }
      if (!currentPricing.tshirtSizeRates) {
        currentPricing.tshirtSizeRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.tshirtSizeRates));
      } else {
        if (currentPricing.tshirtSizeRates.XLL !== undefined) {
          currentPricing.tshirtSizeRates.XL = currentPricing.tshirtSizeRates.XLL;
          delete currentPricing.tshirtSizeRates.XLL;
        }
        if (currentPricing.tshirtSizeRates.M === undefined) {
          currentPricing.tshirtSizeRates.M = 25.00;
        }
      }
      if (!currentPricing.tshirtClothSizeRates) {
        currentPricing.tshirtClothSizeRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.tshirtClothSizeRates));
      }
      if (!currentPricing.tshirtTransferRates) {
        currentPricing.tshirtTransferRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.tshirtTransferRates));
      }
      if (currentPricing.cupBaseRate === undefined) {
        currentPricing.cupBaseRate = DEFAULT_PRICING.cupBaseRate;
      }
      if (!currentPricing.cupTransferRates) {
        currentPricing.cupTransferRates = JSON.parse(JSON.stringify(DEFAULT_PRICING.cupTransferRates));
      }
    } catch (e) {
      console.error("Error parsing stored pricing. Reverting to defaults.", e);
      currentPricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
    }
  }
}

function savePricingToStorage() {
  localStorage.setItem('right_printers_pricing_v4', JSON.stringify(currentPricing));
}

// --- UI SETUP & EVENT LISTENERS ---
function initUI() {
  // 1. Setup Job Type Tabs
  const tabPaper = document.getElementById('tabPaper');
  const tabSticker = document.getElementById('tabSticker');
  const tabTshirt = document.getElementById('tabTshirt');

  tabPaper.addEventListener('click', () => {
    currentJobType = 'paper';
    updateJobTypeTabVisibility();
    updateExtrasAvailabilities();
    calculateAndUpdate();
  });

  tabSticker.addEventListener('click', () => {
    currentJobType = 'sticker';
    updateJobTypeTabVisibility();
    updateExtrasAvailabilities();
    calculateAndUpdate();
  });

  tabTshirt.addEventListener('click', () => {
    currentJobType = 'tshirt';
    updateJobTypeTabVisibility();
    updateExtrasAvailabilities();
    calculateAndUpdate();
  });

  // 2. Setup Paper Size List
  renderPaperSizeButtons();

  // 3. Setup GSM List
  renderGsmButtons();

  // 4. Orientation Switch
  const orientationToggle = document.getElementById('orientationToggle');
  orientationToggle.addEventListener('change', (e) => {
    isPortraitOrientation = e.target.checked;
    userForcedOrientation = null; // Reset forced direction on sheet flip
    calculateAndUpdate();
  });

  // 5. Inputs Auto-change
  const inputIds = [
    'itemWidth', 'itemHeight', 'itemQty', 'boxDepthH', 'wallThickness', 'boxFoldType', 'stickerType', 'stickerColors',
    'extraDesignCharge', 'designChargeInput', 'extraColorCharge', 'colorCountInput', 'colorRateInput',
    'extraLamination', 'laminationBothSides', 'extraPlotter', 'extraFolding', 'extraPasting', 'extraHandleRope', 'extraPacking', 'businessCardMode', 'backSidePrint',
    'extraPolarCutting', 'polarCuttingRateInput',
    'extraDieCylinder', 'dieCylinderRateInput', 'extraDieManual', 'dieManualRateInput',
    'extraPlastic', 'plasticMicron', 'plasticLength', 'plasticWidth', 'plasticDiecutRate',
    'tshirtCloth', 'tshirtSize', 'laserUps', 'tshirtTransfer', 'cupTransfer', 'tshirtCupQty'
  ];



  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', () => {
        calculateAndUpdate();
      });
      if (el.type !== 'checkbox') {
        el.addEventListener('change', () => {
          calculateAndUpdate();
        });
      }
    }
  });


  // Dedicated Print Laser auto-ups listeners
  const laserWidthEl = document.getElementById('laserWidth');
  const laserHeightEl = document.getElementById('laserHeight');
  const tshirtLaserPrintEl = document.getElementById('tshirtLaserPrint');

  if (laserWidthEl) {
    laserWidthEl.addEventListener('input', () => {
      updateLaserUps();
      calculateAndUpdate();
    });
  }
  if (laserHeightEl) {
    laserHeightEl.addEventListener('input', () => {
      updateLaserUps();
      calculateAndUpdate();
    });
  }
  if (tshirtLaserPrintEl) {
    tshirtLaserPrintEl.addEventListener('change', () => {
      updateLaserUps();
      calculateAndUpdate();
    });
  }

  // T-Shirt / Cup Product toggle
  const tshirtCupProduct = document.getElementById('tshirtCupProduct');
  if (tshirtCupProduct) {
    tshirtCupProduct.addEventListener('change', (e) => {
      const isCup = e.target.value === 'cup';
      const tshirtClothGroup = document.getElementById('tshirtClothGroup');
      const tshirtSizeGroup = document.getElementById('tshirtSizeGroup');
      const tshirtPrintGroup = document.getElementById('tshirtPrintGroup');
      const cupGroup = document.getElementById('cupGroup');

      if (isCup) {
        if (tshirtClothGroup) tshirtClothGroup.classList.add('hidden');
        tshirtSizeGroup.classList.add('hidden');
        tshirtPrintGroup.classList.add('hidden');
        cupGroup.classList.remove('hidden');
      } else {
        if (tshirtClothGroup) tshirtClothGroup.classList.remove('hidden');
        tshirtSizeGroup.classList.remove('hidden');
        tshirtPrintGroup.classList.remove('hidden');
        cupGroup.classList.add('hidden');
      }
      updateLaserUps();
      calculateAndUpdate();
    });
  }

  // 6. Settings Toggle / Drawer Controls & Authentication Modal Controls
  const settingsDrawer = document.getElementById('settingsDrawer');
  const appLockScreen = document.getElementById('appLockScreen');
  const lockScreenForm = document.getElementById('lockScreenForm');
  const lockErrorMsg = document.getElementById('lockErrorMsg');
  
  const adminElevationModal = document.getElementById('adminElevationModal');
  const elevationForm = document.getElementById('elevationForm');
  const elevationErrorMsg = document.getElementById('elevationErrorMsg');

  // App lock screen submit
  if (lockScreenForm) {
    lockScreenForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('lockUsername').value.trim().toLowerCase();
      const pass = document.getElementById('lockPassword').value;

      const salesPass = getSalesPassword();
      const adminPass = getAdminPassword();
      const isSmsOtpEnabled = localStorage.getItem('sms_otp_enabled') !== 'false';

      if (user === 'sales' && pass === salesPass) {
        lockErrorMsg.innerText = '';
        if (isSmsOtpEnabled) {
          transitionToOtp('sales');
        } else {
          sessionStorage.setItem('isAppUnlocked', 'true');
          sessionStorage.setItem('isSalesAuthenticated', 'true');
          applyAppLockStatus();
          lockScreenForm.reset();
        }
      } else if ((user === 'admin' || user === 'administrator') && pass === adminPass) {
        lockErrorMsg.innerText = '';
        if (isSmsOtpEnabled) {
          transitionToOtp('admin');
        } else {
          sessionStorage.setItem('isAppUnlocked', 'true');
          sessionStorage.setItem('isAdminAuthenticated', 'true');
          applyAppLockStatus();
          lockScreenForm.reset();
        }
      } else {
        lockErrorMsg.innerText = 'Incorrect Username or Password / اسم المستخدم أو كلمة المرور غير صحيحة';
        const lockCard = appLockScreen.querySelector('.lock-card');
        lockCard.classList.add('shake');
        setTimeout(() => {
          lockCard.classList.remove('shake');
        }, 400);
      }
    });
  }

  // Initialize Segmented OTP digit inputs
  initOtpInputs();

  // Handle OTP form submission
  const lockOtpForm = document.getElementById('lockOtpForm');
  const otpErrorMsg = document.getElementById('otpErrorMsg');
  if (lockOtpForm) {
    lockOtpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredOtp = document.getElementById('lockOtpCombined').value;
      
      if (enteredOtp === currentOtpCode && currentOtpCode !== null) {
        sessionStorage.setItem('isAppUnlocked', 'true');
        if (pendingUserRole === 'sales') {
          sessionStorage.setItem('isSalesAuthenticated', 'true');
        } else if (pendingUserRole === 'admin') {
          sessionStorage.setItem('isAdminAuthenticated', 'true');
        }
        applyAppLockStatus();
        
        // Reset and clear states
        lockOtpForm.reset();
        if (lockScreenForm) lockScreenForm.reset();
        otpErrorMsg.innerText = '';
        pendingUserRole = null;
        currentOtpCode = null;
        if (otpTimer) clearInterval(otpTimer);
        transitionToCredentials(); // reset layout internally for next lock
      } else {
        otpErrorMsg.innerText = 'Incorrect Verification Code / رمز التحقق غير صحيح';
        const lockCard = appLockScreen.querySelector('.lock-card');
        lockCard.classList.add('shake');
        setTimeout(() => {
          lockCard.classList.remove('shake');
        }, 400);
        
        // Reset fields and focus
        resetOtpDigits();
        const firstDigit = document.querySelector('.otp-digit');
        if (firstDigit) firstDigit.focus();
      }
    });
  }

  // Handle back button on OTP screen
  const backToCredBtn = document.getElementById('backToCredentials');
  if (backToCredBtn) {
    backToCredBtn.addEventListener('click', (e) => {
      e.preventDefault();
      transitionToCredentials();
    });
  }

  // Handle Resend OTP button click
  const resendOtpBtn = document.getElementById('resendOtpBtn');
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (pendingUserRole) {
        currentOtpCode = generateOtp();

        const smsProvider = localStorage.getItem('sms_otp_provider') || 'simulation';
        const emailProvider = localStorage.getItem('email_otp_provider') || 'simulation';
        const targetEmail = localStorage.getItem('email_otp_recipient') || 'sypsalim@gmail.com';
        const isSmsEnabled = localStorage.getItem('sms_otp_enabled') !== 'false';
        const isEmailEnabled = localStorage.getItem('email_otp_enabled') !== 'false';

        // Update subtitle with new simulated code if simulation provider is active
        const subtitleEl = document.getElementById('lockCardSubtitle');
        if (subtitleEl) {
          let destinations = [];
          if (isSmsEnabled) destinations.push('+966539044608');
          if (isEmailEnabled) destinations.push(targetEmail);
          const destStr = destinations.join(' / ');

          if ((isSmsEnabled && smsProvider === 'simulation') || (isEmailEnabled && emailProvider === 'simulation')) {
            subtitleEl.innerHTML = `Enter the code sent to ${destStr} / أدخل رمز التحقق المرسل<br><span style="color: var(--primary-gold-light); font-weight: 700; font-size: 1.1rem; margin-top: 8px; display: inline-block;">[Simulated Code: ${currentOtpCode}]</span>`;
          } else {
            subtitleEl.innerText = `Enter the code sent to ${destStr} / أدخل رمز التحقق المرسل`;
          }
        }

        startOtpCountdown();
        if (isSmsEnabled) sendSmsCode(currentOtpCode);
        if (isEmailEnabled) sendEmailCode(targetEmail, currentOtpCode);
        resetOtpDigits();
        const firstDigit = document.querySelector('.otp-digit');
        if (firstDigit) firstDigit.focus();
      }
    });
  }

  // Handle SMS provider change visibility updates
  const smsOtpProviderSelect = document.getElementById('smsOtpProvider');
  if (smsOtpProviderSelect) {
    smsOtpProviderSelect.addEventListener('change', () => {
      updateSmsFieldsVisibility();
    });
  }

  // Handle Email provider change visibility updates
  const emailOtpProviderSelect = document.getElementById('emailOtpProvider');
  if (emailOtpProviderSelect) {
    emailOtpProviderSelect.addEventListener('change', () => {
      updateEmailFieldsVisibility();
    });
  }

  // Open Settings Button click handler
  document.getElementById('openSettingsBtn').addEventListener('click', () => {
    if (checkAdminAuthentication()) {
      populateSettingsDrawer();
      settingsDrawer.classList.add('open');
    } else {
      adminElevationModal.classList.add('open');
      document.getElementById('elevationPassword').focus();
    }
  });

  // Close elevation modal
  document.getElementById('closeElevationBtn').addEventListener('click', () => {
    adminElevationModal.classList.remove('open');
    elevationForm.reset();
    elevationErrorMsg.innerText = '';
  });

  // Admin Elevation submission logic
  if (elevationForm) {
    elevationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const passVal = document.getElementById('elevationPassword').value;
      const adminPass = getAdminPassword();

      if (passVal === adminPass) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        adminElevationModal.classList.remove('open');
        elevationForm.reset();
        elevationErrorMsg.innerText = '';
        populateSettingsDrawer();
        settingsDrawer.classList.add('open');
      } else {
        elevationErrorMsg.innerText = 'Incorrect Admin Password / كلمة مرور المشرف غير صحيحة';
        const modalContent = adminElevationModal.querySelector('.login-modal-content');
        modalContent.classList.add('shake');
        setTimeout(() => {
          modalContent.classList.remove('shake');
        }, 400);
      }
    });
  }

  document.getElementById('closeSettingsBtn').addEventListener('click', () => {
    settingsDrawer.classList.remove('open');
  });

  // Logout Settings Button
  document.getElementById('logoutSettingsBtn').addEventListener('click', () => {
    sessionStorage.clear(); // Log out from entire session
    settingsDrawer.classList.remove('open');
    applyAppLockStatus();
  });
  
  // Close drawer or login modal if clicking outside contents
  settingsDrawer.addEventListener('click', (e) => {
    if (e.target === settingsDrawer) {
      settingsDrawer.classList.remove('open');
    }
  });

  adminElevationModal.addEventListener('click', (e) => {
    if (e.target === adminElevationModal) {
      adminElevationModal.classList.remove('open');
      elevationForm.reset();
      elevationErrorMsg.innerText = '';
    }
  });

  // Settings tab selection
  const setTabBtns = document.querySelectorAll('.setting-tab-btn');
  setTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      setTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const sections = document.querySelectorAll('.setting-section');
      sections.forEach(sec => sec.classList.add('hidden'));
      
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.remove('hidden');
    });
  });

  // Save Settings Button
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    if (saveSettingsFromDrawer() !== false) {
      settingsDrawer.classList.remove('open');
      renderGsmButtons(); // re-render to reflect new prices on buttons
      const polarCutRateInput = document.getElementById('polarCuttingRateInput');
      if (polarCutRateInput) {
        polarCutRateInput.value = (currentPricing.fixedRates.businessCardPolarCutPrice !== undefined ? currentPricing.fixedRates.businessCardPolarCutPrice : 0.50).toFixed(2);
      }
      const dieCylinderRateInput = document.getElementById('dieCylinderRateInput');
      if (dieCylinderRateInput) {
        dieCylinderRateInput.value = (currentPricing.fixedRates.dieCylinder !== undefined ? currentPricing.fixedRates.dieCylinder : 0.30).toFixed(2);
      }
      const dieManualRateInput = document.getElementById('dieManualRateInput');
      if (dieManualRateInput) {
        dieManualRateInput.value = (currentPricing.fixedRates.dieManual !== undefined ? currentPricing.fixedRates.dieManual : 0.15).toFixed(2);
      }
      calculateAndUpdate();
    }
  });

  // Reset Settings Button
  document.getElementById('resetSettingsBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset all rates to company defaults?")) {
      currentPricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
      savePricingToStorage();
      populateSettingsDrawer();
      renderGsmButtons();
      const polarCutRateInput = document.getElementById('polarCuttingRateInput');
      if (polarCutRateInput) {
        polarCutRateInput.value = (currentPricing.fixedRates.businessCardPolarCutPrice !== undefined ? currentPricing.fixedRates.businessCardPolarCutPrice : 0.50).toFixed(2);
      }
      const dieCylinderRateInput = document.getElementById('dieCylinderRateInput');
      if (dieCylinderRateInput) {
        dieCylinderRateInput.value = (currentPricing.fixedRates.dieCylinder !== undefined ? currentPricing.fixedRates.dieCylinder : 0.30).toFixed(2);
      }
      const dieManualRateInput = document.getElementById('dieManualRateInput');
      if (dieManualRateInput) {
        dieManualRateInput.value = (currentPricing.fixedRates.dieManual !== undefined ? currentPricing.fixedRates.dieManual : 0.15).toFixed(2);
      }
      calculateAndUpdate();
    }
  });

  // Print Invoice Button
  document.getElementById('printInvoiceBtn').addEventListener('click', () => {
    window.print();
  });

  // Populate default polar cut price on main screen
  const polarCutRateInput = document.getElementById('polarCuttingRateInput');
  if (polarCutRateInput) {
    polarCutRateInput.value = (currentPricing.fixedRates.businessCardPolarCutPrice !== undefined ? currentPricing.fixedRates.businessCardPolarCutPrice : 0.50).toFixed(2);
  }

  // Populate default die cutting rates on main screen
  const dieCylinderRateInput = document.getElementById('dieCylinderRateInput');
  if (dieCylinderRateInput) {
    dieCylinderRateInput.value = (currentPricing.fixedRates.dieCylinder !== undefined ? currentPricing.fixedRates.dieCylinder : 0.30).toFixed(2);
  }
  const dieManualRateInput = document.getElementById('dieManualRateInput');
  if (dieManualRateInput) {
    dieManualRateInput.value = (currentPricing.fixedRates.dieManual !== undefined ? currentPricing.fixedRates.dieManual : 0.15).toFixed(2);
  }

  // Mutually exclusive toggle for Die Cutting
  const extraDieCylinder = document.getElementById('extraDieCylinder');
  const extraDieManual = document.getElementById('extraDieManual');

  if (extraDieCylinder) {
    extraDieCylinder.addEventListener('change', (e) => {
      if (e.target.checked && extraDieManual) {
        extraDieManual.checked = false;
      }
      calculateAndUpdate();
    });
  }
  if (extraDieManual) {
    extraDieManual.addEventListener('change', (e) => {
      if (e.target.checked && extraDieCylinder) {
        extraDieCylinder.checked = false;
      }
      calculateAndUpdate();
    });
  }

  // Lamination link logic
  const extraLamination = document.getElementById('extraLamination');
  const laminationBothSides = document.getElementById('laminationBothSides');

  if (extraLamination && laminationBothSides) {
    extraLamination.addEventListener('change', (e) => {
      if (!e.target.checked) {
        laminationBothSides.checked = false;
      }
      calculateAndUpdate();
    });
    laminationBothSides.addEventListener('change', (e) => {
      if (e.target.checked) {
        extraLamination.checked = true;
      }
      calculateAndUpdate();
    });
  }
}

// Render Paper Size Buttons
function renderPaperSizeButtons() {
  const container = document.getElementById('paperSizesList');
  container.innerHTML = '';

  DEFAULT_PAPER_SIZES.forEach(size => {
    // All sizes are now allowed for sticker jobs (70x33, 50x33, A3, A4)

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `size-btn ${size.id === selectedPaperSizeId ? 'active' : ''}`;
    btn.id = size.id;
    
    // Width and height changes dynamically with orientation
    const wVal = isPortraitOrientation ? size.h : size.w;
    const hVal = isPortraitOrientation ? size.w : size.h;

    btn.innerHTML = `
      <span class="size-name">${size.alias || size.name}</span>
      <span class="size-dims">${wVal} x ${hVal} cm</span>
    `;

    btn.addEventListener('click', () => {
      selectedPaperSizeId = size.id;
      userForcedOrientation = null; // reset forced layout direction
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculateAndUpdate();
    });

    container.appendChild(btn);
  });
}

// Render GSM Buttons
function renderGsmButtons() {
  const container = document.getElementById('paperGsmList');
  container.innerHTML = '';

  const gsms = ['350', '300', '250', '150', '100'];
  gsms.forEach(gsm => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `gsm-btn ${gsm === selectedGsm ? 'active' : ''}`;
    
    // Find active paper size display name
    const activeSize = DEFAULT_PAPER_SIZES.find(s => s.id === selectedPaperSizeId);
    const key = activeSize ? (activeSize.alias || `${activeSize.w}x${activeSize.h}`) : '70x33';
    
    // Format the price key correctly (A3/A4 vs 70x33/50x33)
    let rateKey = key;
    if (key === 'A3 Size') rateKey = 'A3';
    if (key === 'A4 Size') rateKey = 'A4';
    if (key === '70x33 cm') rateKey = '70x33';
    if (key === '50x33 cm') rateKey = '50x33';

    const priceVal = currentPricing.paperGsmRates[gsm][rateKey] || 0;

    btn.innerHTML = `
      <span class="gsm-val">${gsm} GSM</span>
      <span class="gsm-price">${priceVal.toFixed(2)} SR</span>
    `;

    btn.addEventListener('click', () => {
      selectedGsm = gsm;
      document.querySelectorAll('.gsm-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calculateAndUpdate();
    });

    container.appendChild(btn);
  });
}

// Check checkbox states & enable/disable depending on job type
function updateExtrasAvailabilities() {
  const laminationCardEl = document.getElementById('laminationCardEl');
  const plotterCardEl = document.getElementById('plotterCardEl');
  const isSticker = currentJobType === 'sticker';
  
  const bcModeContainer = document.getElementById('bcModeContainer');
  const backSidePrintContainer = document.getElementById('backSidePrintContainer');
  if (isSticker) {
    if (bcModeContainer) bcModeContainer.classList.add('hidden');
    if (backSidePrintContainer) backSidePrintContainer.classList.add('hidden');
    const bcCheckbox = document.getElementById('businessCardMode');
    if (bcCheckbox) bcCheckbox.checked = false;
    const bsCheckbox = document.getElementById('backSidePrint');
    if (bsCheckbox) bsCheckbox.checked = false;
  } else {
    if (bcModeContainer) bcModeContainer.classList.remove('hidden');
    if (backSidePrintContainer) backSidePrintContainer.classList.remove('hidden');
  }
  
  if (isSticker) {
    // Disable lamination checkbox for sticker jobs (since transparent/white stickers usually don't do lamination or it's built-in)
    // Or if the user wishes we can keep it, but default transparent/white is self-contained. 
    // Wait, prompt Section 7 says: "Lamination cost for each selected paper size. Size Only 70x33 and 50x33. 70x33 cm = 0.40 SR, 50x33 cm = 0.25 SR, A3 = 0.20 SR".
    // It is available for 70x33, 50x33, and A3 sheet sizes. Since sticker is A3/A4 only, lamination is available for A3 sticker.
    // Let's keep it enabled but show warning if A4 is selected and lamination is checked.
  }
}

// --- POPULATE SETTINGS DRAWER ---
function populateSettingsDrawer() {
  // 1. Paper GSM rates
  const paperBody = document.getElementById('settingsPaperBody');
  paperBody.innerHTML = '';
  const gsms = ['350', '300', '250', '150', '100'];
  const sizes = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4', 'backSide'];
  
  gsms.forEach(gsm => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${gsm} GSM</strong></td>`;
    sizes.forEach(sz => {
      const val = (currentPricing.paperGsmRates[gsm] && currentPricing.paperGsmRates[gsm][sz] !== undefined)
        ? currentPricing.paperGsmRates[gsm][sz]
        : (DEFAULT_PRICING.paperGsmRates[gsm][sz] || 0);
      tr.innerHTML += `
        <td>
          <input type="number" step="0.05" class="table-input paper-gsm-input" 
                 data-gsm="${gsm}" data-size="${sz}" value="${val.toFixed(2)}">
        </td>`;
    });
    paperBody.appendChild(tr);
  });

  // 2. Sticker rates
  const stickerBody = document.getElementById('settingsStickerBody');
  stickerBody.innerHTML = '';
  const mats = [
    { id: 'paper', label: 'Paper Sticker' },
    { id: 'pvc_white', label: 'PVC White' },
    { id: 'pvc_transparent', label: 'PVC Transparent' }
  ];
  const colors = [
    { id: 'cymk', label: '4 Color CYMK' },
    { id: 'cymk_white', label: '5 Color CYMK+W' },
    { id: 'clear_color', label: 'Clear Color' }
  ];
  const stickerSizes = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4'];

  mats.forEach(mat => {
    colors.forEach(col => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${mat.label}</strong></td>
        <td>${col.label}</td>
      `;
      stickerSizes.forEach(sz => {
        const val = (currentPricing.stickerRates[mat.id] && currentPricing.stickerRates[mat.id][col.id] && currentPricing.stickerRates[mat.id][col.id][sz] !== undefined)
          ? currentPricing.stickerRates[mat.id][col.id][sz]
          : (DEFAULT_PRICING.stickerRates[mat.id][col.id][sz] || 0);
        tr.innerHTML += `
          <td>
            <input type="number" step="0.1" class="table-input sticker-input" 
                   data-mat="${mat.id}" data-col="${col.id}" data-size="${sz}" value="${val.toFixed(2)}">
          </td>`;
      });
      stickerBody.appendChild(tr);
    });
  });


  // 3. Quantity Multipliers & Discount Tiers
  const qtyTierBody = document.getElementById('settingsQtyTierBody');
  if (qtyTierBody) {
    qtyTierBody.innerHTML = '';
    const qtyTiers = currentPricing.quantityTiers || DEFAULT_PRICING.quantityTiers;
    qtyTiers.forEach((tier, index) => {
      const tr = document.createElement('tr');
      const maxVal = (tier.max === Infinity || tier.max === null || tier.max === undefined) ? '' : tier.max;
      tr.innerHTML = `
        <td>
          <input type="number" class="table-input qty-tier-min" data-index="${index}" value="${tier.min}">
        </td>
        <td>
          <input type="number" class="table-input qty-tier-max" data-index="${index}" placeholder="Infinity" value="${maxVal}">
        </td>
        <td>
          <input type="number" step="0.05" class="table-input qty-tier-mult" data-index="${index}" value="${tier.multiplier}">
        </td>
      `;
      qtyTierBody.appendChild(tr);
    });
  }

  const discountBody = document.getElementById('settingsDiscountBody');
  discountBody.innerHTML = '';
  currentPricing.discountTiers.forEach((tier, index) => {
    const tr = document.createElement('tr');
    const maxVal = tier.max === Infinity ? '' : tier.max;
    tr.innerHTML = `
      <td>
        <input type="number" class="table-input disc-min" data-index="${index}" value="${tier.min}">
      </td>
      <td>
        <input type="number" class="table-input disc-max" data-index="${index}" placeholder="Infinity" value="${maxVal}">
      </td>
      <td>
        <input type="number" step="0.5" class="table-input disc-val" data-index="${index}" value="${tier.discount}">%
      </td>
    `;
    discountBody.appendChild(tr);

  });

  // 4. Lamination Rates
  const lamContainer = document.getElementById('settingsLaminationContainer');
  if (lamContainer) {
    lamContainer.innerHTML = '';
    const allSizes = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4'];
    allSizes.forEach(sz => {
      const val = (currentPricing.laminationRates && currentPricing.laminationRates[sz] !== undefined)
        ? currentPricing.laminationRates[sz]
        : (DEFAULT_PRICING.laminationRates[sz] || 0);
      lamContainer.innerHTML += `
        <div class="form-group min-w-150">
          <label>${sz} Lamination (SR)</label>
          <input type="number" step="0.05" class="form-input lamination-rate-input" data-size="${sz}" value="${val.toFixed(2)}">
        </div>
      `;
    });
  }

  // 5. Plotter Rates
  const plotterContainer = document.getElementById('settingsPlotterContainer');
  if (plotterContainer) {
    plotterContainer.innerHTML = '';
    const allSizes = ['100x70', '90x64', '50x70', '70x33', '50x33', 'A3', 'A4'];
    allSizes.forEach(sz => {
      const val = (currentPricing.plotterRates && currentPricing.plotterRates[sz] !== undefined)
        ? currentPricing.plotterRates[sz]
        : (DEFAULT_PRICING.plotterRates[sz] || 0);
      plotterContainer.innerHTML += `
        <div class="form-group min-w-150">
          <label>${sz} Plotter Cut (SR)</label>
          <input type="number" step="0.05" class="form-input plotter-rate-input" data-size="${sz}" value="${val.toFixed(2)}">
        </div>
      `;
    });
  }


  // 6. Fixed Services rates
  document.getElementById('rateFolding').value = currentPricing.fixedRates.folding.toFixed(2);
  document.getElementById('ratePasting').value = currentPricing.fixedRates.pasting.toFixed(2);
  document.getElementById('rateRope').value = currentPricing.fixedRates.rope.toFixed(2);
  document.getElementById('ratePacking').value = currentPricing.fixedRates.packing.toFixed(2);
  const bcRateVal = currentPricing.fixedRates.businessCardPrint !== undefined ? currentPricing.fixedRates.businessCardPrint : 0.012;
  document.getElementById('rateBcPrint').value = bcRateVal.toFixed(3);
  const bcSheetRateVal = currentPricing.fixedRates.businessCardA3SheetPrice !== undefined ? currentPricing.fixedRates.businessCardA3SheetPrice : 0.75;
  document.getElementById('rateBcA3Sheet').value = bcSheetRateVal.toFixed(2);
  const bcPolarRateVal = currentPricing.fixedRates.businessCardPolarCutPrice !== undefined ? currentPricing.fixedRates.businessCardPolarCutPrice : 0.50;
  document.getElementById('rateBcPolarCut').value = bcPolarRateVal.toFixed(2);
  const dieCylinderRateVal = currentPricing.fixedRates.dieCylinder !== undefined ? currentPricing.fixedRates.dieCylinder : 0.30;
  document.getElementById('rateDieCylinder').value = dieCylinderRateVal.toFixed(2);
  const dieManualRateVal = currentPricing.fixedRates.dieManual !== undefined ? currentPricing.fixedRates.dieManual : 0.15;
  document.getElementById('rateDieManual').value = dieManualRateVal.toFixed(2);

  // 6.5. T-Shirt & Cup Rates
  document.getElementById('rateTshirtLaserA3').value = currentPricing.tshirtLaserRates.A3.toFixed(2);
  document.getElementById('rateTshirtLaserA4').value = currentPricing.tshirtLaserRates.A4.toFixed(2);

  const tshirtClothBody = document.getElementById('settingsTshirtClothBody');
  if (tshirtClothBody) {
    tshirtClothBody.innerHTML = '';
    const clothTypes = [
      { id: 'cotton', label: 'Cotton / قطن' },
      { id: 'polyester', label: 'Polyester / بوليستر' },
      { id: 'linen', label: 'Linen / كتان' },
      { id: 'flannel', label: 'Flannel / فلانيل' },
      { id: 'silk', label: 'Silk / حرير' },
      { id: 'blends', label: 'Blends (polyester and cotton) / مخلوط' }
    ];
    const tshirtSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    clothTypes.forEach(cloth => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><strong>${cloth.label}</strong></td>`;
      tshirtSizes.forEach(size => {
        const val = (currentPricing.tshirtClothSizeRates && currentPricing.tshirtClothSizeRates[cloth.id] && currentPricing.tshirtClothSizeRates[cloth.id][size]) || 0;
        tr.innerHTML += `
          <td>
            <input type="number" step="0.5" class="table-input tshirt-cloth-size-input" 
                   data-cloth="${cloth.id}" data-size="${size}" value="${val.toFixed(2)}">
          </td>`;
      });
      tshirtClothBody.appendChild(tr);
    });
  }

  document.getElementById('rateTshirtTransferA3').value = currentPricing.tshirtTransferRates.A3.toFixed(2);
  document.getElementById('rateTshirtTransferA4').value = currentPricing.tshirtTransferRates.A4.toFixed(2);
  document.getElementById('rateTshirtTransferA5').value = currentPricing.tshirtTransferRates.A5.toFixed(2);
  document.getElementById('rateTshirtTransferA6').value = currentPricing.tshirtTransferRates.A6.toFixed(2);

  document.getElementById('rateCupBase').value = currentPricing.cupBaseRate.toFixed(2);
  document.getElementById('rateCupTransferFull').value = currentPricing.cupTransferRates.FULL_PART.toFixed(2);
  document.getElementById('rateCupTransferSmall').value = currentPricing.cupTransferRates.SMALL.toFixed(2);

  // 7. Security Tab Credentials
  document.getElementById('adminSalesPassword').value = getSalesPassword();

  // Load SMS settings fields
  document.getElementById('smsOtpEnabled').checked = localStorage.getItem('sms_otp_enabled') !== 'false';
  document.getElementById('smsOtpProvider').value = localStorage.getItem('sms_otp_provider') || 'simulation';

  document.getElementById('twilioSid').value = localStorage.getItem('twilio_sid') || '';
  document.getElementById('twilioAuthToken').value = localStorage.getItem('twilio_auth_token') || '';
  document.getElementById('twilioFrom').value = localStorage.getItem('twilio_from') || '';

  document.getElementById('unifonicAppSid').value = localStorage.getItem('unifonic_app_sid') || '';
  document.getElementById('unifonicSender').value = localStorage.getItem('unifonic_sender') || '';

  document.getElementById('customSmsUrl').value = localStorage.getItem('custom_sms_url') || '';
  document.getElementById('customSmsMethod').value = localStorage.getItem('custom_sms_method') || 'GET';
  document.getElementById('customSmsHeaders').value = localStorage.getItem('custom_sms_headers') || '';
  document.getElementById('customSmsPayload').value = localStorage.getItem('custom_sms_payload') || '';

  updateSmsFieldsVisibility();

  // Load Email settings fields
  document.getElementById('emailOtpEnabled').checked = localStorage.getItem('email_otp_enabled') !== 'false';
  document.getElementById('emailOtpRecipient').value = localStorage.getItem('email_otp_recipient') || 'sypsalim@gmail.com';
  document.getElementById('emailOtpProvider').value = localStorage.getItem('email_otp_provider') || 'simulation';

  document.getElementById('web3formsAccessKey').value = localStorage.getItem('web3forms_access_key') || '';

  document.getElementById('emailjsServiceId').value = localStorage.getItem('emailjs_service_id') || '';
  document.getElementById('emailjsTemplateId').value = localStorage.getItem('emailjs_template_id') || '';
  document.getElementById('emailjsPublicKey').value = localStorage.getItem('emailjs_public_key') || '';

  document.getElementById('customEmailUrl').value = localStorage.getItem('custom_email_url') || '';
  document.getElementById('customEmailHeaders').value = localStorage.getItem('custom_email_headers') || '';
  document.getElementById('customEmailPayload').value = localStorage.getItem('custom_email_payload') || '';

  updateEmailFieldsVisibility();

  const securityMsg = document.getElementById('securityMsg');
  if (securityMsg) {
    securityMsg.innerText = '';
    securityMsg.className = 'security-feedback-msg';
  }
}

// --- SAVE SETTINGS FROM DRAWER ---
function saveSettingsFromDrawer() {
  // 1. GSM
  const gsmInputs = document.querySelectorAll('.paper-gsm-input');
  gsmInputs.forEach(input => {
    const gsm = input.getAttribute('data-gsm');
    const sz = input.getAttribute('data-size');
    currentPricing.paperGsmRates[gsm][sz] = parseFloat(input.value) || 0;
  });

  // 2. Sticker
  const stickerInputs = document.querySelectorAll('.sticker-input');
  stickerInputs.forEach(input => {
    const mat = input.getAttribute('data-mat');
    const col = input.getAttribute('data-col');
    const sz = input.getAttribute('data-size');
    currentPricing.stickerRates[mat][col][sz] = parseFloat(input.value) || 0;
  });

  // 3. Quantity Multipliers & Discount tiers
  const qtyMinInputs = document.querySelectorAll('.qty-tier-min');
  const qtyMaxInputs = document.querySelectorAll('.qty-tier-max');
  const qtyMultInputs = document.querySelectorAll('.qty-tier-mult');
  if (qtyMinInputs.length > 0) {
    const newQtyTiers = [];
    qtyMinInputs.forEach((input, index) => {
      const minVal = parseInt(input.value) || 0;
      const maxText = qtyMaxInputs[index].value.trim();
      const maxVal = maxText === '' ? Infinity : parseInt(maxText);
      const multVal = parseFloat(qtyMultInputs[index].value) || 1.0;
      newQtyTiers.push({ min: minVal, max: maxVal, multiplier: multVal });
    });
    newQtyTiers.sort((a, b) => a.min - b.min);
    currentPricing.quantityTiers = newQtyTiers;
  }

  const minInputs = document.querySelectorAll('.disc-min');
  const maxInputs = document.querySelectorAll('.disc-max');
  const valInputs = document.querySelectorAll('.disc-val');
  
  const newTiers = [];
  minInputs.forEach((input, index) => {
    const minVal = parseInt(input.value) || 0;
    const maxText = maxInputs[index].value.trim();
    const maxVal = maxText === '' ? Infinity : parseInt(maxText);
    const discVal = parseFloat(valInputs[index].value) || 0;
    newTiers.push({ min: minVal, max: maxVal, discount: discVal });
  });
  // Sort tiers by min quantity
  newTiers.sort((a, b) => a.min - b.min);
  currentPricing.discountTiers = newTiers;


  // 4. Lamination Rates
  const lamInputs = document.querySelectorAll('.lamination-rate-input');
  lamInputs.forEach(input => {
    const sz = input.getAttribute('data-size');
    currentPricing.laminationRates[sz] = parseFloat(input.value) || 0;
  });

  // 5. Plotter Rates
  const plotterInputs = document.querySelectorAll('.plotter-rate-input');
  plotterInputs.forEach(input => {
    const sz = input.getAttribute('data-size');
    currentPricing.plotterRates[sz] = parseFloat(input.value) || 0;
  });

  // 6. Fixed Services rates
  currentPricing.fixedRates.folding = parseFloat(document.getElementById('rateFolding').value) || 0;
  currentPricing.fixedRates.pasting = parseFloat(document.getElementById('ratePasting').value) || 0;
  currentPricing.fixedRates.rope = parseFloat(document.getElementById('rateRope').value) || 0;
  currentPricing.fixedRates.packing = parseFloat(document.getElementById('ratePacking').value) || 0;
  currentPricing.fixedRates.businessCardPrint = parseFloat(document.getElementById('rateBcPrint').value) || 0;
  currentPricing.fixedRates.businessCardA3SheetPrice = parseFloat(document.getElementById('rateBcA3Sheet').value) || 0;
  currentPricing.fixedRates.businessCardPolarCutPrice = parseFloat(document.getElementById('rateBcPolarCut').value) || 0;
  currentPricing.fixedRates.dieCylinder = parseFloat(document.getElementById('rateDieCylinder').value) || 0;
  currentPricing.fixedRates.dieManual = parseFloat(document.getElementById('rateDieManual').value) || 0;

  // 6.5. T-Shirt & Cup rates save
  currentPricing.tshirtLaserRates.A3 = parseFloat(document.getElementById('rateTshirtLaserA3').value) || 0;
  currentPricing.tshirtLaserRates.A4 = parseFloat(document.getElementById('rateTshirtLaserA4').value) || 0;

  const tshirtClothInputs = document.querySelectorAll('.tshirt-cloth-size-input');
  if (!currentPricing.tshirtClothSizeRates) {
    currentPricing.tshirtClothSizeRates = {};
  }
  tshirtClothInputs.forEach(input => {
    const cloth = input.getAttribute('data-cloth');
    const size = input.getAttribute('data-size');
    if (!currentPricing.tshirtClothSizeRates[cloth]) {
      currentPricing.tshirtClothSizeRates[cloth] = {};
    }
    currentPricing.tshirtClothSizeRates[cloth][size] = parseFloat(input.value) || 0;
  });

  currentPricing.tshirtTransferRates.A3 = parseFloat(document.getElementById('rateTshirtTransferA3').value) || 0;
  currentPricing.tshirtTransferRates.A4 = parseFloat(document.getElementById('rateTshirtTransferA4').value) || 0;
  currentPricing.tshirtTransferRates.A5 = parseFloat(document.getElementById('rateTshirtTransferA5').value) || 0;
  currentPricing.tshirtTransferRates.A6 = parseFloat(document.getElementById('rateTshirtTransferA6').value) || 0;

  currentPricing.cupBaseRate = parseFloat(document.getElementById('rateCupBase').value) || 0;
  currentPricing.cupTransferRates.FULL_PART = parseFloat(document.getElementById('rateCupTransferFull').value) || 0;
  currentPricing.cupTransferRates.SMALL = parseFloat(document.getElementById('rateCupTransferSmall').value) || 0;

  // 7. Security credentials update (if filled)
  const salesPass = document.getElementById('adminSalesPassword').value;
  const securityMsg = document.getElementById('securityMsg');

  if (salesPass) {
    localStorage.setItem('sales_password', salesPass);
  }

  // Save SMS Gateway configuration
  const smsOtpEnabled = document.getElementById('smsOtpEnabled');
  if (smsOtpEnabled) {
    localStorage.setItem('sms_otp_enabled', smsOtpEnabled.checked ? 'true' : 'false');
  }

  const smsOtpProvider = document.getElementById('smsOtpProvider');
  if (smsOtpProvider) {
    localStorage.setItem('sms_otp_provider', smsOtpProvider.value);
  }

  localStorage.setItem('twilio_sid', document.getElementById('twilioSid').value.trim());
  localStorage.setItem('twilio_auth_token', document.getElementById('twilioAuthToken').value.trim());
  localStorage.setItem('twilio_from', document.getElementById('twilioFrom').value.trim());

  localStorage.setItem('unifonic_app_sid', document.getElementById('unifonicAppSid').value.trim());
  localStorage.setItem('unifonic_sender', document.getElementById('unifonicSender').value.trim());

  localStorage.setItem('custom_sms_url', document.getElementById('customSmsUrl').value.trim());
  localStorage.setItem('custom_sms_method', document.getElementById('customSmsMethod').value);
  localStorage.setItem('custom_sms_headers', document.getElementById('customSmsHeaders').value.trim());
  localStorage.setItem('custom_sms_payload', document.getElementById('customSmsPayload').value.trim());

  // Save Email Gateway configuration
  const emailOtpEnabled = document.getElementById('emailOtpEnabled');
  if (emailOtpEnabled) {
    localStorage.setItem('email_otp_enabled', emailOtpEnabled.checked ? 'true' : 'false');
  }

  const emailOtpRecipient = document.getElementById('emailOtpRecipient');
  if (emailOtpRecipient) {
    localStorage.setItem('email_otp_recipient', emailOtpRecipient.value.trim());
  }

  const emailOtpProvider = document.getElementById('emailOtpProvider');
  if (emailOtpProvider) {
    localStorage.setItem('email_otp_provider', emailOtpProvider.value);
  }

  localStorage.setItem('web3forms_access_key', document.getElementById('web3formsAccessKey').value.trim());

  localStorage.setItem('emailjs_service_id', document.getElementById('emailjsServiceId').value.trim());
  localStorage.setItem('emailjs_template_id', document.getElementById('emailjsTemplateId').value.trim());
  localStorage.setItem('emailjs_public_key', document.getElementById('emailjsPublicKey').value.trim());

  localStorage.setItem('custom_email_url', document.getElementById('customEmailUrl').value.trim());
  localStorage.setItem('custom_email_headers', document.getElementById('customEmailHeaders').value.trim());
  localStorage.setItem('custom_email_payload', document.getElementById('customEmailPayload').value.trim());

  if (securityMsg) {
    securityMsg.innerText = 'Security credentials and gateway configurations saved successfully!';
    securityMsg.className = 'security-feedback-msg success';
  }

  // Save to storage
  savePricingToStorage();
  return true;
}

// Set quick dimensions
function setQuickSize(w, h) {
  document.getElementById('itemWidth').value = w;
  document.getElementById('itemHeight').value = h;
  
  const bcModeCheckbox = document.getElementById('businessCardMode');
  if (bcModeCheckbox && currentJobType === 'paper') {
    if (w === 9 && h === 5.5) {
      bcModeCheckbox.checked = true;
      selectedGsm = '300'; // Default to 300 GSM for Business Cards
    } else {
      bcModeCheckbox.checked = false;
    }
  }
  calculateAndUpdate();
}

// --- ALGORITHMS & CALCULATIONS ---

// Return active sheet size dimension (cm) based on size ID & portrait toggle
function getSheetDimensions() {
  const sizeObj = DEFAULT_PAPER_SIZES.find(s => s.id === selectedPaperSizeId);
  if (!sizeObj) return { w: 70, h: 33, label: '70x33' };
  
  // Standard (Landscape default) vs Swapped (Portrait toggle)
  const baseW = sizeObj.w;
  const baseH = sizeObj.h;
  const alias = sizeObj.alias || `${baseW}x${baseH}`;

  if (isPortraitOrientation) {
    return { w: baseH, h: baseW, label: alias };
  } else {
    return { w: baseW, h: baseH, label: alias };
  }
}

// Evaluates layout options for a given parent sheet (S_W, S_H) and child item (i_w, i_h)
function calculateLayoutOptions(S_W, S_H, i_w, i_h) {
  // Option 1: Horizontal Layout (no rotation of item)
  const cols_H = Math.floor(S_W / i_w);
  const rows_H = Math.floor(S_H / i_h);
  const ups_H = Math.max(0, cols_H * rows_H);
  const area_H = ups_H * i_w * i_h;
  const totalSheetArea = S_W * S_H;
  const wastePercent_H = totalSheetArea > 0 ? ((totalSheetArea - area_H) / totalSheetArea) * 100 : 100;

  // Option 2: Vertical Layout (item is rotated 90 degrees)
  const cols_V = Math.floor(S_W / i_h);
  const rows_V = Math.floor(S_H / i_w);
  const ups_V = Math.max(0, cols_V * rows_V);
  const area_V = ups_V * i_w * i_h;
  const wastePercent_V = totalSheetArea > 0 ? ((totalSheetArea - area_V) / totalSheetArea) * 100 : 100;

  return {
    horizontal: {
      cols: cols_H,
      rows: rows_H,
      ups: ups_H,
      usedArea: area_H,
      wastageArea: totalSheetArea - area_H,
      wastagePercent: wastePercent_H,
      itemW: i_w,
      itemH: i_h
    },
    vertical: {
      cols: cols_V,
      rows: rows_V,
      ups: ups_V,
      usedArea: area_V,
      wastageArea: totalSheetArea - area_V,
      wastagePercent: wastePercent_V,
      itemW: i_h, // rotated placement dims
      itemH: i_w
    }
  };
}

// Keep track of previous BC mode state to detect toggle transitions
if (typeof window.bcModeWasActive === 'undefined') {
  window.bcModeWasActive = false;
}

// Main logic trigger to recalculate estimators
function calculateAndUpdate() {
  if (currentJobType === 'tshirt') {
    calculateTshirtCupAndUpdate();
    return;
  }
  const plotterCardEl = document.getElementById('plotterCardEl');
  const isBcMode = document.getElementById('businessCardMode') && document.getElementById('businessCardMode').checked && currentJobType === 'paper';
  if (isBcMode) {
    selectedPaperSizeId = 'size_a3';
    if (!window.bcModeWasActive) {
      selectedGsm = '300';
      window.bcModeWasActive = true;
      const extraPolar = document.getElementById('extraPolarCutting');
      if (extraPolar) extraPolar.checked = true;
    }
    if (plotterCardEl) {
      plotterCardEl.classList.add('disabled');
      document.getElementById('extraPlotter').checked = false;
    }
  } else {
    window.bcModeWasActive = false;
    if (plotterCardEl) {
      plotterCardEl.classList.remove('disabled');
    }
  }

  // Render buttons b/c they change sizes or prices
  renderPaperSizeButtons();
  renderGsmButtons();

  const { w: S_W, h: S_H, label: sizeLabel } = getSheetDimensions();
  
  const i_w = parseFloat(document.getElementById('itemWidth').value) || 1;
  const i_h = parseFloat(document.getElementById('itemHeight').value) || 1;
  const qty = parseInt(document.getElementById('itemQty').value) || 1;

  // Box Wall-Fold Calculation:
  // Double-Wall: Each fold side = Height (H) + Wall Thickness (T) + Height (H) + 1.9 cm (Inside Lock Flap)
  // Single-Wall: Each fold side = Height (H) + Wall Thickness (T) + 1.9 cm (Inside Lock Flap)
  const boxHInput = document.getElementById('boxDepthH');
  const boxTInput = document.getElementById('wallThickness');
  const boxFoldTypeEl = document.getElementById('boxFoldType');
  const boxH = boxHInput ? (parseFloat(boxHInput.value) || 0) : 0;
  const boxT = boxTInput ? (parseFloat(boxTInput.value) || 0) : 0;
  const boxFoldType = boxFoldTypeEl ? boxFoldTypeEl.value : 'double';

  let sideFold = 0;
  if (boxH > 0) {
    if (boxFoldType === 'single') {
      sideFold = boxH + boxT + 1.9;
    } else {
      sideFold = (2 * boxH) + boxT + 1.9;
    }
  }

  const effective_w = i_w + (2 * sideFold);
  const effective_h = i_h + (2 * sideFold);

  // Show/Hide Unfolded Box Notice in Section 3
  const boxFoldNotice = document.getElementById('boxFoldInfoNotice');
  if (boxFoldNotice) {
    if (boxH > 0) {
      boxFoldNotice.classList.remove('hidden');
      const isExceeding = (effective_w > S_W || effective_h > S_H) && (effective_w > S_H || effective_h > S_W);
      const foldTypeName = boxFoldType === 'single' ? 'Single-Wall Fold' : 'Double-Wall Fold';
      const foldFormulaDesc = boxFoldType === 'single'
        ? `(Height ${boxH}cm + Wall ${boxT}cm + Lock Flap 1.9cm)`
        : `(Height ${boxH}cm + Wall ${boxT}cm + Fold ${boxH}cm + Lock Flap 1.9cm)`;

      if (isExceeding) {
        boxFoldNotice.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 4px; color: #f43f5e;">
            ⚠️ Notice: Unfolded Box Flat Size (${effective_w.toFixed(2)} × ${effective_h.toFixed(2)} cm) exceeds Sheet Dimensions (${S_W} × ${S_H} cm)!
          </div>
          <div style="font-size: 0.82rem; opacity: 0.9;">
            Fold Allowance per Side: <strong>${sideFold.toFixed(2)} cm</strong> ${foldFormulaDesc}<br>
            <em>Tip: Try switching <strong>Box Wall Type</strong> to <strong>Single-Wall Fold</strong> or selecting a larger Paper Sheet (e.g. 100×70 cm).</em>
          </div>
        `;
      } else {
        boxFoldNotice.innerHTML = `
          <div style="font-weight: 700; margin-bottom: 2px; color: var(--primary-gold-light);">
            📐 ${foldTypeName} Unfolded Flat Size: ${effective_w.toFixed(2)} × ${effective_h.toFixed(2)} cm
          </div>
          <div style="font-size: 0.82rem; opacity: 0.9;">
            Fold Allowance per Side: <strong>${sideFold.toFixed(2)} cm</strong> ${foldFormulaDesc}
          </div>
        `;
      }
    } else {
      boxFoldNotice.classList.add('hidden');
    }
  }


  // 1. Calculate Layout Options based on the true unfolded flat box dimensions
  const layout = calculateLayoutOptions(S_W, S_H, effective_w, effective_h);
  
  // Decide which is the best layout (the one with max ups, or lowest wastage)
  let bestDirection = 'horizontal';
  if (layout.vertical.ups > layout.horizontal.ups) {
    bestDirection = 'vertical';
  } else if (layout.vertical.ups === layout.horizontal.ups) {
    // If equal, prefer the one with cleaner spacing or just default horizontal
    bestDirection = 'horizontal';
  }

  // If user clicked comparison table and forced an option, respect it
  const activeDirection = userForcedOrientation || bestDirection;
  const activeLayout = layout[activeDirection];

  // 2. Compute Sheets Needed
  const ups = activeLayout.ups;
  const sheetsNeeded = ups > 0 ? Math.ceil(qty / ups) : 0;
  const totalSheetArea = S_W * S_H;
  const wasteArea = activeLayout.wastageArea;
  const wastePercent = activeLayout.wastagePercent;

  // 3. Render SVG Layout
  renderLayoutSvg(S_W, S_H, activeLayout, activeDirection, i_w, i_h, sideFold);

  // 4. Render Stats
  document.getElementById('valUps').innerText = ups;
  document.getElementById('valSheetsNeeded').innerText = sheetsNeeded;
  document.getElementById('valWastagePercent').innerText = wastePercent.toFixed(1) + '%';
  document.getElementById('valWastageArea').innerHTML = wasteArea.toFixed(1) + ' <small>cm²</small>';
  document.getElementById('layoutDirectionLabel').innerText = 
    activeDirection === 'horizontal' ? 'Horizontal Setup (Original)' : 'Vertical Setup (Rotated)';

  // 5. Render Comparison Table

  renderComparisonTable(layout, bestDirection, activeDirection);

  // 6. Base cost calculation
  let baseSheetPrice = 0;
  let jobName = "";
  let specName = "";

  if (currentJobType === 'paper') {
    if (isBcMode && selectedGsm === '300') {
      baseSheetPrice = currentPricing.fixedRates.businessCardA3SheetPrice !== undefined ? currentPricing.fixedRates.businessCardA3SheetPrice : 0.75;
    } else {
      baseSheetPrice = currentPricing.paperGsmRates[selectedGsm][sizeLabel] || 0;
    }
    jobName = `Standard Paper (${selectedGsm} GSM)`;
    specName = `${selectedGsm} GSM`;
  } else {
    // Sticker Job
    const mat = document.getElementById('stickerType').value;
    const col = document.getElementById('stickerColors').value;
    baseSheetPrice = currentPricing.stickerRates[mat][col][sizeLabel] || 0;
    
    // Human readable names
    const matNames = { paper: 'Paper Sticker', pvc_white: 'PVC White Sticker', pvc_transparent: 'PVC Transparent Sticker' };
    const colNames = { cymk: 'CYMK (4 Color)', cymk_white: 'CYMK+White (5 Color)' };
    
    jobName = `${matNames[mat] || mat} - ${colNames[col] || col}`;
    specName = matNames[mat] || mat;
  }

  let baseCostTotal = 0;
  let a3SheetCostTotal = 0;
  let bcPrintCostTotal = 0;

  if (isBcMode) {
    a3SheetCostTotal = sheetsNeeded * baseSheetPrice;
    const bcRate = currentPricing.fixedRates.businessCardPrint !== undefined ? currentPricing.fixedRates.businessCardPrint : 0.012;
    bcPrintCostTotal = qty * bcRate;
    baseCostTotal = a3SheetCostTotal + bcPrintCostTotal;
  } else {
    baseCostTotal = sheetsNeeded * baseSheetPrice;
  }

  // Calculate back side print cost
  const optBackSide = document.getElementById('backSidePrint') && document.getElementById('backSidePrint').checked && currentJobType === 'paper';
  let backSideCost = 0;
  if (optBackSide) {
    if (isBcMode) {
      const bcRate = currentPricing.fixedRates.businessCardPrint !== undefined ? currentPricing.fixedRates.businessCardPrint : 0.012;
      backSideCost = qty * bcRate;
    } else {
      const backSideRate = currentPricing.paperGsmRates[selectedGsm]['backSide'] || 0;
      backSideCost = sheetsNeeded * backSideRate;
    }
  }

  // 7. Extras calculations
  const optLamination = document.getElementById('extraLamination').checked;
  const optPlotter = document.getElementById('extraPlotter').checked;
  const optFolding = document.getElementById('extraFolding').checked;
  const optPasting = document.getElementById('extraPasting').checked;
  const optHandleRope = document.getElementById('extraHandleRope').checked;
  const optPacking = document.getElementById('extraPacking').checked;

  // Check size-specific availability for extras
  // Lamination: Size only 70x33, 50x33, A3
  const lamRate = currentPricing.laminationRates[sizeLabel] || 0;
  const plotterRate = currentPricing.plotterRates[sizeLabel] || 0;

  // Update label text dynamically
  document.getElementById('laminationPriceText').innerText = 
    lamRate > 0 ? `${lamRate.toFixed(2)} SR / sheet` : 'Not available';
  document.getElementById('plotterPriceText').innerText = 
    plotterRate > 0 ? `${plotterRate.toFixed(2)} SR / sheet` : 'Not available';

  // Lamination & Plotter apply per sheet
  const optLaminationBothSides = document.getElementById('laminationBothSides') && document.getElementById('laminationBothSides').checked;
  const lamMultiplier = optLaminationBothSides ? 2 : 1;
  const lamCost = optLamination && lamRate > 0 ? sheetsNeeded * lamRate * lamMultiplier : 0;
  const plotterCost = optPlotter && plotterRate > 0 ? sheetsNeeded * plotterRate : 0;

  // Folding & Pasting apply per piece
  const foldingCost = optFolding ? qty * currentPricing.fixedRates.folding : 0;
  const pastingCost = optPasting ? qty * currentPricing.fixedRates.pasting : 0;

  // Handle Rope applies per piece (bag)
  const ropeCost = optHandleRope ? qty * currentPricing.fixedRates.rope : 0;

  // Packing cost: 5 SR per 100 pieces (or packet)
  const packets = Math.ceil(qty / 100);
  const packingCost = optPacking ? packets * currentPricing.fixedRates.packing : 0;

  // 8. Discount Tier Matching (based on sheetsNeeded instead of pieces qty, or qty > 1700 for business cards)
  let discountPercent = 0;
  if (isBcMode && qty > 1700) {
    discountPercent = 5;
  } else {
    currentPricing.discountTiers.forEach(tier => {
      if (sheetsNeeded >= tier.min && sheetsNeeded <= tier.max) {
        discountPercent = tier.discount;
      }
    });
  }

  // Apply discount to the print + paper base cost only (including back side)
  const discountVal = ((baseCostTotal + backSideCost) * discountPercent) / 100;
  const discountedBaseCost = (baseCostTotal + backSideCost) - discountVal;

  // Polar Cutting option
  const optPolarCutting = document.getElementById('extraPolarCutting') && document.getElementById('extraPolarCutting').checked;
  const polarCuttingRate = parseFloat(document.getElementById('polarCuttingRateInput').value) || 0;
  const polarCuttingCost = optPolarCutting ? sheetsNeeded * polarCuttingRate : 0;

  // Update Polar Cutting dynamic text in UI
  const polarCuttingPriceText = document.getElementById('polarCuttingPriceText');
  if (polarCuttingPriceText) {
    polarCuttingPriceText.innerText = `${polarCuttingRate.toFixed(2)} SR / sheet`;
  }

  // Die Cutting options
  const optDieCylinder = document.getElementById('extraDieCylinder') && document.getElementById('extraDieCylinder').checked;
  const dieCylinderRate = parseFloat(document.getElementById('dieCylinderRateInput').value) || 0;
  const dieCylinderCost = optDieCylinder ? sheetsNeeded * dieCylinderRate : 0;

  const dieCylinderPriceText = document.getElementById('dieCylinderPriceText');
  if (dieCylinderPriceText) {
    dieCylinderPriceText.innerText = `${dieCylinderRate.toFixed(2)} SR / sheet`;
  }

  const optDieManual = document.getElementById('extraDieManual') && document.getElementById('extraDieManual').checked;
  const dieManualRate = parseFloat(document.getElementById('dieManualRateInput').value) || 0;
  const dieManualCost = optDieManual ? sheetsNeeded * dieManualRate : 0;

  const dieManualPriceText = document.getElementById('dieManualPriceText');
  if (dieManualPriceText) {
    dieManualPriceText.innerText = `${dieManualRate.toFixed(2)} SR / sheet`;
  }

  // Plastic Window option
  const optPlastic = document.getElementById('extraPlastic') && document.getElementById('extraPlastic').checked;
  const plasticDetailsRow = document.getElementById('plasticDetailsRow');
  if (plasticDetailsRow) {
    if (optPlastic) {
      plasticDetailsRow.classList.remove('hidden');
    } else {
      plasticDetailsRow.classList.add('hidden');
    }
  }

  let plasticMatCost = 0;
  let plasticDiecutCost = 0;
  let plasticTotalCost = 0;
  let plasticUps = 0;
  let plasticSheets = 0;
  let micronRate = 1.38;

  if (optPlastic) {
    const p_l = parseFloat(document.getElementById('plasticLength').value) || 1;
    const p_w = parseFloat(document.getElementById('plasticWidth').value) || 1;
    
    const micronSelect = document.getElementById('plasticMicron');
    if (micronSelect && micronSelect.selectedOptions && micronSelect.selectedOptions[0]) {
      micronRate = parseFloat(micronSelect.selectedOptions[0].getAttribute('data-rate')) || 1.38;
    }

    const diecutRatePerThousand = parseFloat(document.getElementById('plasticDiecutRate').value) || 450.00;

    // Calculate Plastic UPS on 100x70 cm Sheet (testing horizontal vs vertical rotation)
    const cols_A = Math.floor(100 / p_l);
    const rows_A = Math.floor(70 / p_w);
    const ups_A = cols_A * rows_A;

    const cols_B = Math.floor(100 / p_w);
    const rows_B = Math.floor(70 / p_l);
    const ups_B = cols_B * rows_B;

    plasticUps = Math.max(ups_A, ups_B, 1);
    const plasticBestDir = ups_A >= ups_B ? 'Horizontal (100x70)' : 'Vertical Rotated (100x70)';

    plasticSheets = Math.ceil(qty / plasticUps);
    plasticMatCost = plasticSheets * micronRate;
    plasticDiecutCost = (qty / 1000) * diecutRatePerThousand;
    plasticTotalCost = plasticMatCost + plasticDiecutCost;

    const calcNotice = document.getElementById('plasticCalcNotice');
    if (calcNotice) {
      calcNotice.innerHTML = `
        <strong>Plastic Sheet Yield (100x70 cm):</strong> <span style="color: var(--accent-green); font-weight: 700;">${plasticUps} UPS</span> (${plasticBestDir})<br>
        <strong>Sheets Needed:</strong> ${plasticSheets} sheets | <strong>Material (${micronRate.toFixed(2)} SR):</strong> ${plasticMatCost.toFixed(2)} SR | <strong>Diecut (${diecutRatePerThousand.toFixed(2)} SR/1000):</strong> ${plasticDiecutCost.toFixed(2)} SR
      `;
    }

    const plasticSummaryText = document.getElementById('plasticSummaryText');
    if (plasticSummaryText) {
      plasticSummaryText.innerText = `${plasticTotalCost.toFixed(2)} SR (${plasticSheets} sheets @ ${micronRate.toFixed(2)} SR + Diecut ${plasticDiecutCost.toFixed(2)} SR)`;
    }
  }

  // Pre-Press Setup: Design Charge & Color Charge
  const optDesign = document.getElementById('extraDesignCharge') && document.getElementById('extraDesignCharge').checked;
  const designCost = optDesign ? (parseFloat(document.getElementById('designChargeInput').value) || 0) : 0;
  const designSummaryText = document.getElementById('designChargeSummaryText');
  if (designSummaryText) {
    designSummaryText.innerText = optDesign ? `${designCost.toFixed(2)} SR` : 'Manual input';
  }

  const optColor = document.getElementById('extraColorCharge') && document.getElementById('extraColorCharge').checked;
  const colorDetailsRow = document.getElementById('colorChargeDetailsRow');
  if (colorDetailsRow) {
    if (optColor) {
      colorDetailsRow.classList.remove('hidden');
    } else {
      colorDetailsRow.classList.add('hidden');
    }
  }

  const colorCount = optColor ? (parseInt(document.getElementById('colorCountInput').value) || 1) : 0;
  const colorRate = optColor ? (parseFloat(document.getElementById('colorRateInput').value) || 0) : 0;
  const colorCost = optColor ? (colorCount * colorRate) : 0;

  const colorNotice = document.getElementById('colorChargeNotice');
  if (colorNotice && optColor) {
    colorNotice.innerHTML = `<strong>Total Print Colors Charge:</strong> ${colorCost.toFixed(2)} SR (${colorCount} colors @ ${colorRate.toFixed(2)} SR/color)`;
  }
  const colorSummaryText = document.getElementById('colorChargeSummaryText');
  if (colorSummaryText) {
    colorSummaryText.innerText = optColor ? `${colorCost.toFixed(2)} SR (${colorCount} colors @ ${colorRate.toFixed(2)} SR)` : 'Specify color count & price per color';
  }

  // Total invoice cost
  const totalCost = discountedBaseCost + polarCuttingCost + dieCylinderCost + dieManualCost + designCost + colorCost + lamCost + plotterCost + foldingCost + pastingCost + ropeCost + packingCost + plasticTotalCost;
  const unitCost = qty > 0 ? totalCost / qty : 0;


  // 9. Update UI Invoice card
  document.getElementById('jobTypeBadge').innerText = currentJobType === 'paper' ? (isBcMode ? 'Business Card Job' : 'Paper Job') : 'Sticker Job';
  document.getElementById('gsmBadge').innerText = specName;

  document.getElementById('invSheetSize').innerText = `${S_W} x ${S_H} cm (${isPortraitOrientation ? 'Portrait' : 'Landscape'})`;
  if (sideFold > 0) {
    document.getElementById('invCutSize').innerText = `${effective_w.toFixed(2)} x ${effective_h.toFixed(2)} cm (Box Base: ${i_w} x ${i_h} cm)`;
  } else {
    document.getElementById('invCutSize').innerText = `${i_w} x ${i_h} cm`;
  }
  document.getElementById('invLayoutType').innerText = activeDirection === 'horizontal' ? 'Standard Layout (Horizontal)' : 'Rotated Layout (Vertical)';
  document.getElementById('invQty').innerText = `${qty} pcs`;


  if (isBcMode) {
    document.getElementById('invRowBaseCost').classList.add('hidden');
    
    const rowA3 = document.getElementById('invRowA3Sheet');
    rowA3.classList.remove('hidden');
    document.getElementById('invA3SheetCost').innerText = `${a3SheetCostTotal.toFixed(2)} SR (${sheetsNeeded} sheets @ ${baseSheetPrice.toFixed(2)} SR)`;
    
    const rowBc = document.getElementById('invRowBcPrint');
    rowBc.classList.remove('hidden');
    const bcRate = currentPricing.fixedRates.businessCardPrint !== undefined ? currentPricing.fixedRates.businessCardPrint : 0.012;
    document.getElementById('invBcPrintCost').innerText = `${bcPrintCostTotal.toFixed(2)} SR (${qty} pcs @ ${bcRate.toFixed(3)} SR)`;
  } else {
    document.getElementById('invRowBaseCost').classList.remove('hidden');
    document.getElementById('invRowA3Sheet').classList.add('hidden');
    document.getElementById('invRowBcPrint').classList.add('hidden');
    document.getElementById('invBaseCost').innerText = `${baseCostTotal.toFixed(2)} SR (${sheetsNeeded} sheets @ ${baseSheetPrice.toFixed(2)} SR)`;
  }

  // Polar Cutting Invoice Row
  toggleInvoiceRow('invRowBcCut', optPolarCutting, 'invBcCutCost', polarCuttingCost);
  if (optPolarCutting) {
    document.getElementById('invBcCutCost').innerText = `${polarCuttingCost.toFixed(2)} SR (${sheetsNeeded} sheets @ ${polarCuttingRate.toFixed(2)} SR)`;
  }

  // Die Cutting Invoice Rows
  toggleInvoiceRow('invRowDieCylinder', optDieCylinder, 'invDieCylinderCost', dieCylinderCost);
  if (optDieCylinder) {
    document.getElementById('invDieCylinderCost').innerText = `${dieCylinderCost.toFixed(2)} SR (${sheetsNeeded} sheets @ ${dieCylinderRate.toFixed(2)} SR)`;
  }

  toggleInvoiceRow('invRowDieManual', optDieManual, 'invDieManualCost', dieManualCost);
  if (optDieManual) {
    document.getElementById('invDieManualCost').innerText = `${dieManualCost.toFixed(2)} SR (${sheetsNeeded} sheets @ ${dieManualRate.toFixed(2)} SR)`;
  }

  // Pre-Press Setup Invoice Rows
  toggleInvoiceRow('invRowDesign', optDesign && designCost > 0, 'invDesignCost', designCost);
  if (optDesign && designCost > 0) {
    document.getElementById('invDesignCost').innerText = `${designCost.toFixed(2)} SR`;
  }

  toggleInvoiceRow('invRowColor', optColor && colorCost > 0, 'invColorCost', colorCost);
  if (optColor && colorCost > 0) {
    document.getElementById('invColorCost').innerText = `${colorCost.toFixed(2)} SR (${colorCount} colors @ ${colorRate.toFixed(2)} SR)`;
  }

  
  // Show / Hide rows depending on whether they have costs or are selected
  toggleInvoiceRow('invRowLamination', optLamination && lamRate > 0, 'invLaminationCost', lamCost);
  if (optLamination && lamRate > 0) {
    const sideText = optLaminationBothSides ? 'Both Sides / وجهين' : 'One Side / وجه واحد';
    document.getElementById('invLaminationCost').innerText = `${lamCost.toFixed(2)} SR (${sheetsNeeded} sheets @ ${lamRate.toFixed(2)} SR [${sideText}])`;
  }
  toggleInvoiceRow('invRowPlotter', optPlotter && plotterRate > 0, 'invPlotterCost', plotterCost);
  toggleInvoiceRow('invRowFolding', optFolding, 'invFoldingCost', foldingCost);
  toggleInvoiceRow('invRowPasting', optPasting, 'invPastingCost', pastingCost);
  toggleInvoiceRow('invRowRope', optHandleRope, 'invRopeCost', ropeCost);
  toggleInvoiceRow('invRowPacking', optPacking, 'invPackingCost', packingCost);

  // Plastic Window Invoice Row
  toggleInvoiceRow('invRowPlastic', optPlastic, 'invPlasticCost', plasticTotalCost);
  if (optPlastic) {
    document.getElementById('invPlasticCost').innerText = `${plasticTotalCost.toFixed(2)} SR (${plasticSheets} sheets @ ${micronRate.toFixed(2)} SR + Diecut ${plasticDiecutCost.toFixed(2)} SR [${plasticUps} UPS])`;
  }


  // Back Side Print Row
  toggleInvoiceRow('invRowBackSide', optBackSide, 'invBackSideCost', backSideCost);
  if (optBackSide) {
    if (isBcMode) {
      const bcRate = currentPricing.fixedRates.businessCardPrint !== undefined ? currentPricing.fixedRates.businessCardPrint : 0.012;
      document.getElementById('invBackSideCost').innerText = `${backSideCost.toFixed(2)} SR (${qty} pcs @ ${bcRate.toFixed(3)} SR)`;
    } else {
      const backSideRate = currentPricing.paperGsmRates[selectedGsm]['backSide'] || 0;
      document.getElementById('invBackSideCost').innerText = `${backSideCost.toFixed(2)} SR (${sheetsNeeded} sheets @ ${backSideRate.toFixed(2)} SR)`;
    }
  }

  // Discount
  const discountRow = document.getElementById('invRowDiscount');
  if (discountPercent > 0) {
    discountRow.classList.remove('hidden');
    const labelSuffix = (isBcMode && qty > 1700) ? ' - Qty > 1700' : '';
    document.getElementById('invDiscountPercent').innerText = `${discountPercent}%${labelSuffix}`;
    document.getElementById('invDiscountVal').innerText = `-${discountVal.toFixed(2)} SR`;
  } else {
    discountRow.classList.add('hidden');
  }

  // Totals
  document.getElementById('invTotalVal').innerText = `${totalCost.toFixed(2)} SR`;
  document.getElementById('invUnitCostVal').innerText = `${unitCost.toFixed(3)} SR`;
}

// Invoice row helper
function toggleInvoiceRow(rowId, show, valId, costVal) {
  const row = document.getElementById(rowId);
  if (show) {
    row.classList.remove('hidden');
    document.getElementById(valId).innerText = `${costVal.toFixed(2)} SR`;
  } else {
    row.classList.add('hidden');
  }
}

// Render Comparison Table rows
function renderComparisonTable(layout, bestDirection, activeDirection) {
  const tbody = document.getElementById('comparisonTableBody');
  tbody.innerHTML = '';

  const directions = [
    { key: 'horizontal', label: 'Horizontal Arrangement (Standard / أفقي)' },
    { key: 'vertical', label: 'Vertical Arrangement (Rotated / عمودي)' }
  ];

  directions.forEach(dir => {
    const data = layout[dir.key];
    const tr = document.createElement('tr');
    
    if (dir.key === activeDirection) {
      tr.className = 'better-option';
    }

    let statusHtml = '';
    if (dir.key === bestDirection) {
      statusHtml = '<span class="comparison-status-badge best">Max Output (Best)</span>';
    } else {
      statusHtml = '<span class="comparison-status-badge alt">Alternative</span>';
    }

    tr.innerHTML = `
      <td><strong>${dir.label}</strong></td>
      <td>${data.ups} ups</td>
      <td>${data.wastagePercent.toFixed(1)}%</td>
      <td>${statusHtml}</td>
    `;

    // Click to toggle orientation
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', () => {
      userForcedOrientation = dir.key;
      calculateAndUpdate();
    });

    tbody.appendChild(tr);
  });
}

// --- RENDER VISUAL SVG PREVIEW ---
function renderLayoutSvg(S_W, S_H, activeLayout, activeDirection, origW = 0, origH = 0, sideFold = 0) {
  const svg = document.getElementById('layoutSvg');
  svg.innerHTML = '';

  // Setup SVG dimensions and margins
  const svgWidth = 800;
  const svgHeight = 400;
  const margin = 40;

  // Available canvas box
  const viewW = svgWidth - (margin * 2);
  const viewH = svgHeight - (margin * 2);

  // Compute scaling factor to fit sheet (S_W, S_H) into (viewW, viewH)
  const scaleX = viewW / S_W;
  const scaleY = viewH / S_H;
  const scale = Math.min(scaleX, scaleY);

  // Scaled dimensions
  const drawSheetW = S_W * scale;
  const drawSheetH = S_H * scale;

  // Centering offsets
  const offsetX = margin + (viewW - drawSheetW) / 2;
  const offsetY = margin + (viewH - drawSheetH) / 2;

  // Add hatching pattern definitions for wastage
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <pattern id="wastageHatchPattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#f43f5e" stroke-width="2" opacity="0.3" />
    </pattern>
  `;
  svg.appendChild(defs);

  // 1. Draw Sheet Wastage Background (Hatched red representing waste base)
  const wasteRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  wasteRect.setAttribute("x", offsetX);
  wasteRect.setAttribute("y", offsetY);
  wasteRect.setAttribute("width", drawSheetW);
  wasteRect.setAttribute("height", drawSheetH);
  wasteRect.setAttribute("class", "svg-wastage-hatch");
  svg.appendChild(wasteRect);

  // 2. Draw Sheet Outline
  const sheetRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  sheetRect.setAttribute("x", offsetX);
  sheetRect.setAttribute("y", offsetY);
  sheetRect.setAttribute("width", drawSheetW);
  sheetRect.setAttribute("height", drawSheetH);
  sheetRect.setAttribute("fill", "none");
  sheetRect.setAttribute("stroke", "#9ca3af");
  sheetRect.setAttribute("stroke-width", "2");
  svg.appendChild(sheetRect);

  // 3. Draw Ups Grid
  const cols = activeLayout.cols;
  const rows = activeLayout.rows;
  const itemW = activeLayout.itemW;
  const itemH = activeLayout.itemH;

  const drawItemW = itemW * scale;
  const drawItemH = itemH * scale;

  let upCounter = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const upX = offsetX + (c * drawItemW);
      const upY = offsetY + (r * drawItemH);

      // Create grouping for hover effects and clean structures
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", upX);
      rect.setAttribute("y", upY);
      rect.setAttribute("width", drawItemW);
      rect.setAttribute("height", drawItemH);
      rect.setAttribute("class", "svg-up-box");
      group.appendChild(rect);

      // If box wall fold applies, draw dashed inner box base outline
      if (sideFold > 0) {
        const foldOffset = sideFold * scale;
        const innerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        innerRect.setAttribute("x", upX + foldOffset);
        innerRect.setAttribute("y", upY + foldOffset);
        innerRect.setAttribute("width", Math.max(0, drawItemW - (2 * foldOffset)));
        innerRect.setAttribute("height", Math.max(0, drawItemH - (2 * foldOffset)));
        innerRect.setAttribute("fill", "rgba(212, 175, 55, 0.15)");
        innerRect.setAttribute("stroke", "#d4af37");
        innerRect.setAttribute("stroke-width", "1.5");
        innerRect.setAttribute("stroke-dasharray", "3 3");
        group.appendChild(innerRect);
      }

      // Add label inside each piece
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", upX + (drawItemW / 2));
      text.setAttribute("y", upY + (drawItemH / 2));
      text.setAttribute("class", "svg-up-label");

      text.textContent = upCounter;
      group.appendChild(text);

      svg.appendChild(group);
      upCounter++;
    }
  }

  // 4. Draw Ruler/Dimensions text around the sheet
  // Width dimension (Top)
  const textWidth = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textWidth.setAttribute("x", offsetX + (drawSheetW / 2));
  textWidth.setAttribute("y", offsetY - 12);
  textWidth.setAttribute("class", "svg-sheet-dim");
  textWidth.setAttribute("text-anchor", "middle");
  textWidth.textContent = `Sheet Width: ${S_W} cm`;
  svg.appendChild(textWidth);

  // Height dimension (Left)
  const textHeight = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textHeight.setAttribute("x", offsetX - 12);
  textHeight.setAttribute("y", offsetY + (drawSheetH / 2));
  textHeight.setAttribute("class", "svg-sheet-dim");
  textHeight.setAttribute("text-anchor", "middle");
  textHeight.setAttribute("transform", `rotate(-90 ${offsetX - 12} ${offsetY + (drawSheetH / 2)})`);
  textHeight.textContent = `Sheet Height: ${S_H} cm`;
  svg.appendChild(textHeight);

  // Item dimension overlay on the first item (if exists)
  if (cols > 0 && rows > 0) {
    const textItemDim = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textItemDim.setAttribute("x", offsetX + (drawItemW / 2));
    textItemDim.setAttribute("y", offsetY + drawItemH + 15);
    textItemDim.setAttribute("fill", "#10b981");
    textItemDim.setAttribute("font-size", "9px");
    textItemDim.setAttribute("font-weight", "600");
    textItemDim.setAttribute("text-anchor", "middle");
    textItemDim.textContent = `${itemW} x ${itemH} cm`;
    svg.appendChild(textItemDim);
  }
}

// --- T-SHIRT & CUP ESTIMATOR FUNCTIONS ---

function updateLaserUps() {
  const productSelect = document.getElementById('tshirtCupProduct');
  if (!productSelect) return;
  const product = productSelect.value;
  const laserPrintSelect = document.getElementById('tshirtLaserPrint');
  if (!laserPrintSelect) return;
  const laserPrint = laserPrintSelect.value;
  const laserDetailsRow = document.getElementById('laserDetailsRow');
  
  if (product === 'cup' || laserPrint === 'none') {
    if (laserDetailsRow) laserDetailsRow.classList.add('hidden');
    return;
  }
  
  if (laserDetailsRow) laserDetailsRow.classList.remove('hidden');
  
  const laserWidthInput = document.getElementById('laserWidth');
  const laserHeightInput = document.getElementById('laserHeight');
  const laserUpsInput = document.getElementById('laserUps');
  
  if (!laserWidthInput || !laserHeightInput || !laserUpsInput) return;
  
  const w = parseFloat(laserWidthInput.value) || 1;
  const h = parseFloat(laserHeightInput.value) || 1;
  
  let sheetW = 42;
  let sheetH = 29.7;
  
  if (laserPrint === 'A4') {
    sheetW = 29.7;
    sheetH = 21;
  }
  
  const layout = calculateLayoutOptions(sheetW, sheetH, w, h);
  const bestUps = Math.max(layout.horizontal.ups, layout.vertical.ups);
  
  if (document.activeElement !== laserUpsInput) {
    laserUpsInput.value = bestUps || 1;
  }
}

function drawTshirtSvg(laserSize, transferSize) {
  let printAreaHtml = '';
  if (laserSize !== 'none' || transferSize !== 'none') {
    let labelText = '';
    if (laserSize !== 'none') labelText += `Laser: ${laserSize}`;
    if (transferSize !== 'none') {
      if (labelText) labelText += ' + ';
      labelText += `Trans: ${transferSize}`;
    }
    // A dotted print area overlay on the chest of the T-shirt
    printAreaHtml = `
      <g>
        <rect x="70" y="65" width="60" height="70" class="svg-print-area" rx="4" />
        <text x="100" y="100" class="svg-print-label" font-size="7">${labelText}</text>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 200 200" style="width: 100%; height: 100%; max-height: 250px;">
      <!-- Stylized Tshirt Path -->
      <path d="M 60,30 
               C 80,35 120,35 140,30 
               L 165,55 
               C 155,65 145,70 140,65 
               L 140,170 
               C 140,175 60,175 60,170 
               L 60,65 
               C 55,70 45,65 35,55 
               Z" 
            class="svg-product-base" />
      <!-- Neck cutout -->
      <path d="M 85,32.5 C 90,45 110,45 115,32.5 Z" fill="#0b0f19" stroke="#4b5563" stroke-width="1.5" />
      ${printAreaHtml}
    </svg>
  `;
}

function drawCupSvg(transferType) {
  let printAreaHtml = '';
  if (transferType !== 'none') {
    const labelText = transferType === 'FULL_PART' ? 'Full Print' : 'Small Print';
    const rectWidth = transferType === 'FULL_PART' ? 70 : 40;
    const rectX = 100 - (rectWidth / 2);
    printAreaHtml = `
      <g>
        <rect x="${rectX}" y="65" width="${rectWidth}" height="80" class="svg-print-area" rx="4" />
        <text x="100" y="105" class="svg-print-label" font-size="8">${labelText}</text>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 200 200" style="width: 100%; height: 100%; max-height: 250px;">
      <!-- Handle -->
      <path d="M 55,70 C 20,70 20,130 55,130" fill="none" stroke="#4b5563" stroke-width="8" />
      <path d="M 55,75 C 27,75 27,125 55,125" fill="none" stroke="#0b0f19" stroke-width="4" />
      <!-- Cup Body -->
      <path d="M 55,50 L 145,50 C 145,50 150,140 145,150 C 140,160 60,160 55,150 C 50,140 55,50 55,50 Z" class="svg-product-base" />
      <!-- Cup rim ellipse -->
      <ellipse cx="100" cy="50" rx="45" ry="8" fill="#111827" stroke="#4b5563" stroke-width="1.5" />
      ${printAreaHtml}
    </svg>
  `;
}

function calculateTshirtCupAndUpdate() {
  const product = document.getElementById('tshirtCupProduct').value;
  const qty = parseInt(document.getElementById('tshirtCupQty').value) || 1;
  const container = document.getElementById('productSvgContainer');
  const label = document.getElementById('tshirtCupPreviewLabel');

  // Hide paper invoice rows
  document.getElementById('invRowBaseCost').classList.add('hidden');
  document.getElementById('invRowA3Sheet').classList.add('hidden');
  document.getElementById('invRowBcPrint').classList.add('hidden');
  const rowBcCut = document.getElementById('invRowBcCut');
  if (rowBcCut) rowBcCut.classList.add('hidden');
  const rowDieCylinder = document.getElementById('invRowDieCylinder');
  if (rowDieCylinder) rowDieCylinder.classList.add('hidden');
  const rowDieManual = document.getElementById('invRowDieManual');
  if (rowDieManual) rowDieManual.classList.add('hidden');
  document.getElementById('invRowBackSide').classList.add('hidden');
  document.getElementById('invRowLamination').classList.add('hidden');
  document.getElementById('invRowPlotter').classList.add('hidden');
  document.getElementById('invRowFolding').classList.add('hidden');
  document.getElementById('invRowPasting').classList.add('hidden');
  document.getElementById('invRowRope').classList.add('hidden');
  document.getElementById('invRowPacking').classList.add('hidden');
  document.getElementById('invRowDiscount').classList.add('hidden');

  let totalCost = 0;
  let specName = "";
  let badgeName = "";

  if (product === 'tshirt') {
    badgeName = "T-Shirt Job";
    const size = document.getElementById('tshirtSize').value;
    const cloth = document.getElementById('tshirtCloth').value;

    const clothNames = {
      cotton: 'Cotton / قطن',
      polyester: 'Polyester / بوليستر',
      linen: 'Linen / كتان',
      flannel: 'Flannel / فلانيل',
      silk: 'Silk / حرير',
      blends: 'Blends (polyester and cotton) / مخلوط'
    };
    const clothLabel = clothNames[cloth] || cloth;
    specName = `${clothLabel.split(' / ')[0]} (${size})`;

    if (label) label.innerText = `T-Shirt Graphic Preview`;

    const tshirtBasePrice = (currentPricing.tshirtClothSizeRates && currentPricing.tshirtClothSizeRates[cloth] && currentPricing.tshirtClothSizeRates[cloth][size]) || currentPricing.tshirtSizeRates[size] || 0;
    const laserPrint = document.getElementById('tshirtLaserPrint').value;
    const laserPrice = laserPrint === 'none' ? 0 : (currentPricing.tshirtLaserRates[laserPrint] || 0);
    const laserUps = parseInt(document.getElementById('laserUps').value) || 1;
    const laserPricePerPc = laserPrint === 'none' ? 0 : (laserPrice / laserUps);

    const transfer = document.getElementById('tshirtTransfer').value;
    const transferPrice = transfer === 'none' ? 0 : (currentPricing.tshirtTransferRates[transfer] || 0);

    const tshirtBaseTotal = tshirtBasePrice * qty;
    const laserTotal = laserPricePerPc * qty;
    const transferTotal = transferPrice * qty;
    totalCost = tshirtBaseTotal + laserTotal + transferTotal;

    // Show Tshirt Invoice Rows
    toggleInvoiceRow('invRowTshirtBase', true, 'invTshirtBaseCost', tshirtBaseTotal);
    document.getElementById('invTshirtBaseCost').innerText = `${tshirtBaseTotal.toFixed(2)} SR (${qty} pcs @ ${tshirtBasePrice.toFixed(2)} SR [${clothLabel.split(' / ')[0]}])`;
    
    toggleInvoiceRow('invRowTshirtLaser', laserPrint !== 'none', 'invTshirtLaserCost', laserTotal);
    if (laserPrint !== 'none') {
      document.getElementById('invTshirtLaserCost').innerText = `${laserTotal.toFixed(2)} SR (${qty} pcs @ ${laserPricePerPc.toFixed(2)} SR [${laserPrint} Sheet: ${laserPrice.toFixed(2)} SR / ${laserUps} ups])`;
    }

    toggleInvoiceRow('invRowTshirtTransfer', transfer !== 'none', 'invTshirtTransferCost', transferTotal);
    if (transfer !== 'none') {
      document.getElementById('invTshirtTransferCost').innerText = `${transferTotal.toFixed(2)} SR (${qty} pcs @ ${transferPrice.toFixed(2)} SR)`;
    }

    // Hide Cup rows
    document.getElementById('invRowCupBase').classList.add('hidden');
    document.getElementById('invRowCupTransfer').classList.add('hidden');

    // Draw SVG
    if (container) container.innerHTML = drawTshirtSvg(laserPrint, transfer);

    // Dynamic Sheet Layout preview for T-Shirt Print Laser
    const paperLayoutPreviewCard = document.getElementById('paperLayoutPreviewCard');
    if (laserPrint !== 'none') {
      const laserWidth = parseFloat(document.getElementById('laserWidth').value) || 1;
      const laserHeight = parseFloat(document.getElementById('laserHeight').value) || 1;
      let sheetW = 42;
      let sheetH = 29.7;
      if (laserPrint === 'A4') {
        sheetW = 29.7;
        sheetH = 21;
      }
      const layout = calculateLayoutOptions(sheetW, sheetH, laserWidth, laserHeight);
      let bestDirection = 'horizontal';
      if (layout.vertical.ups > layout.horizontal.ups) {
        bestDirection = 'vertical';
      }
      renderLayoutSvg(sheetW, sheetH, layout[bestDirection], bestDirection);
      
      if (paperLayoutPreviewCard) paperLayoutPreviewCard.classList.remove('hidden');
      document.getElementById('layoutDirectionLabel').innerText = 
        bestDirection === 'horizontal' ? 'Horizontal Setup (Original)' : 'Vertical Setup (Rotated)';
      
      const sheetsNeeded = layout[bestDirection].ups > 0 ? Math.ceil(qty / layout[bestDirection].ups) : 0;
      document.getElementById('valUps').innerText = layout[bestDirection].ups;
      document.getElementById('valSheetsNeeded').innerText = sheetsNeeded;
      document.getElementById('valWastagePercent').innerText = layout[bestDirection].wastagePercent.toFixed(1) + '%';
      document.getElementById('valWastageArea').innerHTML = layout[bestDirection].wastageArea.toFixed(1) + ' <small>cm²</small>';
    } else {
      if (paperLayoutPreviewCard) paperLayoutPreviewCard.classList.add('hidden');
    }
  } else {
    // Cup product
    badgeName = "Cup Job";
    const cupTransfer = document.getElementById('cupTransfer').value;
    const transferName = cupTransfer === 'FULL_PART' ? 'Full Part' : (cupTransfer === 'SMALL' ? 'Small Cup' : 'No Print');
    specName = transferName;
    if (label) label.innerText = `Cup Graphic Preview`;

    const cupBasePrice = currentPricing.cupBaseRate || 0;
    const transferPrice = cupTransfer === 'none' ? 0 : (currentPricing.cupTransferRates[cupTransfer] || 0);

    const cupBaseTotal = cupBasePrice * qty;
    const transferTotal = transferPrice * qty;
    totalCost = cupBaseTotal + transferTotal;

    // Show Cup Invoice Rows
    toggleInvoiceRow('invRowCupBase', true, 'invCupBaseCost', cupBaseTotal);
    document.getElementById('invCupBaseCost').innerText = `${cupBaseTotal.toFixed(2)} SR (${qty} pcs @ ${cupBasePrice.toFixed(2)} SR)`;
    
    toggleInvoiceRow('invRowCupTransfer', cupTransfer !== 'none', 'invCupTransferCost', transferTotal);
    if (cupTransfer !== 'none') {
      document.getElementById('invCupTransferCost').innerText = `${transferTotal.toFixed(2)} SR (${qty} pcs @ ${transferPrice.toFixed(2)} SR)`;
    }

    // Hide Tshirt rows
    document.getElementById('invRowTshirtBase').classList.add('hidden');
    document.getElementById('invRowTshirtLaser').classList.add('hidden');
    document.getElementById('invRowTshirtTransfer').classList.add('hidden');

    // Hide laser preview layout for Cup
    const paperLayoutPreviewCard = document.getElementById('paperLayoutPreviewCard');
    if (paperLayoutPreviewCard) paperLayoutPreviewCard.classList.add('hidden');

    // Draw SVG
    if (container) container.innerHTML = drawCupSvg(cupTransfer);
  }

  let discountVal = 0;
  let finalTotal = totalCost;
  let discountPercent = 0;

  if (qty > 10) {
    discountPercent = 10;
    discountVal = totalCost * 0.10;
    finalTotal = totalCost - discountVal;
  }

  const unitCost = qty > 0 ? finalTotal / qty : 0;

  // Show/Hide Discount row
  const rowDiscount = document.getElementById('invRowDiscount');
  if (rowDiscount) {
    if (discountPercent > 0) {
      rowDiscount.classList.remove('hidden');
      document.getElementById('invDiscountPercent').innerText = `${discountPercent}%`;
      document.getElementById('invDiscountVal').innerText = `-${discountVal.toFixed(2)} SR`;
    } else {
      rowDiscount.classList.add('hidden');
    }
  }

  // Update badge details
  document.getElementById('jobTypeBadge').innerText = badgeName;
  document.getElementById('gsmBadge').innerText = specName;

  document.getElementById('invSheetSize').innerText = "N/A";
  document.getElementById('invCutSize').innerText = "N/A";
  document.getElementById('invLayoutType').innerText = "N/A";
  document.getElementById('invQty').innerText = `${qty} pcs`;

  document.getElementById('invTotalVal').innerText = `${finalTotal.toFixed(2)} SR`;
  document.getElementById('invUnitCostVal').innerText = `${unitCost.toFixed(3)} SR`;
}

// --- Quantity Tiered Surcharge & Volume Discount Pricing Logic ---
function getQuantityPriceMultiplier(qty) {
  if (typeof currentPricing !== 'undefined' && currentPricing.quantityTiers && currentPricing.quantityTiers.length > 0) {
    for (let i = 0; i < currentPricing.quantityTiers.length; i++) {
      const tier = currentPricing.quantityTiers[i];
      const maxVal = (tier.max === Infinity || tier.max === null || tier.max === undefined || tier.max === '') ? Infinity : tier.max;
      if (qty >= tier.min && qty <= maxVal) {
        return tier.multiplier;
      }
    }
  }

  if (qty >= 1 && qty <= 3) {
    return 2.5; // 1 to 3 Pcs: 2.5x multiplier (+150% markup based on 100 Pcs unit cost)
  } else if (qty >= 4 && qty <= 10) {
    return 2.0; // 4 to 10 Pcs: 2.0x multiplier (+100% markup)
  } else if (qty >= 11 && qty <= 25) {
    return 1.8; // 11 to 25 Pcs: 1.8x multiplier (+80% markup)
  } else if (qty >= 26 && qty <= 50) {
    return 1.5; // 26 to 50 Pcs: 1.5x multiplier (+50% markup)
  } else if (qty >= 51 && qty <= 75) {
    return 1.3; // 51 to 75 Pcs: 1.3x multiplier (+30% markup)
  } else if (qty >= 76 && qty <= 99) {
    return 1.1; // 76 to 99 Pcs: 1.1x multiplier (+10% markup)
  } else if (qty >= 100 && qty <= 249) {
    return 1.0; // 100 to 249 Pcs: Standard 100 Pcs Base Rate (1.0x)
  } else if (qty >= 250 && qty <= 500) {
    return 0.95; // 250 to 500 Pcs: Minus 0.05 (0.95x / -5% discount)
  } else if (qty >= 501 && qty <= 1000) {
    return 0.90; // 501 to 1000 Pcs: Minus 0.10 (0.90x / -10% discount)
  } else if (qty >= 1001 && qty <= 5000) {
    return 0.85; // 1001 to 5000 Pcs: Minus 0.15 (0.85x / -15% discount)
  } else if (qty >= 5001) {
    return 0.80; // 5001+ Pcs: Minus 0.20 (0.80x / -20% discount)
  } else {
    return 1.0;
  }
}



function calculateDigitalBagPrice(qty, basePrice = 5.20) {
  const multiplier = getQuantityPriceMultiplier(qty);
  const pricePerPiece = basePrice * multiplier;

  return {
    multiplier: multiplier,
    unitPrice: pricePerPiece.toFixed(2),
    totalCost: (qty * pricePerPiece).toFixed(2)
  };
}

// --- 3D Box Rendering Function with Wall Thickness Support ---
function drawDigital3DBox(L, W, H, T) {
  const container = document.getElementById("digitalBox3dContainer");
  if (!container) return;

  L = parseFloat(L) || 0;
  W = parseFloat(W) || 0;
  H = parseFloat(H) || 0;
  T = parseFloat(T) || 0;

  if (L <= 0 || W <= 0) {
    container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 20px;">Please enter valid box dimensions</div>';
    return;
  }

  const displayH = H > 0 ? H : 4;
  const svgWidth = 380;
  const svgHeight = 250;
  
  const cos30 = 0.866;
  const sin30 = 0.5;

  // 3D Vertices for Outer Box
  const p3d = [
    [0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0],
    [0, 0, displayH], [L, 0, displayH], [L, W, displayH], [0, W, displayH]
  ];

  const p2d = p3d.map(([x, y, z]) => ({
    x: (x - y) * cos30,
    y: (x + y) * sin30 - z
  }));

  // Inner Box Vertices offset by Wall Thickness (T) if T > 0
  let p2dInner = null;
  if (T > 0 && T < Math.min(L, W) / 2) {
    const inL = L - 2 * T;
    const inW = W - 2 * T;
    const in3d = [
      [T, T, 0], [T + inL, T, 0], [T + inL, T + inW, 0], [T, T + inW, 0],
      [T, T, displayH], [T + inL, T, displayH], [T + inL, T + inW, displayH], [T, T + inW, displayH]
    ];
    p2dInner = in3d.map(([x, y, z]) => ({
      x: (x - y) * cos30,
      y: (x + y) * sin30 - z
    }));
  }

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  p2d.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const boxW = maxX - minX || 1;
  const boxH = maxY - minY || 1;

  const scale = Math.min((svgWidth - 80) / boxW, (svgHeight - 80) / boxH);
  const cx = svgWidth / 2 - ((minX + maxX) / 2) * scale;
  const cy = svgHeight / 2 - ((minY + maxY) / 2) * scale;

  const pts = p2d.map(p => ({
    x: (p.x * scale + cx).toFixed(1),
    y: (p.y * scale + cy).toFixed(1)
  }));

  let inPts = null;
  if (p2dInner) {
    inPts = p2dInner.map(p => ({
      x: (p.x * scale + cx).toFixed(1),
      y: (p.y * scale + cy).toFixed(1)
    }));
  }

  let innerSvgLines = '';
  if (inPts) {
    innerSvgLines = `
      <!-- Inner Wall Offset (Wall Thickness T) -->
      <polygon points="${inPts[4].x},${inPts[4].y} ${inPts[5].x},${inPts[5].y} ${inPts[6].x},${inPts[6].y} ${inPts[7].x},${inPts[7].y}" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 2"/>
      <line x1="${pts[4].x}" y1="${pts[4].y}" x2="${inPts[4].x}" y2="${inPts[4].y}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="${pts[5].x}" y1="${pts[5].y}" x2="${inPts[5].x}" y2="${inPts[5].y}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="${pts[6].x}" y1="${pts[6].y}" x2="${inPts[6].x}" y2="${inPts[6].y}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2" />
      <line x1="${pts[7].x}" y1="${pts[7].y}" x2="${inPts[7].x}" y2="${inPts[7].y}" stroke="#f43f5e" stroke-width="1" stroke-dasharray="2 2" />
    `;
  }

  const svgHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boxGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#b89324" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="boxGradTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f3e5ab" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#d4af37" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="boxGradSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#065f46" stop-opacity="0.05"/>
        </linearGradient>
      </defs>
      
      <!-- Back wireframe lines -->
      <line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[1].x}" y2="${pts[1].y}" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[3].x}" y2="${pts[3].y}" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 3" />
      <line x1="${pts[0].x}" y1="${pts[0].y}" x2="${pts[4].x}" y2="${pts[4].y}" stroke="#4b5563" stroke-width="1.5" stroke-dasharray="4 3" />
      
      <!-- Bottom Face -->
      <polygon points="${pts[0].x},${pts[0].y} ${pts[1].x},${pts[1].y} ${pts[2].x},${pts[2].y} ${pts[3].x},${pts[3].y}" fill="none" stroke="#374151" stroke-width="1"/>

      <!-- Right/Side Face -->
      <polygon points="${pts[1].x},${pts[1].y} ${pts[2].x},${pts[2].y} ${pts[6].x},${pts[6].y} ${pts[5].x},${pts[5].y}" fill="url(#boxGradSide)" stroke="#10b981" stroke-width="1.5"/>

      <!-- Front Face -->
      <polygon points="${pts[3].x},${pts[3].y} ${pts[2].x},${pts[2].y} ${pts[6].x},${pts[6].y} ${pts[7].x},${pts[7].y}" fill="url(#boxGradFront)" stroke="#d4af37" stroke-width="1.5"/>

      <!-- Top Face -->
      <polygon points="${pts[4].x},${pts[4].y} ${pts[5].x},${pts[5].y} ${pts[6].x},${pts[6].y} ${pts[7].x},${pts[7].y}" fill="url(#boxGradTop)" stroke="#f3e5ab" stroke-width="2"/>

      ${innerSvgLines}

      <!-- Key Outer Highlight Edges -->
      <line x1="${pts[4].x}" y1="${pts[4].y}" x2="${pts[5].x}" y2="${pts[5].y}" stroke="#f3e5ab" stroke-width="2" />
      <line x1="${pts[5].x}" y1="${pts[5].y}" x2="${pts[6].x}" y2="${pts[6].y}" stroke="#d4af37" stroke-width="2" />
      <line x1="${pts[6].x}" y1="${pts[6].y}" x2="${pts[7].x}" y2="${pts[7].y}" stroke="#d4af37" stroke-width="2" />
      <line x1="${pts[7].x}" y1="${pts[7].y}" x2="${pts[4].x}" y2="${pts[4].y}" stroke="#f3e5ab" stroke-width="2" />
      <line x1="${pts[1].x}" y1="${pts[1].y}" x2="${pts[5].x}" y2="${pts[5].y}" stroke="#10b981" stroke-width="1.5" />
      <line x1="${pts[2].x}" y1="${pts[2].y}" x2="${pts[6].x}" y2="${pts[6].y}" stroke="#d4af37" stroke-width="2" />
      <line x1="${pts[3].x}" y1="${pts[3].y}" x2="${pts[7].x}" y2="${pts[7].y}" stroke="#d4af37" stroke-width="1.5" />

      <!-- Vertex Dots -->
      <circle cx="${pts[4].x}" cy="${pts[4].y}" r="3" fill="#f3e5ab" />
      <circle cx="${pts[5].x}" cy="${pts[5].y}" r="3" fill="#d4af37" />
      <circle cx="${pts[6].x}" cy="${pts[6].y}" r="3.5" fill="#d4af37" />
      <circle cx="${pts[7].x}" cy="${pts[7].y}" r="3" fill="#d4af37" />
      <circle cx="${pts[2].x}" cy="${pts[2].y}" r="3" fill="#10b981" />

      <!-- Dimension Labels -->
      <text x="${((parseFloat(pts[3].x) + parseFloat(pts[2].x)) / 2).toFixed(1)}" y="${((parseFloat(pts[3].y) + parseFloat(pts[2].y)) / 2 + 16).toFixed(1)}" fill="#d4af37" font-size="11" font-weight="600" text-anchor="middle" font-family="sans-serif">L: ${L} cm</text>
      <text x="${((parseFloat(pts[2].x) + parseFloat(pts[6].x)) / 2 + 25).toFixed(1)}" y="${((parseFloat(pts[2].y) + parseFloat(pts[6].y)) / 2).toFixed(1)}" fill="#10b981" font-size="11" font-weight="600" text-anchor="middle" font-family="sans-serif">W: ${W} cm</text>
      <text x="${((parseFloat(pts[5].x) + parseFloat(pts[6].x)) / 2).toFixed(1)}" y="${((parseFloat(pts[5].y) + parseFloat(pts[6].y)) / 2 - 10).toFixed(1)}" fill="#f3e5ab" font-size="10" font-weight="500" text-anchor="middle" font-family="sans-serif">H: ${H} cm ${T > 0 ? `| Wall: ${T}cm` : ''}</text>
    </svg>
  `;

  container.innerHTML = svgHTML;
}

// --- 3D Box Auto Update Listeners ---
function initDigital3DListeners() {
  const inputL = document.getElementById("itemWidth");
  const inputW = document.getElementById("itemHeight");
  const inputH = document.getElementById("boxDepthH");
  const inputT = document.getElementById("wallThickness");

  const updateBox = () => {
    const L = parseFloat(inputL ? inputL.value : 0) || 0;
    const W = parseFloat(inputW ? inputW.value : 0) || 0;
    const H = parseFloat(inputH ? inputH.value : 0) || 0;
    const T = parseFloat(inputT ? inputT.value : 0) || 0;

    drawDigital3DBox(L, W, H, T);
    calculateAndUpdate();
  };

  [inputL, inputW, inputH, inputT].forEach(inp => {
    if (inp) {
      inp.addEventListener("input", updateBox);
      inp.addEventListener("change", updateBox);
    }
  });

  updateBox();
}


document.addEventListener("DOMContentLoaded", initDigital3DListeners);
setTimeout(initDigital3DListeners, 300);



