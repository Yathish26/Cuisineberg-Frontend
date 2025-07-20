import { useState } from "react";

function PhotoUpload({ newItem, setNewItem, setIsPhotoLibraryOpen }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${import.meta.env.VITE_API_URL}/upload-image`, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.imageUrl) {
            setNewItem({ ...newItem, photoURL: data.imageUrl });
          }
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        // Handle error
        alert("Image upload failed. Please try again.");
      };

      xhr.send(formData);
    } catch (err) {
      setIsUploading(false);
      alert("Upload error.");
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>

      {newItem.photoURL && (
        <div className="mb-2 flex items-center gap-3">
          <img
            src={newItem.photoURL}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => setNewItem({ ...newItem, photoURL: "" })}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <label className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg cursor-pointer text-gray-700 font-medium transition-colors relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {isUploading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span className="text-xs">Uploading... {uploadProgress}%</span>
            </div>
          ) : (
            "Upload Photo"
          )}
        </label>

        <button
          type="button"
          onClick={() => setIsPhotoLibraryOpen(true)}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
        >
          Select from Library
        </button>
      </div>

      {isUploading && (
        <div className="w-full mt-2 bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1">JPG, PNG, or GIF. Max 5MB.</p>
    </div>
  );
}

export default PhotoUpload;
