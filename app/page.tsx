"use client";

import { useState } from "react";

export default function Home() {

  const [files, setFiles] = useState<FileList | null>(null);

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<
    { filename: string; transcript: string }[]
  >([]);

  const [currentFile, setCurrentFile] = useState("");

  const [progress, setProgress] = useState(0);

  const [totalFiles, setTotalFiles] = useState(0);

  const handleUpload = async () => {

    if (!files || files.length === 0) {
      alert("Please select audio files");
      return;
    }

    setLoading(true);
    setResults([]);

    setTotalFiles(files.length);

    const transcripts: {
      filename: string;
      transcript: string;
    }[] = [];

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      setCurrentFile(file.name);

      setProgress(i + 1);

      const formData = new FormData();

      formData.append("audio", file);

      try {

        const response = await fetch(
          "https://fine-comics-talk.loca.lt/transcribe",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        transcripts.push({
          filename: file.name,
          transcript:
            data.transcript || "No transcript generated",
        });

      } catch (error) {

        transcripts.push({
          filename: file.name,
          transcript: "Error generating transcript",
        });
      }
    }

    setResults(transcripts);

    setLoading(false);

    setCurrentFile("");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-5xl">

        <h1 className="text-5xl font-bold text-center mb-4">
          Lawyer Audio Transcriber
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Upload legal audio recordings and generate transcripts.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">

          <input
            type="file"
            multiple
            accept=".mp3,.wav,.m4a"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full"
          />

        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl text-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
        >

          {loading
            ? "Generating Transcripts..."
            : "Generate Transcripts"}

        </button>

        {loading && (

          <div className="mt-8 bg-gray-100 rounded-xl p-6">

            <p className="text-lg font-semibold mb-2">
              Processing File {progress} of {totalFiles}
            </p>

            <p className="text-gray-700 break-all">
              {currentFile}
            </p>

            <div className="w-full bg-gray-300 rounded-full h-4 mt-4 overflow-hidden">

              <div
                className="bg-black h-4 transition-all duration-300"
                style={{
                  width: `${(progress / totalFiles) * 100}%`,
                }}
              />

            </div>

          </div>
        )}

        <div className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Transcripts
          </h2>

          {results.length === 0 && !loading && (

            <div className="bg-gray-100 rounded-xl p-6 text-gray-500">
              Transcripts will appear here...
            </div>

          )}

          <div className="space-y-6">

            {results.map((item, index) => (

              <div
                key={index}
                className="bg-gray-100 rounded-xl p-6 whitespace-pre-wrap"
              >

                <h3 className="font-bold text-xl mb-4 break-all">
                  {item.filename}
                </h3>

                <p className="leading-8">
                  {item.transcript}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}