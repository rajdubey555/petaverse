import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import {
    FiX,
    FiDownload,
    FiPrinter,
    FiShield,
    FiPhone,
    FiMapPin,
    FiCheck,
    FiCopy,
    FiAlertCircle,
} from 'react-icons/fi';
import { SPECIES_CONFIG } from '../../config/constants';
import { formatAge } from '../../utils/formatters';

const PetQrModal = ({ isOpen, onClose, pet }) => {
    const [qrDataUrl, setQrDataUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const cardRef = useRef(null);

    const petUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/pets/${pet?._id}`
        : `https://petaverse-kappa.vercel.app/pets/${pet?._id}`;

    useEffect(() => {
        if (isOpen && pet?._id) {
            QRCode.toDataURL(petUrl, {
                width: 320,
                margin: 2,
                color: {
                    dark: '#1e293b',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'H',
            })
                .then((url) => setQrDataUrl(url))
                .catch((err) => console.error('Failed to generate QR:', err));
        }
    }, [isOpen, pet?._id, petUrl]);

    if (!isOpen || !pet) return null;

    const speciesInfo = SPECIES_CONFIG[pet.species];
    const isLost = pet.listingType === 'lost';
    const emergencyPhone = pet.contactInfo?.phone || pet.owner?.phone || 'Not Provided';

    const handleCopy = () => {
        navigator.clipboard.writeText(petUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `${pet.name.replace(/\s+/g, '_')}_PetVerse_Collar_Tag.png`;
        link.href = qrDataUrl;
        link.click();
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8"
                >
                    {/* Header bar */}
                    <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-600/10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
                                <FiShield className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-base leading-tight">
                                    Smart Collar Tag & QR Passport
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    Official PetVerse Safety Registry
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Printable Collar Tag Card */}
                    <div className="p-6">
                        <div
                            ref={cardRef}
                            className="relative rounded-2xl p-6 bg-gradient-to-br from-neutral-900 via-neutral-850 to-neutral-950 text-white shadow-xl border border-neutral-700/80 overflow-hidden"
                        >
                            {/* Decorative accent badges */}
                            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs">
                                        PV
                                    </div>
                                    <span className="font-extrabold tracking-wider text-xs uppercase text-amber-400">
                                        PetVerse Smart Tag
                                    </span>
                                </div>
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                        isLost
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                    }`}
                                >
                                    {isLost ? 'LOST ALERT' : pet.listingType}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
                                {/* Pet Photo & Details */}
                                <div className="sm:col-span-2 space-y-3">
                                    <div className="flex items-center gap-3">
                                        {pet.images?.[0]?.url ? (
                                            <img
                                                src={pet.images[0].url}
                                                alt={pet.name}
                                                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/50 shadow-md"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-2xl border border-neutral-700">
                                                {speciesInfo?.icon || '🐾'}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                                {pet.name}
                                                <span className="text-sm font-normal text-amber-400">
                                                    ({speciesInfo?.label || pet.species})
                                                </span>
                                            </h4>
                                            <p className="text-xs text-neutral-400">
                                                {pet.breed || 'Mixed Breed'} • {formatAge(pet.age)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 pt-1 text-xs text-neutral-300">
                                        {pet.location?.city && (
                                            <div className="flex items-center gap-1.5 text-neutral-400">
                                                <FiMapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                                <span>{pet.location.city}, {pet.location.state}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                            <FiPhone className="w-3.5 h-3.5 flex-shrink-0" />
                                            <span>Emergency: {emergencyPhone}</span>
                                        </div>
                                    </div>

                                    {/* Vaccination chips */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {pet.healthStatus?.vaccinated && (
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                                                ✓ Vaccinated
                                            </span>
                                        )}
                                        {pet.healthStatus?.neutered && (
                                            <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[10px] font-semibold">
                                                ✓ Neutered
                                            </span>
                                        )}
                                        {pet.healthStatus?.dewormed && (
                                            <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 text-[10px] font-semibold">
                                                ✓ Dewormed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* QR Code Box */}
                                <div className="sm:col-span-1 flex flex-col items-center justify-center text-center">
                                    <div className="p-2 bg-white rounded-2xl shadow-xl border-2 border-amber-400">
                                        {qrDataUrl ? (
                                            <img
                                                src={qrDataUrl}
                                                alt={`QR Code for ${pet.name}`}
                                                className="w-28 h-28 object-contain"
                                            />
                                        ) : (
                                            <div className="w-28 h-28 bg-neutral-200 animate-pulse rounded-lg" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                                        Scan to Identify
                                    </p>
                                </div>
                            </div>

                            {/* Tag Footer */}
                            <div className="relative z-10 mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                                <span>Tag ID: <span className="font-mono text-neutral-300">{pet._id.slice(-8).toUpperCase()}</span></span>
                                <span>Scan via smartphone camera</span>
                            </div>
                        </div>

                        {/* Informative Callout */}
                        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                            <FiAlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                                <strong className="font-semibold">How it works:</strong> Anyone who scans this QR code with their phone's camera is immediately redirected to {pet.name}'s live medical & contact passport to report them safely.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download QR
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                                <FiPrinter className="w-4 h-4" />
                                Print Collar Tag
                            </button>
                            <button
                                onClick={handleCopy}
                                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                                {copied ? <FiCheck className="w-4 h-4 text-emerald-500" /> : <FiCopy className="w-4 h-4" />}
                                {copied ? 'Copied URL!' : 'Copy Link'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PetQrModal;
