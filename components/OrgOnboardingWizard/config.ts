export type StepConfig = {
  id: number;
  title: string;
  nextStep: number | null;
  prevStep: number | null;
};

export const PROVIDER_STEPS: Record<number, StepConfig> = {
  1: {
    id: 1,
    title: 'Welcome',
    nextStep: 2,
    prevStep: null,
  },
  2: {
    id: 2,
    title: 'Auth Fields',
    nextStep: 3,
    prevStep: 1,
  },
  3: {
    id: 3,
    title: 'Request Types',
    nextStep: 4,
    prevStep: 2,
  },
  4: {
    id: 4,
    title: 'Terms & Conditions',
    nextStep: 5,
    prevStep: 3,
  },
  5: {
    id: 5,
    title: 'Congratulations',
    nextStep: null,
    prevStep: 4,
  },
};

export const PROXY_STEPS: Record<number, StepConfig> = {
  1: {
    id: 1,
    title: 'Welcome',
    nextStep: 2,
    prevStep: null,
  },
  2: {
    id: 2,
    title: 'Terms & Conditions',
    nextStep: 3,
    prevStep: 1,
  },
  3: {
    id: 3,
    title: 'Congratulations',
    nextStep: null,
    prevStep: 2,
  },
};
