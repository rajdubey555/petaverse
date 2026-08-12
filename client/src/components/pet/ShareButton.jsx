import { memo, useState, useCallback } from 'react';
import { FiShare2, FiLink, FiTwitter, FiFacebook, FiMail, FiCheck } from 'react-icons/fi';
import { cn } from '../../utils/cn';

const ShareButton = ({
  petId,
  petName,
  shareUrl,
  shareText,
  size = 'sm',
  variant = 'ghost',
  disabled = false,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = shareUrl || (typeof window !== 'undefined' ? `${window.location.origin}/pets/${petId}` : `/pets/${petId}`);
  const text = shareText || (petName ? `Check out ${petName} on PetVerse!` : 'Check out this pet on PetVerse!');

  const handleToggle = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
    setCopied(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setCopied(false);
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleShare = useCallback(
    (platform) => {
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);

      let shareLink = '';
      let windowFeatures = 'width=600,height=400,location=no,toolbar=no';

      switch (platform) {
        case 'twitter':
          shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
          break;
        case 'facebook':
          shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
          break;
        case 'email':
          shareLink = `mailto:?subject=${encodedText}&body=${encodedUrl}`;
          windowFeatures = '';
          break;
        default:
          break;
      }

      if (shareLink) {
        if (windowFeatures) {
          window.open(shareLink, '_blank', windowFeatures);
        } else {
          window.location.href = shareLink;
        }
      }

      setIsOpen(false);
    },
    [url, text]
  );

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-sm px-4 py-2',
  };

  const variantClasses = {
    ghost: 'text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10',
    outline: 'border border-neutral-300 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400',
    subtle: 'text-neutral-400 dark:text-neutral-500 hover:text-primary-500 dark:hover:text-primary-400',
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size] || sizeClasses.sm,
          variantClasses[variant] || variantClasses.ghost,
          isOpen && 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400',
          className
        )}
        aria-label="Share this pet"
        aria-expanded={isOpen}
        aria-haspopup="true"
        {...props}
      >
        <FiShare2 size={size === 'lg' ? 16 : 14} />
        <span>Share</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
          />
          <div className="absolute bottom-full left-0 mb-2 z-50 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 py-1.5 animate-slide-up">
            <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Share via
            </div>

            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <FiTwitter className="text-[#1DA1F2]" size={16} />
              Twitter
            </button>

            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <FiFacebook className="text-[#1877F2]" size={16} />
              Facebook
            </button>

            <button
              onClick={() => handleShare('email')}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <FiMail className="text-neutral-500 dark:text-neutral-400" size={16} />
              Email
            </button>

            <div className="border-t border-neutral-100 dark:border-neutral-700 my-1" />

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              {copied ? (
                <>
                  <FiCheck className="text-green-500" size={16} />
                  <span className="text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <FiLink className="text-neutral-500 dark:text-neutral-400" size={16} />
                  Copy link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(ShareButton);