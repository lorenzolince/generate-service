// utils/sanitize.js
import validator from 'validator';

export function sanitizeInput(input) {
  if (typeof input === "string") {
    return validator.escape(input.trim());
  }
  return input;
}

export function validateInput(input) {
  if (typeof input !== "string") return false;
  let decodedInput = ""
  try {
    decodedInput = decodeURIComponent(input);
  } catch (error) {
    console.error("Error al decodificar URI:", error);
    return true
  }
  const sanitizedInput = sanitizeInput(decodedInput); // Primero eliminamos caracteres peligrosos
  const dangerousPatterns = /[%<>;"'(){}|&$`\n\r]|document\(|system-property\(|xsl:value-of/i;
  return dangerousPatterns.test(sanitizedInput); // Validamos después de sanitizar
}
