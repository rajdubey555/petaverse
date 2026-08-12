import { memo, useState, useCallback } from 'react';
import { FiMail, FiPhone, FiMessageCircle, FiUser, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { cn } from '../../utils/cn';
import Button from '../common/Button';

const PetContactCard = ({
    pet,
    owner: rawOwner,
    contactInfo: rawContactInfo,
    listingType: rawListingType,
    petName: rawPetName,
    className,
    onContact,
    ...props
}) => {
    const owner = rawOwner || pet?.owner;
    const contactInfo = rawContactInfo || pet?.contactInfo || (owner ? { phone: owner.phone, email: owner.email, preferredMethod: 'phone' } : null);
    const listingType = rawListingType || pet?.listingType;
    const petName = rawPetName || pet?.name;
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    const handleShowPhone = useCallback(() => {
        setShowPhone(true);
    }, []);

    const handleShowEmail = useCallback(() => {
        setShowEmail(true);
    }, []);

    const preferredMethod = contactInfo?.preferredMethod || 'email';

    if (!owner && !contactInfo) {
        return (
            <div
                className={cn(
                    'bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6',
                    className
                )}
                {...props}
            >
                <div className="text-center">
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiAlertCircle size={20} className="text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Contact information not available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden',
                className
            )}
            {...props}
        >
            {/* Owner Info Header */}
            {owner && (
                <div className="p-5 border-b border-neutral-100 dark:border-neutral-700/50">
                    <div className="flex items-center gap-3">
                        {owner.avatar?.url ? (
                            <img
                                src={owner.avatar.url}
                                alt={owner.name || 'Owner'}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-700"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center ring-2 ring-neutral-100 dark:ring-neutral-700">
                                <FiUser size={20} className="text-primary-600 dark:text-primary-400" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {owner.name || 'Pet Owner'}
                            </h3>
                            {owner.location && (owner.location.city || owner.location.state) && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                                    <FiMapPin size={10} />
                                    {[owner.location.city, owner.location.state].filter(Boolean).join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Methods */}
            <div className="p-5 space-y-3">
                <h4 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Contact {owner?.name ? owner.name.split(' ')[0] : 'Owner'}
                </h4>

                {/* Phone */}
                {contactInfo?.phone && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                                <FiPhone size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Phone</p>
                                {showPhone ? (
                                    <a
                                        href={`tel:${contactInfo.phone}`}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        {contactInfo.phone}
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleShowPhone}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        Show phone number
                                    </button>
                                )}
                            </div>
                        </div>
                        {preferredMethod === 'phone' && (
                            <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-medium rounded-full">
                                Preferred
                            </span>
                        )}
                    </div>
                )}

                {/* Email */}
                {contactInfo?.email && (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                                <FiMail size={16} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                                {showEmail ? (
                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline break-all"
                                    >
                                        {contactInfo.email}
                                    </a>
                                ) : (
                                    <button
                                        onClick={handleShowEmail}
                                        className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                    >
                                        Show email address
                                    </button>
                                )}
                            </div>
                        </div>
                        {preferredMethod === 'email' && (
                            <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-medium rounded-full">
                                Preferred
                            </span>
                        )}
                    </div>
                )}

                {/* No contact info but has owner */}
                {!contactInfo?.phone && !contactInfo?.email && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-2">
                        No direct contact information provided.
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="p-5 pt-0 space-y-2">
                {contactInfo?.phone && (
                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={() => {
                            if (onContact) {
                                onContact({ method: 'phone', value: contactInfo.phone });
                            }
                            setShowPhone(true);
                            window.location.href = `tel:${contactInfo.phone}`;
                        }}
                        leftIcon={FiPhone}
                    >
                        Call Now
                    </Button>
                )}

                {contactInfo?.email && (
                    <Button
                        variant="primary"
                        size="md"
                        fullWidth
                        onClick={() => {
                            if (onContact) {
                                onContact({ method: 'email', value: contactInfo.email });
                            }
                            setShowEmail(true);
                            window.location.href = `mailto:${contactInfo.email}`;
                        }}
                        leftIcon={FiMail}
                    >
                        Send Email
                    </Button>
                )}
            </div>

            {/* Safety Notice */}
            <div className="px-5 pb-5">
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                    <FiAlertCircle
                        size={14}
                        className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                        Stay safe! Meet in public places and verify information before making any payments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default memo(PetContactCard);