import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowLeft,
    FiUpload,
    FiX,
    FiSave,
    FiAlertCircle,
    FiImage,
    FiInfo,
    FiTrash2,
} from 'react-icons/fi';
import { useGetPetByIdQuery, useUpdatePetMutation, useDeletePetMutation } from '../store/api/petApi';
import { useUploadSingleMutation, useDeleteImageMutation } from '../store/api/uploadApi';
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
import ConfirmDialog from '../components/common/ConfirmDialog';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SIZES = [
    { value: 'small', label: 'Small (0-10 kg)' },
    { value: 'medium', label: 'Medium (10-25 kg)' },
    { value: 'large', label: 'Large (25-45 kg)' },
    { value: 'extra-large', label: 'Extra Large (45+ kg)' },
];

const speciesOptions = Object.entries(SPECIES_CONFIG).map(([key, val]) => ({
    value: key,
    label: `${val.icon} ${val.label}`,
}));

const listingTypeOptions = Object.entries(LISTING_TYPES).map(([key, val]) => ({
    value: key,
    label: val,
}));

const genderOptions = GENDERS.map((g) => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }));

const ageUnitOptions = Object.entries(AGE_UNITS).map(([key, val]) => ({
    value: key,
    label: val,
}));

const EditPetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { data: petData, isLoading: petLoading, error: petError } = useGetPetByIdQuery(id);
    const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();
    const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
    const [uploadSingle] = useUploadSingleMutation();
    const [deleteImage] = useDeleteImageMutation();

    const pet = petData?.data;

    const [formData, setFormData] = useState({
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
        status: 'available',
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (pet) {
            setFormData({
                name: pet.name || '',
                species: pet.species || '',
                breed: pet.breed || '',
                age: { value: pet.age?.value || '', unit: pet.age?.unit || 'years' },
                gender: pet.gender || '',
                size: pet.size || '',
                color: pet.color || '',
                description: pet.description || '',
                healthStatus: {
                    vaccinated: pet.healthStatus?.vaccinated || false,
                    neutered: pet.healthStatus?.neutered || false,
                    dewormed: pet.healthStatus?.dewormed || false,
                    notes: pet.healthStatus?.notes || '',
                },
                listingType: pet.listingType || 'adoption',
                price: pet.price || '',
                isNegotiable: pet.isNegotiable || false,
                location: {
                    city: pet.location?.city || '',
                    state: pet.location?.state || '',
                    country: 'India',
                },
                tags: pet.tags?.join(', ') || '',
                status: pet.status || 'available',
            });
            setExistingImages(pet.images || []);
        }
    }, [pet]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'ageValue' || name === 'ageUnit') {
            setFormData((prev) => ({
                ...prev,
                age: {
                    ...prev.age,
                    [name === 'ageValue' ? 'value' : 'unit']: type === 'number' ? Number(value) : value,
                },
            }));
        } else if (name === 'city' || name === 'state') {
            setFormData((prev) => ({
                ...prev,
                location: { ...prev.location, [name]: value },
            }));
        } else if (['vaccinated', 'neutered', 'dewormed'].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                healthStatus: { ...prev.healthStatus, [name]: checked },
            }));
        } else if (name === 'healthNotes') {
            setFormData((prev) => ({
                ...prev,
                healthStatus: { ...prev.healthStatus, notes: value },
            }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        setFormErrors((prev) => ({ ...prev, [name]: '' }));
        setSubmitError('');
    };

    const handleNewImagesAdd = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const totalImages = existingImages.length + newImageFiles.length + files.length;
        if (totalImages > (UPLOAD.MAX_IMAGES || 5)) {
            setFormErrors((prev) => ({
                ...prev,
                images: `Maximum ${UPLOAD.MAX_IMAGES || 5} images allowed per listing.`,
            }));
            return;
        }

        const validFiles = [];
        const validPreviews = [];
        let errorMsg = '';

        files.forEach((file) => {
            if (!UPLOAD.ALLOWED_MIME_TYPES.includes(file.type)) {
                errorMsg = `⚠️ "${file.name}" is an invalid format. Only JPG, PNG, and WebP images are allowed.`;
                return;
            }
            if (file.size > (UPLOAD.MAX_FILE_SIZE || 5 * 1024 * 1024)) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                errorMsg = `⚠️ "${file.name}" (${sizeMB} MB) exceeds the 5MB size limit! Please upload images under 5MB.`;
                return;
            }
            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        });

        if (errorMsg) {
            setFormErrors((prev) => ({ ...prev, images: errorMsg }));
        }

        if (validFiles.length > 0) {
            setNewImageFiles((prev) => [...prev, ...validFiles]);
            setNewImagePreviews((prev) => [...prev, ...validPreviews]);
            if (!errorMsg) setFormErrors((prev) => ({ ...prev, images: '' }));
        }
    };

    const handleRemoveExistingImage = async (index) => {
        const image = existingImages[index];
        if (image.publicId) {
            try {
                await deleteImage(image.publicId).unwrap();
            } catch {
                // Silently fail - image may already be deleted
            }
        }
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        URL.revokeObjectURL(newImagePreviews[index]);
        setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
        if (existingImages.length === 0 && newImageFiles.length === 0) {
            errors.images = 'At least one image is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (!validate()) return;

        try {
            // Upload new images
            let uploadedImages = [];
            for (const file of newImageFiles) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', file);
                const uploadResult = await uploadSingle(uploadFormData).unwrap();
                if (uploadResult.data) {
                    uploadedImages.push(uploadResult.data);
                }
            }

            const allImages = [
                ...existingImages.map((img) => ({
                    url: img.url,
                    publicId: img.publicId,
                    isPrimary: existingImages.indexOf(img) === 0 && newImageFiles.length === 0,
                })),
                ...uploadedImages.map((img, index) => ({
                    url: img.url,
                    publicId: img.publicId,
                    isPrimary: existingImages.length === 0 && index === 0,
                })),
            ];

            const payload = {
                id,
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
                images: allImages,
                tags: formData.tags
                    ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
                    : [],
                status: formData.status,
            };

            await updatePet(payload).unwrap();
            navigate(ROUTES.PET_DETAIL(id), { replace: true });
        } catch (err) {
            setSubmitError(err?.data?.message || 'Failed to update listing. Please try again.');
        }
    };

    const handleDelete = async () => {
        try {
            await deletePet(id).unwrap();
            navigate(ROUTES.MY_LISTINGS, { replace: true });
        } catch {
            // Error handled by toast middleware
        }
    };

    const statusOptions = [
        { value: 'available', label: 'Available' },
        { value: 'adopted', label: 'Adopted' },
        { value: 'pending', label: 'Pending' },
        { value: 'removed', label: 'Removed' },
    ];

    if (petLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center py-20">
                    <Spinner size="lg" />
                </div>
            </div>
        );
    }

    if (petError || !pet) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <EmptyState
                    icon={FiAlertCircle}
                    title="Listing Not Found"
                    description="The pet listing you're trying to edit doesn't exist or has been removed."
                    action={{
                        label: 'Back to My Listings',
                        onClick: () => navigate(ROUTES.MY_LISTINGS),
                    }}
                />
            </div>
        );
    }

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
                    to={ROUTES.PET_DETAIL(id)}
                    className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to Listing</span>
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Edit Listing
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    Update details for {pet.name}
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
            >
                <Card padding="lg">
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
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, species: value }));
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
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, gender: value }));
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
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    age: { ...prev.age, unit: value },
                                                }))
                                            }
                                            options={ageUnitOptions}
                                            className="w-32"
                                        />
                                    </div>
                                </div>
                                <Select
                                    label="Size"
                                    value={formData.size}
                                    onChange={(value) => {
                                        setFormData((prev) => ({ ...prev, size: value }));
                                        setFormErrors((prev) => ({ ...prev, size: '' }));
                                    }}
                                    options={SIZES}
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
                                <Select
                                    label="Status"
                                    value={formData.status}
                                    onChange={(value) =>
                                        setFormData((prev) => ({ ...prev, status: value }))
                                    }
                                    options={statusOptions}
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
                                    onChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            listingType: value,
                                            price: value === 'adoption' ? '' : prev.price,
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
                                    placeholder="Describe your pet's personality, habits, special needs..."
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
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Vaccinated</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="neutered"
                                        checked={formData.healthStatus.neutered}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Neutered / Spayed</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="dewormed"
                                        checked={formData.healthStatus.dewormed}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Dewormed</span>
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
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <FiImage className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    Images <span className="text-red-500">*</span>
                                </span>
                                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                                    Max 5MB per file • JPG, PNG, WebP
                                </span>
                            </h3>

                            <div className="relative rounded-2xl p-1">
                                {isUploading && (
                                    <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center gap-2.5 text-white p-4 animate-fade-in">
                                        <div className="w-9 h-9 border-3 border-white/30 border-t-amber-400 rounded-full animate-spin" />
                                        <p className="text-sm font-extrabold tracking-tight">Uploading new photos to Cloudinary...</p>
                                        <p className="text-xs text-neutral-300 font-medium">Please wait while images are processed</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {existingImages.map((image, index) => (
                                        <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 shadow-sm border border-neutral-200 dark:border-neutral-700 group">
                                            <img
                                                src={image.url}
                                                alt={`Pet ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <button
                                                type="button"
                                                disabled={isLoading}
                                                onClick={() => handleRemoveExistingImage(index)}
                                                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all shadow-md"
                                                title="Delete photo"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                            {index === 0 && newImageFiles.length === 0 && (
                                                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-primary-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    {newImagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 shadow-sm border border-neutral-200 dark:border-neutral-700 group">
                                            <img
                                                src={preview}
                                                alt={`New ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <button
                                                type="button"
                                                disabled={isLoading}
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 active:scale-95 transition-all shadow-md"
                                                title="Remove photo"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(existingImages.length + newImageFiles.length) < (UPLOAD.MAX_IMAGES || 5) && (
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-600 flex flex-col items-center justify-center gap-2 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-500/5 transition-all cursor-pointer group"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FiUpload className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Add Image</span>
                                            <span className="text-[10px] text-neutral-400">Max 5MB</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleNewImagesAdd}
                                className="hidden"
                            />

                            {formErrors.images && (
                                <div className="mt-3 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs font-semibold shadow-sm">
                                    <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <span>{formErrors.images}</span>
                                </div>
                            )}
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
                        </section>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <FiTrash2 className="w-4 h-4" />
                                Delete Listing
                            </Button>
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate(ROUTES.PET_DETAIL(id))}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={isUpdating}>
                                    <FiSave className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </motion.div>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Listing"
                message={`Are you sure you want to delete "${pet?.name}"? This action cannot be undone.`}
                variant="danger"
                confirmLabel="Delete"
                isLoading={isDeleting}
            />
        </div>
    );
};

export default EditPetPage;