import React from 'react';
import { ComicGenerator } from './components/ComicGenerator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 pb-2">
          Comic Crafter AI
        </h1>
        <p className="text-slate-300 text-lg mt-2">
          Turn your ideas into vibrant comic book art with the power of Gemini.
        </p>
      </header>
      <main className="w-full flex-grow flex items-start justify-center">
        <ComicGenerator />
      </main>
      <footer className="w-full max-w-4xl text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
