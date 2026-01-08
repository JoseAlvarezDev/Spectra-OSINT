import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Smartphone, UserSearch, Terminal, Camera, Wallet, Mail, Link2, Eye, Cpu } from 'lucide-react';
import IPTracker from './components/IPTracker';
import PhoneTracker from './components/PhoneTracker';
import UsernameTracker from './components/UsernameTracker';
import ImageIntel from './components/ImageIntel';
import CryptoTracker from './components/CryptoTracker';
import EmailTracker from './components/EmailTracker';
import UrlIntell from './components/UrlIntell';
import DorkStudio from './components/DorkStudio';
import MacTracker from './components/MacTracker';
import SplashScreen from './components/SplashScreen';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import Header from './components/Header';
import PrivacyPolicy from './components/PrivacyPolicy';
import LicenseModal from './components/LicenseModal';
import { useLanguage } from './context/LanguageHooks';

function App() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTool, setActiveTool] = useState('ip');

  const tools = [
    { id: 'ip', name: t.sidebar.tools.ip, icon: Globe },
    { id: 'phone', name: t.sidebar.tools.phone, icon: Smartphone },
    { id: 'email', name: t.sidebar.tools.email, icon: Mail },
    { id: 'user', name: t.sidebar.tools.user, icon: UserSearch },
    { id: 'url', name: t.sidebar.tools.url, icon: Link2 },
    { id: 'dork', name: t.sidebar.tools.dork, icon: Eye },
    { id: 'mac', name: t.sidebar.tools.mac, icon: Cpu },
    { id: 'crypto', name: t.sidebar.tools.crypto, icon: Wallet },
    { id: 'image', name: t.sidebar.tools.image, icon: Camera },
  ];

  return (
    <>
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}

        {/* Force Disclaimer on First Load */}
        {!loading && !disclaimerAccepted && !showDisclaimer && (
          <Disclaimer onAccept={() => setDisclaimerAccepted(true)} />
        )}

        {/* Disclaimer Triggered from Menu */}
        {showDisclaimer && (
          <Disclaimer onAccept={() => setShowDisclaimer(false)} />
        )}

        {/* Privacy Policy Modal */}
        {showPrivacy && (
          <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
        )}

        {/* License Modal */}
        {showLicense && (
          <LicenseModal onClose={() => setShowLicense(false)} />
        )}
      </AnimatePresence>

      {disclaimerAccepted && (
        <div className="flex h-screen w-full overflow-hidden">
          {/* Desktop Sidebar (Hidden on Mobile) */}
          <div className="hidden md:flex w-64 glass-panel m-4 flex-col p-6 z-10 border-r-0">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
                <img src={`${import.meta.env.BASE_URL}spectra-logo.png`} alt="SPECTRA" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wider">SPECTRA</h1>
                <p className="text-xs text-cyan-400 tracking-[0.2em] font-mono">{t.sidebar.osintPlatform}</p>
              </div>
            </div>

            <nav className="flex-1 space-y-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${activeTool === tool.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <tool.icon className={`w-5 h-5 ${activeTool === tool.id ? 'text-cyan-400' : ''}`} />
                  <span className="font-medium">{tool.name}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <Terminal className="w-3 h-3" />
                <span>{t.sidebar.systemOnline}</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar (Slide-over) */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileSidebarOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 w-64 glass-panel z-50 p-6 flex flex-col md:hidden border-r border-cyan-500/20"
                >
                  <div className="flex items-center gap-3 mb-12">
                    <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-lg border border-cyan-500/30">
                      <img src={`${import.meta.env.BASE_URL}spectra-logo.png`} alt="SPECTRA" className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white tracking-wider">SPECTRA</h1>
                      <p className="text-xs text-cyan-400 tracking-[0.2em] font-mono">{t.sidebar.osintPlatform}</p>
                    </div>
                  </div>

                  <nav className="flex-1 space-y-4 overflow-y-auto">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setActiveTool(tool.id);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${activeTool === tool.id
                          ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        <tool.icon className={`w-5 h-5 ${activeTool === tool.id ? 'text-cyan-400' : ''}`} />
                        <span className="font-medium">{tool.name}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                      <Terminal className="w-3 h-3" />
                      <span>{t.sidebar.systemOnline}</span>
                      <span className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden">
            <Header
              onOpenPrivacy={() => setShowPrivacy(true)}
              onOpenDisclaimer={() => setShowDisclaimer(true)}
              onOpenMobileMenu={() => setMobileSidebarOpen(true)}
            />
            <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                {!loading && (
                  <motion.div
                    key={activeTool}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-5xl mx-auto"
                  >
                    {activeTool === 'ip' && <IPTracker />}
                    {activeTool === 'phone' && <PhoneTracker />}
                    {activeTool === 'email' && <EmailTracker />}
                    {activeTool === 'user' && <UsernameTracker />}
                    {activeTool === 'url' && <UrlIntell />}
                    {activeTool === 'dork' && <DorkStudio />}
                    {activeTool === 'mac' && <MacTracker />}
                    {activeTool === 'crypto' && <CryptoTracker />}
                    {activeTool === 'image' && <ImageIntel />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer anchored to the bottom of the content area only */}
            <Footer onOpenLicense={() => setShowLicense(true)} />
          </main>
        </div>
      )}
    </>
  );
}

export default App;
