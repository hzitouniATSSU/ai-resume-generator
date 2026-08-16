import { useState } from "react";


const emptyForm = {
     jobDescription: "",
    companyName: "",
    roleTitle: ""
  };

function JobInfoPanel({onJobInfoChange}){
    const [formData, setFormData] = useState(emptyForm);
    const handleChange = (field, value) => {
        const updated = { ...formData, [field]: value};
        setFormData(updated);
        onJobInfoChange(updated);
    };


return(
    <div className="border rounded-lg p-4 space-y-3">
<textarea
    value={formData.jobDescription}
    onChange={(e) => handleChange("jobDescription", e.target.value)}
    placeholder="Paste job description" className="w-full border rounded p-2"/>
    <input
        value={formData.companyName}
        onChange={(e) => handleChange("companyName", e.target.value)}
        placeholder="Paste the company Name" className="w-full border rounded p-2"/>
    <input
        value={formData.roleTitle}
        onChange={(e) => handleChange("roleTitle", e.target.value)}
        placeholder="Paste role title" className="w-full border rounded p-2"/>

   </div>
);
}
export default JobInfoPanel;
