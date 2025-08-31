import React, { useState, useCallback } from 'react';
import { generateComicImageFromPrompt } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4">
    <svg className="animate-spin h-12 w-12 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-slate-300 text-lg">Crafting your comic vision...</p>
    <p className="text-slate-400 text-sm">This can take a moment, the AI is thinking hard!</p>
  </div>
);

interface ComicDisplayProps {
  imageUrl: string;
  prompt: string;
}
const ComicDisplay: React.FC<ComicDisplayProps> = ({ imageUrl, prompt }) => (
  <div className="w-full flex flex-col items-center gap-4 animate-fade-in">
     <img 
        src={imageUrl} 
        alt={prompt} 
        className="w-full max-w-lg rounded-lg shadow-2xl shadow-yellow-500/10 border-4 border-slate-700 h-auto object-contain"
      />
      <p className="text-center text-slate-400 italic mt-2 text-sm max-w-md">"{prompt}"</p>
  </div>
);

interface ErrorDisplayProps {
  message: string;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-2 text-red-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <p className="font-semibold">Oops! Something went wrong.</p>
    <p className="text-sm">{message}</p>
  </div>
);

const WelcomePlaceholder: React.FC = () => (
    <div className="text-center text-slate-500 flex flex-col items-center gap-4 p-8 border-2 border-dashed border-slate-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold text-slate-300">Your Comic Panel Awaits</h3>
        <p>Describe a scene, a character, or an action. <br /> For example: "A cat astronaut discovering a planet made of yarn."</p>
    </div>
);

const aspectRatios = [
    { value: '1:1', label: 'Square' },
    { value: '4:3', label: 'Landscape' },
    { value: '3:4', label: 'Portrait' },
    { value: '16:9', label: 'Widescreen' },
    { value: '9:16', label: 'Story' },
];


export const ComicGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastPrompt(prompt);

    try {
      const imageB64 = await generateComicImageFromPrompt(prompt, aspectRatio);
      setGeneratedImage(`data:image/jpeg;base64,${imageB64}`);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate comic. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, aspectRatio]);

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-700">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="prompt-input" className="sr-only">Enter your comic description</label>
        <textarea
          id="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your comic scene here..."
          className="w-full bg-slate-900 border-2 border-slate-600 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition duration-200 resize-none h-28"
          disabled={isLoading}
        />
         <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">Aspect Ratio</label>
            <div className="grid grid-cols-5 gap-2">
                {aspectRatios.map((ratio) => (
                    <button
                        key={ratio.value}
                        type="button"
                        onClick={() => setAspectRatio(ratio.value)}
                        className={`p-2 rounded-md text-xs font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-yellow-400
                            ${aspectRatio === ratio.value 
                                ? 'bg-yellow-400 text-slate-900' 
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`
                        }
                        aria-pressed={aspectRatio === ratio.value}
                        title={ratio.label}
                    >
                        {ratio.value}
                    </button>
                ))}
            </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-yellow-300 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Generating...' : 'Craft Comic!'}
        </button>
      </form>
      <div className="mt-8 flex items-center justify-center min-h-[300px] w-full">
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && <ErrorDisplay message={error} />}
        {generatedImage && !isLoading && <ComicDisplay imageUrl={generatedImage} prompt={lastPrompt} />}
        {!isLoading && !error && !generatedImage && <WelcomePlaceholder />}
      </div>
    </div>
  );
};