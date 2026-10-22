import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import {
    FiCamera,
    FiUpload,
    FiCheckCircle,
    FiAlertCircle,
    FiShield,
    FiArrowRight,
    FiInfo,
    FiHeart,
    FiMapPin,
} from 'react-icons/fi';
import { Button, Card } from '../components/common';
import { ROUTES } from '../config/routes';

const ScannerPage = () => {
    const navigate = useNavigate();

    // QR Scanner States
    const [scanResult, setScanResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const scannerRef = useRef(null);
    const qrFileInputRef = useRef(null);

    // Initialize/Stop QR Scanner
    useEffect(() => {
        if (cameraActive) {
            const html5QrCode = new Html5Qrcode('qr-reader');
            scannerRef.current = html5QrCode;

            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            html5QrCode
                .start(
                    { facingMode: 'environment' },
                    config,
                    (decodedText) => {
                        handleQrSuccess(decodedText);
                    },
                    () => {
                        // In frame but no QR yet - ignore
                    }
                )
                .catch((err) => {
                    console.error('Camera start error:', err);
                    setCameraError('Camera access denied or unavailable. You can upload a QR image instead.');
                    setCameraActive(false);
                });

            return () => {
                if (scannerRef.current && scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(() => {});
                }
            };
        }
    }, [cameraActive]);

    const handleQrSuccess = (decodedText) => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
            setCameraActive(false);
        }

        setScanResult(decodedText);

        // Check if it's a pet URL or ID
        const petUrlMatch = decodedText.match(/\/pets\/([a-zA-Z0-9]+)/);
        if (petUrlMatch && petUrlMatch[1]) {
            setTimeout(() => {
                navigate(`/pets/${petUrlMatch[1]}`);
            }, 1200);
        }
    };

    const handleQrFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCameraError(null);
        const html5QrCode = new Html5Qrcode('qr-hidden-reader');
        html5QrCode
            .scanFile(file, true)
            .then((decodedText) => {
                handleQrSuccess(decodedText);
            })
            .catch(() => {
                setCameraError('Could not detect a valid QR code in this image. Please try a clearer screenshot or photo.');
            });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
            {/* Hidden div for file-based QR decoding */}
            <div id="qr-hidden-reader" style={{ display: 'none' }} />

            {/* Header Hero */}
            <section className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white overflow-hidden py-14 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4"
                    >
                        <FiShield className="w-4 h-4 text-amber-200" />
                        Lost & Found Safety Tag Ecosystem
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        Pet Collar QR Scanner
                    </h1>
                    <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl mx-auto">
                        Found a lost pet? Scan their PetVerse Smart Collar Tag with your camera to access emergency owner contact and medical information immediately.
                    </p>
                </div>
            </section>

            {/* Main Interactive Workspace */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="p-6 sm:p-8 bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 rounded-3xl">
                        <div className="text-center max-w-md mx-auto mb-6">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2">
                                <FiCamera className="w-5 h-5 text-amber-500" />
                                Scan Pet Digital Collar Tag
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                Point your device camera at the physical collar QR code or upload a screenshot/photo.
                            </p>
                        </div>

                        {/* Camera Viewport or Start Prompt */}
                        <div className="relative max-w-sm mx-auto aspect-square rounded-2xl bg-neutral-900 overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-amber-500/50 shadow-inner">
                            <div id="qr-reader" className="w-full h-full" />

                            {!cameraActive && !scanResult && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neutral-900/90 text-white z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
                                        <FiCamera className="w-8 h-8 text-amber-400" />
                                    </div>
                                    <h3 className="font-bold text-sm text-white mb-1">
                                        Camera Is Inactive
                                    </h3>
                                    <p className="text-xs text-neutral-400 mb-4 max-w-xs">
                                        Click below to enable your camera or upload a QR image from your device.
                                    </p>
                                    <Button
                                        onClick={() => { setCameraError(null); setCameraActive(true); }}
                                        variant="primary"
                                        size="sm"
                                        className="rounded-xl flex items-center gap-2"
                                    >
                                        <FiCamera className="w-4 h-4" />
                                        Enable Live Camera
                                    </Button>
                                </div>
                            )}

                            {scanResult && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-emerald-950/95 text-white z-20">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-3 text-emerald-400">
                                        <FiCheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-base text-white">
                                        Pet Collar Tag Detected!
                                    </h3>
                                    <p className="text-xs text-emerald-300 mt-1 font-mono break-all max-w-xs">
                                        {scanResult}
                                    </p>
                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            onClick={() => {
                                                const petMatch = scanResult.match(/\/pets\/([a-zA-Z0-9]+)/);
                                                if (petMatch && petMatch[1]) {
                                                    navigate(`/pets/${petMatch[1]}`);
                                                } else {
                                                    window.open(scanResult, '_blank');
                                                }
                                            }}
                                            variant="success"
                                            size="sm"
                                            className="rounded-xl flex items-center gap-1.5"
                                        >
                                            Open Pet Passport <FiArrowRight className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            onClick={() => { setScanResult(null); setCameraActive(true); }}
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-white border-white/30"
                                        >
                                            Scan Again
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Error Alert */}
                        {cameraError && (
                            <div className="mt-4 max-w-sm mx-auto p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                                <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{cameraError}</span>
                            </div>
                        )}

                        {/* Alternative: Upload QR File */}
                        <div className="mt-6 text-center border-t border-neutral-100 dark:border-neutral-700/80 pt-6">
                            <input
                                ref={qrFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleQrFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => qrFileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                                <FiUpload className="w-4 h-4" />
                                Or Upload Image / Screenshot of QR Tag
                            </button>
                        </div>
                    </Card>

                    {/* How It Works Explainer Card */}
                    <div className="mt-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/60">
                        <div className="flex items-start gap-3">
                            <FiInfo className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                                <p className="font-bold text-sm">How PetVerse Smart Collar Tags Work:</p>
                                <p>
                                    1. Every pet listed on PetVerse receives a unique encrypted Collar QR Passport.
                                </p>
                                <p>
                                    2. Pet owners can download and print the physical tag to attach to their pet's collar.
                                </p>
                                <p>
                                    3. If the pet wanders away, anyone finding them can scan the tag with any smartphone camera or this scanner to view emergency contact numbers and vaccination status instantly.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ScannerPage;
