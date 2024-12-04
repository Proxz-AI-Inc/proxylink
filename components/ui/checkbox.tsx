// file: components/ui/checkbox.tsx
import {
  Checkbox as HeadlessCheckbox,
  Field as HeadlessField,
  type CheckboxProps as HeadlessCheckboxProps,
  type FieldProps as HeadlessFieldProps,
} from '@headlessui/react';
import { clsx } from 'clsx';
import type React from 'react';

export function CheckboxGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,

        // Basic groups
        'space-y-3',

        // With descriptions
        'has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium',
      )}
    />
  );
}

export function CheckboxField({ className, ...props }: HeadlessFieldProps) {
  return (
    <HeadlessField
      data-slot="field"
      {...props}
      className={clsx(
        className,

        // Base layout
        'grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]',

        // Control layout
        '[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center',

        // Label layout
        '[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start',

        // Description layout
        '[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2',

        // With description
        '[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium',
      )}
    />
  );
}

const base = [
  // Basic layout
  'relative flex size-4 items-center justify-center rounded-[4px]',

  // Unchecked state
  'border border-gray-200 bg-white transition-colors duration-150',
  'dark:border-white/15 dark:bg-white/5',

  // Focus styles (keyboard only)
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',

  // Hover state
  'hover:border-primary-500/50 dark:hover:border-primary-500/50',

  // Checked state styling
  'group-data-[checked]:border-primary-500 group-data-[checked]:bg-primary-500',

  // Disabled state
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
];

const colors = {
  primary: [
    // Check mark color
    '[--checkbox-check:theme(colors.white)]',
  ],
};

type Color = keyof typeof colors;

export function Checkbox({
  color = 'primary',
  className,
  ...props
}: {
  color?: Color;
  className?: string;
} & HeadlessCheckboxProps) {
  return (
    <HeadlessCheckbox
      data-slot="control"
      className={clsx(className, 'group inline-flex focus:outline-none')}
      {...props}
    >
      <span className={clsx([base, colors[color]])}>
        <svg
          className="size-4 stroke-[--checkbox-check] opacity-0 group-data-[checked]:opacity-100 sm:h-3.5 sm:w-3.5"
          viewBox="0 0 14 14"
          fill="none"
        >
          {/* Checkmark icon */}
          <path
            className="opacity-100 group-data-[indeterminate]:opacity-0"
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Indeterminate icon */}
          <path
            className="opacity-0 group-data-[indeterminate]:opacity-100"
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </HeadlessCheckbox>
  );
}
