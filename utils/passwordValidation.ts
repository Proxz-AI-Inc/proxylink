export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  preventCommonWords: true,
};

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`,
    );
  }

  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(
      `Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters`,
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common words/patterns
  const commonPatterns = ['password', 'admin', '123456', 'qwerty', 'letmein'];

  if (
    commonPatterns.some(pattern => password.toLowerCase().includes(pattern))
  ) {
    errors.push('Password contains common words or patterns');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
