
import React, { useRef } from 'react';

interface ImageUploaderProps {
  label: string;
  onImageSelect: (base64: string) => void;
  currentImage: string | null;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageSelect, currentImage, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">{label}</h3>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed transition-all duration-300 rounded-lg aspect-square flex flex-col items-center justify-center overflow-hidden
          ${currentImage ? 'border-stone-300' : 'border-stone-200 hover:border-stone-400 bg-white/50'}`}
      >
        {currentImage ? (
          <>
            <img src={currentImage} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change Image</span>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <svg className="w-8 h-8 mx-auto mb-2 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-xs text-stone-500">{description}</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default ImageUploader;
