import type React from 'react';

/**
 * Form Validation & Input Sanitization Utilities
 * Enforces strict typing, phone number validation (digits only), email checks, and field integrity.
 */

/**
 * Sanitizes phone input in real-time.
 * Only permits:
 * - One optional leading '+'
 * - Digits 0-9
 * - Formatting characters: spaces ' ', hyphens '-', and parentheses '()'
 * Automatically strips all letters, symbols, and invalid characters.
 */
export function sanitizePhoneNumber(value: string): string {
  if (!value) return '';

  const trimmed = value.trimStart();
  const hasLeadingPlus = trimmed.startsWith('+');

  // Strip anything that is NOT a digit, space, hyphen, or parenthesis
  let clean = value.replace(/[^\d\s\-()]/g, '');

  // Ensure '+' can only exist at the very start
  clean = clean.replace(/\+/g, '');
  if (hasLeadingPlus) {
    clean = '+' + clean;
  }

  return clean;
}

/**
 * KeyDown handler to prevent non-phone characters from even appearing in the input box.
 * Allows navigation, editing shortcuts, and phone-valid characters only.
 */
export function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
  // Allow system / navigation / editing keys
  if (
    e.key === 'Backspace' ||
    e.key === 'Delete' ||
    e.key === 'Tab' ||
    e.key === 'Enter' ||
    e.key === 'Escape' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight' ||
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown' ||
    e.key === 'Home' ||
    e.key === 'End' ||
    // Allow Ctrl / Cmd combinations (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z)
    e.ctrlKey ||
    e.metaKey
  ) {
    return;
  }

  // Allowed single keys
  const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '(', ')', ' '];

  if (!allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
}

/**
 * Validates international and local phone number formats.
 * E.164 ITU-T standards require between 7 and 15 digits.
 */
export function validatePhoneNumber(
  value: string,
  isRequired: boolean = true
): { isValid: boolean; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    if (isRequired) {
      return { isValid: false, error: 'Phone / WhatsApp number is required' };
    }
    return { isValid: true };
  }

  // Count total digits
  const digitMatches = trimmed.match(/\d/g);
  const digitCount = digitMatches ? digitMatches.length : 0;

  if (digitCount === 0) {
    return { isValid: false, error: 'Please enter a valid phone number containing digits' };
  }

  if (digitCount < 7) {
    return {
      isValid: false,
      error: `Phone number is too short (${digitCount} digits). Please enter at least 7 digits.`
    };
  }

  if (digitCount > 15) {
    return {
      isValid: false,
      error: `Phone number cannot exceed 15 digits (currently ${digitCount} digits).`
    };
  }

  // Check overall structure
  const phonePattern = /^\+?[0-9\s\-()]{7,25}$/;
  if (!phonePattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number format (e.g., +1 555 234 5678 or 0300 1234567)'
    };
  }

  return { isValid: true };
}

/**
 * Validates an email address against strict format standards.
 */
export function validateEmail(value: string): { isValid: boolean; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email address is required' };
  }

  // RFC-5322 compliant regex for modern domains
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed) || trimmed.includes(' ') || !trimmed.includes('.')) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@company.com)' };
  }

  // Ensure TLD is at least 2 letters
  const parts = trimmed.split('.');
  const tld = parts[parts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, error: 'Please provide a valid domain extension (e.g. .com, .org, .io)' };
  }

  return { isValid: true };
}

/**
 * Validates full name or contact person name.
 */
export function validateName(
  value: string,
  fieldLabel: string = 'Full Name'
): { isValid: boolean; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldLabel} must be at least 2 characters` };
  }

  // Ensure it's not just numbers or punctuation
  const hasLetters = /[a-zA-Z\u00C0-\u024F\u0600-\u06FF]/.test(trimmed);
  if (!hasLetters) {
    return { isValid: false, error: `Please enter a valid name containing letters` };
  }

  return { isValid: true };
}

/**
 * Validates company or organization name.
 */
export function validateCompany(
  value: string,
  isRequired: boolean = true
): { isValid: boolean; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    if (isRequired) {
      return { isValid: false, error: 'Company / Business Name is required' };
    }
    return { isValid: true };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Company Name must be at least 2 characters' };
  }

  return { isValid: true };
}

/**
 * Validates text message, problem description, or system requirements.
 */
export function validateMessage(
  value: string,
  fieldLabel: string = 'Message',
  minLength: number = 10
): { isValid: boolean; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `Please provide at least ${minLength} characters for ${fieldLabel.toLowerCase()} (currently ${trimmed.length})`
    };
  }

  return { isValid: true };
}
