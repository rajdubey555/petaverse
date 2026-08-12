import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiUpload,
    FiX,
    FiPlus,
    FiSave,
    FiAlertCircle,
    FiImage,
    FiInfo,
} from 'react-icons/fi';
import { useCreatePetMutation } from '../store/api/petApi';
import { useUploadMultipleMutation } from '../store/api/uploadApi';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/routes';
import {
    SPECIES_CONFIG,
    LISTING_TYPES,
    GENDERS,
    AGE_UNITS,
    UPLOAD,
} from '../config/constants';
import { cn } from '../utils/cn';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const speciesOptions = Object.entries(SPECIES_CONFIG).map(([key, val]) => ({
    value: key,
    label: `${val.icon} ${val.label}`,
}));

const listingTypeOptions = [
    { value: 'adoption', label: 'Adoption' },
    { value: 'rehoming', label: 'Rehoming' },
    { value: 'sale', label: 'For Sale' },
    { value: 'lost', label: 'Lost Pet Alert' },
    { value: 'found', label: 'Found Pet Alert' },
];

const genderOptions = [
    { value: 'male', label: 'Male ♂' },
    { value: 'female', label: 'Female ♀' },
    { value: 'unknown', label: 'Unknown / Unsure' },
];

const ageUnitOptions = [
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
];

const sizeOptions = [
    { value: 'small', label: 'Small (0-10 kg)' },
    { value: 'medium', label: 'Medium (10-25 kg)' },
    { value: 'large', label: 'Large (25-45 kg)' },
    { value: 'xlarge', label: 'Extra Large (45+ kg)' },
];

const initialFormData = {
    name: '',
    species: '',
    breed: '',
    age: { value: '', unit: 'years' },
    gender: '',
    size: '',
    color: '',
    description: '',
    healthStatus: { vaccinated: false, neutered: false, dewormed: false, notes: '' },
    listingType: 'adoption',
    price: '',
    isNegotiable: false,
    location: { city: '', state: '', country: 'India' },
    tags: '',
    contactInfo: { preferredMethod: 'phone' },
};

const CreateListingPage = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState(initialFormData);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const [createPet, { isLoading: isCreating }] = useCreatePetMutation();
    const [uploadMultiple, { isLoading: isUploading }] = useUploadMultipleMutation();

    const isLoading = isCreating || isUploading;

    const handleChange = (e) => {
        if (!e) return;
        const target = e.target || e;
        const name = target.name;
        let value = target.value;
        const type = target.type;
        const checked = target.checked;

        if (!name) return;

        // Ensure value is a primitive string/number/boolean, not a DOM element or event object
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            value = value.value || '';
        }

        if (name === 'ageValue' || name === 'ageUnit') {
            const cleanVal = name === 'ageValue' ? (value === '' ? '' : Number(value)) : String(value || '');
            setFormData((prev) => ({
                ...prev,
                age: {
                    ...prev.age,
                    [name === 'ageValue' ? 'value' : 'unit']: cleanVal,
                },
            }));
        } else if (name === 'city' || name === 'state') {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [name]: String(value || '') },
            }));
        } else if (['vaccinated', 'neutered', 'dewormed'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                healthStatus: { ...prev.healthStatus, [name]: Boolean(checked) },
            }));
        } else if (name === 'healthNotes') {
            setFormData((prev) => ({
                ...prev,
                healthStatus: { ...prev.healthStatus, notes: String(value || '') },
            }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: Boolean(checked) }));
        } else if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: String(value || '') }));
        }

        setFormErrors((prev) => ({ ...prev, [name]: '' }));
        setSubmitError('');
    };

    const handleImagesAdd = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const totalImages = imageFiles.length + files.length;
        if (totalImages > UPLOAD.MAX_IMAGES) {
            setFormErrors((prev) => ({
                ...prev,
                images: `Maximum ${UPLOAD.MAX_IMAGES} images allowed`,
            }));
            return;
        }

        const validFiles = [];
        const validPreviews = [];

        files.forEach((file) => {
            if (!UPLOAD.ALLOWED_MIME_TYPES.includes(file.type)) {
                setFormErrors((prev) => ({
                    ...prev,
                    images: 'Only JPG, PNG, and WebP images are allowed',
                }));
                return;
            }
            if (file.size > UPLOAD.MAX_FILE_SIZE) {
                setFormErrors((prev) => ({
                    ...prev,
                    images: `Each image must be less than ${UPLOAD.MAX_FILE_SIZE / (1024 * 1024)}MB`,
                }));
                return;
            }
            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        });

        setImageFiles((prev) => [...prev, ...validFiles]);
        setImagePreviews((prev) => [...prev, ...validPreviews]);
        setFormErrors((prev) => ({ ...prev, images: '' }));
    };

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Pet name is required';
        if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        if (!formData.species) errors.species = 'Species is required';
        if (!formData.breed.trim()) errors.breed = 'Breed is required';
        if (!formData.age.value || formData.age.value < 0) errors.age = 'Valid age is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.size) errors.size = 'Size is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (formData.description.trim().length < 20) errors.description = 'Description must be at least 20 characters';
        if (!formData.location.city.trim()) errors.city = 'City is required';
        if (!formData.location.state.trim()) errors.state = 'State is required';
        if (formData.listingType === 'sale' && !formData.price) errors.price = 'Price is required for sale listings';
        if (imageFiles.length === 0) errors.images = 'At least one image is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        try {
            // Upload images first
            const uploadFormData = new FormData();
            imageFiles.forEach((file) => uploadFormData.append('images', file));
            const uploadResult = await uploadMultiple(uploadFormData).unwrap();
            const uploadedImages = uploadResult.data || [];

            // Prepare payload
            const payload = {
                name: formData.name.trim(),
                species: formData.species,
                breed: formData.breed.trim(),
                age: {
                    value: Number(formData.age.value),
                    unit: formData.age.unit,
                },
                gender: formData.gender,
                size: formData.size,
                color: formData.color.trim() || undefined,
                description: formData.description.trim(),
                healthStatus: {
                    vaccinated: formData.healthStatus.vaccinated,
                    neutered: formData.healthStatus.neutered,
                    dewormed: formData.healthStatus.dewormed,
                    notes: formData.healthStatus.notes.trim() || undefined,
                },
                listingType: formData.listingType,
                price: formData.listingType === 'sale' ? Number(formData.price) : undefined,
                isNegotiable: formData.isNegotiable,
                location: {
                    city: formData.location.city.trim(),
                    state: formData.location.state.trim(),
                    country: 'India',
                },
                images: uploadedImages,
                tags: formData.tags
                    ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
                    : [],
                contactInfo: {
                    preferredMethod: formData.contactInfo.preferredMethod,
                },
            };

            const result = await createPet(payload).unwrap();
            navigate(`/pets/${result.data._id}`, { replace: true });
        } catch (err) {
            console.error('Create pet listing error detail:', err);
            const errorMessage =
                err?.data?.message ||
                (Array.isArray(err?.data?.errors) ? err.data.errors.join(', ') : null) ||
                err?.data?.error ||
                (err?.status === 401 ? 'Please sign in to create a pet listing.' : null) ||
                err?.error ||
                err?.message ||
                'Failed to create listing. Please try again.';
            setSubmitError(errorMessage);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mb-8"
            >
                <Link
                    to={ROUTES.MY_LISTINGS}
                    className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to My Listings</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Create New Listing
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    Fill in the details to list a pet for adoption or sale
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
            >
                <Card padding="lg">
                    {/* Submit Error */}
                    {submitError && (
                        <div className="flex items-start gap-3 p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiInfo className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Pet Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={formErrors.name}
                                    placeholder="e.g., Buddy"
                                    required
                                />
                                <Select
                                    label="Species"
                                    value={formData.species}
                                    onChange={(rawVal) => {
                                        const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                        setFormData((prev) => ({ ...prev, species: val }));
                                        setFormErrors((prev) => ({ ...prev, species: '' }));
                                    }}
                                    options={speciesOptions}
                                    error={formErrors.species}
                                    placeholder="Select species"
                                    required
                                />
                                <Input
                                    label="Breed"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleChange}
                                    error={formErrors.breed}
                                    placeholder="e.g., Golden Retriever"
                                    required
                                />
                                <Select
                                    label="Gender"
                                    value={formData.gender}
                                    onChange={(rawVal) => {
                                        const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                        setFormData((prev) => ({ ...prev, gender: val }));
                                        setFormErrors((prev) => ({ ...prev, gender: '' }));
                                    }}
                                    options={genderOptions}
                                    error={formErrors.gender}
                                    placeholder="Select gender"
                                    required
                                />
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Age <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="ageValue"
                                            type="number"
                                            value={formData.age.value}
                                            onChange={handleChange}
                                            error={formErrors.age}
                                            placeholder="Age"
                                            min="0"
                                            step="0.1"
                                            className="flex-1"
                                        />
                                        <Select
                                            value={formData.age.unit}
                                            onChange={(rawVal) => {
                                                const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    age: { ...prev.age, unit: val },
                                                }));
                                            }}
                                            options={ageUnitOptions}
                                            className="w-32"
                                        />
                                    </div>
                                </div>
                                <Select
                                    label="Size"
                                    value={formData.size}
                                    onChange={(rawVal) => {
                                        const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                        setFormData((prev) => ({ ...prev, size: val }));
                                        setFormErrors((prev) => ({ ...prev, size: '' }));
                                    }}
                                    options={sizeOptions}
                                    error={formErrors.size}
                                    placeholder="Select size"
                                    required
                                />
                                <Input
                                    label="Color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="e.g., Golden, Black & White"
                                />
                            </div>
                        </section>

                        {/* Listing Type & Price */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Listing Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Select
                                    label="Listing Type"
                                    value={formData.listingType}
                                    onChange={(rawVal) => {
                                        const val = typeof rawVal === 'object' && rawVal?.target ? rawVal.target.value : String(rawVal || '');
                                        setFormData((prev) => ({
                                            ...prev,
                                            listingType: val,
                                            price: val === 'adoption' ? '' : prev.price,
                                        }));
                                    }}
                                    options={listingTypeOptions}
                                    required
                                />
                                {formData.listingType === 'sale' && (
                                    <>
                                        <Input
                                            label="Price (₹)"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            error={formErrors.price}
                                            placeholder="e.g., 5000"
                                            min="0"
                                            required
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                name="isNegotiable"
                                                id="isNegotiable"
                                                checked={formData.isNegotiable}
                                                onChange={handleChange}
                                                className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <label htmlFor="isNegotiable" className="text-sm text-neutral-700 dark:text-neutral-300">
                                                Price is negotiable
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Description */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Description
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Describe your pet's personality, habits, special needs, and why they need a new home..."
                                    className={cn(
                                        'input min-h-[120px] resize-y',
                                        formErrors.description && 'input-error'
                                    )}
                                />
                                {formErrors.description && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
                                )}
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {formData.description.length}/2000 characters (min 20)
                                </p>
                            </div>
                        </section>

                        {/* Health Status */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Health Status
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="vaccinated"
                                        checked={formData.healthStatus.vaccinated}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                        Vaccinated
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="neutered"
                                        checked={formData.healthStatus.neutered}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                        Neutered / Spayed
                                    </span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="dewormed"
                                        checked={formData.healthStatus.dewormed}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                        Dewormed
                                    </span>
                                </label>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                                        Health Notes
                                    </label>
                                    <textarea
                                        name="healthNotes"
                                        value={formData.healthStatus.notes}
                                        onChange={handleChange}
                                        rows={2}
                                        placeholder="Any additional health information..."
                                        className="input min-h-[60px] resize-y"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Images */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiImage className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                Images <span className="text-red-500">*</span>
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <FiX className="w-3.5 h-3.5" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary-600 text-white text-xs font-medium">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {imageFiles.length < (UPLOAD.MAX_IMAGES || 5) && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-2 hover:border-primary-400 dark:hover:border-primary-400 transition-colors"
                                    >
                                        <FiUpload className="w-6 h-6 text-neutral-400" />
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            Add Image
                                        </span>
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesAdd}
                                className="hidden"
                            />
                            {formErrors.images && (
                                <p className="text-xs text-red-500 mt-2">{formErrors.images}</p>
                            )}
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                                First image will be the primary photo. Max {(UPLOAD.MAX_IMAGES || 5)} images.
                            </p>
                        </section>

                        {/* Location */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Location
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="City"
                                    name="city"
                                    value={formData.location.city}
                                    onChange={handleChange}
                                    error={formErrors.city}
                                    placeholder="e.g., Mumbai"
                                    required
                                />
                                <Input
                                    label="State"
                                    name="state"
                                    value={formData.location.state}
                                    onChange={handleChange}
                                    error={formErrors.state}
                                    placeholder="e.g., Maharashtra"
                                    required
                                />
                            </div>
                        </section>

                        {/* Tags */}
                        <section>
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Tags
                            </h3>
                            <Input
                                label="Tags (comma separated)"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g., friendly, good with kids, trained"
                            />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Add tags to help people find your pet listing more easily
                            </p>
                        </section>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                                <FiSave className="w-4 h-4" />
                                Create Listing
                            </Button>
                        </div>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
};

export default CreateListingPage;