/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-scrollama' {
  import { ReactNode } from 'react';

  interface StepProps {
    data: any;
    children: ReactNode;
    threshold?: number;
  }

  interface ScrollamaProps {
    offset?: number | string;
    threshold?: number;
    onStepEnter?: (args: { data: any }) => void;
    onStepExit?: (args: { data: any }) => void;
    onStepProgress?: (args: { progress: number; data: any }) => void;
    debug?: boolean;
    children: ReactNode;
  }

  export const Step: React.FC<StepProps>;
  export const Scrollama: React.FC<ScrollamaProps>;
}
