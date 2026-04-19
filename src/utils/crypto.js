// Utility to securely encode array buffers to Base64 and back for LocalStorage
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generates a CryptoKey using PBKDF2 from a string PIN and salt
const deriveKey = async (pinStr, saltBuffer) => {
  const enc = new TextEncoder();
  
  // Create an initial raw key from the PIN
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(pinStr),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive the actual AES-GCM encryption key using PBKDF2 with 100,000 iterations
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

/**
 * Encrypts a Javascript Object using AES-GCM with a string PIN.
 * @param {Object} dataObj - The raw data state to encrypt.
 * @param {String} pin - The user's input PIN string.
 * @returns {Promise<String>} A JSON string containing base64 encoded ciphertext, iv, and salt.
 */
export const encryptVaultData = async (dataObj, pin) => {
  try {
    const enc = new TextEncoder();
    const dataStr = JSON.stringify(dataObj);
    const dataBuffer = enc.encode(dataStr);

    // Generate strict cryptography material
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(pin, salt);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      dataBuffer
    );

    return JSON.stringify({
      ct: arrayBufferToBase64(encryptedBuffer),
      iv: arrayBufferToBase64(iv),
      s: arrayBufferToBase64(salt)
    });
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt vault data');
  }
};

/**
 * Decrypts an encrypted bundle from localStorage.
 * @param {String} encryptedBundle - The JSON string containing ct, iv, and s.
 * @param {String} pin - The user's input PIN string.
 * @returns {Promise<Object>} The original parsed object. Throws if PIN is incorrect or payload corrupted.
 */
export const decryptVaultData = async (encryptedBundle, pin) => {
  try {
    const parsed = JSON.parse(encryptedBundle);
    const encryptedBuffer = base64ToArrayBuffer(parsed.ct);
    const iv = new Uint8Array(base64ToArrayBuffer(parsed.iv));
    const salt = new Uint8Array(base64ToArrayBuffer(parsed.s));

    const key = await deriveKey(pin, salt);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBuffer
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedBuffer));
  } catch (error) {
    // If decryption fails (e.g. wrong key, bad MAC), it throws naturally.
    throw new Error('Incorrect PIN or corrupted data');
  }
};
