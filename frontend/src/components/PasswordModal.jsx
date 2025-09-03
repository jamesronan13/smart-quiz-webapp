import React, { useState } from "react";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function PasswordModal({ onClose, onSave }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    // Basic password validation - you can customize these rules
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSave = async () => {
    setError("");
    
    // Validation checks
    if (!currentPassword.trim()) {
      setError("Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("User not authenticated");
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Call the onSave callback
      onSave(newPassword);
      onClose();
    } catch (error) {
      console.error("Password update error:", error);
      
      // Handle specific Firebase errors
      switch (error.code) {
        case 'auth/wrong-password':
          setError("Current password is incorrect");
          break;
        case 'auth/weak-password':
          setError("New password is too weak");
          break;
        case 'auth/requires-recent-login':
          setError("Please log out and log back in before changing your password");
          break;
        default:
          setError("Failed to update password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-600 hover:text-black hover:font-bold hover:scale-105 transition-transform duration-300"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-lg font-poppins font-bold mb-4">Change Password</h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-poppins">
            {error}
          </div>
        )}

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-poppins font-medium mb-2">Current Password</label>
          <div className="flex items-center gap-2">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full font-poppins border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter current password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="text-sm font-poppins text-six hover:underline"
              disabled={loading}
            >
              {showCurrentPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-poppins font-medium mb-2">New Password</label>
          <div className="flex items-center gap-2">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full font-poppins border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter new password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-sm font-poppins text-six hover:underline"
              disabled={loading}
            >
              {showNewPassword ? "Hide" : "Show"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-poppins">
            Password must be at least 6 characters long
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="block text-sm font-poppins font-medium mb-2">Confirm New Password</label>
          <div className="flex items-center gap-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full font-poppins border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm new password"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-sm font-poppins text-six hover:underline"
              disabled={loading}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="text-black font-poppins px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-one font-poppins px-4 py-2 bg-six rounded-lg hover:bg-seven transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}