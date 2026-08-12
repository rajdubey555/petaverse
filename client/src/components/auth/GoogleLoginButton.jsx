import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { FiAlertCircle } from 'react-icons/fi';
import cn from '../../utils/cn';

/**
 * GoogleLoginButton — Official Google OAuth Sign-In component
 * Powered by @react-oauth/google with One-Tap support.
 */

const GoogleLoginButton = ({
    onSuccess,
    onError,
    isLoading = false,
    error,
    fullWidth = true,
    className,
}) => {
    return (
        <div className={cn('flex flex-col gap-2 items-center w-full', className)}>
            <div className={cn('w-full flex justify-center [&>div]:w-full', fullWidth && 'w-full')}>
                <GoogleLogin
                    onSuccess={(credentialResponse) => {
                        if (credentialResponse?.credential) {
                            onSuccess?.(credentialResponse.credential);
                        } else {
                            onError?.('Google did not return a valid credential token.');
                        }
                    }}
                    onError={() => {
                        onError?.('Google Login failed. Please try again or check Client ID.');
                    }}
                    useOneTap
                    theme="outline"
                    shape="pill"
                    size="large"
                    text="signin_with"
                    width="100%"
                />
            </div>

            {error && (
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 w-full"
                    role="alert"
                >
                    <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;