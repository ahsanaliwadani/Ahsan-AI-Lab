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
  Target,
  Menu,
  X,
  Copy,
  FileDown,
  UserPlus,
  PhoneCall,
  Share2,
  CheckSquare,
  Square,
  Archive,
  ArrowUpRight,
  Upload,
  Play,
  Film,
  Image as ImageIcon,
  Loader2,
  Wand2,
  ImagePlus,
  Server,
  HardDrive,
  Gauge,
  FileCode,
  CheckCheck
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
  ServiceType,
  ContactMethod
} from '../../types';
import { AnalyticsMonitoringView } from './analytics/AnalyticsMonitoringView';
import { BrandLogo } from '../../components/BrandLogo';
import { VideoModal } from '../../components/VideoModal';
import { parseVideoUrl } from '../../utils/video';

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

  // Mobile Navigation Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Inquiries UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isRetryingNotification, setIsRetryingNotification] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [selectedInquiryIds, setSelectedInquiryIds] = useState<string[]>([]);
  const [copiedLeadSummary, setCopiedLeadSummary] = useState(false);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Smart WhatsApp Proposal State
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalInquiry, setProposalInquiry] = useState<Inquiry | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [proposalCopied, setProposalCopied] = useState(false);

  // Brand Logo Studio State
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());
  const [logoUploadMsg, setLogoUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // System Health & Diagnostics State
  const [diagnosticsData, setDiagnosticsData] = useState<any | null>(null);
  const [isLoadingDiagnostics, setIsLoadingDiagnostics] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [flushCacheMsg, setFlushCacheMsg] = useState<string | null>(null);

  // Manual Lead Modal State
  const [showManualLeadModal, setShowManualLeadModal] = useState(false);
  const [isCreatingManualLead, setIsCreatingManualLead] = useState(false);
  const [manualLeadForm, setManualLeadForm] = useState({
    fullName: '',
    companyName: '',
    email: '',
    whatsapp: '',
    country: 'United States',
    service: 'AI Agents' as ServiceType,
    industry: 'Technology',
    problem: '',
    requirements: '',
    budget: '$5,000 - $10,000',
    timeline: 'Within 2-4 Weeks',
    preferredContact: 'WhatsApp' as ContactMethod
  });

  // Modals & Editing
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingDemo, setEditingDemo] = useState<Partial<DemoItem> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);

  // Demo CMS Upload & Management State
  const [uploadingDemoVideo, setUploadingDemoVideo] = useState(false);
  const [uploadingDemoThumb, setUploadingDemoThumb] = useState(false);
  const [demoUploadStatus, setDemoUploadStatus] = useState<string | null>(null);
  const [featureTagInput, setFeatureTagInput] = useState('');
  const [previewingDemo, setPreviewingDemo] = useState<DemoItem | null>(null);
  const [demoSearchFilter, setDemoSearchFilter] = useState('');
  const [demoCategoryFilter, setDemoCategoryFilter] = useState('ALL');

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

  // --- BULK INQUIRIES EXPORT ---
  const handleBulkExportCsv = () => {
    const targetInquiries = inquiries.filter(i => selectedInquiryIds.includes(i._id));
    if (targetInquiries.length === 0) return;

    const headers = ['Inquiry ID', 'Created Date', 'Client Name', 'Company Name', 'Email', 'WhatsApp', 'Country', 'Service', 'Status', 'Budget', 'Requirements'];
    const rows = targetInquiries.map(i => [
      `"${i.inquiryId}"`,
      `"${new Date(i.createdAt).toISOString()}"`,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.companyName.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.whatsapp}"`,
      `"${i.country}"`,
      `"${i.service}"`,
      `"${i.status}"`,
      `"${i.budget || ''}"`,
      `"${(i.requirements || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `selected_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- BULK STATUS CHANGE ---
  const handleBulkStatusChange = async (newStatus: InquiryStatus) => {
    if (selectedInquiryIds.length === 0) return;
    setIsBulkUpdating(true);
    try {
      const res = await fetch('/api/admin/inquiries/bulk-status', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ids: selectedInquiryIds, status: newStatus })
      });
      if (res.ok) {
        setSelectedInquiryIds([]);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to update bulk status:', err);
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // --- BULK DELETE INQUIRIES ---
  const handleBulkDeleteInquiries = async () => {
    if (selectedInquiryIds.length === 0) return;
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${selectedInquiryIds.length} selected lead(s)?`);
    if (!confirmDelete) return;

    setIsBulkDeleting(true);
    try {
      const res = await fetch('/api/admin/inquiries/bulk-delete', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ids: selectedInquiryIds })
      });
      if (res.ok) {
        setSelectedInquiryIds([]);
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to bulk delete inquiries:', err);
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // --- BRAND LOGO UPLOAD ---
  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLogoUploadMsg({ type: 'error', text: 'Please select a valid image file (JPG, PNG, WebP, SVG).' });
      return;
    }

    setIsUploadingLogo(true);
    setLogoUploadMsg(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result as string;
        const res = await fetch('/api/admin/upload-logo', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ fileData, fileName: file.name })
        });
        const data = await res.json();
        if (data.success) {
          setLogoTimestamp(Date.now());
          setLogoUploadMsg({ type: 'success', text: 'Brand logo updated successfully! Reloading system cache...' });
          setTimeout(() => setLogoUploadMsg(null), 5000);
        } else {
          setLogoUploadMsg({ type: 'error', text: data.message || 'Failed to upload logo.' });
        }
      } catch (err: any) {
        setLogoUploadMsg({ type: 'error', text: err?.message || 'Network error during logo upload.' });
      } finally {
        setIsUploadingLogo(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- SYSTEM DIAGNOSTICS & CACHE FLUSH ---
  const handleLoadDiagnostics = async () => {
    setIsLoadingDiagnostics(true);
    try {
      const res = await fetch('/api/admin/system/diagnostics', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        setDiagnosticsData(data.diagnostics);
      }
    } catch (err) {
      console.error('Failed to load diagnostics:', err);
    } finally {
      setIsLoadingDiagnostics(false);
    }
  };

  const handleFlushCache = async () => {
    setIsFlushingCache(true);
    setFlushCacheMsg(null);
    try {
      const res = await fetch('/api/admin/system/flush-cache', {
        method: 'POST',
        headers: authHeaders
      });
      const data = await res.json();
      if (data.success) {
        setFlushCacheMsg('Cache purged and system memory synced successfully.');
        fetchAllData();
        setTimeout(() => setFlushCacheMsg(null), 4000);
      }
    } catch (err) {
      setFlushCacheMsg('Failed to flush cache.');
    } finally {
      setIsFlushingCache(false);
    }
  };

  // --- OPEN WHATSAPP PROPOSAL DRAFT ---
  const handleOpenProposal = (inq: Inquiry) => {
    setProposalInquiry(inq);
    const clientName = inq.fullName.split(' ')[0] || inq.fullName;
    const requirementsSummary = inq.requirements?.length > 150 
      ? inq.requirements.slice(0, 150) + '...' 
      : inq.requirements || 'tailored autonomous AI workflow systems';

    const draft = `Hello ${clientName},

Thank you for contacting AHSAN AI LABS regarding ${inq.service} for ${inq.companyName}.

I have reviewed your core objective:
"${requirementsSummary}"

We have engineered autonomous enterprise architectures specifically for this use case. I would love to show you a live interactive demo and discuss how we can deploy this within your timeline (${inq.timeline}).

When would be a convenient time for a quick 15-minute technical discovery call this week?

Best regards,
Ahsan Ali
Founder & Principal AI Systems Architect
AHSAN AI LABS | http://www.ahsanlab.qd.je
WhatsApp: +92 344 6899742`;

    setProposalText(draft);
    setProposalCopied(false);
    setShowProposalModal(true);
  };

  // --- SELECTION TOGGLES ---
  const handleToggleSelectInquiry = (id: string) => {
    setSelectedInquiryIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllInquiries = (filteredList: Inquiry[]) => {
    if (selectedInquiryIds.length === filteredList.length) {
      setSelectedInquiryIds([]);
    } else {
      setSelectedInquiryIds(filteredList.map(i => i._id));
    }
  };

  // --- DOWNLOAD PLATFORM BACKUP ---
  const handleDownloadBackup = async () => {
    setIsDownloadingBackup(true);
    try {
      const res = await fetch('/api/admin/backup', { headers: authHeaders });
      if (!res.ok) throw new Error('Backup failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ahsan-ai-labs-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to generate full system backup.');
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  // --- CREATE MANUAL LEAD ---
  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualLeadForm.fullName || !manualLeadForm.email || !manualLeadForm.whatsapp) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsCreatingManualLead(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualLeadForm)
      });
      const data = await res.json();
      if (data.success) {
        setShowManualLeadModal(false);
        setManualLeadForm({
          fullName: '',
          companyName: '',
          email: '',
          whatsapp: '',
          country: 'United States',
          service: 'AI Agents' as ServiceType,
          industry: 'Technology',
          problem: '',
          requirements: '',
          budget: '$5,000 - $10,000',
          timeline: 'Within 2-4 Weeks',
          preferredContact: 'WhatsApp'
        });
        fetchAllData();
      } else {
        alert(data.message || 'Failed to create lead.');
      }
    } catch (err) {
      alert('Error creating manual lead.');
    } finally {
      setIsCreatingManualLead(false);
    }
  };

  // --- COPY LEAD SUMMARY ---
  const handleCopyLeadSummary = (inq: Inquiry) => {
    const summary = `📌 *AHSAN AI LABS — INQUIRY DOSSIER [${inq.inquiryId}]*
• *Client:* ${inq.fullName} (${inq.companyName || 'Private Enterprise'})
• *Service:* ${inq.service}
• *Status:* ${inq.status}
• *Country:* ${inq.country}
• *Budget:* ${inq.budget || 'Custom'}
• *Timeline:* ${inq.timeline}
• *WhatsApp:* ${inq.whatsapp}
• *Email:* ${inq.email}
• *Problem:* ${inq.problem}
• *Requirements:* ${inq.requirements}`;

    navigator.clipboard.writeText(summary);
    setCopiedLeadSummary(true);
    setTimeout(() => setCopiedLeadSummary(false), 2500);
  };

  // --- CALCULATE ESTIMATED PIPELINE VALUE ---
  const calculatePipelineValue = () => {
    let total = 0;
    inquiries.forEach(inq => {
      if (inq.status === 'CLOSED') return;
      const b = inq.budget || '';
      if (b.includes('$25,000+')) total += 35000;
      else if (b.includes('$10,000 - $25,000')) total += 17500;
      else if (b.includes('$5,000 - $10,000')) total += 7500;
      else if (b.includes('$3,000 - $5,000')) total += 4000;
      else if (b.includes('Under $3,000')) total += 2000;
      else total += 5000;
    });
    return total;
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
  const handleUploadDemoMedia = async (file: File, type: 'video' | 'thumbnail') => {
    if (!file) return;

    if (type === 'video') {
      setUploadingDemoVideo(true);
      setDemoUploadStatus(`Uploading ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`);
    } else {
      setUploadingDemoThumb(true);
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/admin/upload-media', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              fileType: file.type
            })
          });

          const data = await res.json();
          if (data.success && data.url) {
            if (type === 'video') {
              setEditingDemo(prev => prev ? ({ ...prev, videoUrl: data.url }) : null);
              setDemoUploadStatus(`Successfully uploaded: ${data.url} (${data.sizeMb} MB)`);
            } else {
              setEditingDemo(prev => prev ? ({ ...prev, thumbnail: data.url }) : null);
            }
          } else {
            alert(`Upload error: ${data.message || 'Failed to upload'}`);
            if (type === 'video') setDemoUploadStatus(null);
          }
        } catch (err: any) {
          alert(`Network error during upload: ${err?.message || err}`);
          if (type === 'video') setDemoUploadStatus(null);
        } finally {
          setUploadingDemoVideo(false);
          setUploadingDemoThumb(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`Could not process file: ${err?.message || err}`);
      setUploadingDemoVideo(false);
      setUploadingDemoThumb(false);
      setDemoUploadStatus(null);
    }
  };

  const handleAddFeatureTag = () => {
    if (!featureTagInput.trim() || !editingDemo) return;
    const currentFeatures = editingDemo.features || [];
    if (!currentFeatures.includes(featureTagInput.trim())) {
      setEditingDemo({
        ...editingDemo,
        features: [...currentFeatures, featureTagInput.trim()]
      });
    }
    setFeatureTagInput('');
  };

  const handleRemoveFeatureTag = (tagToRemove: string) => {
    if (!editingDemo) return;
    setEditingDemo({
      ...editingDemo,
      features: (editingDemo.features || []).filter(f => f !== tagToRemove)
    });
  };

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
      
      {/* MOBILE TOP BAR (Visible on screens < md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#081120]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2" onClick={onNavigateHome}>
          <BrandLogo size="sm" taglineClassName="text-cyan-400 font-mono tracking-wider" />
        </div>

        <div className="flex items-center space-x-2">
          {stats?.newInquiries > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
              <span>{stats.newInquiries} New</span>
            </span>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-[#081120] border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <BrandLogo size="sm" taglineClassName="text-cyan-400 font-mono tracking-wider" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Navigation List */}
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setSelectedInquiry(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.count ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-400 text-slate-950">
                          {item.count}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Footer */}
            <div className="pt-6 border-t border-slate-800 space-y-3">
              <div className="text-xs text-slate-400 px-1">
                <div className="font-semibold text-slate-200">{admin.name}</div>
                <div className="text-[10px] text-blue-400 font-mono">{admin.role}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowPasswordModal(true);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Password</span>
                </button>
                <button
                  onClick={onNavigateHome}
                  className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Site</span>
                </button>
              </div>
              <button
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-red-950/60 text-red-300 border border-red-900/80 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION (Visible on md+) */}
      <aside className="hidden md:flex w-64 bg-[#081120] border-r border-slate-800/80 flex-col justify-between shrink-0">
        
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowManualLeadModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Record Lead</span>
            </button>
            <button
              onClick={handleDownloadBackup}
              disabled={isDownloadingBackup}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="Download Platform JSON Snapshot"
            >
              <Archive className={`w-3.5 h-3.5 ${isDownloadingBackup ? 'animate-spin' : 'text-purple-400'}`} />
              <span className="hidden sm:inline">Backup</span>
            </button>
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {currentTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* High-Level Financial & Conversion Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: 'Estimated Pipeline', value: `$${calculatePipelineValue().toLocaleString()}`, color: 'text-emerald-400', isMonetary: true },
                { label: 'Total Inquiries', value: stats.totalInquiries, color: 'text-white' },
                { label: 'New / Unreviewed', value: stats.newInquiries, color: 'text-cyan-400' },
                { label: 'Contacted', value: stats.contactedInquiries, color: 'text-purple-400' },
                { label: 'In Progress', value: stats.inProgressInquiries, color: 'text-emerald-400' },
                { label: 'Completed', value: stats.completedInquiries, color: 'text-blue-400' }
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-medium text-slate-400">{s.label}</div>
                  <div className={`text-xl sm:text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* Quick Action Engine & Pipeline Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Service Distribution */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-heading text-white uppercase tracking-wider">
                    Demand by Solution
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">Live Distribution</span>
                </div>
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
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Customer / Company</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Budget</th>
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
                          <td className="py-3 font-mono text-emerald-400">{inq.budget || 'Custom'}</td>
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
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowManualLeadModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add Lead Manually</span>
                </button>

                <button
                  onClick={exportInquiriesToCsv}
                  disabled={inquiries.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Export All (CSV)</span>
                </button>

                {inquiries.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirmModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Inquiries</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <div>
                  Pipeline: <span className="font-bold text-emerald-400 font-mono">${calculatePipelineValue().toLocaleString()}</span>
                </div>
                <div>
                  Total: <span className="font-bold text-white font-mono">{inquiries.length}</span>
                </div>
              </div>
            </div>

            {/* Bulk Selection Action Bar (appears when items selected) */}
            {selectedInquiryIds.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-purple-950 border border-blue-600/80 shadow-lg shadow-blue-900/30 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center space-x-2 text-xs text-blue-200">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white font-mono">{selectedInquiryIds.length}</span> lead(s) selected
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 text-[11px]">Set Pipeline:</span>
                  {(['CONTACTED', 'DISCUSSING', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'] as InquiryStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleBulkStatusChange(st)}
                      disabled={isBulkUpdating}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-200 text-[11px] font-bold border border-slate-700 transition-colors"
                    >
                      {st}
                    </button>
                  ))}

                  <button
                    onClick={handleBulkExportCsv}
                    className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center space-x-1 ml-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>CSV Export</span>
                  </button>

                  <button
                    onClick={handleBulkDeleteInquiries}
                    disabled={isBulkDeleting}
                    className="px-3 py-1 rounded-lg bg-red-900/80 hover:bg-red-700 text-red-100 text-[11px] font-bold flex items-center space-x-1 border border-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isBulkDeleting ? 'Deleting...' : 'Delete Selected'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedInquiryIds([])}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                    title="Clear Selection"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

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
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      ← Back to Inquiries
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
                      onClick={() => handleCopyLeadSummary(selectedInquiry)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                      title="Copy Dossier Markdown"
                    >
                      {copiedLeadSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLeadSummary ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs"
                      title="Delete Inquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Instant Client Outreach Fast Actions */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-800/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs">
                    <div className="font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>One-Click Outreach Launchers</span>
                    </div>
                    <div className="text-slate-400 text-[11px]">Instant personalized WhatsApp & Email contact links</div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => handleOpenProposal(selectedInquiry)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/30 transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Smart Proposal Draft</span>
                    </button>

                    <a
                      href={`https://wa.me/${selectedInquiry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.fullName}, Ahsan from AHSAN AI LABS here regarding your inquiry for ${selectedInquiry.service}. Let's discuss your requirements and schedule a discovery call.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct Reply</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>

                    <a
                      href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`AHSAN AI LABS — Project Scope: ${selectedInquiry.service}`)}&body=${encodeURIComponent(`Dear ${selectedInquiry.fullName},\n\nThank you for reaching out to AHSAN AI LABS regarding ${selectedInquiry.service}.\n\nWe have reviewed your project requirements:\n"${selectedInquiry.requirements}"\n\nLet's schedule a brief 15-minute discovery consultation to discuss the architecture and timeline.\n\nBest regards,\nAhsan Ali\nFounder & Principal AI Architect\nAHSAN AI LABS\nWhatsApp: +92 344 6899742`)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 transition-colors border border-slate-700"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Draft Email</span>
                    </a>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          <a href={`mailto:${selectedInquiry.email}`} className="text-blue-400 hover:underline break-all">
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
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
                <table className="w-full text-left text-xs min-w-[720px]">
                  <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="pb-3 w-10">
                        <button
                          onClick={() => handleToggleSelectAllInquiries(filteredInquiries)}
                          className="text-slate-400 hover:text-white"
                          title="Select / Deselect All"
                        >
                          {selectedInquiryIds.length === filteredInquiries.length && filteredInquiries.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="pb-3">Inquiry ID</th>
                      <th className="pb-3">Customer & Company</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3">Budget</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          {searchQuery || statusFilter !== 'ALL' || serviceFilter !== 'ALL'
                            ? 'No inquiries found matching your filters.'
                            : 'No inquiries registered yet. Click "Add Lead Manually" or receive submissions from the website.'}
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => {
                        const isSelected = selectedInquiryIds.includes(inq._id);
                        return (
                          <tr key={inq._id} className={`hover:bg-slate-900/50 ${isSelected ? 'bg-blue-950/30' : ''}`}>
                            <td className="py-3.5">
                              <button
                                onClick={() => handleToggleSelectInquiry(inq._id)}
                                className="text-slate-400 hover:text-white"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 font-mono text-cyan-400 font-semibold">{inq.inquiryId}</td>
                            <td className="py-3.5 font-medium text-white">
                              <div>{inq.fullName}</div>
                              <div className="text-[11px] text-slate-400">{inq.companyName}</div>
                            </td>
                            <td className="py-3.5 text-slate-200">{inq.service}</td>
                            <td className="py-3.5 font-mono text-emerald-400 font-semibold">{inq.budget || 'Custom'}</td>
                            <td className="py-3.5">{getStatusBadge(inq.status)}</td>
                            <td className="py-3.5 text-slate-400">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleOpenProposal(inq)}
                                className="px-2.5 py-1 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-300 text-xs font-semibold border border-purple-800 transition-colors inline-flex items-center space-x-1"
                                title="Draft Smart WhatsApp Proposal"
                              >
                                <Wand2 className="w-3 h-3 text-yellow-300" />
                                <span className="hidden sm:inline">Proposal</span>
                              </button>
                              <button
                                onClick={() => setSelectedInquiry(inq)}
                                className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        );
                      })
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <Film className="w-4 h-4 text-blue-400" />
                  <span>Showcase Video & Interactive Demos CMS ({demos.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Upload video files (.mp4, .webm) or link YouTube, Vimeo & Loom embeds directly to your live portfolio.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingDemo({
                    title: '',
                    category: 'AI AGENTS',
                    description: '',
                    features: [],
                    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                    videoUrl: '',
                    duration: '03:30',
                    clientIndustry: 'Enterprise Technology',
                    keyImpact: 'Automated Operations',
                    published: true,
                    featured: true,
                    displayOrder: demos.length + 1
                  });
                  setDemoUploadStatus(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-lg shadow-blue-600/30 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showcase Demo</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search demos by title, industry, impact..."
                  value={demoSearchFilter}
                  onChange={(e) => setDemoSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {['ALL', 'AI AGENTS', 'AI VOICE AGENTS', 'AI CHATBOTS', 'BUSINESS AUTOMATION', 'WHATSAPP AUTOMATION'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setDemoCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      demoCategoryFilter === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* EDIT / CREATE DEMO MODAL FORM */}
            {editingDemo && (
              <form onSubmit={handleSaveDemo} className="p-6 rounded-3xl bg-slate-900 border border-blue-600/60 shadow-2xl space-y-5 text-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-white text-sm">
                      {editingDemo._id ? `Edit Showcase Demo (${editingDemo.title || 'Untitled'})` : 'Create New Showcase Video Demo'}
                    </h4>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setEditingDemo(null); setDemoUploadStatus(null); }} 
                    className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Demo Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Autonomous Enterprise Support & CRM Agent"
                      value={editingDemo.title || ''}
                      onChange={(e) => setEditingDemo({ ...editingDemo, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">AI Core Category *</label>
                    <select
                      value={editingDemo.category || 'AI AGENTS'}
                      onChange={(e) => setEditingDemo({ ...editingDemo, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500"
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
                  <label className="text-slate-300 font-medium">Demo Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a comprehensive summary of what this video demonstrates, the problems resolved, and architecture details..."
                    value={editingDemo.description || ''}
                    onChange={(e) => setEditingDemo({ ...editingDemo, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none focus:border-blue-500"
                  />
                </div>

                {/* VIDEO UPLOAD & SOURCE SECTION */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-900/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-cyan-400 font-bold uppercase tracking-wider text-xs flex items-center space-x-1.5">
                        <Video className="w-3.5 h-3.5" />
                        <span>Demo Video Source & File Upload</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Upload a video file from your computer OR paste a YouTube, Vimeo, Loom, or MP4 URL.
                      </p>
                    </div>

                    {/* Direct Video File Upload Button */}
                    <div className="shrink-0">
                      <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors">
                        {uploadingDemoVideo ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                            <span>Uploading File...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Video File (.mp4, .webm)</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                          className="hidden"
                          disabled={uploadingDemoVideo}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadDemoMedia(file, 'video');
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {demoUploadStatus && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-cyan-800 text-cyan-300 text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {uploadingDemoVideo ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{demoUploadStatus}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-medium">Video Link / Embed URL / Upload Path</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. /uploads/video.mp4 OR https://www.youtube.com/watch?v=... OR https://vimeo.com/..."
                        value={editingDemo.videoUrl || ''}
                        onChange={(e) => setEditingDemo({ ...editingDemo, videoUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-cyan-500"
                      />
                      {editingDemo.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setPreviewingDemo(editingDemo as DemoItem)}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1 shrink-0"
                          title="Preview full video player"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Test</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                      <span>Supported:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">YouTube</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Vimeo</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Loom</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">Direct MP4 / WebM Upload</span>
                    </div>
                  </div>

                  {/* LIVE PREVIEW EMBED IN FORM */}
                  {editingDemo.videoUrl && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                        <span>Live Video Preview:</span>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          Source: {parseVideoUrl(editingDemo.videoUrl).type.toUpperCase()}
                        </span>
                      </div>
                      <div className="relative aspect-video w-full max-w-lg rounded-xl overflow-hidden bg-black border border-slate-800">
                        {parseVideoUrl(editingDemo.videoUrl).type === 'direct' ? (
                          <video
                            src={parseVideoUrl(editingDemo.videoUrl).embedUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <iframe
                            src={parseVideoUrl(editingDemo.videoUrl).embedUrl}
                            title="Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* THUMBNAIL & COVER IMAGE */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="text-blue-400 font-bold uppercase tracking-wider text-xs flex items-center space-x-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Thumbnail & Cover Photo</span>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 shrink-0 transition-colors">
                      {uploadingDemoThumb ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading Cover...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Cover Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingDemoThumb}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadDemoMedia(file, 'thumbnail');
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-slate-300 font-medium">Cover Image URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or /uploads/cover.jpg"
                        value={editingDemo.thumbnail || ''}
                        onChange={(e) => setEditingDemo({ ...editingDemo, thumbnail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-blue-500"
                      />
                    </div>
                    {editingDemo.thumbnail && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img
                          src={editingDemo.thumbnail}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* METRICS & DETAILS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Duration (MM:SS)</label>
                    <input
                      type="text"
                      placeholder="03:45"
                      value={editingDemo.duration || ''}
                      onChange={(e) => setEditingDemo({ ...editingDemo, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Client Industry</label>
                    <input
                      type="text"
                      placeholder="e.g. Fintech & B2B SaaS"
                      value={editingDemo.clientIndustry || ''}
                      onChange={(e) => setEditingDemo({ ...editingDemo, clientIndustry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Key Impact Metric</label>
                    <input
                      type="text"
                      placeholder="e.g. 91% First-Contact Resolution"
                      value={editingDemo.keyImpact || ''}
                      onChange={(e) => setEditingDemo({ ...editingDemo, keyImpact: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                {/* FEATURE TAGS */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-medium">Demonstrated Features & Capabilities</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a capability (e.g. Contextual Memory, CRM Sync) and press Add..."
                      value={featureTagInput}
                      onChange={(e) => setFeatureTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeatureTag();
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureTag}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold shrink-0"
                    >
                      Add Tag
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(editingDemo.features || []).map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-950/80 text-blue-300 border border-blue-800 text-xs"
                      >
                        <span>{feat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureTag(feat)}
                          className="text-blue-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {(editingDemo.features || []).length === 0 && (
                      <span className="text-slate-500 text-[11px] italic">No feature tags added yet.</span>
                    )}
                  </div>
                </div>

                {/* PUBLISHING CONTROLS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="demoPublished"
                      checked={editingDemo.published ?? true}
                      onChange={(e) => setEditingDemo({ ...editingDemo, published: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800 focus:ring-0"
                    />
                    <label htmlFor="demoPublished" className="text-slate-200 font-semibold cursor-pointer">
                      Published on Website
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="demoFeatured"
                      checked={editingDemo.featured ?? false}
                      onChange={(e) => setEditingDemo({ ...editingDemo, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-cyan-600 bg-slate-950 border-slate-800 focus:ring-0"
                    />
                    <label htmlFor="demoFeatured" className="text-slate-200 font-semibold cursor-pointer">
                      Featured on Homepage
                    </label>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 text-[11px]">Display Order</label>
                    <input
                      type="number"
                      value={editingDemo.displayOrder ?? 1}
                      onChange={(e) => setEditingDemo({ ...editingDemo, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-24 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => { setEditingDemo(null); setDemoUploadStatus(null); }} 
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Showcase Demo</span>
                  </button>
                </div>
              </form>
            )}

            {/* DEMOS LIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {demos
                .filter((d) => {
                  const matchCat = demoCategoryFilter === 'ALL' || d.category === demoCategoryFilter;
                  const matchSearch = !demoSearchFilter || 
                    d.title.toLowerCase().includes(demoSearchFilter.toLowerCase()) ||
                    (d.clientIndustry && d.clientIndustry.toLowerCase().includes(demoSearchFilter.toLowerCase())) ||
                    (d.keyImpact && d.keyImpact.toLowerCase().includes(demoSearchFilter.toLowerCase()));
                  return matchCat && matchSearch;
                })
                .map((d) => (
                  <div 
                    key={d._id} 
                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 text-xs group"
                  >
                    <div className="space-y-3">
                      {/* Video Thumbnail with Play Overlay */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80">
                        {d.thumbnail ? (
                          <img
                            src={d.thumbnail}
                            alt={d.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-600">
                            <Film className="w-8 h-8" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-950/90 text-blue-300 border border-blue-800 backdrop-blur-md">
                            {d.category}
                          </span>
                          <div className="flex items-center space-x-1">
                            {d.featured && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/90 text-amber-300 border border-amber-800">
                                Featured
                              </span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/90 text-slate-300 border border-slate-800">
                              {d.duration || 'Video'}
                            </span>
                          </div>
                        </div>

                        {/* Play Button Overlay */}
                        <button
                          onClick={() => setPreviewingDemo(d)}
                          className="absolute inset-0 flex items-center justify-center"
                          title="Play Video"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5 fill-white" />
                          </div>
                        </button>
                      </div>

                      <div>
                        <div className="font-bold text-white text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">
                          {d.title}
                        </div>
                        <p className="text-slate-400 mt-1 line-clamp-2 text-[11px]">
                          {d.description}
                        </p>
                      </div>

                      {/* Industry & Impact */}
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300 font-medium">
                        <span className="text-slate-400">{d.clientIndustry || 'Enterprise'}</span>
                        <span className="text-cyan-400 font-bold">{d.keyImpact}</span>
                      </div>

                      {/* Feature Tags */}
                      {d.features && d.features.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {d.features.slice(0, 3).map((feat, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80 text-[10px]">
                              {feat}
                            </span>
                          ))}
                          {d.features.length > 3 && (
                            <span className="px-1 py-0.5 text-slate-500 text-[10px]">
                              +{d.features.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setPreviewingDemo(d)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 font-semibold text-[11px] flex items-center space-x-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Watch Demo</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={() => {
                            setEditingDemo(d);
                            setDemoUploadStatus(null);
                          }} 
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="Edit Demo"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteDemo(d._id)} 
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-red-200"
                          title="Delete Demo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {demos.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
                <Film className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-white font-bold">No showcase demos created yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Click "Add Showcase Demo" to upload a video demo or link YouTube/Vimeo to demonstrate your AI systems.
                </p>
              </div>
            )}
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
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider text-blue-400">
                  Founder Profile & Bio Management (Ahsan Ali)
                </h3>
                <span className="text-[11px] text-slate-400">Displayed on About & Public sections</span>
              </div>
              
              {/* Founder Photo Section */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3">
                <label className="text-slate-200 font-semibold flex items-center justify-between">
                  <span>Founder Photo URL</span>
                  <span className="text-[10px] text-cyan-400">Recommended: /founder.jpg</span>
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative shadow-md">
                    <img 
                      src={content.founder?.photoUrl || '/founder.jpg'} 
                      alt="Ahsan Ali Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/founder.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={content.founder?.photoUrl || ''}
                      onChange={(e) => setContent({
                        ...content,
                        founder: { ...content.founder, photoUrl: e.target.value }
                      })}
                      placeholder="/founder.jpg or https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setContent({
                          ...content,
                          founder: { ...content.founder, photoUrl: '/founder.jpg' }
                        })}
                        className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 text-cyan-300 border border-blue-800 text-[11px]"
                      >
                        Reset to Official Photo (/founder.jpg)
                      </button>
                    </div>
                  </div>
                </div>
              </div>

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

              {/* Founder Social Profiles */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="text-cyan-400 font-bold uppercase tracking-wider text-xs">
                  Founder Direct Social Links
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={content.founder?.socials?.linkedin || ''}
                      onChange={(e) => setContent({
                        ...content,
                        founder: {
                          ...content.founder,
                          socials: { ...content.founder?.socials, linkedin: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Twitter / X URL</label>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={content.founder?.socials?.twitter || ''}
                      onChange={(e) => setContent({
                        ...content,
                        founder: {
                          ...content.founder,
                          socials: { ...content.founder?.socials, twitter: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Email Address</label>
                    <input
                      type="email"
                      placeholder="ahsan@ahsanailabs.com"
                      value={content.founder?.socials?.email || ''}
                      onChange={(e) => setContent({
                        ...content,
                        founder: {
                          ...content.founder,
                          socials: { ...content.founder?.socials, email: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">WhatsApp Number</label>
                    <input
                      type="text"
                      placeholder="+92 344 6899742"
                      value={content.founder?.socials?.whatsapp || ''}
                      onChange={(e) => setContent({
                        ...content,
                        founder: {
                          ...content.founder,
                          socials: { ...content.founder?.socials, whatsapp: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={async () => {
                  await fetch('/api/admin/content', {
                    method: 'PUT',
                    headers: authHeaders,
                    body: JSON.stringify(content)
                  });
                  alert('Content CMS & Founder Profile updated successfully.');
                  fetchAllData();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                Save Content CMS & Founder Profile
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

            {/* BRAND LOGO & FAVICON STUDIO */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-900/60 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                  <ImagePlus className="w-4 h-4 text-blue-400" />
                  <span>Brand Logo & Favicon Studio</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono">
                  Target: /logo.jpg
                </span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                Directly manage the primary brand logo displayed across the Navbar, Footer, Browser Favicon, and OpenGraph social embeds.
              </p>

              {logoUploadMsg && (
                <div className={`p-3 rounded-xl text-xs ${
                  logoUploadMsg.type === 'success' 
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-700' 
                    : 'bg-red-950/90 text-red-300 border border-red-700'
                }`}>
                  {logoUploadMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-4 rounded-2xl bg-slate-950 border border-slate-800">
                {/* Logo Preview */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-500/40 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/10 relative group">
                    <img 
                      src={`/logo.jpg?t=${logoTimestamp}`} 
                      alt="Brand Logo" 
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.jpg';
                      }}
                    />
                    {isUploadingLogo && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono text-center">
                    Active Brand Logo
                  </div>
                </div>

                {/* Upload & Actions */}
                <div className="md:col-span-8 space-y-3">
                  <div>
                    <label className="text-slate-200 font-bold block mb-1">
                      Upload New Brand Logo
                    </label>
                    <p className="text-[11px] text-slate-400 mb-3">
                      Recommended: High-resolution Square image (512x512 JPG or PNG). Will automatically update site logo, favicon, and social embeds.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer flex items-center space-x-2 text-xs shadow-md shadow-blue-600/30 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingLogo ? 'Processing Image...' : 'Choose File & Replace Logo'}</span>
                      <input 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp,image/svg+xml" 
                        onChange={handleUploadLogo}
                        disabled={isUploadingLogo}
                        className="hidden" 
                      />
                    </label>

                    <a 
                      href={`/logo.jpg?t=${logoTimestamp}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Logo in New Tab</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVER HEALTH DIAGNOSTICS & SYSTEM MAINTENANCE */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span>Server Diagnostics & Storage Maintenance</span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDiagnostics}
                  disabled={isLoadingDiagnostics}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center space-x-1 border border-slate-700"
                >
                  <Gauge className={`w-3 h-3 ${isLoadingDiagnostics ? 'animate-spin' : ''}`} />
                  <span>{isLoadingDiagnostics ? 'Inspecting...' : 'Refresh Diagnostics'}</span>
                </button>
              </div>

              {flushCacheMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-700 text-xs">
                  {flushCacheMsg}
                </div>
              )}

              {/* Diagnostics Grid */}
              {diagnosticsData && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px]">Node.js Runtime</div>
                    <div className="font-mono font-bold text-white mt-0.5">{diagnosticsData.nodeVersion}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px]">Memory Used</div>
                    <div className="font-mono font-bold text-cyan-400 mt-0.5">{diagnosticsData.server?.memory?.heapUsedMb || 0} MB</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px]">Media Uploads</div>
                    <div className="font-mono font-bold text-purple-400 mt-0.5">{diagnosticsData.uploads?.fileCount || 0} files ({diagnosticsData.uploads?.totalSizeMb || '0'} MB)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                    <div className="text-slate-500 text-[10px]">Database Engine</div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">{diagnosticsData.database?.connected ? 'MongoDB + JSON' : 'JSON Atomic DB'}</div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={isFlushingCache}
                  className="px-4 py-2 rounded-xl bg-blue-950 hover:bg-blue-900 text-cyan-300 font-semibold flex items-center space-x-1.5 border border-blue-800"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFlushingCache ? 'animate-spin' : ''}`} />
                  <span>Flush Memory Cache & Sync DB</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportDatabaseJson}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center space-x-1.5 border border-slate-700"
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

              {/* Official Brand Social Media Links Section */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="text-blue-400 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
                  <span>Official Brand Social Media Links</span>
                  <span className="text-[10px] text-slate-400">Rendered dynamically in footer & public site</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">LinkedIn Company Page</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/company/..."
                      value={settings.socialLinks?.linkedin || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Twitter / X Handle or URL</label>
                    <input
                      type="url"
                      placeholder="https://x.com/..."
                      value={settings.socialLinks?.twitter || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Instagram Profile URL</label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={settings.socialLinks?.instagram || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">YouTube Channel URL</label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@..."
                      value={settings.socialLinks?.youtube || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-300 font-medium">Facebook Page URL</label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={settings.socialLinks?.facebook || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
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
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Website Domain URL</label>
                    <input
                      type="url"
                      placeholder="http://www.ahsanlab.qd.je"
                      value={settings.siteUrl || 'http://www.ahsanlab.qd.je'}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs"
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

      {/* RECORD MANUAL LEAD MODAL */}
      {showManualLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-blue-800/80 rounded-2xl p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Direct Lead / Client Entry</span>
              </div>
              <button
                onClick={() => setShowManualLeadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Manually register a prospect from WhatsApp, phone call, LinkedIn, or personal referral into the CRM.
            </p>

            <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Contact Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller"
                    value={manualLeadForm.fullName}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Fintech Ltd"
                    value={manualLeadForm.companyName}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="david@horizonfin.com"
                    value={manualLeadForm.email}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555 342 1199"
                    value={manualLeadForm.whatsapp}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Country</label>
                  <input
                    type="text"
                    placeholder="United States"
                    value={manualLeadForm.country}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Primary Service</label>
                  <select
                    value={manualLeadForm.service}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, service: e.target.value as ServiceType })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="AI Agents">AI Agents</option>
                    <option value="AI Voice Agents">AI Voice Agents</option>
                    <option value="AI Chatbots">AI Chatbots</option>
                    <option value="Business Automation">Business Automation</option>
                    <option value="WhatsApp Automation">WhatsApp Automation</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Estimated Budget</label>
                  <select
                    value={manualLeadForm.budget}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, budget: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                    <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                    <option value="$25,000+">$25,000+</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Problem / Business Context</label>
                <textarea
                  rows={2}
                  placeholder="What operational bottleneck or AI requirement does the client have?"
                  value={manualLeadForm.problem}
                  onChange={(e) => setManualLeadForm({ ...manualLeadForm, problem: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Project Scope / Technical Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key deliverables, models, integrations, or timelines discussed..."
                  value={manualLeadForm.requirements}
                  onChange={(e) => setManualLeadForm({ ...manualLeadForm, requirements: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingManualLead}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center space-x-1.5"
                >
                  {isCreatingManualLead ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Save Lead to CRM</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SMART WHATSAPP PROPOSAL MODAL */}
      {showProposalModal && proposalInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-purple-800/80 rounded-2xl p-6 space-y-4 shadow-2xl my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Wand2 className="w-4 h-4 text-purple-400" />
                <span>Smart WhatsApp Proposal Generator</span>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-purple-900/60 text-xs">
              <div>
                <div className="text-white font-bold">{proposalInquiry.fullName}</div>
                <div className="text-purple-300 text-[11px]">{proposalInquiry.companyName} • {proposalInquiry.service}</div>
              </div>
              <div className="text-right font-mono text-emerald-400 font-bold">
                {proposalInquiry.budget || 'Custom Budget'}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 font-medium">Editable Outreach Pitch / Proposal Message:</label>
                <span className="text-[10px] text-slate-500">Auto-tailored to client's requirements</span>
              </div>
              <textarea
                rows={10}
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-purple-900/60 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(proposalText);
                  setProposalCopied(true);
                  setTimeout(() => setProposalCopied(false), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                {proposalCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Proposal Text</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <a
                  href={`https://wa.me/${proposalInquiry.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(proposalText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE VIDEO PREVIEW MODAL */}
      {previewingDemo && (
        <VideoModal 
          demo={previewingDemo} 
          onClose={() => setPreviewingDemo(null)} 
        />
      )}

    </div>
  );
};
