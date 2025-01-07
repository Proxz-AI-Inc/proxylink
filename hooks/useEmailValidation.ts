import { useState, useEffect } from 'react';
import { checkUserExists } from '@/lib/api/user';
import { useDebounce } from './useDebounce';

export function useEmailValidation(emails: string, delay: number = 500) {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const debouncedEmails = useDebounce(emails, delay);

  useEffect(() => {
    const validateEmails = async () => {
      if (debouncedEmails) {
        const inputEmails = debouncedEmails
          .split(',')
          .map(email => email.trim())
          .filter(email => email !== '');

        if (inputEmails.length > 0) {
          try {
            const invalidEmailsList: string[] = [];
            const existingEmailsList: string[] = [];

            // Проверяем каждый email
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

            setInvalidEmails(invalidEmailsList);

            if (existingEmailsList.length > 0) {
              setEmailError(
                `User${existingEmailsList.length > 1 ? 's' : ''}: ${existingEmailsList.join(', ')} already registered in the system`,
              );
            } else {
              setEmailError(null);
            }
          } catch (error) {
            console.error('Error checking emails:', error);
            setEmailError('An unexpected error occurred. Please try again.');
          }
        } else {
          setEmailError(null);
          setInvalidEmails([]);
        }
      }
    };

    validateEmails();
  }, [debouncedEmails]);

  return { emailError, invalidEmails };
}
