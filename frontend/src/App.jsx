import { useState } from 'react'
import UploadPanel from './UploadPanel';
import JobInfoPanel from './JobInfoPanel';
import ResumeGeneratorPanel from './ResumeGeneratorPanel';
import CoverLetterPanel from './CoverLetterPanel';

function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobInfo, setJobInfo] = useState({
    jobDescription: "",
    companyName: "",
    roleTitle: ""
  });


  return (
   <div className="max-w-3xl mx-auto p-6 space-y-6">
    <h1 className="text-2xl font-bold">AI Resume & Cover Letter Generator</h1>
    <UploadPanel onResumeExtracted= {setResumeText}/>
    <JobInfoPanel onJobInfoChange= {setJobInfo}/>
    <ResumeGeneratorPanel 
    resumeText={resumeText}
    jobDescription={jobInfo.jobDescription}/>
    <CoverLetterPanel
    resumeText={resumeText}
    jobDescription={jobInfo.jobDescription}
    companyName={jobInfo.companyName}
    roleTitle={jobInfo.roleTitle}
    />
   </div>
  );
}

export default App;
