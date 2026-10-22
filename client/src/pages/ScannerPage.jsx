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

// Species and Care Knowledge Generator based on genuine image classification
const getCareProfile = (species, breedName) => {
    switch (species) {
        case 'rabbit':
            return {
                species: 'rabbit',
                energy: 'Moderate (Crepuscular activity)',
                grooming: 'Low to Moderate (Regular brushing during molt)',
                shedding: 'Seasonal Moderate',
                temperament: ['Gentle', 'Quiet', 'Curious', 'Affectionate', 'Herbivore'],
                tips: 'Diet MUST consist of 80% Timothy Hay, fresh water, and leafy greens. Keep cords safely protected as rabbits love chewing.',
                vaccination: 'RHDV1, RHDV2, and Myxomatosis vaccines recommended.',
            };
        case 'cat':
            return {
                species: 'cat',
                energy: breedName.toLowerCase().includes('persian') ? 'Low' : 'Moderate to High',
                grooming: breedName.toLowerCase().includes('persian') || breedName.toLowerCase().includes('maine') ? 'High (Daily)' : 'Low',
                shedding: 'Moderate',
                temperament: ['Independent', 'Playful', 'Agile', 'Curious', 'Loving'],
                tips: 'Provide scratch posts and vertical climbing perches. Ensure a taurine-rich feline diet and fresh water away from food bowl.',
                vaccination: 'FVRCP (Feline Distemper), Rabies, and FeLV (Feline Leukemia).',
            };
        case 'bird':
            return {
                species: 'bird',
                energy: 'High & Vocal',
                grooming: 'Self-preening & Occasional mist baths',
                shedding: 'Molting cycles',
                temperament: ['Intelligent', 'Vocal', 'Social', 'Mimicry-capable', 'Bonded'],
                tips: 'Requires spacious flight cage and daily social interaction. Feed balanced pellets and fresh vegetable chop (avoid avocado and chocolate).',
                vaccination: 'Avian Polyomavirus & PBFD screening by avian vet.',
            };
        case 'other':
            return {
                species: 'other',
                energy: 'Varies',
                grooming: 'Low',
                shedding: 'Low',
                temperament: ['Docile', 'Gentle', 'Quiet', 'Low-maintenance'],
                tips: 'Ensure proper dust-free bedding, temperature regulation, and species-specific vitamin supplementation (e.g. Vitamin C for Guinea Pigs).',
                vaccination: 'Regular exotics vet checkup and parasite prevention.',
            };
        case 'dog':
        default:
            return {
                species: 'dog',
                energy: breedName.toLowerCase().includes('shepherd') || breedName.toLowerCase().includes('husky') ? 'Very High' : 'Moderate to High',
                grooming: breedName.toLowerCase().includes('poodle') || breedName.toLowerCase().includes('husky') ? 'High' : 'Moderate',
                shedding: breedName.toLowerCase().includes('poodle') ? 'Low / Hypoallergenic' : 'Moderate to High',
                temperament: ['Loyal', 'Devoted', 'Alert', 'Playful', 'Trainable'],
                tips: 'Requires consistent daily walks (30-60 min), socialization, mental stimulation, and balanced age-appropriate kibble.',
                vaccination: 'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza), Rabies, and Bordetella.',
            };
    }
};

// Map MobileNet ImageNet classes to Clean Human-Readable Pet Species and Names
const parseMobileNetLabel = (rawLabel) => {
    const lower = rawLabel.toLowerCase();

    // 1. Rabbits / Hares
    if (lower.includes('rabbit') || lower.includes('hare')) {
        let breed = 'Domestic Rabbit';
        if (lower.includes('angora')) breed = 'Angora Rabbit';
        else if (lower.includes('cottontail')) breed = 'Cottontail Rabbit';
        else if (lower.includes('hare')) breed = 'Hare / Wild Rabbit';
        return { species: 'rabbit', cleanBreed: breed };
    }

    // 2. Cats / Felines
    if (
        lower.includes('cat') ||
        lower.includes('tabby') ||
        lower.includes('siamese') ||
        lower.includes('persian') ||
        lower.includes('egyptian') ||
        lower.includes('cougar') ||
        lower.includes('lynx')
    ) {
        let breed = 'Domestic Cat';
        if (lower.includes('persian')) breed = 'Persian Cat';
        else if (lower.includes('siamese')) breed = 'Siamese Cat';
        else if (lower.includes('tabby')) breed = 'Tabby Cat';
        else if (lower.includes('tiger cat')) breed = 'Domestic Tiger Cat';
        else if (lower.includes('egyptian')) breed = 'Egyptian Mau';
        return { species: 'cat', cleanBreed: breed };
    }

    // 3. Birds / Parrots
    if (
        lower.includes('macaw') ||
        lower.includes('cockatoo') ||
        lower.includes('parrot') ||
        lower.includes('bird') ||
        lower.includes('lorikeet') ||
        lower.includes('canary') ||
        lower.includes('robin') ||
        lower.includes('finch')
    ) {
        let breed = 'Pet Bird';
        if (lower.includes('macaw')) breed = 'Macaw Parrot';
        else if (lower.includes('cockatoo')) breed = 'Cockatoo';
        else if (lower.includes('african grey')) breed = 'African Grey Parrot';
        else if (lower.includes('lorikeet')) breed = 'Lorikeet';
        return { species: 'bird', cleanBreed: breed };
    }

    // 4. Other Small Pets (Hamster, Guinea Pig, Turtle)
    if (lower.includes('guinea pig') || lower.includes('hamster') || lower.includes('mouse') || lower.includes('turtle')) {
        let breed = 'Small Companion Pet';
        if (lower.includes('guinea pig')) breed = 'Guinea Pig';
        else if (lower.includes('hamster')) breed = 'Hamster';
        else if (lower.includes('turtle') || lower.includes('tortoise')) breed = 'Pet Turtle';
        return { species: 'other', cleanBreed: breed };
    }

    // 5. Dogs (120+ ImageNet breeds)
    // Clean up strings like "German shepherd, German shepherd dog, German police dog, alsatian"
    const firstPart = rawLabel.split(',')[0].trim();
    const formattedBreed = firstPart
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

    return {
        species: 'dog',
        cleanBreed: formattedBreed,
    };
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
    const [aiStatusMessage, setAiStatusMessage] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [aiError, setAiError] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    const fileInputRef = useRef(null);
    const qrFileInputRef = useRef(null);
    const previewImgRef = useRef(null);

    // Dynamic Loader for Google MobileNet & TensorFlow.js
    const loadTfAndMobileNet = async () => {
        if (window.mobilenetModel) {
            return window.mobilenetModel;
        }

        setAiStatusMessage('Loading Google MobileNet Neural Network...');

        // 1. Load tfjs from CDN if not present
        if (!window.tf) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js';
                s.async = true;
                s.onload = resolve;
                s.onerror = () => reject(new Error('Failed to load TensorFlow engine.'));
                document.head.appendChild(s);
            });
        }

        // 2. Load mobilenet from CDN if not present
        if (!window.mobilenet) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js';
                s.async = true;
                s.onload = resolve;
                s.onerror = () => reject(new Error('Failed to load MobileNet vision model.'));
                document.head.appendChild(s);
            });
        }

        setAiStatusMessage('Warming up Computer Vision Tensor graph...');
        const model = await window.mobilenet.load({ version: 2, alpha: 1.0 });
        window.mobilenetModel = model;
        setModelLoaded(true);
        return model;
    };

    // Pre-load model quietly when user switches to AI tab
    useEffect(() => {
        if (activeTab === 'ai' && !window.mobilenetModel) {
            loadTfAndMobileNet().catch((err) => {
                console.warn('Preloading MobileNet model:', err.message);
            });
        }
    }, [activeTab]);

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
                    () => {}
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
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
            setCameraActive(false);
        }

        setScanResult(decodedText);

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

        setAiError(null);
        setAnalysisResult(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target.result;
            setSelectedImage(dataUrl);

            // Give DOM time to mount <img>, then run real TensorFlow classification
            setTimeout(() => {
                runRealTensorFlowVision(dataUrl);
            }, 150);
        };
        reader.readAsDataURL(file);
    };

    // 🔬 RUN REAL DEEP LEARNING INFERENCE
    const runRealTensorFlowVision = async (imageDataUrl) => {
        setIsAnalyzing(true);
        setAiError(null);

        try {
            const model = await loadTfAndMobileNet();

            setAiStatusMessage('Classifying visual features with Neural Network...');

            // Create an image element in memory to ensure complete load
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = imageDataUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Failed to decode image data for tensor processing.'));
            });

            // Perform classification on real pixel buffer
            const predictions = await model.classify(img, 5);

            if (!predictions || predictions.length === 0) {
                throw new Error('No confident object detected in this image. Please try a clearer pet picture.');
            }

            // Top prediction
            const topPrediction = predictions[0];
            const runnerUpPrediction = predictions[1] || predictions[0];

            const parsedTop = parseMobileNetLabel(topPrediction.className);
            const parsedRunnerUp = parseMobileNetLabel(runnerUpPrediction.className);

            const confidencePercent = (topPrediction.probability * 100).toFixed(1);
            const runnerUpPercent = (runnerUpPrediction.probability * 100).toFixed(1);

            const careProfile = getCareProfile(parsedTop.species, parsedTop.cleanBreed);

            setAnalysisResult({
                species: parsedTop.species,
                breed: parsedTop.cleanBreed,
                confidence: confidencePercent,
                rawClass: topPrediction.className,
                runnerUpBreed: parsedRunnerUp.cleanBreed,
                runnerUpConfidence: runnerUpPercent,
                energy: careProfile.energy,
                grooming: careProfile.grooming,
                shedding: careProfile.shedding,
                temperament: careProfile.temperament,
                tips: careProfile.tips,
                vaccination: careProfile.vaccination,
                modelName: 'MobileNet v2 (ImageNet 1000 Deep CNN)',
            });
        } catch (err) {
            console.error('TensorFlow vision error:', err);
            setAiError(err.message || 'Error executing AI vision classification. Please check network connection.');
        } finally {
            setIsAnalyzing(false);
            setAiStatusMessage('');
        }
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
                        Live Computer Vision & IoT Smart Collar Hub
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        PetVerse Smart Scanner Hub
                    </h1>
                    <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl mx-auto">
                        Instant decoding for Lost & Found QR tags and authentic TensorFlow.js Deep Learning breed detection.
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
                            onClick={() => {
                                setActiveTab('ai');
                                if (cameraActive && scannerRef.current) scannerRef.current.stop().catch(() => {});
                                setCameraActive(false);
                            }}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'ai'
                                    ? 'bg-white text-neutral-900 shadow-lg'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            <FiZap className="w-4 h-4 text-amber-500" />
                            AI Deep Vision Classifier
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
                    /* ================= TAB 2: AUTHENTIC TENSORFLOW DEEP LEARNING CLASSIFIER ================= */
                    <motion.div
                        key="ai-tab"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <Card className="p-6 sm:p-8 bg-white dark:bg-neutral-800 shadow-xl border border-neutral-200 dark:border-neutral-700 rounded-3xl">
                            <div className="text-center max-w-md mx-auto mb-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Engine: TensorFlow.js MobileNet (ImageNet 1000)
                                </div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2">
                                    <FiZap className="w-5 h-5 text-amber-500" />
                                    Real AI Breed & Species Classifier
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    Upload any pet picture (Dog, Cat, Rabbit, Bird, etc.). The actual Convolutional Neural Network processes real pixels and predicts species and breed.
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
                                            ref={previewImgRef}
                                            src={selectedImage}
                                            alt="Selected Pet"
                                            className="w-52 h-52 rounded-2xl object-cover shadow-lg border-2 border-amber-400"
                                        />
                                        <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold">
                                            Click to Change Photo
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                                            <FiUpload className="w-7 h-7" />
                                        </div>
                                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                                            Click to upload any Dog, Cat, Rabbit or Bird
                                        </p>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            JPG, PNG, WebP supported
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Analyzing Spinner State */}
                            {isAnalyzing && (
                                <div className="mt-8 text-center max-w-xs mx-auto py-6">
                                    <FiRefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
                                    <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                                        {aiStatusMessage || 'Processing Tensors in WebGL...'}
                                    </h4>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        Evaluating ImageNet probability distribution...
                                    </p>
                                </div>
                            )}

                            {/* Error State */}
                            {aiError && (
                                <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3 text-xs text-red-600 dark:text-red-400">
                                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{aiError}</span>
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
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white">
                                                        {analysisResult.species.toUpperCase()}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                                        {analysisResult.confidence}% Neural Confidence
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1">
                                                    {analysisResult.breed}
                                                </h3>
                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                                    Model Raw Detection: <span className="font-mono text-neutral-600 dark:text-neutral-300">"{analysisResult.rawClass}"</span>
                                                </p>
                                                {analysisResult.runnerUpBreed && analysisResult.runnerUpBreed !== analysisResult.breed && (
                                                    <p className="text-xs text-neutral-400 mt-0.5">
                                                        Secondary Candidate: {analysisResult.runnerUpBreed} ({analysisResult.runnerUpConfidence}%)
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    navigate(
                                                        `${ROUTES.CREATE_LISTING}?species=${analysisResult.species}&breed=${encodeURIComponent(
                                                            analysisResult.breed
                                                        )}`
                                                    );
                                                }}
                                                variant="primary"
                                                size="sm"
                                                className="rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                                            >
                                                List for Adoption as {analysisResult.breed}
                                                <FiArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Trait badges */}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {analysisResult.temperament.map((trait) => (
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
                                                {analysisResult.energy}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/80">
                                            <span className="text-xs text-neutral-500">Grooming Needs</span>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                {analysisResult.grooming}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700/80">
                                            <span className="text-xs text-neutral-500">Shedding Rate</span>
                                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
                                                {analysisResult.shedding}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Care recommendations callout */}
                                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                                        <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                        <div className="text-xs text-blue-900 dark:text-blue-200 space-y-1">
                                            <p className="font-semibold">Veterinary & Care Advice for this {analysisResult.species.toUpperCase()}:</p>
                                            <p>{analysisResult.tips}</p>
                                            <p className="pt-1 text-blue-700 dark:text-blue-300">
                                                Recommended Vaccines: <span className="font-semibold">{analysisResult.vaccination}</span>
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
