import { memo } from 'react';
import {
    FiClock,
    FiMapPin,
    FiHeart,
    FiActivity,
    FiInfo,
} from 'react-icons/fi';
import { cn } from '../../utils/cn';
import { SIZES, GENDERS, AGE_UNITS } from '../../config/constants';

const formatAge = (age) => {
    if (!age) return 'N/A';
    if (typeof age === 'object') {
        const val = age.value ?? age.years ?? age.age;
        if (!val) return 'N/A';
        const unit = age.unit || 'years';
        const unitLabel = AGE_UNITS.find((u) => u.value === unit)?.label || unit;
        const displayUnit = val === 1 ? unitLabel.replace(/s$/, '') : unitLabel;
        return `${val} ${displayUnit}`;
    }
    return `${age} years old`;
};

const InfoItem = ({ icon: Icon, label, value, className }) => (
    <div className={cn('p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-100 dark:border-neutral-700/60', className)}>
        <div className="flex items-center gap-2 mb-1">
            <Icon size={14} className="text-amber-500" />
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
        age,
        gender,
        size,
        color,
    } = pet;

    const sizeLabel = SIZES.find((s) => s.value === size)?.label || size;
    const genderLabel = GENDERS.find((g) => g.value === gender)?.label || gender;
    const ageDisplay = formatAge(age);

    return (
        <div className={cn('bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6', className)} {...props}>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <FiInfo className="w-4 h-4 text-amber-500" />
                Pet Attributes
            </h2>

            {/* Key Details Grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {ageDisplay !== 'N/A' && (
                    <InfoItem icon={FiClock} label="Age" value={ageDisplay} />
                )}

                {genderLabel && (
                    <InfoItem icon={FiHeart} label="Gender" value={genderLabel} />
                )}

                {sizeLabel && (
                    <InfoItem icon={FiActivity} label="Size" value={sizeLabel} />
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
            </dl>
        </div>
    );
};

export default memo(PetInfo);