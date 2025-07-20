import { useState } from "react";

function PhotoURLPicker({ editFields, setEditFields, setIsPhotoLibraryOpen }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.imageUrl) {
            setEditFields(f => ({ ...f, photoURL: data.imageUrl }));
          }
        } else {
          alert("Upload failed.");
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        alert("Error uploading image.");
      };

      xhr.send(formData);
    } catch (error) {
      setIsUploading(false);
      alert("Unexpected error.");
    }
  };

  const removePhoto = () => {
    setEditFields(f => ({ ...f, photoURL: "" }));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>

      {editFields.photoURL && (
        <div className="mb-2 flex items-center gap-3">
          <img
            src={editFields.photoURL}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            onError={(e) => (e.target.style.display = "none")}
          />
          <button
            type="button"
            onClick={removePhoto}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            Remove
          </button>
        </div>
      )}

      <input
        type="url"
        placeholder="Paste image URL here"
        value={editFields.photoURL}
        onChange={e => setEditFields(f => ({ ...f, photoURL: e.target.value }))}
        className="w-full px-4 py-2.5 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
      />

      <div className="flex gap-2">
        <label className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg cursor-pointer text-gray-700 font-medium transition-colors relative">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
          {isUploading ? (
            <div className="flex items-center gap-2 text-xs">
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
              Uploading... {uploadProgress}%
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

      <p className="text-xs text-gray-400 mt-1">Paste image URL or upload JPG, PNG, or GIF (max 5MB).</p>
    </div>
  );
}

export default PhotoURLPicker;
