import { memo } from 'react';
import {
    FiClock,
    FiMapPin,
    FiHeart,
    FiActivity,
    FiInfo,
    FiCalendar,
    FiShield,
    FiTag,
    FiCheckCircle,
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { SPECIES_CONFIG, SIZES, GENDERS, AGE_UNITS } from '../../config/constants';
import { formatDate } from '../../utils/formatters';

const formatAge = (age) => {
    if (!age) return 'N/A';
    if (typeof age === 'object') {
        const val = age.value ?? age.years ?? age.age;
        if (!val && val !== 0) return 'N/A';
        const unit = age.unit || 'years';
        const unitLabel = AGE_UNITS.find((u) => u.value === unit)?.label || unit;
        const displayUnit = val === 1 ? unitLabel.replace(/s$/, '') : unitLabel;
        return `${val} ${displayUnit}`;
    }
    return `${age} years old`;
};

const InfoItem = ({ icon: Icon, label, value, className }) => (
    <div className={cn('p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-700/60', className)}>
        <div className="flex items-center gap-1.5 mb-1">
            <Icon size={14} className="text-amber-500 flex-shrink-0" />
            <dt className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {label}
            </dt>
        </div>
        <dd className="text-sm font-bold text-neutral-900 dark:text-neutral-100 break-words capitalize">
            {value}
        </dd>
    </div>
);

const PetInfo = ({ pet, className, ...props }) => {
    if (!pet) {
        return (
            <div className={cn('text-center py-6', className)} {...props}>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">No pet specifications available.</p>
            </div>
        );
    }

    const {
        species,
        breed,
        age,
        gender,
        size,
        color,
        status,
        location,
        createdAt,
        healthStatus,
    } = pet;

    const speciesInfo = SPECIES_CONFIG[species];
    const sizeLabel = SIZES.find((s) => s.value === size)?.label || size;
    const genderLabel = GENDERS.find((g) => g.value === gender)?.label || gender;
    const ageDisplay = formatAge(age);
    const locationDisplay = location?.city
        ? [location.city, location.state].filter(Boolean).join(', ')
        : 'Not Specified';

    return (
        <div className={cn('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 space-y-6', className)} {...props}>
            <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <FiInfo className="w-4 h-4 text-amber-500" />
                    Pet Specifications & Attributes
                </h2>

                {/* Key Details Grid */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <InfoItem
                        icon={FiTag}
                        label="Species"
                        value={speciesInfo ? `${speciesInfo.icon} ${speciesInfo.label}` : species}
                    />

                    {breed && (
                        <InfoItem
                            icon={FiShield}
                            label="Breed"
                            value={breed}
                        />
                    )}

                    {ageDisplay !== 'N/A' && (
                        <InfoItem
                            icon={FiClock}
                            label="Age"
                            value={ageDisplay}
                        />
                    )}

                    {genderLabel && (
                        <InfoItem
                            icon={FiHeart}
                            label="Gender"
                            value={genderLabel}
                        />
                    )}

                    {sizeLabel && (
                        <InfoItem
                            icon={FiActivity}
                            label="Size"
                            value={sizeLabel}
                        />
                    )}

                    {color && (
                        <InfoItem
                            icon={FiInfo}
                            label="Color"
                            value={
                                <span className="flex items-center gap-1.5">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-neutral-600 inline-block flex-shrink-0"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    <span>{color}</span>
                                </span>
                            }
                        />
                    )}

                    {locationDisplay && (
                        <InfoItem
                            icon={FiMapPin}
                            label="Location"
                            value={locationDisplay}
                        />
                    )}

                    {status && (
                        <InfoItem
                            icon={FiCheckCircle}
                            label="Status"
                            value={status.charAt(0).toUpperCase() + status.slice(1)}
                        />
                    )}
                </dl>
            </div>

            {/* Medical / Health Summary Badges */}
            {healthStatus && (healthStatus.vaccinated || healthStatus.neutered || healthStatus.dewormed || healthStatus.microchipped) && (
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-750">
                    <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <FiShield className="w-3.5 h-3.5 text-emerald-500" />
                        Medical & Care Status
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {healthStatus.vaccinated && (
                            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
                                ✓ Fully Vaccinated
                            </span>
                        )}
                        {healthStatus.neutered && (
                            <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold flex items-center gap-1 border border-blue-500/20">
                                ✓ Neutered / Spayed
                            </span>
                        )}
                        {healthStatus.dewormed && (
                            <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold flex items-center gap-1 border border-purple-500/20">
                                ✓ Dewormed
                            </span>
                        )}
                        {healthStatus.microchipped && (
                            <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1 border border-amber-500/20">
                                ✓ Microchipped
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(PetInfo);