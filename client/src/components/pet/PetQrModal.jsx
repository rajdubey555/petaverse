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
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef(null);

    const petUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/pets/${pet?._id}`
        : `https://petaverse-kappa.vercel.app/pets/${pet?._id}`;

    useEffect(() => {
        if (isOpen && pet?._id) {
            QRCode.toDataURL(petUrl, {
                width: 360,
                margin: 1,
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
    const ageString = formatAge(pet.age);

    const handleCopy = () => {
        navigator.clipboard.writeText(petUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Download the ENTIRE Smart Collar ID Card as a PNG image
    const handleDownloadCard = async () => {
        setIsDownloading(true);

        try {
            const canvas = document.createElement('canvas');
            const width = 800;
            const height = 480;
            canvas.width = width * 2; // 2x Retina resolution
            canvas.height = height * 2;
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);

            const drawRoundedRect = (x, y, w, h, r) => {
                ctx.beginPath();
                ctx.moveTo(x + r, y);
                ctx.arcTo(x + w, y, x + w, y + h, r);
                ctx.arcTo(x + w, y + h, x, y + h, r);
                ctx.arcTo(x, y + h, x, y, r);
                ctx.arcTo(x, y, x + w, y, r);
                ctx.closePath();
            };

            // 1. Background
            drawRoundedRect(0, 0, width, height, 30);
            const bgGradient = ctx.createLinearGradient(0, 0, width, height);
            bgGradient.addColorStop(0, '#121216');
            bgGradient.addColorStop(1, '#09090d');
            ctx.fillStyle = bgGradient;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2d3748';
            ctx.stroke();

            // Glow effect in background
            const glow = ctx.createRadialGradient(100, 100, 10, 100, 100, 220);
            glow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
            glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            // 2. Top Header Bar
            // PV Logo
            drawRoundedRect(40, 30, 44, 44, 12);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PV', 62, 52);

            // Title
            ctx.textAlign = 'left';
            ctx.font = '900 16px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText('PETVERSE SMART TAG', 96, 52);

            // Badge on right
            const badgeText = isLost ? 'LOST ALERT' : (pet.listingType || 'ADOPTION').toUpperCase();
            drawRoundedRect(width - 165, 34, 125, 34, 17);
            ctx.fillStyle = isLost ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = isLost ? '#ef4444' : '#10b981';
            ctx.stroke();

            ctx.textAlign = 'center';
            ctx.fillStyle = isLost ? '#f87171' : '#34d399';
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillText(badgeText, width - 102, 51);

            // Top divider
            ctx.beginPath();
            ctx.moveTo(40, 92);
            ctx.lineTo(width - 40, 92);
            ctx.strokeStyle = '#262626';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // 3. Pet Photo
            const photoX = 40;
            const photoY = 115;
            const photoSize = 115;
            let imgDrawn = false;

            if (pet.images?.[0]?.url) {
                try {
                    const petImg = new Image();
                    petImg.crossOrigin = 'anonymous';
                    petImg.src = pet.images[0].url;
                    await new Promise((res, rej) => {
                        petImg.onload = res;
                        petImg.onerror = rej;
                        setTimeout(rej, 2000);
                    });

                    ctx.save();
                    drawRoundedRect(photoX, photoY, photoSize, photoSize, 20);
                    ctx.clip();
                    ctx.drawImage(petImg, photoX, photoY, photoSize, photoSize);
                    ctx.restore();

                    drawRoundedRect(photoX, photoY, photoSize, photoSize, 20);
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = '#f59e0b';
                    ctx.stroke();
                    imgDrawn = true;
                } catch {
                    imgDrawn = false;
                }
            }

            if (!imgDrawn) {
                drawRoundedRect(photoX, photoY, photoSize, photoSize, 20);
                ctx.fillStyle = '#262626';
                ctx.fill();
                drawRoundedRect(photoX, photoY, photoSize, photoSize, 20);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#404040';
                ctx.stroke();

                ctx.fillStyle = '#f59e0b';
                ctx.font = '40px system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('🐾', photoX + photoSize / 2, photoY + photoSize / 2 + 5);
            }

            // 4. Pet Details Column
            const detailsX = photoX + photoSize + 22;
            ctx.textAlign = 'left';

            // Pet Name & Species
            ctx.font = '900 28px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(pet.name, detailsX, 142);

            const nameWidth = ctx.measureText(pet.name).width;
            ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#f59e0b';
            ctx.fillText(`(${speciesInfo?.label || pet.species})`, detailsX + nameWidth + 10, 142);

            // Breed and Clean Age
            ctx.font = '500 14px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(`${pet.breed || 'Mixed Breed'} • ${ageString}`, detailsX, 172);

            // Location
            if (pet.location?.city) {
                ctx.font = '500 14px system-ui, -apple-system, sans-serif';
                ctx.fillStyle = '#cbd5e1';
                ctx.fillText(`📍 ${pet.location.city}, ${pet.location.state || ''}`, detailsX, 198);
            }

            // Emergency Phone
            ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#34d399';
            ctx.fillText(`📞 Emergency: ${emergencyPhone}`, 40, 268);

            // Health Badges (Vaccinated / Neutered)
            let badgeX = 40;
            const drawPill = (text, bg, fg) => {
                ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
                const pillW = ctx.measureText(text).width + 18;
                drawRoundedRect(badgeX, 290, pillW, 24, 7);
                ctx.fillStyle = bg;
                ctx.fill();
                ctx.fillStyle = fg;
                ctx.textAlign = 'center';
                ctx.fillText(text, badgeX + pillW / 2, 306);
                badgeX += pillW + 8;
                ctx.textAlign = 'left';
            };

            if (pet.healthStatus?.vaccinated) drawPill('✓ Vaccinated', 'rgba(16, 185, 129, 0.2)', '#6ee7b7');
            if (pet.healthStatus?.neutered) drawPill('✓ Neutered', 'rgba(59, 130, 246, 0.2)', '#93c5fd');
            if (pet.healthStatus?.dewormed) drawPill('✓ Dewormed', 'rgba(168, 85, 247, 0.2)', '#d8b4fe');

            // 5. QR Code Box (Right Side)
            const qrBoxSize = 185;
            const qrBoxX = width - qrBoxSize - 40;
            const qrBoxY = 115;

            drawRoundedRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#f59e0b';
            ctx.stroke();

            if (qrDataUrl) {
                const qrImg = new Image();
                qrImg.src = qrDataUrl;
                await new Promise((res) => {
                    qrImg.onload = res;
                    setTimeout(res, 500);
                });
                ctx.drawImage(qrImg, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20);
            }

            ctx.textAlign = 'center';
            ctx.font = '900 12px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#fcd34d';
            ctx.fillText('SCAN TO IDENTIFY', qrBoxX + qrBoxSize / 2, qrBoxY + qrBoxSize + 22);

            // 6. Bottom Footer
            ctx.beginPath();
            ctx.moveTo(40, 400);
            ctx.lineTo(width - 40, 400);
            ctx.strokeStyle = '#262626';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.font = '600 12px system-ui, -apple-system, sans-serif';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(`Tag ID: ${pet._id.slice(-8).toUpperCase()}`, 40, 435);

            ctx.textAlign = 'right';
            ctx.fillText('Scan via smartphone camera to view medical passport', width - 40, 435);

            // Download Trigger
            const finalImage = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${pet.name.replace(/\s+/g, '_')}_PetVerse_Collar_Tag.png`;
            link.href = finalImage;
            link.click();
        } catch (err) {
            console.error('Failed to render card canvas:', err);
            // Fallback: download raw QR
            const link = document.createElement('a');
            link.download = `${pet.name.replace(/\s+/g, '_')}_PetVerse_QR.png`;
            link.href = qrDataUrl;
            link.click();
        } finally {
            setIsDownloading(false);
        }
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
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${isLost
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
                                                {pet.breed || 'Mixed Breed'} • {ageString}
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
                                onClick={handleDownloadCard}
                                disabled={isDownloading}
                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all disabled:opacity-75"
                            >
                                <FiDownload className="w-4 h-4" />
                                {isDownloading ? 'Rendering Card...' : 'Download Card'}
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
