import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiBell,
  FiShield,
  FiTrash2,
  FiSave,
  FiAlertCircle,
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiGlobe,
} from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfileMutation, useDeleteAccountMutation } from '../store/api/userApi';
import { useUploadSingleMutation } from '../store/api/uploadApi';
import { ROUTES } from '../config/routes';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import UserAvatar from '../components/user/UserAvatar';
import { useDispatch } from 'react-redux';
import { clearCredentials } from '../store/slices/authSlice';
import { baseApi } from '../store/api/baseApi';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'danger', label: 'Danger Zone', icon: FiShield },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile form state
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: { city: '', state: '' },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Preferences state
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadSingle, { isLoading: isUploading }] = useUploadSingleMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: {
          city: user.location?.city || '',
          state: user.location?.state || '',
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors((prev) => ({
        ...prev,
        avatar: 'Image must be less than 5MB',
      }));
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setFormErrors((prev) => ({ ...prev, avatar: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (formData.phone && !/^[+]?[\d\s()-]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid phone number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) return;

    try {
      let avatarData = null;

      if (avatarFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', avatarFile);
        const uploadResult = await uploadSingle(uploadFormData).unwrap();
        avatarData = uploadResult.data;
      }

      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        location: {
          city: formData.location.city.trim() || undefined,
          state: formData.location.state.trim() || undefined,
        },
      };

      if (avatarData) {
        payload.avatar = {
          url: avatarData.url,
          publicId: avatarData.publicId,
        };
      }

      await updateProfile(payload).unwrap();
      setSuccessMessage('Profile updated successfully!');
      setAvatarFile(null);
      setAvatarPreview(null);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setFormErrors({
        general: err?.data?.message || 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      dispatch(clearCredentials());
      dispatch(baseApi.util.resetApiState());
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      // Error handled by toast middleware
    }
  };

  const isLoading = isUpdating || isUploading;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="mb-8"
      >

        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
          Settings
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-8"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm"
        >
          <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
          {successMessage}
        </motion.div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card padding="lg">
            {/* General Error */}
            {formErrors.general && (
              <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {formErrors.general}
                </p>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  <UserAvatar
                    src={avatarPreview || user?.avatar?.url}
                    alt={user?.name || 'User'}
                    size="xl"
                  />
                  <div>
                    <label className="cursor-pointer">
                      <span className="btn btn-ghost text-sm px-4 py-2">
                        Change Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      JPG, PNG or WebP. Max 5MB.
                    </p>
                    {formErrors.avatar && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.avatar}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Name */}
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                placeholder="Your full name"
                required
              />

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                  className="input min-h-[80px] resize-y"
                  maxLength={300}
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {formData.bio.length}/300 characters
                </p>
              </div>

              {/* Phone */}
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={formErrors.phone}
                placeholder="+91 98765 43210"
                type="tel"
              />

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                />
                <Input
                  label="State"
                  name="state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Button type="submit" isLoading={isLoading}>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}


      {/* Danger Zone Tab */}
      {activeTab === 'danger' && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Card padding="lg" className="border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <FiTrash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Delete Account
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                  Permanently delete your account and all associated data. This
                  includes all your pet listings, saved pets, and reports. This
                  action cannot be undone.
                </p>
                <Button
                  variant="danger"
                  className="mt-4"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete My Account
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Delete Account Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you absolutely sure you want to delete your account? All your data, including listings, saved pets, and reports will be permanently removed. This action cannot be undone."
        variant="danger"
        confirmLabel="Delete My Account"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default SettingsPage;