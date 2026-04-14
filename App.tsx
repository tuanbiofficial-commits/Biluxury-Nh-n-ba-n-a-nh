
import React, { useState, useCallback } from 'react';
import { StudioState, GeneratedImage, PoseType } from './types';
import { generateFashionImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import LoadingOverlay from './components/LoadingOverlay';

const PROGRESS_MESSAGES = [
  "Synchronizing model features...",
  "Applying premium lighting textures...",
  "Draping the fabric precisely...",
  "Arranging the luxury interior...",
  "Polishing the final aesthetic...",
  "Perfecting the modern classic silhouette..."
];

const App: React.FC = () => {
  const [state, setState] = useState<StudioState>({
    productImage: null,
    faceImage: null,
    isGenerating: false,
    results: [],
    error: null,
    progressMessage: PROGRESS_MESSAGES[0]
  });

  const handleGenerate = async () => {
    if (!state.productImage || !state.faceImage) {
      setState(prev => ({ ...prev, error: "Please provide both product and model face images." }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null, 
      results: [],
      progressMessage: PROGRESS_MESSAGES[0]
    }));

    const updateProgress = (msg: string) => {
      setState(prev => ({ ...prev, progressMessage: msg }));
    };

    try {
      const generatedResults: GeneratedImage[] = [];
      
      // Configuration for the 4 images
      const tasks = [
        { pose: PoseType.PORTRAIT_FRONT, ratio: "9:16" as const, label: "Studio Portrait - Frontal" },
        { pose: PoseType.PORTRAIT_3_4, ratio: "9:16" as const, label: "Studio Portrait - 3/4 Profile" },
        { pose: PoseType.LANDSCAPE_CROSSED, ratio: "16:9" as const, label: "Lifestyle - Business Professional" },
        { pose: PoseType.LANDSCAPE_RELAXED, ratio: "16:9" as const, label: "Lifestyle - Casual Luxury" }
      ];

      for (let i = 0; i < tasks.length; i++) {
        updateProgress(PROGRESS_MESSAGES[Math.min(i, PROGRESS_MESSAGES.length - 1)]);
        const task = tasks[i];
        const imageUrl = await generateFashionImage(
          state.productImage,
          state.faceImage,
          task.pose,
          task.ratio
        );
        
        generatedResults.push({
          id: `img-${i}-${Date.now()}`,
          url: imageUrl,
          aspectRatio: task.ratio,
          label: task.label
        });
      }

      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        results: generatedResults 
      }));
    } catch (err: any) {
      console.error("Generation failed:", err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "An error occurred during generation. Please ensure your API key is correct and try again." 
      }));
    }
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {state.isGenerating && <LoadingOverlay message={state.progressMessage} />}

      {/* Header */}
      <header className="py-12 text-center border-b border-stone-200 mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 tracking-tight italic">
          AI Fashion Studio
        </h1>
        <p className="text-stone-500 font-light tracking-wide max-w-2xl mx-auto">
          Create high-end menswear imagery in Modern Classic and Quiet Luxury aesthetics. 
          Upload your product and model face to generate a curated collection.
        </p>
      </header>

      {/* Main Controls */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Sidebar - Inputs */}
        <section className="lg:col-span-4 space-y-10">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 space-y-8">
            <ImageUploader 
              label="1. Product Image" 
              description="Upload your jacket or top (clear background preferred)"
              currentImage={state.productImage}
              onImageSelect={(img) => setState(prev => ({ ...prev, productImage: img, error: null }))}
            />
            
            <ImageUploader 
              label="2. Model Face" 
              description="Upload a clear portrait for AI face synchronization"
              currentImage={state.faceImage}
              onImageSelect={(img) => setState(prev => ({ ...prev, faceImage: img, error: null }))}
            />

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={state.isGenerating || !state.productImage || !state.faceImage}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg
                  ${state.isGenerating || !state.productImage || !state.faceImage
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-stone-900 text-stone-50 hover:bg-stone-800 active:scale-[0.98]'}`}
              >
                {state.isGenerating ? 'Generating...' : 'Generate 4-Piece Collection'}
              </button>
              
              {state.error && (
                <p className="mt-4 text-xs text-red-500 text-center font-medium bg-red-50 p-2 rounded">
                  {state.error}
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-stone-100">
              <h4 className="text-[10px] uppercase font-bold text-stone-400 mb-4 tracking-[0.2em]">Studio Specifications</h4>
              <ul className="text-[11px] text-stone-500 space-y-2 font-medium">
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2"></span> Style: Modern Classic / Quiet Luxury</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2"></span> Lighting: Soft Natural Diffusion</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2"></span> Setting: Minimalist Luxury Interior</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-stone-300 mr-2"></span> Format: 2 Portrait, 2 Landscape</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right Content - Results */}
        <section className="lg:col-span-8">
          {state.results.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-serif text-stone-800">Generated Collection</h2>
                <span className="text-xs text-stone-400 uppercase tracking-widest font-bold">4 Images Ready</span>
              </div>
              
              {/* 2 Portrait Images Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {state.results.filter(r => r.aspectRatio === '9:16').map((res) => (
                  <div key={res.id} className="group flex flex-col">
                    <div className="relative overflow-hidden rounded-xl bg-stone-200 aspect-[9/16] shadow-xl shadow-stone-200/50">
                      <img src={res.url} alt={res.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => downloadImage(res.url, `menswear-${res.id}.png`)}
                          className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                          title="Download Image"
                        >
                          <svg className="w-5 h-5 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-medium text-stone-500 italic px-1">{res.label}</p>
                  </div>
                ))}
              </div>

              {/* 2 Landscape Images Column */}
              <div className="space-y-12">
                {state.results.filter(r => r.aspectRatio === '16:9').map((res) => (
                  <div key={res.id} className="group flex flex-col">
                    <div className="relative overflow-hidden rounded-xl bg-stone-200 aspect-[16/9] shadow-xl shadow-stone-200/50">
                      <img src={res.url} alt={res.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={() => downloadImage(res.url, `menswear-${res.id}.png`)}
                          className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <svg className="w-5 h-5 text-stone-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-medium text-stone-500 italic px-1">{res.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white/50 border-2 border-dashed border-stone-200 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-stone-400 mb-2">Collection Preview Area</h3>
              <p className="text-stone-400 text-sm max-w-xs font-light">
                Your generated menswear collection will appear here after the AI process completes.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer Branding */}
      <footer className="mt-24 border-t border-stone-100 pt-12 flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-300">
          Powered by Gemini Intelligence
        </div>
      </footer>
    </div>
  );
};

export default App;
