import { memo, useState, useCallback } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiFileText, FiSave } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import Input from '../common/Input';
import Button from '../common/Button';
import UserAvatar from './UserAvatar';
import { validateEmail, validatePhone } from '../../utils/validators';

const ProfileForm = ({
  user,
  onSubmit,
  isSubmitting = false,
  error: externalError = null,
  className,
  ...props
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    city: user?.location?.city || '',
    state: user?.location?.state || '',
    country: user?.location?.country || '',
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors]
  );

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (formData.name && formData.name.trim().length > 100) {
      newErrors.name = 'Name cannot exceed 100 characters.';
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) return;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: formData.country.trim(),
        },
      };

      if (onSubmit) {
        await onSubmit(payload);
      }
    },
    [formData, validate, onSubmit]
  );

  const displayError = externalError || (Object.keys(errors).length > 0 ? 'Please fix the errors below.' : null);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
      {...props}
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-700/50">
        <UserAvatar
          src={user?.avatar?.url}
          name={user?.name}
          size="xl"
        />
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Profile Photo
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Your avatar is managed via Google account settings.
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {displayError && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-400">
          {displayError}
        </div>
      )}

      {/* Personal Info */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <FiUser size={16} className="text-neutral-400" />
          Personal Information
        </h4>

        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Enter your full name"
          error={errors.name}
          required
          maxLength={100}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="Enter your email"
          error={errors.email}
          leftIcon={FiMail}
          disabled={isSubmitting}
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="+91 98765 43210"
          error={errors.phone}
          leftIcon={FiPhone}
          helperText="Optional. Used for pet listing contact information."
          disabled={isSubmitting}
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <FiMapPin size={16} className="text-neutral-400" />
          Location
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange('city')}
            placeholder="Mumbai"
            disabled={isSubmitting}
          />

          <Input
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange('state')}
            placeholder="Maharashtra"
            disabled={isSubmitting}
          />
        </div>

        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange('country')}
          placeholder="India"
          disabled={isSubmitting}
        />
      </div>

      {/* Bio */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <FiFileText size={16} className="text-neutral-400" />
          About You
        </h4>

        <Input
          label="Bio"
          name="bio"
          type="textarea"
          value={formData.bio}
          onChange={handleChange('bio')}
          placeholder="Tell us a bit about yourself and your love for pets..."
          error={errors.bio}
          rows={4}
          maxLength={500}
          helperText={`${formData.bio.length}/500 characters`}
          disabled={isSubmitting}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-700/50">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          leftIcon={FiSave}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default memo(ProfileForm);