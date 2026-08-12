import { memo, useState, useCallback } from 'react';
import { FiBell, FiShield, FiAlertTriangle, FiMail, FiPhone, FiEye, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';

const SettingRow = ({ icon: Icon, title, description, enabled, onChange, disabled = false }) => (
  <div className="flex items-start justify-between gap-4 py-4">
    <div className="flex items-start gap-3 min-w-0">
      <span className="flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-neutral-400" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {title}
        </p>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900',
        enabled ? 'bg-primary-500' : 'bg-neutral-300 dark:bg-neutral-600',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  </div>
);

const SettingSection = ({ icon: Icon, title, children }) => (
  <div className="space-y-1">
    <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 pb-2">
      <Icon size={16} className="text-neutral-400" />
      {title}
    </h4>
    <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
      {children}
    </div>
  </div>
);

const SettingsForm = ({
  user,
  preferences = {},
  onSavePreferences,
  onDeactivateAccount,
  isSaving = false,
  isDeactivating = false,
  error: externalError = null,
  className,
  ...props
}) => {
  const [settings, setSettings] = useState({
    emailNotifications: preferences.emailNotifications ?? true,
    emailSavedPets: preferences.emailSavedPets ?? true,
    emailMessages: preferences.emailMessages ?? true,
    emailNewsletter: preferences.emailNewsletter ?? false,
    showPhone: preferences.showPhone ?? false,
    showEmail: preferences.showEmail ?? true,
    showLocation: preferences.showLocation ?? true,
    showProfile: preferences.showProfile ?? true,
  });

  const [isDirty, setIsDirty] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleToggle = useCallback(
    (key) => (value) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      setIsDirty(true);
      setSuccessMessage('');
    },
    []
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      setSuccessMessage('');

      if (onSavePreferences) {
        await onSavePreferences(settings);
      }

      setSuccessMessage('Preferences saved successfully.');
      setIsDirty(false);
    },
    [settings, onSavePreferences]
  );

  const handleDeactivateConfirm = useCallback(async () => {
    if (onDeactivateAccount) {
      await onDeactivateAccount();
    }
    setShowDeactivateDialog(false);
  }, [onDeactivateAccount]);

  const displayError = externalError;

  return (
    <form
      onSubmit={handleSave}
      className={cn('space-y-8', className)}
      noValidate
      {...props}
    >
      {/* Error Banner */}
      {displayError && (
        <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-sm text-red-700 dark:text-red-400">
          {displayError}
        </div>
      )}

      {/* Success Banner */}
      {successMessage && (
        <div className="p-3 bg-accent-50 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/30 rounded-xl text-sm text-accent-700 dark:text-accent-400">
          {successMessage}
        </div>
      )}

      {/* Notification Preferences */}
      <SettingSection icon={FiBell} title="Notification Preferences">
        <SettingRow
          icon={FiMail}
          title="Email Notifications"
          description="Receive email notifications for important account activity."
          enabled={settings.emailNotifications}
          onChange={handleToggle('emailNotifications')}
          disabled={isSaving}
        />
        <SettingRow
          icon={FiMail}
          title="Saved Pet Updates"
          description="Get notified when saved pets are updated or adopted."
          enabled={settings.emailSavedPets}
          onChange={handleToggle('emailSavedPets')}
          disabled={isSaving || !settings.emailNotifications}
        />
        <SettingRow
          icon={FiMail}
          title="Message Notifications"
          description="Receive email alerts when someone messages you about a pet."
          enabled={settings.emailMessages}
          onChange={handleToggle('emailMessages')}
          disabled={isSaving || !settings.emailNotifications}
        />
        <SettingRow
          icon={FiMail}
          title="Newsletter & Tips"
          description="Receive our monthly newsletter with pet care tips and platform updates."
          enabled={settings.emailNewsletter}
          onChange={handleToggle('emailNewsletter')}
          disabled={isSaving || !settings.emailNotifications}
        />
      </SettingSection>

      {/* Privacy Settings */}
      <SettingSection icon={FiShield} title="Privacy Settings">
        <SettingRow
          icon={FiEye}
          title="Show Profile Publicly"
          description="Allow other users to view your profile page."
          enabled={settings.showProfile}
          onChange={handleToggle('showProfile')}
          disabled={isSaving}
        />
        <SettingRow
          icon={FiPhone}
          title="Show Phone Number"
          description="Display your phone number on pet listings you create."
          enabled={settings.showPhone}
          onChange={handleToggle('showPhone')}
          disabled={isSaving}
        />
        <SettingRow
          icon={FiMail}
          title="Show Email Address"
          description="Display your email address on pet listings you create."
          enabled={settings.showEmail}
          onChange={handleToggle('showEmail')}
          disabled={isSaving}
        />
        <SettingRow
          icon={FiEye}
          title="Show Location"
          description="Display your city and state on pet listings and profile."
          enabled={settings.showLocation}
          onChange={handleToggle('showLocation')}
          disabled={isSaving}
        />
      </SettingSection>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-700/50">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSaving}
          disabled={!isDirty || isSaving}
        >
          Save Preferences
        </Button>
      </div>

      {/* Danger Zone */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700/50">
        <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
          <FiAlertTriangle size={16} />
          Danger Zone
        </h4>
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                Deactivate Account
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                Temporarily deactivate your account. Your listings will be hidden. You can reactivate anytime by logging in.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              size="md"
              onClick={() => setShowDeactivateDialog(true)}
              disabled={isDeactivating}
              className="flex-shrink-0"
            >
              Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={handleDeactivateConfirm}
        variant="danger"
        title="Deactivate Your Account?"
        message="Your profile and pet listings will be hidden from other users. You can reactivate your account at any time by logging back in."
        confirmText="Yes, Deactivate"
        cancelText="Cancel"
        isLoading={isDeactivating}
      />
    </form>
  );
};

export default memo(SettingsForm);