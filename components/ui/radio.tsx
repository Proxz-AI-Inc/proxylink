import {
  Field as HeadlessField,
  Radio as HeadlessRadio,
  RadioGroup as HeadlessRadioGroup,
  type FieldProps as HeadlessFieldProps,
  type RadioGroupProps as HeadlessRadioGroupProps,
  type RadioProps as HeadlessRadioProps,
} from '@headlessui/react';
import { clsx } from 'clsx';

export function RadioGroup({ className, ...props }: HeadlessRadioGroupProps) {
  return (
    <HeadlessRadioGroup
      data-slot="control"
      {...props}
      className={clsx(
        className,
        'flex gap-4', // Changed from 'space-y-3' to 'flex gap-4'
        '[&_[data-slot=label]]:font-normal',
        'has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium',
      )}
    />
  );
}

export function RadioField({ className, ...props }: HeadlessFieldProps) {
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
  'relative flex size-4 items-center justify-center rounded-full',

  // Unchecked state
  'border border-gray-200 bg-white transition-colors duration-150',
  'dark:border-white/15 dark:bg-white/5',

  // Focus styles (keyboard only)
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',

  // Hover state
  'hover:border-primary-500/50 dark:hover:border-primary-500/50',

  // Checked state
  'group-data-[checked]:border-primary-500 group-data-[checked]:bg-primary-500',

  // Disabled state
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
];

const colors = {
  primary: [
    // Base colors
    '[--radio-indicator:theme(colors.white)]',

    // Checked state uses the same primary color as button
    'group-data-[checked]:bg-primary-500 group-data-[checked]:border-primary-500',

    // Hover state
    'hover:border-primary-500/50',
    'group-data-[checked]:hover:brightness-110',

    // Active state
    'group-data-[checked]:active:brightness-90',

    // Dark mode adjustments
    'dark:group-data-[checked]:bg-primary-500 dark:group-data-[checked]:border-primary-500',
  ],
};

type Color = keyof typeof colors;

export function Radio({
  color = 'primary',
  className,
  ...props
}: { color?: Color; className?: string } & HeadlessRadioProps) {
  return (
    <HeadlessRadio
      data-slot="control"
      {...props}
      className={clsx(className, 'group inline-flex focus:outline-none')}
    >
      <span className={clsx([base, colors[color]])}>
        <span
          className={clsx(
            'size-2 rounded-full bg-[--radio-indicator] transition-transform duration-150',
            'group-data-[checked]:scale-100 scale-0',
          )}
        />
      </span>
    </HeadlessRadio>
  );
}
