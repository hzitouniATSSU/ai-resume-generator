import { useState } from "react";

function UploadPanel({ onResumeExtracted}){
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file) => {
        if (!file) return;
        setFileName(file.name);
        setLoading(true);


    const formData = new FormData();
    formData.append("file", file);

    try{
        const response = await fetch("http://localhost:8000/upload",{
            method: "POST",
            body: formData
        });
        const data = await response.json();
        onResumeExtracted(data.extracted_text);
    }catch(err){
        console.error("Upload Failed", err)
    } finally{
        setLoading(false);
    }
    };
    

    return(
        <div className="border rounded-lg p-4">
            <label className="block font-medium mb-2">Upload Resume (PDF)</label>
            <input 
            type="file"
            accept="application/pdf"
            onChange={(e) =>
                handleUpload(e.target.files[0])}
                />
                {loading && <p
                className="text-sm text-gray-500mt-2">Extracting Text...</p>}
                {fileName && !loading && <p className="text-sm text-gray-600mt-2">Uploaded: {fileName}</p>}
        </div>
    );
}

export default UploadPanel;
