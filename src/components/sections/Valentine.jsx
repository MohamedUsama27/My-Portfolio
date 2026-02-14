import React, { useState, useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { max } from 'mathjs';

// Local images from /public/image – replace with your own filenames
const localImages = [
    '/image/image_1.jpeg',
    '/image/image_2.jpg',
    '/image/image_3.jpeg',
    '/image/image_4.png',
    '/image/image_5.png',
    '/image/image_6.png',
    '/image/image_7.png',
    '/image/image_8.png',
];

const catchGif = '/image/catch.gif';

// Decorative external images (roses, hearts, etc.) – using free icons
const decorImages = [
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f339.png', // rose
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/2764.png', // heart
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f49d.png', // heart with ribbon
    'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f48c.png', // love letter
];

// -------------------- Helper: generate random positions within a container --------------------
const getRandomPosition = (containerRect, elementWidth, elementHeight, avoidCenter = true) => {
    if (!containerRect) return { x: 0, y: 0 };

    const padding = 10; // Increased padding for safety
    const minX = padding;
    const minY = padding;
    const maxX = Math.max(minX, containerRect.width - elementWidth - padding);
    const maxY = Math.max(minY, containerRect.height - elementHeight - padding);

    let x, y;
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;
    const avoidRadius = 100; // Smaller radius since container is smaller

    // If container is too small, return centered position
    if (maxX <= minX || maxY <= minY) {
        return {
            x: Math.max(0, (containerRect.width - elementWidth) / 2),
            y: Math.max(0, (containerRect.height - elementHeight) / 2)
        };
    }

    do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
    } while (
        avoidCenter &&
        Math.hypot(x + elementWidth / 2 - centerX, y + elementHeight / 2 - centerY) < avoidRadius
    );

    return { x, y };
};

// -------------------- Main Component --------------------
const ValentinePage = () => {
    // ---------- State ----------
    const [step, setStep] = useState('initial'); // 'initial', 0,1,2,3, 'final'
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [showNoPopup, setShowNoPopup] = useState(false);
    const [showChasePopup, setShowChasePopup] = useState(false);
    const [chaseImage, setChaseImage] = useState(catchGif);
    const [images, setImages] = useState([]); // for current step
    const [hasNoMoved, setHasNoMoved] = useState(false);
    const [buttonContainerSize, setButtonContainerSize] = useState({ width: 0, height: 0 });

    // Refs
    const containerRef = useRef(null);
    const audioRef = useRef(null);
    const buttonContainerRef = useRef(null);
    const noButtonRef = useRef(null);
    const yesButtonRef = useRef(null);
    const controls = useAnimation(); // for no button movement
    const chaseTimeoutRef = useRef(null);
    const chaseHideTimeoutRef = useRef(null);
    const chaseMovesRef = useRef(0);
    const chaseStartedRef = useRef(false);
    const chaseShowingRef = useRef(false);

    // ---------- Constants ----------
    const questions = [
        { text: 'Do you love me? 💖', answers: ['Yes', 'Of course', 'Absolutely'] },
        { text: 'Will you hug me tight? 🤗', answers: ['Yes', 'Definitely', 'Always'] },
        { text: 'Are you my soulmate? 💞', answers: ['Yes', 'Obviously', '100%'] },
        { text: 'Will you be mine forever? 💍', answers: ['Yes', 'Forever', 'Eternally'] },
    ];

    const decorItems = useMemo(
        () =>
            Array.from({ length: 20 }).map(() => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 20}px`,
                opacity: Math.random() * 0.4 + 0.3,
                duration: Math.random() * 12 + 12,
                delay: Math.random() * 6,
            })),
        []
    );

    // ---------- Generate random images for current step ----------
    const generateRandomImages = useCallback(() => {
        const shuffled = [...localImages].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);
        const safeBox = {
            left: 25,
            right: 75,
            top: 25,
            bottom: 75,
        };

        const pickPosition = () => {
            for (let i = 0; i < 50; i += 1) {
                const x = Math.random() * 70 + 15;
                const y = Math.random() * 70 + 15;
                const outsideCenter = x < safeBox.left || x > safeBox.right || y < safeBox.top || y > safeBox.bottom;
                if (outsideCenter) {
                    return { x: `${x}%`, y: `${y}%` };
                }
            }
            return { x: '15%', y: '15%' };
        };

        return selected.map((src) => ({
            ...pickPosition(),
            src,
            rotate: Math.random() * 20 - 10,
        }));
    }, []);

    // Update images when step changes
    useEffect(() => {
        if (step !== 'initial' && step !== 'final') {
            setImages(generateRandomImages());
        }
    }, [step, generateRandomImages]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.muted = true;
        audio.volume = 0.5;

        const tryPlay = () => {
            const playPromise = audio.play();
            if (playPromise?.catch) {
                playPromise.catch(() => { });
            }
        };

        tryPlay();

        const handleFirstInteraction = () => {
            audio.muted = false;
            tryPlay();
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };

        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('keydown', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);

        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('keydown', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    const resetChasePopup = useCallback(() => {
        if (chaseTimeoutRef.current) {
            clearTimeout(chaseTimeoutRef.current);
        }
        if (chaseHideTimeoutRef.current) {
            clearTimeout(chaseHideTimeoutRef.current);
        }
        chaseTimeoutRef.current = null;
        chaseHideTimeoutRef.current = null;
        chaseStartedRef.current = false;
        chaseShowingRef.current = false;
        chaseMovesRef.current = 0;
        setShowChasePopup(false);
    }, []);

    useEffect(() => {
        if (step !== 'initial') {
            resetChasePopup();
        }
        return () => resetChasePopup();
    }, [step, resetChasePopup]);

    // Update button container size
    useEffect(() => {
        if (buttonContainerRef.current && step === 'initial') {
            const updateSize = () => {
                const rect = buttonContainerRef.current.getBoundingClientRect();
                setButtonContainerSize({ width: rect.width, height: rect.height });
            };
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        }
    }, [step]);

    // ---------- Move No button to random safe position within button container ----------
    const clampPosition = useCallback((containerRect, elementWidth, elementHeight, x, y) => {
        const padding = 10;
        const minX = padding;
        const minY = padding;
        const maxX = Math.max(minX, containerRect.width - elementWidth - padding);
        const maxY = Math.max(minY, containerRect.height - elementHeight - padding);

        return {
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY),
        };
    }, []);

    const positionNoNextToYes = useCallback(() => {
        if (!buttonContainerRef.current || !noButtonRef.current || !yesButtonRef.current) return;

        const containerRect = buttonContainerRef.current.getBoundingClientRect();
        const yesRect = yesButtonRef.current.getBoundingClientRect();
        const noRect = noButtonRef.current.getBoundingClientRect();

        // Guard against zero dimensions (not ready)
        if (containerRect.width === 0 || yesRect.width === 0 || noRect.width === 0) return;

        // Convert yes button position relative to button container
        const containerLeft = buttonContainerRef.current.offsetLeft;
        const containerTop = buttonContainerRef.current.offsetTop;

        const yesRelativeLeft = yesRect.left - containerLeft;
        const yesRelativeTop = yesRect.top - containerTop;

        const gap = 20;
        const targetX = yesRelativeLeft + yesRect.width + gap;
        const targetY = yesRelativeTop;

        const { x, y } = clampPosition(containerRect, noRect.width, noRect.height, targetX, targetY);

        controls.set({ left: x, top: y }); // instant set, no animation
        setNoButtonPosition({ x, y });
    }, [clampPosition, controls]);

    const moveNoButton = useCallback(() => {
        if (!buttonContainerRef.current || !noButtonRef.current) return;

        const containerRect = buttonContainerRef.current.getBoundingClientRect();
        const noButtonRect = noButtonRef.current.getBoundingClientRect();

        const minDistance = 220;
        let target = null;
        for (let i = 0; i < 40; i += 1) {
            const candidate = getRandomPosition(
                containerRect,
                noButtonRect.width,
                noButtonRect.height,
                true
            );
            const distance = Math.hypot(candidate.x - noButtonPosition.x, candidate.y - noButtonPosition.y);
            if (distance >= minDistance) {
                target = candidate;
                break;
            }
        }
        const { x, y } = target || getRandomPosition(
            containerRect,
            noButtonRect.width,
            noButtonRect.height,
            true
        );

        controls.start({
            left: x,
            top: y,
            transition: { type: 'spring', stiffness: 200, damping: 20, mass: 0.3 },
        });

        setNoButtonPosition({ x, y });
        setHasNoMoved(true);

        chaseMovesRef.current += 1;
        if (!chaseStartedRef.current && chaseMovesRef.current >= 3) {
            chaseStartedRef.current = true;
            chaseTimeoutRef.current = setTimeout(() => {
                if (step === 'initial' && !chaseShowingRef.current) {
                    chaseShowingRef.current = true;
                    setChaseImage(catchGif);
                    setShowChasePopup(true);
                    chaseHideTimeoutRef.current = setTimeout(() => {
                        setShowChasePopup(false);
                        chaseShowingRef.current = false;
                        chaseStartedRef.current = false;
                        chaseMovesRef.current = 0;
                    }, 3000);
                } else {
                    chaseStartedRef.current = false;
                }
            }, 3500);
        }
    }, [controls, step]);

    // Initial position (next to Yes) – useLayoutEffect to avoid flicker
    useLayoutEffect(() => {
        if (step === 'initial') {
            // Small delay to ensure refs are ready
            const timer = setTimeout(() => {
                positionNoNextToYes();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [step, positionNoNextToYes]);

    // Resize handling
    useEffect(() => {
        const handleResize = () => {
            if (!buttonContainerRef.current || !noButtonRef.current) return;

            const containerRect = buttonContainerRef.current.getBoundingClientRect();
            const noRect = noButtonRef.current.getBoundingClientRect();

            if (!hasNoMoved && step === 'initial') {
                positionNoNextToYes();
                return;
            }

            // Clamp current position to stay inside
            const { x, y } = clampPosition(
                containerRect,
                noRect.width,
                noRect.height,
                noButtonPosition.x,
                noButtonPosition.y
            );

            controls.set({ left: x, top: y });
            setNoButtonPosition({ x, y }); // update state for future resizes
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [clampPosition, controls, hasNoMoved, noButtonPosition.x, noButtonPosition.y, positionNoNextToYes, step]);

    // ---------- Handlers ----------
    const handleYesClick = () => {
        if (step === 'initial') {
            setStep(0);
        }
    };

    const handleAnswerClick = () => {
        if (typeof step === 'number') {
            if (step < questions.length - 1) {
                setStep(step + 1);
            } else {
                setStep('final');
            }
        }
    };

    const handleNoClick = () => {
        setShowNoPopup(true);
        setTimeout(() => setShowNoPopup(false), 2000);
    };

    // ---------- Render ----------
    return (
        <div ref={containerRef} style={styles.container}>
            <audio
                ref={audioRef}
                src="/image/bg_music.mp3"
                autoPlay
                loop
                preload="auto"
                playsInline
            />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Pacifico&family=Dancing+Script:wght@400;700&display=swap');
        body {
          margin: 0;
          overflow: hidden;
          font-family: 'Dancing Script', cursive;
        }
        * {
          box-sizing: border-box;
          user-select: none;
        }
        @keyframes float {
          0% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50% { transform: translate3d(0, -12px, 0) rotate(3deg); }
          100% { transform: translate3d(0, 0, 0) rotate(0deg); }
        }
      `}</style>

            {/* Floating decorations */}
            <div style={styles.decorContainer}>
                {decorItems.map((item, i) => (
                    <motion.img
                        key={i}
                        src={decorImages[i % decorImages.length]}
                        style={{
                            ...styles.decorItem,
                            left: item.left,
                            top: item.top,
                            width: item.width,
                            opacity: item.opacity,
                            animation: `float ${item.duration}s infinite ease-in-out`,
                            animationDelay: `${item.delay}s`,
                        }}
                        alt="decor"
                    />
                ))}
            </div>

            {/* Popup for clicking No */}
            <AnimatePresence>
                {showNoPopup && (
                    <motion.div
                        style={styles.popup}
                        initial={{ opacity: 0, y: -50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        😘 You are not allowed to click that! 😘
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image popup after chasing No button */}
            <AnimatePresence>
                {showChasePopup && (
                    <motion.div
                        style={styles.imagePopupOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <motion.div
                            style={styles.imagePopupCard}
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                            <p style={styles.imagePopupTitle}>Caught you! 💘</p>
                            <img src={chaseImage} alt="love" style={styles.imagePopupImage} />
                            <p style={styles.imagePopupSubtitle}>Stop running away and say yes 😒</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div style={styles.content}>
                {step === 'initial' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        style={styles.centered}
                    >
                        <h1 style={styles.title}>Will you be my Valentine? 💘</h1>

                        {/* Button Container - This limits the movement area */}
                        <div
                            ref={buttonContainerRef}
                            style={styles.buttonContainer}
                        >
                            <motion.button
                                ref={yesButtonRef}
                                style={{ ...styles.button, ...styles.yesButton, position: 'relative' }}
                                whileHover={{ scale: 1.1, boxShadow: '0 0 20px #ff4d6d' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleYesClick}
                            >
                                Yes 💕
                            </motion.button>

                            <motion.button
                                ref={noButtonRef}
                                style={{
                                    ...styles.button,
                                    ...styles.noButton,
                                    left: noButtonPosition.x,
                                    top: noButtonPosition.y,
                                }}
                                animate={controls}
                                onMouseEnter={moveNoButton}
                                onClick={handleNoClick}
                            >
                                No 💔
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {typeof step === 'number' && step >= 0 && step < questions.length && (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5 }}
                        style={styles.centered}
                    >
                        <h1 style={styles.title}>{questions[step].text}</h1>
                        <div style={styles.answerGroup}>
                            {questions[step].answers.map((ans, idx) => (
                                <motion.button
                                    key={idx}
                                    style={{ ...styles.button, ...styles.answerButton }}
                                    whileHover={{ scale: 1.1, backgroundColor: '#ff8da1' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAnswerClick}
                                >
                                    {ans} {idx === 0 ? '😊' : idx === 1 ? '🥰' : '💖'}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 'final' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                        style={{ ...styles.centered, ...styles.finalCentered }}
                    >
                        <h1 style={{ ...styles.title, fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}>
                            Yay! You've made me the happiest! 💑💖
                        </h1>
                        <p style={styles.finalMessage}>
                            I love you more than anything! 🌹💋 <br />
                            Happy Valentine's Day, my love! ❤️❤️❤️
                        </p>
                        <div style={styles.finalImages}>
                            {[localImages[2], localImages[3], localImages[7], localImages[5]].map((src, idx) => (
                                <motion.div
                                    key={idx}
                                    style={styles.finalFrame}
                                    whileHover={{ scale: 1.1, rotate: 2 }}
                                    transition={{ type: 'spring' }}
                                >
                                    <img src={src} alt="love" style={styles.finalImage} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Randomly placed framed images for questions */}
            {typeof step === 'number' && step >= 0 && step < questions.length && (
                <AnimatePresence>
                    {images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: img.rotate }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            style={{
                                ...styles.imageFrame,
                                left: img.x,
                                top: img.y,
                                transform: `rotate(${img.rotate}deg)`,
                            }}
                            whileHover={{ scale: 1.2, zIndex: 100, rotate: 0 }}
                        >
                            <img src={img.src} alt="romantic" style={styles.image} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 10% 30%, #ffb6c1, #ff4d6d)',
        overflow: 'hidden',
    },
    decorContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
    },
    decorItem: {
        position: 'absolute',
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))',
        willChange: 'transform',
    },
    popup: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#fff0f5',
        padding: '15px 30px',
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(255, 80, 120, 0.5)',
        fontSize: '1.5rem',
        color: '#d43f6b',
        zIndex: 2000,
        border: '2px solid #ffb6c1',
        fontFamily: "'Pacifico', cursive",
        whiteSpace: 'nowrap',
    },
    imagePopupOverlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2200,
        backdropFilter: 'blur(3px)',
    },
    imagePopupCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '30px',
        padding: '25px 30px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
        border: '3px solid #ffb6c1',
        textAlign: 'center',
        maxWidth: '420px',
        width: '90%',
    },
    imagePopupTitle: {
        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
        margin: '0 0 12px',
        color: '#d43f6b',
        fontFamily: "'Pacifico', cursive",
    },
    imagePopupImage: {
        width: '100%',
        height: '260px',
        objectFit: 'cover',
        borderRadius: '20px',
        border: '4px solid #fff',
        boxShadow: '0 10px 25px rgba(255, 77, 109, 0.35)',
        marginBottom: '12px',
    },
    imagePopupSubtitle: {
        fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
        color: '#9d174d',
        margin: 0,
        fontFamily: "'Dancing Script', cursive",
    },
    content: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    centered: {
        pointerEvents: 'auto',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        padding: '30px 50px',
        borderRadius: '80px',
        border: '2px solid rgba(255,255,255,0.5)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        maxWidth: '60%',
        maxHeight: '40%',
    },
    finalCentered: {
        maxWidth: '90%',
        maxHeight: '90%',
    },
    // New button container to limit movement area
    buttonContainer: {
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '1400px', // Fixed width to ensure consistent movement area
        height: '400px', // Fixed height for movement area
        margin: '20px auto',
        //backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background to visualize the container (optional)
        //borderRadius: '20px',
        //border: '2px dashed rgba(255, 255, 255, 0.3)', // Dashed border to show boundaries (optional)
        overflow: 'visible', // Allow button to be visible even near edges
    },
    title: {
        fontSize: 'clamp(2rem, 6vw, 4rem)',
        color: '#fff',
        textShadow: '2px 2px 10px #ff4d6d, 0 0 20px #fff',
        marginBottom: '30px',
        fontFamily: "'Great Vibes', cursive",
    },
    buttonRow: {
        display: 'flex',
        gap: '30px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: '120px',
        position: 'relative',
    },
    button: {
        padding: '15px 40px',
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        border: 'none',
        borderRadius: '60px',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        fontWeight: 'bold',
        transition: 'box-shadow 0.2s',
        fontFamily: "'Pacifico', cursive",
        letterSpacing: '1px',
    },
    yesButton: {
        background: '#ff4d6d',
        color: 'white',
        border: '3px solid #fff',
        position: 'relative', // Changed from absolute to relative
        display: 'inline-block', // Keep it inline
        marginRight: '20px', // Add some space from the no button
    },
    noButton: {
        background: '#6c757d',
        color: 'white',
        border: '3px solid #fff',
        position: 'absolute',
        margin: 0, // Remove any default margins
    },
    answerGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        marginTop: '20px',
    },
    answerButton: {
        background: '#ffb3c6',
        color: '#9d174d',
        padding: '15px 30px',
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        border: '2px solid white',
    },
    imageFrame: {
        position: 'absolute',
        width: '150px',
        height: '150px',
        borderRadius: '20px',
        border: '5px solid white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        backgroundColor: '#ffe4e9',
        padding: '5px',
        transition: 'z-index 0s',
        pointerEvents: 'auto',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
    },
    finalMessage: {
        fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
        color: '#fff',
        background: 'rgba(255, 77, 109, 0.7)',
        padding: '20px',
        borderRadius: '50px',
        backdropFilter: 'blur(5px)',
        marginBottom: '30px',
        fontFamily: "'Dancing Script', cursive",
    },
    finalImages: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
    },
    finalFrame: {
        width: '150px',
        height: '150px',
        borderRadius: '20px',
        border: '5px solid white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    finalImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
};

export default ValentinePage;