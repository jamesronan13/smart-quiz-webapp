import React, { useState } from "react";

export default function AvatarModal({ currentImg, onClose, onSave }) {
  const [previewImg, setPreviewImg] = useState(currentImg);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImg(imageUrl);
    }
  };

  const handleSave = () => {
    onSave(previewImg); // Update the image to parent para di na refresh
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black hover:font-bold hover:scale-105 transition-transform duration-300"
        >
          ✕
        </button>

        <h2 className="text-lg font-poppins font-bold mb-4">Update Avatar</h2>

        <div className="flex justify-center mb-6">
          <img
            src={previewImg}
            alt="Avatar Preview"
            className="w-24 h-24 rounded-full object-cover border-4 border-four shadow-md"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 font-poppins text-sm"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-black font-poppins px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-one font-poppins px-4 py-2 bg-six rounded-lg hover:bg-seven"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
