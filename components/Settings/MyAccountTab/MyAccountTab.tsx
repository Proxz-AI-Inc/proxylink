import { FieldGroup, Fieldset, Field } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/db/schema';
import { Button } from '@/components/ui/button';
import { FC, useState } from 'react';
import { updateUser } from '@/lib/api/user';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Spinner from '../../ui/spinner';
import { ChangePasswordForm } from '@/components/Settings/MyAccountTab/ChangePasswordForm';

const MyAccountTab: FC<{
  userData: User;
  tenantName?: string;
  isEnabled: boolean;
}> = ({ userData, tenantName, isEnabled }) => {
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) =>
      updateUser({
        firstName,
        lastName,
        id: userData.id,
        role: userData.role,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User updated successfully', {
        duration: 2000,
      });
    },
    onError: error => {
      toast.error(`Failed to update user: ${error.message}`);
    },
  });

  const handleSaveName = () => {
    mutation.mutate({
      firstName,
      lastName,
    });
  };

  if (!userData.email || !isEnabled) {
    return null;
  }

  return (
    <div className="h-full w-full py-8">
      <h3 className="text-lg font-medium mb-6">Personal Data</h3>
      <Fieldset>
        <FieldGroup>
          <div className="flex gap-4 items-center">
            <Field className="w-fit">
              <p className="text-base mb-2 text-gray-500">First Name</p>
              <div className="flex gap-x-2">
                <Input
                  name="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
            </Field>
            <Field className="w-fit">
              <p className="text-base mb-2 text-gray-500">Last Name</p>
              <div className="flex gap-x-2">
                <Input
                  name="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
                <Button onClick={handleSaveName}>
                  {mutation.isPending ? <Spinner color="white" /> : 'Save'}
                </Button>
              </div>
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>

      <div className="mt-8 flex flex-col gap-4">
        <div>
          <p className="text-base text-gray-500">Email</p>
          <p className="text-base text-black">{userData.email}</p>
        </div>
        <div>
          <p className="text-base text-gray-500">Organization</p>
          <p className="text-base text-black">{tenantName}</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-200 max-w-prose">
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default MyAccountTab;
