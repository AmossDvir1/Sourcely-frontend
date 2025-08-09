import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { CustomButton as Button } from '../../components/atoms/CustomButton';
import { TextField } from '@mui/material';
import { motion } from 'framer-motion';
import Typography from '../../components/atoms/Typography';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [isDirty, setIsDirty] = useState(false);

  // Populate form with user data on load
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
    }
  }, [user]);

  // Check if form has changed from initial state
  useEffect(() => {
    if (user) {
      const hasChanged =
        formData.firstName !== user.firstName || formData.lastName !== user.lastName;
      setIsDirty(hasChanged);
    }
  }, [formData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving data:', formData);
    // Add your API call logic here to update user details
    setIsDirty(false); // Reset dirty state after save
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
        <div>
          <Typography variant="h5" className="font-semibold mb-1">Personal Information</Typography>
          <Typography variant="body2" className="text-gray-500">Update your personal details here.</Typography>
        </div>

        {/* Email Field (Disabled) */}
        <TextField
          label="Email"
          value={user?.email || ''}
          disabled
          fullWidth
          variant="outlined"
          helperText="Contact support to change your email address."
        />

        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" theme="primary" disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}