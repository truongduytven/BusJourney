/**
 * Check if required fields are present
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(
    field => data[field] === undefined || data[field] === null || data[field] === ''
  );
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format (Vietnamese phone number)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^0[0-9]{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  return !!password && password.length >= minLength;
};
