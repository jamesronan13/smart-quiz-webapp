import React, { useState } from "react";

export default function PasswordModal({ currentPassword, onClose, onSave }) {
  const [previewPassword, setPreviewPassword] = useState(currentPassword || "");
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    onSave(previewPassword); // Pass updated password back to parent
    onClose(); // Close modal after saving (optional)
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

        
        <h2 className="text-lg font-poppins font-bold mb-2">Change Password</h2>

        {/*Add current password tayo for security?*/}
        
        <div className="mb-4">
          <label className="block text-sm font-poppins font-medium mb-2">New Password</label>
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? "text" : "password"}
              value={previewPassword}
              onChange={(e) => setPreviewPassword(e.target.value)}
              className="w-full font-poppins border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-sm font-poppins text-six hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

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
