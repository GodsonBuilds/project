import React from 'react';
import PosterBuilder from './components/PosterBuilder';
import './styles/fonts.css';

function App() {
  return (
    <div className="min-h-screen bg-green-500">
      <div className=" mx-auto pt-1 pb-1 px-1">
        {/* <h1 className="text-3xl font-bold text-white text-center mb-1">ZenGrowth Poster Creator</h1> */}
        <PosterBuilder />
      </div>
    </div>
  );
}

export default App;