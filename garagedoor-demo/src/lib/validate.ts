/** Returns an error message, or null if valid. */

export function validateName(raw: string): string | null {
  const name = raw.trim()
  if (!name) return 'Please enter your name.'
  if (name.length < 2) return 'Please enter your full name.'
  if (name.length > 80) return 'Name is too long.'
  // Letters (incl. accented), spaces, hyphens, apostrophes, periods — must start with a letter.
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(name)) {
    return 'Please enter a valid name (letters only).'
  }
  const letters = name.replace(/[^\p{L}]/gu, '')
  if (letters.length < 2) return 'Please enter your full name.'
  return null
}

export function validatePhone(raw: string): string | null {
  const phone = raw.trim()
  if (!phone) return 'Please enter your phone number.'

  // Allow common international formatting; count digits only for length bounds.
  if (!/^\+?[\d\s()./-]+$/.test(phone)) {
    return 'Please enter a valid phone number.'
  }

  const digits = phone.replace(/\D/g, '')
  // E.164 allows up to 15 digits; short local numbers still need a few digits to dial.
  if (digits.length < 7) {
    return 'Please enter a valid phone number (include country code if outside the US).'
  }
  if (digits.length > 15) {
    return 'Please enter a valid phone number.'
  }
  if (/^(\d)\1+$/.test(digits)) {
    return 'Please enter a valid phone number.'
  }
  return null
}
