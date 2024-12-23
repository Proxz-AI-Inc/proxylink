import { InfoTooltip } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import CaptchaChallenge from '../CaptchaChallenge';
import { sendRegisterFormEmail } from '@/lib/email/templates/RegisterFormTemplate';
import { FC, useState } from 'react';
import { parseErrorMessage } from '@/utils/general';
import { useMutation } from '@tanstack/react-query';

type Props = {
  onSubmit: () => void;
};

const TASKS = [
  { field: 'answer_questions', display: 'Answer Account-Specific Questions' },
  {
    field: 'manage_subscriptions',
    display: 'Manage Subscriptions',
    subdisplay: 'Initiate, pause, resume, and cancel subscriptions',
    tooltip:
      'FTC regulations require companies to allow customers to cancel subscriptions through the same method they initiated them. Therefore, if you allow AI assistants to discover and initiate a subscription, then you must also allow AI assistants to pause and cancel subscriptions.',
  },
  { field: 'update_billing', display: 'Update Billing Information' },
  { field: 'request_order_changes', display: 'Request Order Changes' },
  { field: 'track_shipping', display: 'Track Shipping' },
  { field: 'update_shipping', display: 'Update Shipping Address' },
];

type CaptchaVerifyRes = {
  success: boolean;
  error?: string;
};
const WaitlistForm: FC<Props> = ({ onSubmit }) => {
  const [selectedTasks, setSelectedTasks] = useState(
    TASKS.map(task => task.field),
  );
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');

  const verifyMutation = useMutation({
    mutationFn: async (token: string): Promise<CaptchaVerifyRes> => {
      const response = await fetch('/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error('Captcha verification failed');
      }
      return data;
    },
    onSuccess: () => {
      const selectedTasksDisplay = selectedTasks.map(
        task => TASKS.find(t => t.field === task)?.display || '',
      );
      sendRegisterFormEmail({
        email: email,
        tasks: selectedTasksDisplay,
      });
      onSubmit();
    },
    onError: error => {
      setError(parseErrorMessage(error));
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    verifyMutation.mutate(captchaToken);
  };

  const handleCheckboxChange = (field: string) => {
    if (selectedTasks.includes(field)) {
      setSelectedTasks(selectedTasks.filter(f => f !== field));
    } else {
      setSelectedTasks([...selectedTasks, field]);
    }
  };

  return (
    <div>
      <form
        className="bg-white text-center rounded-xl p-7 mt-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold">Join the Waitlist</h2>
        <p className="mt-4 max-w-lg text-center text-gray-600 mb-8">
          Be among the first 1,000 companies to have AI assistants recommend
          your company based on the quality of your customer experience.
        </p>
        {/* Permitted Tasks */}
        <div className="flex flex-col gap-4">
          {TASKS.map(task => (
            <div key={task.field} className="flex items-center gap-2">
              <label key={task.field} className="inline-flex items-start">
                <input
                  type="checkbox"
                  className="relative top-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={task.field}
                  checked={selectedTasks.includes(task.field)}
                  onChange={() => handleCheckboxChange(task.field)}
                />
                <div className="flex flex-col items-start ml-2">
                  <div className="flex items-center gap-2">
                    <span>{task.display}</span>
                    {task.tooltip && <InfoTooltip text={task.tooltip} />}
                  </div>
                  {task.subdisplay && (
                    <span className="text-sm text-gray-400">
                      {task.subdisplay}
                    </span>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
        {/* Email Address */}
        <div className="flex items-center gap-2 w-full mt-8">
          <input
            type="email"
            placeholder="Email Address"
            className="p-2 border flex-1 rounded-lg h-9 placeholder:text-sm"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            disabled={verifyMutation.isPending}
            color="primary"
            loading={verifyMutation.isPending}
          >
            Submit
          </Button>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
      <div className="mt-4">
        <CaptchaChallenge onVerify={setCaptchaToken} />
      </div>
    </div>
  );
};

export default WaitlistForm;
