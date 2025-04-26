import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { THEME } from '../../constants/posterBuilderConstants';

interface SidebarSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
        onClick={onToggle}
        style={{
          borderBottom: isOpen ? `1px solid ${THEME.colors.border}` : 'none',
        }}
      >
        <span className="font-medium text-gray-800">{title}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">{children}</div>
      )}
    </div>
  );
};

export default SidebarSection;