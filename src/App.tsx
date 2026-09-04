import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { DemosPage } from './pages/DemosPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { GetStartedPage } from './pages/GetStartedPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPortal } from './pages/admin/AdminPortal';
import { 
  ServiceItem, 
  DemoItem, 
  FAQItem, 
  CompanyContent, 
  SiteSettings, 
  AdminUser 
} from './types';
import { MessageSquare, ArrowUp, Sparkles } from 'lucide-react';
import { trackPageView, initWebVitalsTracking, initErrorReporter } from './utils/analytics';
import { updatePageSEO } from './utils/seo';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Public Data State
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [companyContent, setCompanyContent] = useState<CompanyContent | undefined>(undefined);
  const [settings, setSettings] = useState<SiteSettings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Interaction State
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<string>('AI Agents');
  const [selectedDemoForVideo, setSelectedDemoForVideo] = useState<DemoItem | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('ahsan_admin_token');
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Navigation Handler
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize Global Client Telemetry & Web Vitals
  useEffect(() => {
    initWebVitalsTracking();
    initErrorReporter();
  }, []);

  // Dynamic SEO Meta Tag Management on active page change
  useEffect(() => {
    updatePageSEO(currentPath);
  }, [currentPath]);

  // Track Page Views on route change
  useEffect(() => {
    if (!currentPath.startsWith('/admin')) {
      trackPageView(currentPath);
    }
  }, [currentPath]);

  // Listen to browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top button visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load public data
  useEffect(() => {
    const safeFetchJson = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await res.json();
        }
        return null;
      } catch (e) {
        return null;
      }
    };

    const loadPublicData = async () => {
      try {
        const [srvData, demData, faqData, cntData, setData] = await Promise.all([
          safeFetchJson('/api/public/services'),
          safeFetchJson('/api/public/demos'),
          safeFetchJson('/api/public/faqs'),
          safeFetchJson('/api/public/content'),
          safeFetchJson('/api/public/settings')
        ]);

        if (srvData?.success && srvData.data) setServices(srvData.data);
        if (demData?.success && demData.data) setDemos(demData.data);
        if (faqData?.success && faqData.data) setFaqs(faqData.data);
        if (cntData?.success && cntData.data) setCompanyContent(cntData.data);
        if (setData?.success && setData.data) setSettings(setData.data);
      } catch (err) {
        console.error('Error fetching public platform data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPublicData();
  }, []);

  // Check admin session if token exists
  useEffect(() => {
    if (!adminToken) return;

    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        const data = await res.json();
        if (data.success && data.admin) {
          setAdminUser(data.admin);
        } else {
          // Token expired or invalid
          localStorage.removeItem('ahsan_admin_token');
          setAdminToken(null);
          setAdminUser(null);
        }
      } catch (err) {
        console.error('Error verifying admin token:', err);
      }
    };

    checkAdmin();
  }, [adminToken]);

  // Handler for service selection to open Get Started form pre-filled
  const handleSelectService = (serviceName: string) => {
    setSelectedServiceForOrder(serviceName);
    handleNavigate('/get-started');
  };

  // Handler for Watch Demo click
  const handleWatchDemo = (demo: DemoItem) => {
    setSelectedDemoForVideo(demo);
  };

  // Admin Login Success
  const handleLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    handleNavigate('/admin');
  };

  // Admin Logout
  const handleLogout = () => {
    localStorage.removeItem('ahsan_admin_token');
    setAdminToken(null);
    setAdminUser(null);
    handleNavigate('/admin');
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#081120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black w-full overflow-x-hidden relative">
      
      {/* Video Modal Player */}
      <VideoModal
        isOpen={!!selectedDemoForVideo}
        demo={selectedDemoForVideo}
        onClose={() => setSelectedDemoForVideo(null)}
        onRequestService={(serviceName) => {
          setSelectedDemoForVideo(null);
          handleSelectService(serviceName);
        }}
      />

      {/* Global Public Navigation Bar (hidden in Admin mode) */}
      {!isAdminRoute && (
        <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full overflow-x-hidden">
        {(() => {
          // Admin Routes
          if (isAdminRoute) {
            if (adminToken && adminUser) {
              return (
                <AdminPortal
                  token={adminToken}
                  admin={adminUser}
                  onLogout={handleLogout}
                  onNavigateHome={() => handleNavigate('/')}
                />
              );
            }
            return (
              <AdminLogin
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => handleNavigate('/')}
              />
            );
          }

          // Public Pages
          switch (currentPath) {
            case '/services':
              return (
                <ServicesPage
                  services={services}
                  demos={demos}
                  initialServiceSlug="ai-agents"
                  onSelectService={handleSelectService}
                  onWatchDemo={handleWatchDemo}
                />
              );

            case '/demos':
              return (
                <DemosPage
                  demos={demos}
                  onWatchDemo={handleWatchDemo}
                  onSelectService={handleSelectService}
                />
              );

            case '/about':
              return (
                <AboutPage
                  content={companyContent}
                  onNavigate={handleNavigate}
                  onSelectService={handleSelectService}
                />
              );

            case '/faq':
              return (
                <FAQPage
                  faqs={faqs}
                  onNavigate={handleNavigate}
                />
              );

            case '/contact':
              return (
                <ContactPage
                  settings={settings}
                  onNavigate={handleNavigate}
                />
              );

            case '/get-started':
              return (
                <GetStartedPage
                  initialService={selectedServiceForOrder}
                  onNavigate={handleNavigate}
                />
              );

            case '/':
            default:
              return (
                <HomePage
                  content={companyContent}
                  services={services}
                  demos={demos}
                  onNavigate={handleNavigate}
                  onSelectService={handleSelectService}
                  onWatchDemo={handleWatchDemo}
                />
              );
          }
        })()}
      </main>

      {/* Floating Quick WhatsApp & Support Trigger */}
      {!isAdminRoute && (
        <aside 
          aria-label="Direct Support and Back to top actions"
          className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3"
        >
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 shadow-lg flex items-center justify-center transition-all animate-in fade-in zoom-in"
              title="Scroll to top"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}

          {/* Quick WhatsApp Floating Contact */}
          <a
            href={`https://wa.me/${settings?.whatsappDirectNumber || '923316041183'}?text=${encodeURIComponent('Hello AHSAN AI LABS team, I would like to inquire about building an AI automation system for my business.')}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/80 hover:scale-105 active:scale-95 transition-all duration-200"
            title="Chat on WhatsApp"
            aria-label="Chat directly on WhatsApp with AHSAN AI LABS"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp Us</span>
          </a>
        </aside>
      )}

      {/* Global Public Footer */}
      {!isAdminRoute && (
        <Footer
          settings={settings}
          onNavigate={handleNavigate}
          onSelectService={handleSelectService}
        />
      )}

    </div>
  );
}
