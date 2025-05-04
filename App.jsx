// App.jsx
import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import AnalysisView from './components/AnalysisView';

// NOTE: make sure to install wavesurfer.js with:
// npm install wavesurfer.js

const App = () => {
  const [view, setView] = useState('landing');
  const [audioUrl, setAudioUrl] = useState(null);
  const [midiHex, setMidiHex] = useState(null);

  const handleUpload = async (file) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setView('analysis');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload-audio/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setMidiHex(data.midi);
    } catch (error) {
      console.error('MIDI extraction failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {view === 'landing' ? (
        <LandingScreen onUpload={handleUpload} onRecord={() => setView('analysis')} />
      ) : (
        <AnalysisView audioUrl={audioUrl} midiHex={midiHex} />
      )}
    </div>
  );
};

export default App;
