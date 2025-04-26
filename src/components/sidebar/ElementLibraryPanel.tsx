import React, { useRef, useState } from 'react';
import { Text, Image, Type, Quote, Heading, List } from 'lucide-react';
import SidebarSection from './SidebarSection';
import { THEME } from '../../constants/posterBuilderConstants';

interface ElementLibraryPanelProps {
  onAddElement: (elementType: 'text' | 'image', imageUrl?: string, textStyle?: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ElementLibraryPanel: React.FC<ElementLibraryPanelProps> = ({
  onAddElement,
  isOpen,
  onToggle,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Text styles available
  const textStyles = [
    { icon: <Heading size={24} />, label: 'Heading', style: 'heading' },
    { icon: <Type size={24} />, label: 'Paragraph', style: 'paragraph' },
    { icon: <Quote size={24} />, label: 'Quote', style: 'quote' },
    { icon: <List size={24} />, label: 'List', style: 'list' },
  ];
  
  // Handle drag start for text element
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    elementType: 'text' | 'image',
    data?: string
  ) => {
    e.dataTransfer.setData('elementType', elementType);
    if (data) {
      if (elementType === 'image') {
        e.dataTransfer.setData('imageUrl', data);
      } else if (elementType === 'text') {
        e.dataTransfer.setData('textStyle', data);
      }
    }
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setUploadedImages(prev => [...prev, imageUrl]);
          // Also add it to canvas if it's a single upload
          if (files.length === 1) {
            onAddElement('image', imageUrl);
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  // Sample images from Pexels (stock photos)
  const sampleImages = [
    'https://images.pexels.com/photos/355508/pexels-photo-355508.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=300',
  ];
  
  return (
    <SidebarSection title="Element Library" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-6">
        {/* Text Elements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Text Elements</h3>
          <div className="grid grid-cols-2 gap-2">
            {textStyles.map((textStyle) => (
              <div
                key={textStyle.style}
                draggable
                onDragStart={(e) => handleDragStart(e, 'text', textStyle.style)}
                onClick={() => onAddElement('text', undefined, textStyle.style)}
                className="flex flex-col items-center justify-center h-20 bg-white border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors shadow-sm"
              >
                {textStyle.icon}
                <span className="text-xs text-gray-600 mt-1">{textStyle.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Image Elements */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Image Elements</h3>
          
          <div className="space-y-4">
            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                multiple
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Image size={16} />
                <span>Upload Image</span>
              </button>
            </div>
            
            {/* User Uploaded Images */}
            {uploadedImages.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-2">Your Uploads</h4>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((src, index) => (
                    <div
                      key={`upload-${index}`}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('elementType', 'image');
                        e.dataTransfer.setData('imageUrl', src);
                      }}
                      onClick={() => onAddElement('image', src)}
                      className="h-20 bg-white border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors overflow-hidden shadow-sm"
                    >
                      <img
                        src={src}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Sample Images */}
            <div>
              <h4 className="text-xs font-medium text-gray-700 mb-2">Sample Images</h4>
              <div className="grid grid-cols-2 gap-2">
                {sampleImages.map((src, index) => (
                  <div
                    key={`sample-${index}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('elementType', 'image');
                      e.dataTransfer.setData('imageUrl', src);
                    }}
                    onClick={() => onAddElement('image', src)}
                    className="h-20 bg-white border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer transition-colors overflow-hidden shadow-sm"
                  >
                    <img
                      src={src}
                      alt={`Sample ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarSection>
  );
};

export default ElementLibraryPanel;