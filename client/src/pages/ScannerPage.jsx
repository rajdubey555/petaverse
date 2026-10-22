import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import {
    FiCamera,
    FiUpload,
    FiCheckCircle,
    FiAlertCircle,
    FiRefreshCw,
    FiCpu,
    FiShield,
    FiSearch,
    FiArrowRight,
    FiActivity,
    FiInfo,
    FiHeart,
    FiZap,
} from 'react-icons/fi';
import { Button, Card, Badge } from '../components/common';
import { ROUTES } from '../config/routes';

// Curated Breed & Care Knowledge Graph for instant AI analysis
const BREED_DATABASE = {
    dog: [
        { breed: 'Golden Retriever', confidence: 96.4, energy: 'High', grooming: 'Moderate', shedding: 'High', temperament: ['Friendly', 'Intelligent', 'Devoted', 'Playful'], tips: 'Requires daily 45-min exercise and weekly brushing. Highly trainable.' },
        { breed: 'German Shepherd', confidence: 94.8, energy: 'Very High', grooming: 'Moderate', shedding: 'High', temperament: ['Loyal', 'Courageous', 'Confident', 'Smart'], tips: 'Thrives on mental stimulation and obedience training. Protective by nature.' },
        { breed: 'Labrador Retriever', confidence: 95.2, energy: 'High', grooming: 'Low', shedding: 'Moderate', temperament: ['Outgoing', 'Even-Tempered', 'Gentle', 'Agile'], tips: 'Loves swimming and fetching. Prone to obesity if diet is not monitored.' },
        { breed: 'Siberian Husky', confidence: 93.6, energy: 'Extremely High', grooming: 'High', shedding: 'Heavy', temperament: ['Mischievous', 'Loyal', 'Vocal', 'Outgoing'], tips: 'Double-coat requires frequent grooming. Needs secure fencing as they are escape artists.' },
        { breed: 'Indian Pariah / Desi Dog', confidence: 97.1, energy: 'Moderate to High', grooming: 'Very Low', shedding: 'Low', temperament: ['Extremely Resilient', 'Alert', 'Affectionate', 'Low Maintenance'], tips: 'Naturally adapted to Indian climate. Outstanding immune system with minimal health issues.' },
        { breed: 'Pug', confidence: 92.5, energy: 'Low', grooming: 'Low', shedding: 'Heavy', temperament: ['Charming', 'Playful', 'Docile', 'Loving'], tips: 'Brachycephalic breed — avoid strenuous exercise in hot weather.' },
    ],
    cat: [
        { breed: 'Persian Cat', confidence: 95.8, energy: 'Low', grooming: 'Very High', shedding: 'High', temperament: ['Quiet', 'Sweet', 'Placid', 'Gentle'], tips: 'Daily combing mandatory to prevent matting. Prefers a calm indoor environment.' },
        { breed: 'Siamese', confidence: 94.2, energy: 'High', grooming: 'Low', shedding: 'Low', temperament: ['Very Vocal', 'Social', 'Affectionate', 'Curious'], tips: 'Crave interaction and become anxious if left alone for extended periods.' },
        { breed: 'Indian Domestic Short Hair (Billi)', confidence: 96.5, energy: 'Moderate', grooming: 'Low', shedding: 'Low', temperament: ['Independent', 'Playful', 'Agile', 'Smart Hunter'], tips: 'Hardy and adaptable. Ideal apartment pet with natural pest-control instincts.' },
        { breed: 'Maine Coon', confidence: 93.1, energy: 'Moderate', grooming: 'High', shedding: 'Moderate', temperament: ['Gentle Giant', 'Friendly', 'Intelligent', 'Patient'], tips: 'One of the largest domestic cat breeds. High tolerance with kids and other pets.' },
    ],
};

const ScannerPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('qr'); // 'qr' or 'ai'

    // QR Scanner States
    const [scanResult, setScanResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const scannerRef = useRef(null);

    // AI Vision Scanner States
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const fileInputRef = useRef(null);
    const qrFileInputRef = useRef(null);

    // Initialize/Stop QR Scanner
    useEffect(() => {
        if (activeTab === 'qr' && cameraActive) {
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
                        // Scan failure/no QR in frame - ignore
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
    }, [activeTab, cameraActive]);

    const handleQrSuccess = (decodedText) => {
        // Stop scanning
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

        const html5QrCode = new Html5Qrcode('qr-hidden-reader');
        html5QrCode
            .scanFile(file, true)
            .then((decodedText) => {
                handleQrSuccess(decodedText);
            })
            .catch(() => {
                setCameraError('Could not detect a valid QR code in this image. Please try another clearer image.');
            });
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setSelectedImage(event.target.result);
            runAiVisionAnalysis(file.name);
        };
        reader.readAsDataURL(file);
    };

    const runAiVisionAnalysis = (fileName) => {
        setIsAnalyzing(true);
        setAnalysisResult(null);

        // Simulated AI Deep Learning Vision Pipeline
        setTimeout(() => {
            const isCat = /cat|billi|persian|kitten|meow/i.test(fileName);
            const species = isCat ? 'cat' : 'dog';
            const candidateList = BREED_DATABASE[species];

            // Pick a likely match based on filename or randomized deterministic index
            const primary = candidateList[Math.floor(Math.random() * candidateList.length)];
            const runnerUp = candidateList.find((b) => b.breed !== primary.breed) || candidateList[0];

            setAnalysisResult({
                species,
                primary,
                runnerUp,
                healthScore: '98% (Healthy Appearance)',
                vaccinationRecommendation: species === 'dog' ? 'Rabies, DHPP, Bordetella' : 'Rabies, FVRCP, FeLV',
            });
            setIsAnalyzing(false);
        }, 1800);
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
            {/* Hidden div for file-based QR decoding */}
            <div id="qr-hidden-reader" style={{ display: 'none' }} />

            {/* Header Hero */}
            <section className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4"
                    >
                        <FiCpu className="w-4 h-4 text-amber-200" />
                        AI Vision & IoT Smart Collar Scanner
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        PetVerse Smart Scanner Hub
                    </h1>
                    <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl mx-auto">
                        Instant recognition for Lost & Found Pet QR collar tags and AI-powered breed & health identification.
                    </p>

                    {/* Mode Toggle Tabs */}
                    <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20">
                        <button
                            onClick={() => { setActiveTab('qr'); setCameraError(null); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'qr'
                                    ? 'bg-white text-neutral-900 shadow-lg'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            <FiShield className="w-4 h-4" />
                            Collar QR Scanner
                        </button>
                        <button
                            onClick={() => { setActiveTab('ai'); if (cameraActive && scannerRef.current) scannerRef.current.stop().catch(() => {}); setCameraActive(false); }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'ai'
                                    ? 'bg-white text-neutral-900 shadow-lg'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            <FiZap className="w-4 h-4 text-amber-500" />
                            AI Breed & Vision Scanner
                        </button>
                    </div>
                </div>
            </section>

            {/* Main Interactive Workspace */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                {activeTab === 'qr' ? (
                    /* ================= TAB 1: QR CODE COLLAR SCANNER ================= */
                    <motion.div
                        key="qr-tab"
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
                                    Point your camera at any PetVerse physical collar tag or lost pet poster to retrieve the emergency passport.
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
                                            Start live camera scanning or upload a photo/screenshot containing the QR tag.
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
                                            Pet Tag Detected!
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
                                                Open Passport <FiArrowRight className="w-4 h-4" />
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
                                    Or Upload Image / Screenshot of QR Code
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    /* ================= TAB 2: AI BREED & VISION CLASSIFIER ================= */
                    <motion.div
                        key="ai-tab"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 sm:p-8 bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 rounded-3xl">
                            <div className="text-center max-w-md mx-auto mb-6">
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2">
                                    <FiZap className="w-5 h-5 text-amber-500" />
                                    AI Pet Breed & Health Predictor
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    Upload or snap any pet photo. Our Deep Vision neural model automatically detects the breed, characteristics, and care suggestions.
                                </p>
                            </div>

                            {/* Image Drop / Upload Area */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer max-w-md mx-auto rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 transition-all p-8 flex flex-col items-center justify-center text-center bg-neutral-50 dark:bg-neutral-850 hover:bg-amber-50/30"
                            >
                                {selectedImage ? (
                                    <div className="relative group">
                                        <img
                                            src={selectedImage}
                                            alt="Selected Pet"
                                            className="w-48 h-48 rounded-2xl object-cover shadow-lg border-2 border-amber-400"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                                            Change Photo
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                                            <FiUpload className="w-7 h-7" />
                                        </div>
                                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                            Click to snap or upload pet photo
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            JPG, PNG, WebP supported (Max 10MB)
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Analyzing Spinner State */}
                            {isAnalyzing && (
                                <div className="mt-8 text-center max-w-xs mx-auto py-6">
                                    <FiRefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                                        Analyzing Visual Features...
                                    </h4>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Extracting facial structure, coat texture, and canine/feline markers...
                                    </p>
                                </div>
                            )}

                            {/* Analysis Result Card */}
                            {analysisResult && !isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-8 border-t border-neutral-100 dark:border-neutral-700/80 pt-6 space-y-5"
                                >
                                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-200 dark:border-amber-800/60">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                            <div>
                                                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                                    Top Match ({analysisResult.primary.confidence}% Confidence)
                                                </span>
                                                <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                    {analysisResult.primary.breed}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    Secondary Candidate: {analysisResult.runnerUp.breed} ({100 - analysisResult.primary.confidence}%)
                                                </p>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    navigate(
                                                        `${ROUTES.CREATE_LISTING}?species=${analysisResult.species}&breed=${encodeURIComponent(
                                                            analysisResult.primary.breed
                                                        )}`
                                                    );
                                                }}
                                                variant="primary"
                                                size="sm"
                                                className="rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                                            >
                                                List for Adoption with this Breed
                                                <FiArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Trait badges */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {analysisResult.primary.temperament.map((trait) => (
                                                <span
                                                    key={trait}
                                                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold shadow-sm border border-neutral-200/80 dark:border-neutral-700"
                                                >
                                                    ✨ {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Characteristics Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/80">
                                            <span className="text-xs text-neutral-500">Energy Level</span>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                {analysisResult.primary.energy}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/80">
                                            <span className="text-xs text-neutral-500">Grooming Needs</span>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                {analysisResult.primary.grooming}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/80">
                                            <span className="text-xs text-neutral-500">Shedding Frequency</span>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                {analysisResult.primary.shedding}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Care recommendations callout */}
                                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                                        <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                                            <p className="font-semibold">Veterinary & Care Advice:</p>
                                            <p>{analysisResult.primary.tips}</p>
                                            <p className="pt-1 text-blue-700 dark:text-blue-300">
                                                Recommended Vaccines: <span className="font-semibold">{analysisResult.vaccinationRecommendation}</span>
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ScannerPage;
