// components/LandingScreen.jsx
import React, { useRef } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import 'react-piano/dist/styles.css';

const firstNote = MidiNumbers.fromNote('a0');
const lastNote = MidiNumbers.fromNote('c8');
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote,
  lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const LandingScreen = ({ onUpload, onRecord }) => {
  const fileInputRef = useRef();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="absolute top-4 left-4 text-2xl font-serif font-bold">Legato</div>
      <h1 className="text-3xl md:text-4xl text-center font-light mt-24">
        Turn every piano recording into an instant lesson.
      </h1>
      <div className="mt-6 flex gap-4 flex-wrap justify-center">
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-black text-white px-6 py-3 rounded-md text-lg hover:bg-gray-800"
        >
          Upload Recording
        </button>
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={(e) => onUpload(e.target.files[0])}
          className="hidden"
        />
        <button
          onClick={onRecord}
          className="bg-gray-100 text-black px-6 py-3 rounded-md text-lg hover:bg-gray-200"
        >
          Record Live
        </button>
      </div>
      <div className="mt-auto w-full pt-12">
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={() => {}}
          stopNote={() => {}}
          disabled
          width={window.innerWidth}
          keyboardShortcuts={keyboardShortcuts}
        />
      </div>
    </div>
  );
};

export default LandingScreen;
