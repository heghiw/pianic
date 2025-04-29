# Piano Performance Analyzer

## Overview

This project develops a web application that processes clean solo piano recordings (uploaded or recorded live) and transforms them into an interactive, musician-friendly visual breakdown.  
The system is intended not only to "teach" a piece but to present it in a structured, analyzable format suitable for study and practice.

## Core Functionality

### 1. Audio-to-MIDI Conversion
- Convert input audio (.mp3 or .wav) into MIDI-style note data.
- Extract for each note:
  - Pitch
  - Start time
  - Duration
  - (Optional) Velocity
- Estimate global tempo (BPM).
- (Optional) Identify key signature and time signature.

### 2. Hand Assignment
- Assign notes to left or right hand.
- Perform basic assignment based on pitch range or clustering.
- Prioritize plausible and playable assignment over complete accuracy.

### 3. Section Detection
- Segment the piece into logical units (bars, phrases, or rests).
- Utilize tempo estimation, rhythmic patterns, and pauses for segmentation.

### 4. (Optional Future Extensions)
- Chord labeling.
- Export analysis results to MIDI or MusicXML formats.

## System Architecture

### Frontend
- **Framework:** React or Next.js
- **Functionality:**
  - File upload and live recording interface.
  - Interactive visualization of note breakdowns.
  - Section highlighting and hand separation display.

### Backend
- **Framework:** FastAPI or Flask
- **Functionality:**
  - Audio preprocessing and feature extraction.
  - Model inference (Audio-to-MIDI transcription, hand assignment, segmentation).
  - Data formatting for frontend consumption.

### Machine Learning Models
- **Audio-to-MIDI:** Onsets and Frames model (or similar transcription models).
- **Hand Assignment:** Heuristic-based or lightweight clustering.
- **Section Detection:** Rule-based segmentation combined with tempo analysis.

### Data Storage
- Temporary storage of uploaded audio and generated MIDI data.
- Structured JSON output for frontend rendering.

## Technical Requirements

- **Input:** Audio file (.mp3 or .wav)
- **Output:** Structured note and performance data (visual and downloadable)
- **Performance Goals:**
  - Efficient processing of typical solo piano recordings (~3–7 minutes).
  - High transcription accuracy for clear, monophonic/mildly polyphonic recordings.
  - Low-latency API responses for interactive use.

## Project Goals

- Deliver accurate, musician-usable performance breakdowns.
- Build a modular system to enable future extensions such as:
  - Chord recognition
  - Advanced dynamic analysis
  - Full MusicXML export
- Maintain separation of concerns between frontend (visualization) and backend (processing).

