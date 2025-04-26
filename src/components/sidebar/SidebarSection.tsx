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
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <button
        className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
          isOpen ? 'bg-zen-green-400 text-white' : 'bg-white text-gray-800'
        }`}
        onClick={onToggle}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? (
          <ChevronUp size={18} className={isOpen ? 'text-white' : 'text-gray-500'} />
        ) : (
          <ChevronDown size={18} className={isOpen ? 'text-white' : 'text-gray-500'} />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">{children}</div>
      )}
    </div>
  );
};

export default SidebarSection;