import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/atoms/Button";
import TextField from "../../components/atoms/TextField";
import { motion } from "framer-motion";
import Typography from "../../components/atoms/Typography";
import { updateUserProfile } from "../../api/userService";

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false); // For loading state

  const [initialData, setInitialData] = useState({
    firstName: "",
    lastName: "",
  });
  const [formData, setFormData] = useState({ firstName: "", lastName: "" });
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null); // For errors

  useEffect(() => {
    if (user) {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      };
      setInitialData(userData);
      setFormData(userData);
    }
  }, [user]);

  useEffect(() => {
    const hasChanged =
      formData.firstName !== initialData.firstName ||
      formData.lastName !== initialData.lastName;
    setIsDirty(hasChanged);
  }, [formData, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Call the new API service function
      const response = await updateUserProfile(formData);

      // Update the global user state with the response from the server
      updateUser(response.data); 

      // Update the 'initialData' to the new saved state
      setInitialData(formData);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Could not save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }} 
    >
      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 max-w-lg">
        <div>
          <Typography variant="h6" className="font-semibold mb-1">
            Personal Information
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Update your personal details here.
          </Typography>
        </div>

        <TextField
          label="Email"
          value={user?.email || ""}
          disabled
          fullWidth
          helperText="Contact support to change your email address."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 md:gap-x-6">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
        </div>

        {error && (
          <Typography color="error" className="text-sm">
            {error}
          </Typography>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            theme="primary"
            disabled={!isDirty || isSaving}
            loading={isSaving}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
