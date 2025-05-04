// components/AnalysisView.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';
import { Midi } from '@tonejs/midi';
import WaveSurfer from 'wavesurfer.js';
import 'react-piano/dist/styles.css';

const firstNote = MidiNumbers.fromNote('a0');
const lastNote = MidiNumbers.fromNote('c8');
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote,
  lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

const AnalysisView = ({ audioUrl, midiHex }) => {
  const [notes, setNotes] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!midiHex) return;
    const byteArray = new Uint8Array(
      midiHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
    );
    const midi = new Midi(byteArray);
    const extracted = [];

    midi.tracks.forEach((track) => {
      track.notes.forEach((note) => {
        extracted.push({
          midi: note.midi,
          pitch: note.name,
          start: note.time,
          duration: note.duration,
          velocity: note.velocity,
        });
      });
    });
    setNotes(extracted);
  }, [midiHex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!audioUrl || !waveformRef.current) return;
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#ddd',
      progressColor: '#555',
      height: 80,
      barWidth: 2,
      responsive: true,
    });
    wavesurferRef.current.load(audioUrl);

    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration || 1;
        wavesurferRef.current.seekTo(current / duration);
      };
    }

    waveformRef.current.addEventListener('dblclick', (e) => {
      const rect = waveformRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = x / rect.width;
      const newTime = percent * (audioRef.current?.duration || 0);
      if (audioRef.current) audioRef.current.currentTime = newTime;
    });

    return () => wavesurferRef.current && wavesurferRef.current.destroy();
  }, [audioUrl]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div ref={waveformRef} className="w-full bg-gray-100 rounded overflow-hidden" />

      <div className="relative h-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {notes.map((note, idx) => {
            const offset = ((note.start - currentTime) * 100).toFixed(2);
            const width = (note.duration * 100).toFixed(2);
            const keyIndex = note.midi - 21;
            const left = `${(keyIndex / 88) * 100}%`;
            const bg = note.midi < 60 ? 'bg-green-400' : 'bg-yellow-400';
            return (
              <div
                key={idx}
                className={`absolute top-0 h-4 ${bg} opacity-70 rounded`}
                style={{
                  left,
                  width: `${width}px`,
                  transform: `translateX(${offset}px)`,
                }}
              />
            );
          })}
        </div>
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          playNote={() => {}}
          stopNote={() => {}}
          disabled
          width={window.innerWidth}
          keyboardShortcuts={keyboardShortcuts}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => audioRef.current?.play()}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Play
          </button>
          <button
            onClick={() => audioRef.current?.pause()}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Pause
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Current Time: {currentTime.toFixed(2)}s
        </div>
        <div className="text-sm text-gray-600">BPM: 95 | Key: C Major</div>
      </div>

      {audioUrl && (
        <audio ref={audioRef} controls className="mt-4 w-full">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AnalysisView;
