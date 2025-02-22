import React, { useState } from 'react';
import { X } from 'lucide-react'; // Importing the close icon from lucide-react
import '@/assets/styles/AddProduct.css'; // Ensure you import the CSS file

const ImageUploadPopup = ({ onClose, onUpload, position }) => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const updatedFileNames = files.map((file) => file.name);
      setFileNames(updatedFileNames);
      setSelectedFiles(files);

      // Generate image URLs for the files and upload
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      onUpload(imageUrls, position, files);
      onClose();
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup">
        <div className="popup-header">
          <h2 className='pb-8 text-xl'>Upload Images</h2>
          <X className="close-icon" onClick={onClose} />
        </div>
        <div className="popup-content">
          <label htmlFor="file-upload" className="upload-btn">
            Choose Files
          </label>
          <input
            id="file-upload"
            type="file"
            className="custom-file-input"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {fileNames.length > 0 && (
            <ul className="file-list">
              {fileNames.map((fileName, index) => (
                <li key={index} className="file-name">{fileName}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPopup;
