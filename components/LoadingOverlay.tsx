
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-50/90 backdrop-blur-md">
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-serif text-stone-800 mb-2">Curating Your Collection</h2>
      <p className="text-stone-500 text-sm animate-pulse">{message}</p>
      
      <div className="mt-12 flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
