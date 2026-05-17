import whisper
import os

os.environ["PATH"] += os.pathsep + r"C:\Users\Ritesh Office\Downloads\ffmpeg-8.1.1-essentials_build\ffmpeg-8.1.1-essentials_build\bin"

model = whisper.load_model("base")

result = model.transcribe("Destiny Mann Atkeya Dhurandhar The Revenge 128 Kbps.mp3")

print(result["text"])