import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, X, Package, RefreshCw, Loader2 } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import emailjs from '@emailjs/browser';
import { generateInvoiceHTML } from '../utils/generateInvoice';

// EmailJS Configuration
// These should be configured in your .env file and Vercel Project Settings
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function OfferSelector() {
    const { content } = useEdit();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [step, setStep] = useState('select'); // 'select' | 'sign' | 'success'

    // User Details
    const [clientName, setClientName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Signature Canvas Refs
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Reset state on open/close
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('select');
                setSelectedOffer(null);
                setHasSignature(false);
                setClientName('');
                setIsSubmitting(false);
            }, 300);
        }
    }, [isOpen]);

    // Canvas Logic (Keep existing implementation...)
    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff';

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    const getCoordinates = (e, canvas) => {
        if (e.touches && e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        }
        return {
            offsetX: e.nativeEvent.offsetX,
            offsetY: e.nativeEvent.offsetY
        };
    };

    const handleSelect = (planIndex, packageIndex = null) => {
        setSelectedOffer({
            planIndex,
            packageIndex,
            type: packageIndex !== null ? 'package' : 'plan'
        });
    };

    const getOfferName = () => {
        if (!selectedOffer) return '';
        const plan = content.plans[selectedOffer.planIndex];
        if (selectedOffer.type === 'package') {
            return `${plan.name} - ${plan.packages[selectedOffer.packageIndex]}`;
        }
        return plan.name;
    };

    const getPrice = () => {
        if (!selectedOffer) return '';
        const plan = content.plans[selectedOffer.planIndex];
        // Logic to parse price if needed, for now just returning plan price
        // Note: If packages have specific prices parsed from string, we might need regex.
        // Assuming package string is like "10 videos for 3500"
        if (selectedOffer.type === 'package') {
            return plan.packages[selectedOffer.packageIndex];
        }
        return plan.price;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const canvas = canvasRef.current;
            // Optimize signature size: using JPEG with 0.5 quality reduces size significantly vs PNG
            const signatureImage = canvas.toDataURL('image/jpeg', 0.5);

            const dateStr = new Date().toLocaleString('he-IL');
            const offerName = getOfferName();
            const priceVal = getPrice();

            // Generate professional HTML invoice
            const invoiceHtml = generateInvoiceHTML({
                clientName,
                offerName,
                price: priceVal,
                signature: signatureImage, // Pass full base64 to generator
                date: dateStr
            });

            const templateParams = {
                client_name: clientName,
                offer_name: offerName,
                price: priceVal,
                signature: signatureImage,
                date: dateStr,
                invoice_html: invoiceHtml // The new rich HTML field
            };

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
            setStep('success');
        } catch (error) {
            console.error('EmailJS Error:', error);
            if (error && error.text) console.error('Error Text:', error.text);
            alert(`אירעה שגיאה בשליחת הטופס: ${error.text || 'שגיאה לא ידועה'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Floating Button - Optimized with pure Framer Motion */}
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.5
                }}
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 50px rgba(59,130,246,0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-accent text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center gap-3 border border-white/20 will-change-transform"
            >
                <span>בחר הצעה</span>
                <ChevronRight size={20} className="rotate-180" />
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                            className="relative w-[95%] sm:w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-[32px] sm:rounded-[40px] shadow-[0_0_80px_rgba(59,130,246,0.2)] flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            {/* Animated Background Inside Modal - OPTIMIZED */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/10 blur-[80px] rounded-full animate-aurora mix-blend-screen" style={{ animationDelay: '-2s' }} />
                                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-600/10 blur-[80px] rounded-full animate-aurora mix-blend-screen" style={{ animationDelay: '-7s' }} />
                            </div>

                            {/* Header */}
                            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/5 bg-white/5 backdrop-blur-sm">
                                <h2 className="text-2xl font-black text-white">
                                    {step === 'select' && 'בחר את המסלול שלך'}
                                    {step === 'sign' && 'חתימה דיגיטלית'}
                                    {step === 'success' && 'ההצעה אושרה!'}
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content Zones */}
                            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">

                                    {/* STEP 1: SELECT */}
                                    {step === 'select' && (
                                        <motion.div
                                            key="select"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-6 space-y-6"
                                        >
                                            {content.plans.map((plan, pIndex) => (
                                                <div key={pIndex} className="space-y-3">
                                                    <div
                                                        onClick={() => handleSelect(pIndex)}
                                                        className={`
                                                            relative p-4 rounded-2xl border transition-colors cursor-pointer flex items-center gap-4 group
                                                            ${selectedOffer?.type === 'plan' && selectedOffer?.planIndex === pIndex
                                                                ? 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}
                                                        `}
                                                    >
                                                        <div className={`
                                                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                            ${selectedOffer?.type === 'plan' && selectedOffer?.planIndex === pIndex
                                                                ? 'border-accent bg-accent text-white'
                                                                : 'border-gray-500 group-hover:border-gray-300'}
                                                        `}>
                                                            {selectedOffer?.type === 'plan' && selectedOffer?.planIndex === pIndex && <Check size={14} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                                                            <p className="text-sm text-gray-400">{plan.price} / סרטון</p>
                                                        </div>
                                                    </div>

                                                    {/* Packages */}
                                                    {plan.packages && plan.packages.length > 0 && (
                                                        <div className="mr-8 space-y-2 border-r-2 border-white/5 pr-4">
                                                            <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                                                                <Package size={12} /> חבילות מוזלות
                                                            </div>
                                                            {plan.packages.map((pkg, pkgIndex) => (
                                                                <div
                                                                    key={pkgIndex}
                                                                    onClick={() => handleSelect(pIndex, pkgIndex)}
                                                                    className={`
                                                                        p-3 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 group text-sm
                                                                        ${selectedOffer?.type === 'package' && selectedOffer?.planIndex === pIndex && selectedOffer?.packageIndex === pkgIndex
                                                                            ? 'bg-accent/10 border-accent/50'
                                                                            : 'bg-transparent border-transparent hover:bg-white/5'}
                                                                    `}
                                                                >
                                                                    <div className={`
                                                                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                                        ${selectedOffer?.type === 'package' && selectedOffer?.planIndex === pIndex && selectedOffer?.packageIndex === pkgIndex
                                                                            ? 'border-accent bg-accent text-white'
                                                                            : 'border-gray-600 group-hover:border-gray-400'}
                                                                    `}>
                                                                        {selectedOffer?.type === 'package' && selectedOffer?.planIndex === pIndex && selectedOffer?.packageIndex === pkgIndex && <Check size={12} />}
                                                                    </div>
                                                                    <span className="text-gray-300 group-hover:text-white transition-colors">{pkg}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* STEP 2: SIGN */}
                                    {step === 'sign' && (
                                        <motion.div
                                            key="sign"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="p-8 flex flex-col items-center text-center space-y-6"
                                        >
                                            <div className="text-gray-300 w-full text-right space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                                                <h4 className="text-lg font-bold text-white border-b border-white/10 pb-2">תנאים ומידע חשוב</h4>

                                                <div className="space-y-2 text-sm leading-relaxed text-gray-400">
                                                    <p>
                                                        <strong className="text-white">סבבי תיקונים:</strong> כל הצעה כוללת סבב תיקונים אחד ללא עלות נוספת.
                                                        כל סבב תיקון נוסף מעבר לכך יחויב ב-25% ממחיר הסרטון.
                                                    </p>

                                                    <p>
                                                        <strong className="text-white">הגדרת סבב תיקונים:</strong> סבב תיקונים נחשב רק לאחר שנשלחה גרסה ראשונית של הסרטון עם קאטים נקיים וטקסט ללא עריכה מתקדמת.
                                                        הלקוח בוחר באמצעות מערכת <span className="text-accent">Timeliner.io</span> אילו קטעים להסיר או לשמר, ולאחר מכן מחכה לקבלת הגרסה המלאה.
                                                        רק אז ניתן לרשום תיקונים מסודרים במערכת ולשלוח לעריכה סופית. כל מעבר נוסף מעבר לכך נחשב כסבב תיקון נוסף.
                                                    </p>

                                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
                                                        <strong className="text-red-400 block mb-1">חשוב לדעת:</strong>
                                                        יש לרשום את כל התיקונים באמצעות מערכת Timeliner.io בלבד - לא בוואטסאפ.
                                                    </div>
                                                </div>

                                                <div className="border-t border-white/10 pt-4 mt-4">
                                                    <p className="mb-2 text-center text-gray-300">מאשר את קבלת ההצעה:</p>
                                                    <p className="text-xl font-bold text-white text-center bg-black/20 py-2 px-4 rounded-lg block w-fit mx-auto">{getOfferName()}</p>
                                                </div>
                                            </div>

                                            {/* Client Name Input */}
                                            <div className="w-full text-right">
                                                <label className="block text-sm font-bold text-gray-400 mb-2 mr-1">
                                                    שם מלא / שם חברה:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={clientName}
                                                    onChange={(e) => setClientName(e.target.value)}
                                                    placeholder="הכנס שם מלא או שם חברה..."
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                                                />
                                            </div>

                                            <p className="text-sm opacity-60">בחתימתי אני מאשר את תנאי ההתקשרות והמחירים המפורטים בהצעה זו.</p>

                                            {/* Signature Pad */}
                                            <div className="relative w-full max-w-md aspect-[3/2] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-inner border-2 border-white/20 group">
                                                <canvas
                                                    ref={canvasRef}
                                                    width={500}
                                                    height={300}
                                                    className="w-full h-full touch-none cursor-crosshair bg-[#1a1a1a]"
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                />
                                                <div className="absolute bottom-2 right-2 flex gap-2">
                                                    <button
                                                        onClick={clearCanvas}
                                                        className="p-2 bg-white/10 text-gray-300 rounded-full hover:bg-white/20 transition-colors text-xs font-bold shadow-sm backdrop-blur-sm"
                                                        title="נקה חתימה"
                                                    >
                                                        <RefreshCw size={14} />
                                                    </button>
                                                </div>
                                                {!hasSignature && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                                        <span className="text-4xl font-handwriting text-gray-500 -rotate-12">חתום כאן</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: SUCCESS */}
                                    {step === 'success' && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-12 flex flex-col items-center text-center space-y-6"
                                        >
                                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-4">
                                                <Check size={48} className="text-white" strokeWidth={4} />
                                            </div>
                                            <h3 className="text-3xl font-black text-white">תודה רבה!</h3>
                                            <p className="text-gray-400 text-lg">
                                                ההצעה נחתמה בהצלחה ונשלחה במייל.<br />
                                                נצור איתך קשר בהקדם לתחילת עבודה.
                                            </p>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Footer Buttons */}
                            <div className="relative z-10 p-6 border-t border-white/5 bg-white/5 backdrop-blur-sm flex justify-between items-center">
                                {step !== 'success' && (
                                    <button
                                        onClick={() => {
                                            if (step === 'sign') setStep('select');
                                            else setIsOpen(false);
                                        }}
                                        className="text-gray-400 hover:text-white transition-colors text-sm font-bold px-4"
                                    >
                                        {step === 'sign' ? 'חזור' : 'ביטול'}
                                    </button>
                                )}

                                {step === 'select' && (
                                    <motion.button
                                        className={`
                                            px-8 py-3 rounded-full font-bold shadow-lg flex-1 mr-4
                                            ${selectedOffer
                                                ? 'bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                                        `}
                                        whileHover={selectedOffer ? { scale: 1.05 } : {}}
                                        whileTap={selectedOffer ? { scale: 0.95 } : {}}
                                        disabled={!selectedOffer}
                                        onClick={() => setStep('sign')}
                                    >
                                        המשך לחתימה
                                    </motion.button>
                                )}

                                {step === 'sign' && (
                                    <motion.button
                                        className={`
                                            px-8 py-3 rounded-full font-bold shadow-lg flex-1 mr-4 flex items-center justify-center gap-2
                                            ${hasSignature && clientName.trim().length > 0 && !isSubmitting
                                                ? 'bg-green-500 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                                                : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                                        `}
                                        whileHover={hasSignature && clientName.trim().length > 0 && !isSubmitting ? { scale: 1.05 } : {}}
                                        whileTap={hasSignature && clientName.trim().length > 0 && !isSubmitting ? { scale: 0.95 } : {}}
                                        disabled={!hasSignature || clientName.trim().length === 0 || isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                שולח...
                                            </>
                                        ) : (
                                            'אשר וחתום'
                                        )}
                                    </motion.button>
                                )}

                                {step === 'success' && (
                                    <motion.button
                                        onClick={() => setIsOpen(false)}
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full py-4 rounded-full bg-white/10 text-white font-bold transition-colors"
                                    >
                                        סגור
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
