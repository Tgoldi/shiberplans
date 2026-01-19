import React from 'react';
import { PricingSection } from './components/PricingSection';
import { VideoGallery } from './components/VideoGallery';
import { EditProvider, useEdit } from './context/EditContext';
import { EditableText } from './components/EditableText';
import { Save, Phone, MapPin, Mail, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { OfferSelector } from './components/OfferSelector';
import { TemplateSelector } from './components/TemplateSelector';

// Background Component with Darker Theme - OPTIMIZED
const Background = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none">
      {/* Optimized CSS Gradient Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/10 rounded-full blur-[100px] animate-aurora mix-blend-screen" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 rounded-full blur-[120px] animate-aurora mix-blend-screen" style={{ animationDelay: '-5s' }} />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[80px] animate-aurora mix-blend-screen" style={{ animationDelay: '-10s' }} />
    </div>
  );
};

function AppContent() {
  const { content, isEditMode, saveContent } = useEdit();

  return (
    <div className="relative min-h-screen text-right" dir="rtl">
      <Background />

      {/* Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 pb-32">

        {/* Header Section */}
        <header className="text-center mb-16 relative">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2 tracking-tighter drop-shadow-2xl">
              <EditableText value={content.hero.title} path="hero.title" />
            </h1>
            <div className="h-2 w-full bg-accent/30 rounded-full blur-md absolute -bottom-2"></div>
          </div>
          <p className="text-2xl md:text-3xl text-accent font-bold tracking-widest uppercase mt-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <EditableText value={content.hero.subtitle} path="hero.subtitle" />
          </p>


          {/* Contact Info Card */}
          <div className="mt-12 inline-flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-white/5 backdrop-blur-md border border-white/10 px-8 py-6 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">מאת</span>
              <span className="text-xl font-bold text-white">Amit Shiber</span>
            </div>

            <div className="h-px w-full md:w-px md:h-12 bg-white/10"></div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 font-medium">
              <a href="tel:0525577758" className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="bg-white/5 p-2 rounded-full"><Phone size={16} /></span>
                <span dir="ltr">052-557-7758</span>
              </a>
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="bg-white/5 p-2 rounded-full"><MapPin size={16} /></span>
                <span>הוד השרון, החרמון 6</span>
              </div>
              <a href="mailto:shiberzone@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="bg-white/5 p-2 rounded-full"><Mail size={16} /></span>
                <span>shiberzone@gmail.com</span>
              </a>
              <a href="https://shortcutpr.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
                <span className="bg-white/5 p-2 rounded-full"><Globe size={16} /></span>
                <span>shortcutpr.com</span>
              </a>
            </div>
          </div>
        </header>

        <PricingSection />

        <OfferSelector />

        <TemplateSelector />

        {/* Global Edit Mode Save Button */}
        {isEditMode && (
          <button
            onClick={saveContent}
            className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce"
          >
            <Save size={20} />
            שמור שינויים
          </button>
        )}
      </main>
    </div >
  );
}

function App() {
  return (
    <EditProvider>
      <AppContent />
    </EditProvider>
  );
}

export default App;
