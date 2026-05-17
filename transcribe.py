from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import uuid

# FFmpeg path
os.environ["PATH"] += os.pathsep + r"C:\Users\Ritesh Office\Downloads\ffmpeg-8.1.1-essentials_build\ffmpeg-8.1.1-essentials_build\bin"

app = Flask(__name__)
CORS(app)

print("Loading Whisper model...")

# You can change:
# tiny / base / small / medium
model = whisper.load_model("medium")

print("Model loaded successfully!")


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():

    try:

        if "audio" not in request.files:
            return jsonify({
                "error": "No audio file uploaded"
            }), 400

        audio_file = request.files["audio"]

        # Generate unique temp filename
        temp_filename = f"{uuid.uuid4()}.mp3"

        # Save uploaded file
        audio_file.save(temp_filename)

        print(f"Processing: {temp_filename}")

        # Validate file
        if os.path.getsize(temp_filename) == 0:

            os.remove(temp_filename)

            return jsonify({
                "error": "Empty audio file"
            }), 400

        # Transcribe
        result = model.transcribe(
            temp_filename,
            language=None,
            fp16=False,
            condition_on_previous_text=False
        )

        transcript = result["text"]

        # Cleanup
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

        return jsonify({
            "transcript": transcript
        })

    except Exception as e:

        print("ERROR:", str(e))

        # Cleanup temp file if exists
        try:
            if os.path.exists(temp_filename):
                os.remove(temp_filename)
        except:
            pass

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)