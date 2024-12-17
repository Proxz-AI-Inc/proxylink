import React, { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { c, InfoIcon } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
  position?: 'left' | 'right';
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  position = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover className="relative flex items-center justify-center">
      <PopoverButton
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="w-fit h-fit"
      >
        <InfoIcon className="w-5 h-5 text-primary-500" />
      </PopoverButton>

      {isOpen && (
        <PopoverPanel
          static
          className="absolute z-50 w-64 p-2 mt-2 text-sm bg-white rounded-md shadow-xl leading-normal"
          anchor={position}
        >
          {text}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
        </PopoverPanel>
      )}
    </Popover>
  );
};
