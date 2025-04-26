import React from 'react';
import PosterBuilder from './components/PosterBuilder';
import './styles/fonts.css';

function App() {
  return (
    <div className="min-h-screen bg-green-500">
      <div className="container mx-auto py-4 px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-6">ZenGrowth Poster Creator</h1>
        <PosterBuilder />
      </div>
    </div>
  );
}

export default App;