# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile
from basic_pitch.inference import predict_and_save
import os

app = FastAPI()

# CORS for local frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    # Save uploaded audio file to a temporary location
    with NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        contents = await file.read()
        temp_audio.write(contents)
        temp_audio_path = temp_audio.name

    # Define MIDI output path
    midi_output_path = temp_audio_path.replace(".wav", ".mid")

    # Run Basic Pitch to generate MIDI
    predict_and_save(
        [temp_audio_path],
        output_directory=os.path.dirname(temp_audio_path),
        save_midi=True
    )

    # Read MIDI file and encode it as a hex string
    with open(midi_output_path, "rb") as midi_file:
        midi_data = midi_file.read()

    # Cleanup temp files
    os.remove(temp_audio_path)
    os.remove(midi_output_path)

    return {"midi": midi_data.hex()}
