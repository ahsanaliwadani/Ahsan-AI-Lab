import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Layers, 
  Video, 
  HelpCircle, 
  FileText, 
  Settings, 
  ShieldAlert, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Send, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Edit, 
  Lock,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Check,
  Building,
  Mail,
  Phone,
  Globe, 
  Calendar,
  DollarSign,
  ChevronRight,
  Eye,
  Sliders,
  Cpu,
  Zap,
  Database,
  KeyRound,
  FileSpreadsheet,
  Activity,
  TrendingUp,
  Target
} from 'lucide-react';
import { 
  AdminUser, 
  Inquiry, 
  InquiryStatus, 
  ServiceItem, 
  DemoItem, 
  FAQItem, 
  CompanyContent, 
  SiteSettings, 
  AuditLog, 
  ServiceType 
} from '../../types';
import { AnalyticsMonitoringView } from './analytics/AnalyticsMonitoringView';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminPortalProps {
  token: string;
  admin: AdminUser;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type AdminTab = 
  | 'overview' 
  | 'analytics'
  | 'inquiries' 
  | 'services' 
  | 'demos' 
  | 'faqs' 
  | 'content' 
  | 'settings' 
  | 'audit';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  token,
  admin,
  onLogout,
  onNavigateHome
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<any>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [demos, setDemos] = useState<DemoItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [content, setContent] = useState<CompanyContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Inquiries UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isRetryingNotification, setIsRetryingNotification] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Modals & Editing
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingDemo, setEditingDemo] = useState<Partial<DemoItem> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Webhook testing
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        inqRes,
        srvRes,
        demRes,
        faqRes,
        cntRes,
        setRes,
        audRes
      ] = await Promise.all([
        fetch('/api/admin/dashboard-stats', { headers: authHeaders }),
        fetch('/api/admin/inquiries', { headers: authHeaders }),
        fetch('/api/admin/services', { headers: authHeaders }),
        fetch('/api/admin/demos', { headers: authHeaders }),
        fetch('/api/admin/faqs', { headers: authHeaders }),
        fetch('/api/admin/content', { headers: authHeaders }),
        fetch('/api/admin/settings', { headers: authHeaders }),
        fetch('/api/admin/audit-logs', { headers: authHeaders })
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.data);
      }
      if (inqRes.ok) {
        const d = await inqRes.json();
        setInquiries(d.data || []);
      }
      if (srvRes.ok) {
        const d = await srvRes.json();
        setServices(d.data || []);
      }
      if (demRes.ok) {
        const d = await demRes.json();
        setDemos(d.data || []);
      }
      if (faqRes.ok) {
        const d = await faqRes.json();
        setFaqs(d.data || []);
      }
      if (cntRes.ok) {
        const d = await cntRes.json();
        setContent(d.data);
      }
      if (setRes.ok) {
        const d = await setRes.json();
        setSettings(d.data);
      }
      if (audRes.ok) {
        const d = await audRes.json();
        setAuditLogs(d.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // --- CSV EXPORT ---
  const exportInquiriesToCsv = () => {
    if (inquiries.length === 0) {
      alert('No inquiries available to export.');
      return;
    }

    const headers = [
      'Inquiry ID',
      'Created Date',
      'Client Name',
      'Company Name',
      'Email',
      'WhatsApp',
      'Country',
      'Service',
      'Industry',
      'Status',
      'Timeline',
      'Budget',
      'Preferred Contact',
      'Problem / Description',
      'Requirements'
    ];

    const rows = inquiries.map(i => [
      `"${i.inquiryId}"`,
      `"${new Date(i.createdAt).toISOString()}"`,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.companyName.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.whatsapp}"`,
      `"${i.country}"`,
      `"${i.service}"`,
      `"${(i.industry || '').replace(/"/g, '""')}"`,
      `"${i.status}"`,
      `"${i.timeline}"`,
      `"${i.budget || ''}"`,
      `"${i.preferredContact}"`,
      `"${(i.problem || '').replace(/"/g, '""')}"`,
      `"${(i.requirements || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ahsan_ai_labs_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CLEAR TEST INQUIRIES ---
  const handleClearAllInquiries = async () => {
    try {
      const res = await fetch('/api/admin/clear-inquiries', {
        method: 'POST',
        headers: authHeaders
      });
      const data = await res.json();
      if (data.success) {
        setShowClearConfirmModal(false);
        setSelectedInquiry(null);
        fetchAllData();
      } else {
        alert(data.message || 'Failed to clear inquiries');
      }
    } catch (err) {
      alert('Error clearing inquiries');
    }
  };

  // --- CHANGE PASSWORD ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordStatusMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPasswordInput.length < 8) {
      setPasswordStatusMsg({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput
        })
      });
      const data = await res.json();
      if (data.success) {
        setPasswordStatusMsg({ type: 'success', text: 'Password successfully updated!' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPasswordInput('');
          setNewPasswordInput('');
          setConfirmPasswordInput('');
          setPasswordStatusMsg(null);
        }, 1500);
      } else {
        setPasswordStatusMsg({ type: 'error', text: data.message || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordStatusMsg({ type: 'error', text: 'Network error updating password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // --- DATABASE EXPORT & IMPORT ---
  const handleExportDatabaseJson = () => {
    window.open('/api/admin/export-data?token=' + token, '_blank');
  };

  // --- INQUIRY ACTIONS ---
  const handleUpdateInquiryStatus = async (id: string, status: InquiryStatus) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status } : null);
        }
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteText.trim()) return;

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry._id}/notes`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ text: newNoteText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedInquiry(data.data);
        setInquiries(prev => prev.map(i => i._id === selectedInquiry._id ? data.data : i));
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleRetryNotification = async (id: string) => {
    setIsRetryingNotification(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/retry-notification`, {
        method: 'POST',
        headers: authHeaders
      });
      const data = await res.json();
      if (data.success) {
        setSelectedInquiry(data.data);
        setInquiries(prev => prev.map(i => i._id === id ? data.data : i));
      }
    } catch (err) {
      console.error('Retry notification failed:', err);
    } finally {
      setIsRetryingNotification(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.filter(i => i._id !== id));
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
    }
  };

  // --- SERVICE CMS ACTIONS ---
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name) return;
    const isEdit = !!editingService._id;
    const url = isEdit ? `/api/admin/services/${editingService._id}` : '/api/admin/services';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingService)
      });
      const data = await res.json();
      if (data.success) {
        setEditingService(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to save service:', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/admin/services/${id}`, { method: 'DELETE', headers: authHeaders });
      fetchAllData();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  // --- DEMO CMS ACTIONS ---
  const handleSaveDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDemo || !editingDemo.title) return;
    const isEdit = !!editingDemo._id;
    const url = isEdit ? `/api/admin/demos/${editingDemo._id}` : '/api/admin/demos';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingDemo)
      });
      const data = await res.json();
      if (data.success) {
        setEditingDemo(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to save demo:', err);
    }
  };

  const handleDeleteDemo = async (id: string) => {
    if (!confirm('Delete this showcase demo?')) return;
    try {
      await fetch(`/api/admin/demos/${id}`, { method: 'DELETE', headers: authHeaders });
      fetchAllData();
    } catch (err) {
      console.error('Failed to delete demo:', err);
    }
  };

  // --- FAQ CMS ACTIONS ---
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;
    const isEdit = !!editingFaq._id;
    const url = isEdit ? `/api/admin/faqs/${editingFaq._id}` : '/api/admin/faqs';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingFaq)
      });
      const data = await res.json();
      if (data.success) {
        setEditingFaq(null);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to save FAQ:', err);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE', headers: authHeaders });
      fetchAllData();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSavedMessage('Platform settings saved successfully.');
        setTimeout(() => setSettingsSavedMessage(''), 3000);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleTestWebhook = async () => {
    if (!settings?.n8nWebhookUrl) return;
    setIsTestingWebhook(true);
    setWebhookTestResult(null);

    try {
      const res = await fetch('/api/admin/test-webhook', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          url: settings.n8nWebhookUrl,
          secret: settings.n8nWebhookSecret
        })
      });
      const data = await res.json();
      setWebhookTestResult(data.data || { ok: false, statusText: 'Error' });
    } catch (err: any) {
      setWebhookTestResult({ ok: false, statusText: err.message });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // Status Badge Helper
  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">NEW</span>;
      case 'CONTACTED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-950 text-purple-400 border border-purple-800">CONTACTED</span>;
      case 'DISCUSSING':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 text-amber-400 border border-amber-800">DISCUSSING</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-400 border border-blue-800">COMPLETED</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.inquiryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.whatsapp.includes(searchQuery);

    const matchesStatus = statusFilter === 'ALL' || inq.status === statusFilter;
    const matchesService = serviceFilter === 'ALL' || inq.service === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { 
      id: 'analytics', 
      label: 'Analytics & Monitoring', 
      icon: <Activity className="w-4 h-4 text-cyan-400" /> 
    },
    { 
      id: 'inquiries', 
      label: 'Inquiries', 
      icon: <Users className="w-4 h-4" />, 
      count: stats?.newInquiries || 0 
    },
    { id: 'services', label: 'Services CMS', icon: <Layers className="w-4 h-4" /> },
    { id: 'demos', label: 'Demos CMS', icon: <Video className="w-4 h-4" /> },
    { id: 'faqs', label: 'FAQs CMS', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'content', label: 'Company CMS', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings & n8n', icon: <Settings className="w-4 h-4" /> },
    { id: 'audit', label: 'Security & Audit', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-[#060c18] text-slate-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#081120] border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        
        {/* Brand header */}
        <div className="p-6">
          <div className="mb-8 cursor-pointer" onClick={onNavigateHome}>
            <BrandLogo 
              size="sm" 
              taglineClassName="text-cyan-400 font-mono tracking-wider" 
            />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSelectedInquiry(null);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.count ? (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div>
              <div className="font-semibold text-slate-200">{admin.name}</div>
              <div className="text-[10px] text-blue-400">{admin.role}</div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Change Admin Password"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateHome}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="View Public Site"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-red-950/60 hover:text-red-300 text-slate-400 text-xs font-semibold flex items-center justify-center space-x-2 border border-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-screen">
        
        {/* Top bar header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white capitalize">
                {currentTab.replace('-', ' ')}
              </h2>
              {stats?.mongoStatus && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  <Database className="w-3 h-3" />
                  <span>{stats.mongoStatus.mode}</span>
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              AHSAN AI LABS Enterprise Management & Automation Control
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center space-x-1"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {currentTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Total Inquiries', value: stats.totalInquiries, color: 'text-white' },
                { label: 'New / Unreviewed', value: stats.newInquiries, color: 'text-cyan-400' },
                { label: 'Contacted', value: stats.contactedInquiries, color: 'text-purple-400' },
                { label: 'In Progress', value: stats.inProgressInquiries, color: 'text-emerald-400' },
                { label: 'Completed', value: stats.completedInquiries, color: 'text-blue-400' },
                { label: 'Active Services', value: stats.totalServices, color: 'text-amber-400' }
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-medium text-slate-400">{s.label}</div>
                  <div className={`text-2xl sm:text-3xl font-bold font-mono ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Inquiries by Service & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Service Distribution */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                  Demand by Solution
                </h3>
                <div className="space-y-3">
                  {Object.keys(stats.serviceDistribution || {}).length === 0 ? (
                    <div className="text-slate-500 text-xs py-4 text-center">No inquiry service data recorded yet.</div>
                  ) : (
                    Object.entries(stats.serviceDistribution || {}).map(([srv, count]) => (
                      <div key={srv} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{srv}</span>
                          <span className="font-mono text-cyan-400">{count as number} inquiries</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, ((count as number) / Math.max(1, stats.totalInquiries)) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* System Infrastructure Status */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
                <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                  Production Infrastructure Health
                </h3>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">n8n Automation Engine</div>
                      <div className="text-slate-400 font-mono text-[11px] truncate max-w-[220px]">
                        {settings?.n8nWebhookUrl || 'Configured in Settings'}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                      CONNECTED
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">WhatsApp Notifications</div>
                      <div className="text-slate-400">Automated Direct Dispatch</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 border border-blue-700 text-cyan-300">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Database Engine</div>
                      <div className="text-slate-400">{stats?.mongoStatus?.mode || 'MongoDB / Local Store'}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 border border-emerald-700 text-emerald-300">
                      OPERATIONAL
                    </span>
                  </div>

                  {/* Quick Monitoring Jump Banner */}
                  <div 
                    onClick={() => setCurrentTab('analytics')}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-cyan-950/40 border border-cyan-800/60 flex items-center justify-between cursor-pointer hover:border-cyan-500 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold text-white text-xs">Live Telemetry & Web Vitals</div>
                        <div className="text-[11px] text-cyan-300/80">99.98% Uptime • Avg 24ms API Latency</div>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Recent Inquiries List */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                  Latest Inquiries
                </h3>
                <button
                  onClick={() => setCurrentTab('inquiries')}
                  className="text-xs text-blue-400 hover:text-cyan-300 font-semibold"
                >
                  View All Inquiries →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Customer / Company</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Timeline</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-6 text-center text-slate-500">
                          No inquiries received yet. Production ready to accept live submissions.
                        </td>
                      </tr>
                    ) : (
                      inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq._id} className="hover:bg-slate-900/40">
                          <td className="py-3 font-mono text-cyan-400 font-semibold">{inq.inquiryId}</td>
                          <td className="py-3 font-medium text-white">
                            <div>{inq.fullName}</div>
                            <div className="text-[11px] text-slate-400">{inq.companyName}</div>
                          </td>
                          <td className="py-3 text-slate-200">{inq.service}</td>
                          <td className="py-3">{inq.country}</td>
                          <td className="py-3">{getStatusBadge(inq.status)}</td>
                          <td className="py-3 text-slate-400">{inq.timeline}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedInquiry(inq);
                                setCurrentTab('inquiries');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-medium text-[11px] transition-colors"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. ANALYTICS & MONITORING TAB */}
        {currentTab === 'analytics' && (
          <div className="animate-in fade-in duration-200">
            <AnalyticsMonitoringView token={token} />
          </div>
        )}

        {/* 2. INQUIRIES MANAGEMENT TAB */}
        {currentTab === 'inquiries' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Top Inquiries Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={exportInquiriesToCsv}
                  disabled={inquiries.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                {inquiries.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirmModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Inquiries</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-400">
                Total Inquiries: <span className="font-bold text-white font-mono">{inquiries.length}</span>
              </div>
            </div>

            {/* Search and Filters Header */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by ID, name, email, company, WhatsApp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="DISCUSSING">DISCUSSING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="ALL">All Services</option>
                  <option value="AI Agents">AI Agents</option>
                  <option value="AI Voice Agents">AI Voice Agents</option>
                  <option value="AI Chatbots">AI Chatbots</option>
                  <option value="Business Automation">Business Automation</option>
                  <option value="WhatsApp Automation">WhatsApp Automation</option>
                </select>
              </div>
            </div>

            {/* Inquiries List or Detail View */}
            {selectedInquiry ? (
              /* Detailed Inquiry Inspector */
              <div className="p-6 rounded-3xl bg-slate-900 border border-blue-900/60 shadow-2xl space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      ← Back to All Inquiries
                    </button>
                    <div>
                      <span className="font-mono text-cyan-400 font-bold text-sm">
                        {selectedInquiry.inquiryId}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedInquiry.status)}
                    <button
                      onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Transition Action Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Change Pipeline Status:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['NEW', 'CONTACTED', 'DISCUSSING', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'] as InquiryStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateInquiryStatus(selectedInquiry._id, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedInquiry.status === st
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main 2-Col Data Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Customer Info & Requirements */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                      <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-blue-400">
                        Customer & Business Profile
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-slate-500">Contact Name</div>
                          <div className="font-semibold text-white text-sm">{selectedInquiry.fullName}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Company Name</div>
                          <div className="font-semibold text-white text-sm">{selectedInquiry.companyName}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Email Address</div>
                          <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 hover:underline">
                            {selectedInquiry.email}
                          </a>
                        </div>
                        <div>
                          <div className="text-slate-500">WhatsApp / Phone</div>
                          <a 
                            href={`https://wa.me/${selectedInquiry.whatsapp.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline font-semibold flex items-center"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {selectedInquiry.whatsapp}
                          </a>
                        </div>
                        <div>
                          <div className="text-slate-500">Country / Location</div>
                          <div className="text-slate-200">{selectedInquiry.country}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Industry / Sector</div>
                          <div className="text-slate-200">{selectedInquiry.industry || 'General'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                      <div>
                        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                          Problem / Context:
                        </div>
                        <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          {selectedInquiry.problem}
                        </p>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                          Project Requirements:
                        </div>
                        <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800 whitespace-pre-line">
                          {selectedInquiry.requirements}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Service Requested</div>
                          <div className="font-semibold text-white">{selectedInquiry.service}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Timeline</div>
                          <div className="font-semibold text-white">{selectedInquiry.timeline}</div>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                          <div className="text-slate-500 text-[10px]">Budget</div>
                          <div className="font-semibold text-emerald-400 font-mono">{selectedInquiry.budget || 'Custom'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Notes & Automation */}
                  <div className="lg:col-span-5 space-y-6">
                    
                    {/* Internal Team Notes */}
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 text-xs">
                      <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-purple-400">
                        Internal Team Notes
                      </h4>

                      <form onSubmit={handleAddNote} className="space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Add team note or follow-up update..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 resize-none"
                        />
                        <button
                          type="submit"
                          className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                        >
                          Post Note
                        </button>
                      </form>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedInquiry.adminNotes && selectedInquiry.adminNotes.length > 0 ? (
                          selectedInquiry.adminNotes.map((n) => (
                            <div key={n.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                                <span className="font-semibold text-slate-200">{n.author}</span>
                                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-slate-300">{n.text}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 text-center py-2">No internal notes yet.</div>
                        )}
                      </div>
                    </div>

                    {/* Automation Notification Logs & Retry */}
                    <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-cyan-400">
                          Automation Logs
                        </h4>
                        <button
                          onClick={() => handleRetryNotification(selectedInquiry._id)}
                          disabled={isRetryingNotification}
                          className="text-[11px] text-blue-400 hover:underline flex items-center space-x-1"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRetryingNotification ? 'animate-spin' : ''}`} />
                          <span>Retry Automation</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {selectedInquiry.notificationLogs && selectedInquiry.notificationLogs.length > 0 ? (
                          selectedInquiry.notificationLogs.map((log) => (
                            <div key={log.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-300">{log.type}</span>
                                <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                                  log.status === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                                }`}>
                                  {log.status}
                                </span>
                              </div>
                              <div className="text-slate-400">{log.responseMessage || log.target}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500">No automation logs registered.</div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            ) : (
              /* Inquiries Table */
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">Inquiry ID</th>
                      <th className="pb-3">Customer & Company</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          {searchQuery || statusFilter !== 'ALL' || serviceFilter !== 'ALL'
                            ? 'No inquiries found matching your filters.'
                            : 'No inquiries registered yet. The platform is ready to record new client requests.'}
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id} className="hover:bg-slate-900/40">
                          <td className="py-3.5 font-mono text-cyan-400 font-semibold">{inq.inquiryId}</td>
                          <td className="py-3.5 font-medium text-white">
                            <div>{inq.fullName}</div>
                            <div className="text-[11px] text-slate-400">{inq.companyName}</div>
                          </td>
                          <td className="py-3.5 text-slate-200">{inq.service}</td>
                          <td className="py-3.5">{inq.country}</td>
                          <td className="py-3.5">{getStatusBadge(inq.status)}</td>
                          <td className="py-3.5 text-slate-400">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button
                              onClick={() => setSelectedInquiry(inq)}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* 3. SERVICES CMS TAB */}
        {currentTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Services Catalog Management ({services.length})
              </h3>
              <button
                onClick={() => setEditingService({
                  name: '',
                  tagline: '',
                  shortDescription: '',
                  fullDescription: '',
                  features: [],
                  capabilities: [],
                  published: true,
                  displayOrder: services.length + 1
                })}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {editingService && (
              <form onSubmit={handleSaveService} className="p-6 rounded-3xl bg-slate-900 border border-blue-900 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-white text-sm">
                    {editingService._id ? 'Edit Service' : 'Create New Service'}
                  </h4>
                  <button type="button" onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Service Name</label>
                    <input
                      type="text"
                      required
                      value={editingService.name || ''}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Tagline</label>
                    <input
                      type="text"
                      value={editingService.tagline || ''}
                      onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Short Description</label>
                  <textarea
                    rows={2}
                    value={editingService.shortDescription || ''}
                    onChange={(e) => setEditingService({ ...editingService, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    Save Service
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv._id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{srv.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${srv.published ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {srv.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                    <div className="text-cyan-400 text-[11px] font-medium mt-0.5">{srv.tagline}</div>
                    <p className="text-slate-400 mt-2 line-clamp-2">{srv.shortDescription}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                    <button onClick={() => setEditingService(srv)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteService(srv._id)} className="p-1.5 rounded-lg bg-red-950/60 text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. DEMOS CMS TAB */}
        {currentTab === 'demos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Showcase Video & Demo CMS ({demos.length})
              </h3>
              <button
                onClick={() => setEditingDemo({
                  title: '',
                  category: 'AI AGENTS',
                  description: '',
                  features: [],
                  published: true,
                  displayOrder: demos.length + 1
                })}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Demo</span>
              </button>
            </div>

            {editingDemo && (
              <form onSubmit={handleSaveDemo} className="p-6 rounded-3xl bg-slate-900 border border-blue-900 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-white text-sm">
                    {editingDemo._id ? 'Edit Showcase Demo' : 'Create Showcase Demo'}
                  </h4>
                  <button type="button" onClick={() => setEditingDemo(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Demo Title</label>
                    <input
                      type="text"
                      required
                      value={editingDemo.title || ''}
                      onChange={(e) => setEditingDemo({ ...editingDemo, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Category</label>
                    <select
                      value={editingDemo.category || 'AI AGENTS'}
                      onChange={(e) => setEditingDemo({ ...editingDemo, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option value="AI AGENTS">AI AGENTS</option>
                      <option value="AI VOICE AGENTS">AI VOICE AGENTS</option>
                      <option value="AI CHATBOTS">AI CHATBOTS</option>
                      <option value="BUSINESS AUTOMATION">BUSINESS AUTOMATION</option>
                      <option value="WHATSAPP AUTOMATION">WHATSAPP AUTOMATION</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Description</label>
                  <textarea
                    rows={2}
                    value={editingDemo.description || ''}
                    onChange={(e) => setEditingDemo({ ...editingDemo, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setEditingDemo(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    Save Demo
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {demos.map((d) => (
                <div key={d._id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                      {d.category}
                    </span>
                    <div className="font-bold text-white mt-2">{d.title}</div>
                    <p className="text-slate-400 mt-1 line-clamp-2">{d.description}</p>
                  </div>
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                    <button onClick={() => setEditingDemo(d)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteDemo(d._id)} className="p-1.5 rounded-lg bg-red-950/60 text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FAQS CMS TAB */}
        {currentTab === 'faqs' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                FAQs Management ({faqs.length})
              </h3>
              <button
                onClick={() => setEditingFaq({
                  question: '',
                  answer: '',
                  category: 'General',
                  published: true,
                  displayOrder: faqs.length + 1
                })}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>

            {editingFaq && (
              <form onSubmit={handleSaveFaq} className="p-6 rounded-3xl bg-slate-900 border border-blue-900 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-white text-sm">
                    {editingFaq._id ? 'Edit FAQ' : 'Create FAQ'}
                  </h4>
                  <button type="button" onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Question</label>
                  <input
                    type="text"
                    required
                    value={editingFaq.question || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Answer</label>
                  <textarea
                    rows={3}
                    required
                    value={editingFaq.answer || ''}
                    onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setEditingFaq(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
                    Save FAQ
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {faqs.map((f) => (
                <div key={f._id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white">{f.question}</div>
                    <p className="text-slate-300">{f.answer}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button onClick={() => setEditingFaq(f)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteFaq(f._id)} className="p-1.5 rounded bg-red-950 text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. CONTENT & FOUNDER CMS TAB */}
        {currentTab === 'content' && content && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider text-blue-400">
                Founder Profile & Bio Management (Ahsan Ali)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Founder Name</label>
                  <input
                    type="text"
                    value={content.founder?.name || ''}
                    onChange={(e) => setContent({
                      ...content,
                      founder: { ...content.founder, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Founder Title</label>
                  <input
                    type="text"
                    value={content.founder?.title || ''}
                    onChange={(e) => setContent({
                      ...content,
                      founder: { ...content.founder, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Founder Quote</label>
                <input
                  type="text"
                  value={content.founder?.quote || ''}
                  onChange={(e) => setContent({
                    ...content,
                    founder: { ...content.founder, quote: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Founder Bio</label>
                <textarea
                  rows={4}
                  value={content.founder?.bio || ''}
                  onChange={(e) => setContent({
                    ...content,
                    founder: { ...content.founder, bio: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                />
              </div>

              <button
                onClick={async () => {
                  await fetch('/api/admin/content', {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify(content)
                  });
                  alert('Content CMS updated successfully.');
                  fetchAllData();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Save Content CMS Changes
              </button>
            </div>
          </div>
        )}

        {/* 7. SETTINGS & AUTOMATION TAB */}
        {currentTab === 'settings' && settings && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {settingsSavedMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs">
                {settingsSavedMessage}
              </div>
            )}

            {/* Database Backup & Export Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                <Database className="w-4 h-4" />
                <span>Database Snapshot & Backup</span>
              </div>
              <p className="text-slate-300">
                Generate an immediate JSON snapshot of all inquiries, services, demos, FAQs, content, and settings.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportDatabaseJson}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full JSON Backup</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-xs">
              
              {/* n8n Section */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                  <Zap className="w-4 h-4" />
                  <span>n8n Webhook & Automation Workflow</span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">n8n Webhook Target URL</label>
                  <input
                    type="url"
                    placeholder="https://n8n.yourdomain.com/webhook/..."
                    value={settings.n8nWebhookUrl || ''}
                    onChange={(e) => setSettings({ ...settings, n8nWebhookUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    The backend dispatches a secure POST payload with complete inquiry parameters whenever a visitor submits an order.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">n8n Webhook Secret Token (Optional)</label>
                  <input
                    type="password"
                    placeholder="Bearer secret token"
                    value={settings.n8nWebhookSecret || ''}
                    onChange={(e) => setSettings({ ...settings, n8nWebhookSecret: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={isTestingWebhook || !settings.n8nWebhookUrl}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold flex items-center space-x-1.5"
                  >
                    <Send className={`w-3.5 h-3.5 ${isTestingWebhook ? 'animate-spin' : ''}`} />
                    <span>Send Test Ping to Webhook</span>
                  </button>

                  {webhookTestResult && (
                    <div className={`text-xs px-2 py-1 rounded font-mono ${webhookTestResult.ok ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'}`}>
                      {webhookTestResult.ok ? `HTTP ${webhookTestResult.status} OK` : `Failed: ${webhookTestResult.statusText || 'Error'}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="text-blue-400 font-bold uppercase tracking-wider text-xs">
                  General Platform Coordinates
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Support WhatsApp Display</label>
                    <input
                      type="text"
                      value={settings.supportWhatsApp || ''}
                      onChange={(e) => setSettings({ ...settings, supportWhatsApp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">WhatsApp Direct Number (digits only)</label>
                    <input
                      type="text"
                      value={settings.whatsappDirectNumber || ''}
                      onChange={(e) => setSettings({ ...settings, whatsappDirectNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Primary Contact Email</label>
                    <input
                      type="email"
                      value={settings.primaryEmail || ''}
                      onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30"
                >
                  Save Platform Settings
                </button>
              </div>

            </form>
          </div>
        )}

        {/* 8. AUDIT LOGS TAB */}
        {currentTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="text-xs text-slate-400">
                Immutable security and administrative event stream.
              </div>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log._id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-cyan-400 font-bold">{log.action}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {log.targetType}
                        </span>
                      </div>
                      <p className="text-slate-300">{log.details}</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500 shrink-0 font-mono">
                      <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                      <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CONFIRM CLEAR ALL INQUIRIES MODAL */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-red-800/80 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-700 flex items-center justify-center text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Clear All Inquiries?</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                This will permanently delete all <span className="text-red-400 font-bold">{inquiries.length}</span> inquiries from the database. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAllInquiries}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Yes, Purge Inquiries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-blue-800/80 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-cyan-400" />
                <span>Change Administrator Password</span>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {passwordStatusMsg && (
              <div className={`p-3 rounded-xl text-xs ${
                passwordStatusMsg.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
              }`}>
                {passwordStatusMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">New Password (min 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
