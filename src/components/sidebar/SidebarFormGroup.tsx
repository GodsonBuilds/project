import React, { ReactNode } from 'react';
import { THEME } from '../../constants/posterBuilderConstants';

interface SidebarFormGroupProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

const SidebarFormGroup: React.FC<SidebarFormGroupProps> = ({
  label,
  htmlFor,
  children,
}) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={htmlFor}
        className="block mb-1 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      {children}
    </div>
  );
};

export default SidebarFormGroup;