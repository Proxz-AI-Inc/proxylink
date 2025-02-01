'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getTenant, updateTenant } from '@/lib/api/tenant';
import { inviteUser } from '@/lib/api/user';
import { Button } from '@/components/ui/button';
import { FaTrash } from 'react-icons/fa';
import { useEmailValidation } from '@/hooks/useEmailValidation';

const OrgOnboardingWizard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const { emailError, invalidEmails, resetError } =
    useEmailValidation(currentEmail);

  const { userData } = useAuth();
  const queryClient = useQueryClient();

  const { data: org } = useQuery({
    queryKey: ['organization', userData?.tenantId],
    queryFn: () => getTenant(userData?.tenantId),
    enabled: !!userData?.tenantId,
  });

  useEffect(() => {
    if (org && !org?.active && userData?.role === 'admin') {
      setIsOpen(true);
    }
  }, [org, userData?.role]);

  const inviteMutation = useMutation({
    mutationFn: async (emailList: string[]) => {
      if (!org || !userData) {
        throw new Error('Tenant or user data not found');
      }

      return Promise.all(
        emailList.map(email =>
          inviteUser({
            sendTo: email,
            invitedBy: userData.email || '',
            tenantType: org.type,
            tenantName: org.name || '',
            tenantId: org.id || '',
            isAdmin: false,
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', org?.id] });
      toast.success(`Invitations sent to:\n${emails.join('\n')}`, {
        duration: 4000,
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const activateTenantMutation = useMutation({
    mutationFn: updateTenant,
    onSuccess: () => {
      setIsOpen(false);
      toast.success('Organization activated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError || invalidEmails.length > 0) {
      resetError();
    }
    setCurrentEmail(e.target.value);
  };

  const handleAddEmail = () => {
    if (
      !emailError &&
      !invalidEmails.length &&
      currentEmail &&
      !emails.includes(currentEmail)
    ) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleContinue = async () => {
    if (!org) return;

    if (emails.length > 0) {
      await inviteMutation.mutateAsync(emails);
    }

    await activateTenantMutation.mutate({
      ...org,
      active: true,
    });
  };

  return (
    <Modal shown={isOpen} title="Welcome to ProxyLink!" size="md">
      <div className="flex flex-col gap-6 p-4">
        <div className="space-y-4">
          <p>
            To get started, please identify the customer support email(s) where
            you would like all proxy requests to be sent. Here are a few tips:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              If you are the only person that needs to be notified, then you can
              skip this step 🙂. You can manage notifications in the Settings
              tab.
            </li>
            <li>
              If you have a large customer support team, then it&apos;s best to
              select a few individuals you want to be involved in handling proxy
              requests.
            </li>
            <li>
              Only use your generic customer support email if you want everyone
              who uses that email to resolve proxy requests with the same login
              credentials.
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={currentEmail}
                onChange={handleEmailChange}
                placeholder="e.g., sally@yourcompany.com"
                className={`flex-1 rounded-md border p-2 ${
                  currentEmail && (emailError || invalidEmails.length > 0)
                    ? 'border-red-500'
                    : ''
                }`}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
              />
              <Button
                onClick={handleAddEmail}
                disabled={
                  !!emailError || invalidEmails.length > 0 || !currentEmail
                }
              >
                Add
              </Button>
            </div>
            {emailError && invalidEmails.length > 0 && (
              <span className="text-sm text-red-500 pl-2">
                Invalid email(s): {invalidEmails.join(', ')}
              </span>
            )}
          </div>

          {emails.length > 0 && (
            <ul>
              {emails.map(email => (
                <li
                  key={email}
                  className="flex items-center justify-between p-2 text-primary-400"
                >
                  <span>{email}</span>
                  <Button onClick={() => handleRemoveEmail(email)}>
                    <FaTrash className="text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          onClick={handleContinue}
          className="w-full"
          color="primary"
          loading={activateTenantMutation.isPending || inviteMutation.isPending}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default OrgOnboardingWizard;
