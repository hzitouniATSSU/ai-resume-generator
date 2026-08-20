import { useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/tailor`;

function ResumeGeneratorPanel({ resumeText, jobDescription }) {
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const canGenerate = Boolean(resumeText?.trim() && jobDescription?.trim());

  const generateResume = async () => {
    if (!canGenerate || loading) return;

    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText.trim(),
          job_description: jobDescription.trim(),
        }),
      });

      if (!response.ok) {
        let message = "Unable to tailor the resume. Please try again.";

        try {
          const data = await response.json();
          message = data.detail || data.message || message;
        } catch {
          // The server did not return a JSON error response.
        }

        throw new Error(message);
      }

      const data = await response.json();

      if (!data.tailored_resume) {
        throw new Error("The server returned an empty resume.");
      }

      setTailoredResume(data.tailored_resume);
    } catch (requestError) {
      setError(
        requestError instanceof TypeError
          ? "Could not connect to the resume service. Make sure the backend is running."
          : requestError.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const copyResume = async () => {
    try {
      await navigator.clipboard.writeText(tailoredResume);
      setCopied(true);
    } catch {
      setError("Could not copy the resume to your clipboard.");
    }
  };

  const downloadResume = async () => {
    try {
      setError("");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/export-pdf`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: tailoredResume,
          title: "Tailored Resume",
        }),
      });
      if (!response.ok){
        throw new Error("Could not create the PDF.");
      }
    const pdfBlob = await response.blob();
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "tailored-resume.pdf";
    link.click();
    URL.revokeObjectURL(url);
  }catch (error){
    setError(error.message || "could not download the resume as a PDF.")
  }
};

  return (
    <section className="space-y-4 rounded-lg border p-4" aria-labelledby="resume-generator-title">
      <div>
        <h2 id="resume-generator-title" className="text-lg font-semibold">
          Tailored Resume
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Generate an ATS-friendly version of your resume for this role.
        </p>
      </div>

      <button
        type="button"
        onClick={generateResume}
        disabled={!canGenerate || loading}
        className="rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading ? "Tailoring resume…" : "Generate tailored resume"}
      </button>

      {!canGenerate && (
        <p className="text-sm text-amber-700">
          Upload a resume and paste a job description to continue.
        </p>
      )}

      {error && (
        <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {tailoredResume && (
        <div className="space-y-3">
          <textarea
            aria-label="Generated tailored resume"
            value={tailoredResume}
            onChange={(event) => {
              setTailoredResume(event.target.value);
              setCopied(false);
            }}
            className="min-h-96 w-full rounded border p-3 font-mono text-sm"
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyResume}
              className="rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={downloadResume}
              className="rounded border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Download .pdf
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResumeGeneratorPanel;
