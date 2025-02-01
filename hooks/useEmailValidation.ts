import { useState, useEffect } from 'react';
import { checkUserExists } from '@/lib/api/user';
import { useDebounce } from './useDebounce';

export function useEmailValidation(emails: string, delay: number = 500) {
  const [validationState, setValidationState] = useState<{
    emailError: string | null;
    invalidEmails: string[];
  }>({
    emailError: null,
    invalidEmails: [],
  });

  const debouncedEmails = useDebounce(emails, delay);

  useEffect(() => {
    const validateEmails = async () => {
      setValidationState({ emailError: null, invalidEmails: [] });

      if (debouncedEmails) {
        const inputEmails = debouncedEmails
          .split(',')
          .map(email => email.trim())
          .filter(email => email !== '');

        if (inputEmails.length > 0) {
          try {
            const invalidEmailsList: string[] = [];
            const existingEmailsList: string[] = [];

            await Promise.all(
              inputEmails.map(async email => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                  invalidEmailsList.push(email);
                  return;
                }

                try {
                  const exists = await checkUserExists(email);
                  if (exists) {
                    existingEmailsList.push(email);
                  }
                } catch (error) {
                  console.error('Error checking email:', email, error);
                }
              }),
            );

            let errorMessage = null;
            if (invalidEmailsList.length > 0) {
              errorMessage = 'Invalid email format';
            } else if (existingEmailsList.length > 0) {
              errorMessage = `User${existingEmailsList.length > 1 ? 's' : ''}: ${existingEmailsList.join(', ')} already registered in the system`;
            }

            setValidationState({
              invalidEmails: invalidEmailsList,
              emailError: errorMessage,
            });
          } catch (error) {
            console.error('Error checking emails:', error);
            setValidationState({
              invalidEmails: [],
              emailError: 'An unexpected error occurred. Please try again.',
            });
          }
        }
      }
    };

    validateEmails();
  }, [debouncedEmails]);

  const resetError = () => {
    setValidationState({
      emailError: null,
      invalidEmails: [],
    });
  };

  return {
    emailError: validationState.emailError,
    invalidEmails: validationState.invalidEmails,
    resetError,
  };
}
