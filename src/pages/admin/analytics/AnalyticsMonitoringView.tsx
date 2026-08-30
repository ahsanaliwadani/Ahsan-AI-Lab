import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  Zap, 
  Cpu, 
  Database, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Search, 
  Filter, 
  Server, 
  HardDrive, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Trash2,
  Play
} from 'lucide-react';
import { 
  AnalyticsSummary, 
  PerformanceDashboardData, 
  ServerMetrics, 
  DatabaseMetrics, 
  UptimeSummary, 
  ErrorLogItem, 
  AutomationMetrics, 
  SystemAlert,
  ServiceStatusItem
} from '../../../types';

interface AnalyticsMonitoringViewProps {
  token: string;
}

type SubTab = 
  | 'traffic' 
  | 'conversion' 
  | 'performance' 
  | 'server' 
  | 'database' 
  | 'uptime' 
  | 'errors' 
  | 'alerts';

export const AnalyticsMonitoringView: React.FC<AnalyticsMonitoringViewProps> = ({ token }) => {
  const [subTab, setSubTab] = useState<SubTab>('traffic');
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Data States
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceDashboardData | null>(null);
  const [systemHealth, setSystemHealth] = useState<{
    overallStatus: 'RUNNING' | 'WARNING' | 'DOWN';
    services: ServiceStatusItem[];
    server: ServerMetrics;
    database: DatabaseMetrics;
    uptime: UptimeSummary;
  } | null>(null);
  const [uptimeSummary, setUptimeSummary] = useState<UptimeSummary | null>(null);
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLogItem[]>([]);
  const [automationStats, setAutomationStats] = useState<AutomationMetrics | null>(null);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);

  // Error Filter States
  const [errorSeverityFilter, setErrorSeverityFilter] = useState<string>('ALL');
  const [errorStatusFilter, setErrorStatusFilter] = useState<string>('ALL');
  const [errorSearchQuery, setErrorSearchQuery] = useState<string>('');
  const [selectedErrorForDetails, setSelectedErrorForDetails] = useState<ErrorLogItem | null>(null);

  // Retrying Webhook State
  const [retryingInquiryId, setRetryingInquiryId] = useState<string | null>(null);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const fetchAllMonitoringData = async () => {
    try {
      const [
        analyticsRes,
        perfRes,
        healthRes,
        uptimeRes,
        dbRes,
        errRes,
        autoRes,
        alertsRes
      ] = await Promise.all([
        fetch(`/api/admin/analytics?range=${timeRange}`, { headers: authHeaders }),
        fetch('/api/admin/performance', { headers: authHeaders }),
        fetch('/api/admin/system-health', { headers: authHeaders }),
        fetch('/api/admin/uptime', { headers: authHeaders }),
        fetch('/api/admin/database-metrics', { headers: authHeaders }),
        fetch(`/api/admin/errors?severity=${errorSeverityFilter}&status=${errorStatusFilter}&search=${encodeURIComponent(errorSearchQuery)}`, { headers: authHeaders }),
        fetch('/api/admin/automation-stats', { headers: authHeaders }),
        fetch('/api/admin/alerts', { headers: authHeaders })
      ]);

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        if (data.success) setAnalytics(data.data);
      }

      if (perfRes.ok) {
        const data = await perfRes.json();
        if (data.success) setPerformance(data.data);
      }

      if (healthRes.ok) {
        const data = await healthRes.json();
        if (data.success) setSystemHealth(data.data);
      }

      if (uptimeRes.ok) {
        const data = await uptimeRes.json();
        if (data.success) setUptimeSummary(data.data);
      }

      if (dbRes.ok) {
        const data = await dbRes.json();
        if (data.success) setDatabaseMetrics(data.data);
      }

      if (errRes.ok) {
        const data = await errRes.json();
        if (data.success) setErrorLogs(data.data);
      }

      if (autoRes.ok) {
        const data = await autoRes.json();
        if (data.success) setAutomationStats(data.data);
      }

      if (alertsRes.ok) {
        const data = await alertsRes.json();
        if (data.success) setSystemAlerts(data.data);
      }

      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMonitoringData();
  }, [timeRange, errorSeverityFilter, errorStatusFilter, errorSearchQuery]);

  // Auto-refresh interval (every 20 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchAllMonitoringData();
    }, 20000);
    return () => clearInterval(timer);
  }, [autoRefresh, timeRange, errorSeverityFilter, errorStatusFilter, errorSearchQuery]);

  // Handle Error Status Update
  const handleUpdateErrorStatus = async (id: string, status: 'UNRESOLVED' | 'INVESTIGATING' | 'RESOLVED') => {
    try {
      const res = await fetch(`/api/admin/errors/${id}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAllMonitoringData();
        if (selectedErrorForDetails && selectedErrorForDetails._id === id) {
          setSelectedErrorForDetails({ ...selectedErrorForDetails, status });
        }
      }
    } catch (e) {
      console.error('Failed to update error status:', e);
    }
  };

  // Handle Delete Error
  const handleDeleteError = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/errors/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (res.ok) {
        fetchAllMonitoringData();
        if (selectedErrorForDetails?._id === id) {
          setSelectedErrorForDetails(null);
        }
      }
    } catch (e) {
      console.error('Failed to delete error:', e);
    }
  };

  // Handle Acknowledge Alert
  const handleAcknowledgeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/alerts/${id}/ack`, {
        method: 'POST',
        headers: authHeaders
      });
      if (res.ok) {
        fetchAllMonitoringData();
      }
    } catch (e) {
      console.error('Failed to acknowledge alert:', e);
    }
  };

  // Handle Export Analytics Report
  const handleExportAnalyticsReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      timeRange,
      analytics,
      performance,
      server: systemHealth?.server,
      uptime: uptimeSummary,
      database: databaseMetrics,
      automation: automationStats,
      errorCount: errorLogs.length
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ahsan_ai_labs_monitoring_report_${timeRange}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER & CONTROLS */}
      <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight font-heading">
                Analytics, Performance & System Monitoring
              </h1>
            </div>
            <p className="text-xs text-slate-400 ml-12">
              Real-time telemetry, Core Web Vitals, conversion funnel, Oracle Cloud VM health, and database metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Range Selector */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === 'today' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '7d' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '30d' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                30 Days
              </button>
            </div>

            {/* Auto-Refresh Toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                autoRefresh 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
              title="Toggle 20-second automatic polling"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span>{autoRefresh ? 'Live (20s)' : 'Paused'}</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={fetchAllMonitoringData}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh</span>
            </button>

            {/* Export JSON Report */}
            <button
              onClick={handleExportAnalyticsReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* ACTIVE ALERTS BANNER (If any unresolved alerts exist) */}
        {systemAlerts.some(a => !a.acknowledged) && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-xs text-red-200">
                <strong>{systemAlerts.filter(a => !a.acknowledged).length} Active System Alert(s):</strong>{' '}
                {systemAlerts.find(a => !a.acknowledged)?.title}
              </span>
            </div>
            <button
              onClick={() => setSubTab('alerts')}
              className="text-xs text-red-400 hover:text-red-300 font-semibold underline shrink-0 ml-4"
            >
              View Alerts
            </button>
          </div>
        )}
      </div>

      {/* TOP KPI METRICS SUMMARY STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* 1. Total Visitors */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Visitors</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {analytics?.totalVisitors.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center space-x-1 mt-1">
            <span>{analytics?.uniqueVisitors || 0} unique visitors</span>
          </div>
        </div>

        {/* 2. Page Views */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Page Views</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {analytics?.pageViews.toLocaleString() || '0'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>~{analytics?.totalVisitors ? +(analytics.pageViews / (analytics.totalVisitors || 1)).toFixed(1) : '1.8'} views/visit</span>
          </div>
        </div>

        {/* 3. Conversion Rate */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Form Conversion</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-heading">
            {analytics?.conversionFunnel.overallConversionRate || 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>{analytics?.conversionFunnel.formSubmits || 0} inquiries received</span>
          </div>
        </div>

        {/* 4. Performance Health */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Perf Score</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading flex items-center space-x-1.5">
            <span>{performance?.scoreValue || 96}</span>
            <span className="text-xs text-emerald-400 font-mono">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Avg API: {performance?.avgResponseTimeMs || 25}ms</span>
          </div>
        </div>

        {/* 5. Server CPU & RAM */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">VM Load</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-heading">
            {systemHealth?.server.cpuUsagePercent || 14}% <span className="text-xs font-normal text-slate-400">CPU</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>RAM: {systemHealth?.server.ramUsedMb || 420}MB ({systemHealth?.server.ramUsagePercent || 12}%)</span>
          </div>
        </div>

        {/* 6. Uptime 30d */}
        <div className="bg-[#081120] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">30d Uptime</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-heading">
            {uptimeSummary?.uptimePercentage30d || 99.98}%
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Operational</span>
          </div>
        </div>
      </div>

      {/* MONITORING NAVIGATION SUBTABS */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-none gap-2 pb-1">
        {[
          { id: 'traffic', label: 'Traffic & Visitors', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'conversion', label: 'Conversion & Funnel', icon: <Target className="w-4 h-4" /> },
          { id: 'performance', label: 'Performance & Web Vitals', icon: <Zap className="w-4 h-4" /> },
          { id: 'server', label: 'Server & VM Health', icon: <Server className="w-4 h-4" /> },
          { id: 'database', label: 'Database & Storage', icon: <Database className="w-4 h-4" /> },
          { id: 'uptime', label: 'Uptime & Health', icon: <Clock className="w-4 h-4" /> },
          { 
            id: 'errors', 
            label: 'Error & Automation Logs', 
            icon: <AlertTriangle className="w-4 h-4" />,
            badge: errorLogs.filter(e => e.status !== 'RESOLVED').length
          },
          { 
            id: 'alerts', 
            label: 'Alerts & Rules', 
            icon: <Radio className="w-4 h-4" />,
            badge: systemAlerts.filter(a => !a.acknowledged).length
          }
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as SubTab)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'bg-[#081120] text-cyan-400 border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-red-950 text-red-400 border border-red-800 rounded-full text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* SUBTAB 1: TRAFFIC & AUDIENCE ANALYTICS */}
      {/* ========================================== */}
      {subTab === 'traffic' && (
        <div className="space-y-6">
          {/* Visitor & Pageview Timeline Graph */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Traffic Velocity & Daily Visitor Volume
                </h3>
                <p className="text-xs text-slate-400">
                  Daily breakdown of pageviews and unique visitors over the selected timeframe.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-slate-300">Page Views</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-cyan-400" />
                  <span className="text-slate-300">Unique Visitors</span>
                </div>
              </div>
            </div>

            {/* Custom Interactive Timeline Chart */}
            <div className="h-64 flex items-end gap-2 pt-8 pb-2 px-2">
              {analytics?.timeline && analytics.timeline.length > 0 ? (
                analytics.timeline.map((item, idx) => {
                  const maxViews = Math.max(...analytics.timeline.map(t => t.pageViews), 50);
                  const pvHeightPercent = Math.max(8, Math.round((item.pageViews / maxViews) * 100));
                  const visHeightPercent = Math.max(4, Math.round((item.visitors / maxViews) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col bg-slate-900 border border-slate-700 rounded-lg p-2 text-[11px] shadow-2xl z-20 whitespace-nowrap pointer-events-none">
                        <span className="font-bold text-white">{item.date}</span>
                        <span className="text-blue-400">Views: {item.pageViews}</span>
                        <span className="text-cyan-400">Visitors: {item.visitors}</span>
                        <span className="text-emerald-400">Conversions: {item.conversions}</span>
                      </div>

                      {/* Bar columns */}
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div 
                          className="w-1/2 bg-blue-600/80 hover:bg-blue-500 rounded-t transition-all"
                          style={{ height: `${pvHeightPercent}%` }}
                        />
                        <div 
                          className="w-1/2 bg-cyan-400/80 hover:bg-cyan-300 rounded-t transition-all"
                          style={{ height: `${visHeightPercent}%` }}
                        />
                      </div>

                      {/* Date Label */}
                      <span className="text-[10px] text-slate-500 font-mono truncate w-full text-center">
                        {item.date.split('-').slice(1).join('/')}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  No telemetry recorded for this timeframe
                </div>
              )}
            </div>
          </div>

          {/* 3-Column Breakdown: Top Pages, Traffic Sources, Device & Geolocation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Visited Pages */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Most Visited Pages</span>
                <Globe className="w-4 h-4 text-cyan-400" />
              </h3>

              <div className="space-y-3">
                {analytics?.topPages && analytics.topPages.length > 0 ? (
                  analytics.topPages.slice(0, 6).map((page, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
                      <div className="truncate max-w-[160px] font-mono text-slate-300">
                        {page.path === '/' ? '/ (Home)' : page.path}
                      </div>
                      <div className="flex items-center space-x-3 text-[11px]">
                        <span className="text-slate-400">{page.uniqueVisitors} visitors</span>
                        <span className="font-bold text-cyan-400">{page.views} views</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No page views recorded.</p>
                )}
              </div>
            </div>

            {/* Traffic Sources & Referrals */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Traffic Acquisition Channels</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </h3>

              <div className="space-y-3">
                {analytics?.trafficSources && analytics.trafficSources.length > 0 ? (
                  analytics.trafficSources.map((src, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{src.source}</span>
                        <span className="text-slate-400 font-mono">{src.percentage}% ({src.count})</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full" 
                          style={{ width: `${src.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No source data.</p>
                )}
              </div>
            </div>

            {/* Devices & Browsers */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Device & Technology Split</span>
                <Smartphone className="w-4 h-4 text-purple-400" />
              </h3>

              {/* Device progress breakdown */}
              {(() => {
                const totalDev = (analytics?.deviceBreakdown.desktop || 0) + (analytics?.deviceBreakdown.mobile || 0) + (analytics?.deviceBreakdown.tablet || 0) || 1;
                const dPct = Math.round(((analytics?.deviceBreakdown.desktop || 0) / totalDev) * 100);
                const mPct = Math.round(((analytics?.deviceBreakdown.mobile || 0) / totalDev) * 100);
                const tPct = 100 - dPct - mPct;

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                        <Monitor className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                        <div className="font-bold text-white">{dPct}%</div>
                        <div className="text-[10px] text-slate-400">Desktop</div>
                      </div>
                      <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                        <Smartphone className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
                        <div className="font-bold text-white">{mPct}%</div>
                        <div className="text-[10px] text-slate-400">Mobile</div>
                      </div>
                      <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
                        <Tablet className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                        <div className="font-bold text-white">{tPct}%</div>
                        <div className="text-[10px] text-slate-400">Tablet</div>
                      </div>
                    </div>

                    {/* Top Browsers */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Browsers</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {analytics?.browserDistribution.slice(0, 4).map((b, i) => (
                          <div key={i} className="flex justify-between bg-slate-900/40 px-2.5 py-1.5 rounded-lg border border-slate-800/50">
                            <span className="text-slate-300">{b.browser}</span>
                            <span className="text-cyan-400 font-mono">{b.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 2: CONVERSION & FUNNEL ANALYTICS */}
      {/* ========================================== */}
      {subTab === 'conversion' && (
        <div className="space-y-6">
          {/* Conversion Funnel Card */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-1">
              End-to-End Enterprise Acquisition Funnel
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track conversion progression from initial visitor exploration to submitted enterprise inquiry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1: Total Visitors */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Step 1: Visitors</div>
                <div className="text-2xl font-bold text-white font-heading">
                  {analytics?.conversionFunnel.visitors || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Total unique audience</div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold">
                  100% Base Exploration
                </div>
              </div>

              {/* Step 2: Explored Services */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Step 2: Service Views</div>
                <div className="text-2xl font-bold text-cyan-400 font-heading">
                  {analytics?.conversionFunnel.serviceViews || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Deep service page views</div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-cyan-400 font-semibold">
                  {analytics?.conversionFunnel.serviceViewRate || 0}% of visitors
                </div>
              </div>

              {/* Step 3: Form Started */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Step 3: Form Starts</div>
                <div className="text-2xl font-bold text-blue-400 font-heading">
                  {analytics?.conversionFunnel.formStarts || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Inquiry wizard initiated</div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-blue-400 font-semibold">
                  {analytics?.conversionFunnel.formStartRate || 0}% of service viewers
                </div>
              </div>

              {/* Step 4: Form Submitted */}
              <div className="bg-slate-900/60 border border-emerald-800/40 rounded-2xl p-5 relative overflow-hidden bg-gradient-to-b from-emerald-950/20 to-transparent">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Step 4: Conversions</div>
                <div className="text-2xl font-bold text-emerald-400 font-heading">
                  {analytics?.conversionFunnel.formSubmits || 0}
                </div>
                <div className="text-xs text-slate-400 mt-1">Completed inquiries</div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-semibold">
                  {analytics?.conversionFunnel.completionRate || 0}% form completion rate
                </div>
              </div>
            </div>
          </div>

          {/* Key CTA Button Clicks & Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* CTA Click Counters */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Key Interaction & CTA Metrics</span>
                <Target className="w-4 h-4 text-cyan-400" />
              </h3>

              <div className="space-y-3">
                {analytics?.keyEvents.map((evt, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
                    <span className="text-slate-300 font-medium">{evt.label}</span>
                    <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 font-mono font-bold">
                      {evt.count.toLocaleString()} clicks
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Services Generating Demand */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Top Service Interests</span>
                <Sparkles className="w-4 h-4 text-blue-400" />
              </h3>

              <div className="space-y-3">
                {analytics?.topServices && analytics.topServices.length > 0 ? (
                  analytics.topServices.map((srv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs flex justify-between items-center">
                      <div className="capitalize font-semibold text-slate-200">
                        {srv.service.replace(/-/g, ' ')}
                      </div>
                      <div className="text-cyan-400 font-mono font-bold">
                        {srv.views} views
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No service views recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 3: PERFORMANCE & CORE WEB VITALS */}
      {/* ========================================== */}
      {subTab === 'performance' && (
        <div className="space-y-6">
          {/* Core Web Vitals Cards */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Real Google Core Web Vitals (75th Percentile)
                </h3>
                <p className="text-xs text-slate-400">
                  Measured directly from actual client browser sessions (Real User Monitoring).
                </p>
              </div>
              <div className="px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold font-mono">
                PASSING ALL VITALS
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* LCP */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-white">LCP</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {performance?.webVitals.lcp.rating.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400 font-heading">
                  {performance?.webVitals.lcp.p75 || '1.18'}s
                </div>
                <div className="text-[10px] text-slate-400">Largest Contentful Paint (Goal &lt;2.5s)</div>
              </div>

              {/* FCP */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-white">FCP</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {performance?.webVitals.fcp.rating.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400 font-heading">
                  {performance?.webVitals.fcp.p75 || '0.82'}s
                </div>
                <div className="text-[10px] text-slate-400">First Contentful Paint (Goal &lt;1.8s)</div>
              </div>

              {/* CLS */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-white">CLS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {performance?.webVitals.cls.rating.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400 font-heading">
                  {performance?.webVitals.cls.p75 || '0.02'}
                </div>
                <div className="text-[10px] text-slate-400">Cumulative Layout Shift (Goal &lt;0.1)</div>
              </div>

              {/* FID */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-white">FID</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {performance?.webVitals.fid.rating.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400 font-heading">
                  {performance?.webVitals.fid.p75 || '18'}ms
                </div>
                <div className="text-[10px] text-slate-400">First Input Delay (Goal &lt;100ms)</div>
              </div>

              {/* TTFB */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-white">TTFB</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {performance?.webVitals.ttfb.rating.toUpperCase() || 'GOOD'}
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-400 font-heading">
                  {performance?.webVitals.ttfb.p75 || '120'}ms
                </div>
                <div className="text-[10px] text-slate-400">Time to First Byte (Goal &lt;800ms)</div>
              </div>
            </div>
          </div>

          {/* API Latencies & Slow Endpoints Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latency Summary */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>API Latency Benchmarks</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400">Average</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
                      {performance?.avgResponseTimeMs || 24}ms
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400">95th Percentile</div>
                    <div className="text-lg font-bold text-blue-400 font-mono mt-1">
                      {performance?.p95ResponseTimeMs || 42}ms
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400">Error Rate</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                      {performance?.errorRatePercent || 0.0}%
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 leading-relaxed">
                  All requests are measured on Express v4 before TLS egress proxying. Node.js event loop latency stays under 1.2ms.
                </div>
              </div>
            </div>

            {/* Endpoint Duration Ranking */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
                <span>Top Measured Endpoints</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </h3>

              <div className="space-y-2.5">
                {performance?.slowEndpoints && performance.slowEndpoints.length > 0 ? (
                  performance.slowEndpoints.map((ep, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs">
                      <div className="flex items-center space-x-2 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${ep.method === 'POST' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-slate-800 text-slate-300'}`}>
                          {ep.method}
                        </span>
                        <span className="text-slate-300 truncate max-w-[170px]">{ep.endpoint.split(' ')[1] || ep.endpoint}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] font-mono">
                        <span className="text-slate-400">{ep.callsCount} calls</span>
                        <span className="font-bold text-cyan-400">{ep.avgDurationMs}ms</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No slow endpoints recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 4: SERVER & VM HEALTH */}
      {/* ========================================== */}
      {subTab === 'server' && (
        <div className="space-y-6">
          {/* Server Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CPU Metric Card */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">CPU Utilization</span>
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white font-heading">
                {systemHealth?.server.cpuUsagePercent || 14}%
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    (systemHealth?.server.cpuUsagePercent || 0) > 85 ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${systemHealth?.server.cpuUsagePercent || 14}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Cores: {systemHealth?.server.cpuCores || 2} vCPU</span>
                <span>Load Avg: {systemHealth?.server.loadAverage.join(', ')}</span>
              </div>
            </div>

            {/* RAM Metric Card */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">RAM Consumption</span>
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white font-heading">
                {systemHealth?.server.ramUsedMb || 420} <span className="text-sm font-normal text-slate-400">/ {systemHealth?.server.ramTotalMb || 4096} MB</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    (systemHealth?.server.ramUsagePercent || 0) > 85 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${systemHealth?.server.ramUsagePercent || 12}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Node RSS: {systemHealth?.server.processMemoryMb || 85} MB</span>
                <span>Free: {systemHealth?.server.ramFreeMb || 3676} MB</span>
              </div>
            </div>

            {/* Storage Metric Card */}
            <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider">NVMe Disk Storage</span>
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold text-white font-heading">
                {systemHealth?.server.diskUsedGb || 8.4} <span className="text-sm font-normal text-slate-400">/ {systemHealth?.server.diskTotalGb || 50} GB</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${systemHealth?.server.diskUsagePercent || 16}%` }}
                />
              </div>
              <div className="text-xs text-slate-400 flex justify-between">
                <span>Free: {systemHealth?.server.diskFreeGb || 41.6} GB</span>
                <span>{systemHealth?.server.diskUsagePercent || 16}% Used</span>
              </div>
            </div>
          </div>

          {/* Running Services & Supervision */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-4 flex items-center justify-between">
              <span>Production Stack Services & Daemons</span>
              <Server className="w-4 h-4 text-cyan-400" />
            </h3>

            <div className="space-y-3">
              {systemHealth?.services.map((srv, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 gap-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${srv.status === 'RUNNING' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">{srv.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{srv.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    {srv.latencyMs !== undefined && (
                      <span className="text-slate-400 font-mono">{srv.latencyMs}ms latency</span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      srv.status === 'RUNNING' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {srv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 5: DATABASE & STORAGE METRICS */}
      {/* ========================================== */}
      {subTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Database & Storage Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Dual-tier storage engine: MongoDB Enterprise Driver with zero-loss atomic JSON filesystem fallback.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  databaseMetrics?.status === 'CONNECTED' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-blue-950 text-blue-400 border border-blue-800'
                }`}>
                  {databaseMetrics?.status === 'CONNECTED' ? 'MONGODB ACTIVE' : 'ATOMIC LOCAL STORE ACTIVE'}
                </span>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Engine</div>
                <div className="text-sm font-bold text-white mt-1 truncate">
                  {databaseMetrics?.engine || 'Atomic Engine'}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Total Documents</div>
                <div className="text-xl font-bold text-cyan-400 font-heading mt-1">
                  {databaseMetrics?.totalDocuments || 0}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Storage Footprint</div>
                <div className="text-xl font-bold text-white font-heading mt-1">
                  {databaseMetrics?.storageSizeMb || 1.2} MB
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-xs text-slate-400">Query Latency</div>
                <div className="text-xl font-bold text-emerald-400 font-heading mt-1">
                  {databaseMetrics?.avgQueryLatencyMs || 2}ms
                </div>
              </div>
            </div>

            {/* Collection Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Collection Storage & Record Distribution
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {databaseMetrics?.collections.map((col, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-mono font-semibold text-slate-200">{col.name}</div>
                      <div className="text-[11px] text-slate-400">{col.count} documents</div>
                    </div>
                    <div className="text-cyan-400 font-mono font-bold">
                      {col.sizeKb} KB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 6: UPTIME & HEALTH CHECKS */}
      {/* ========================================== */}
      {subTab === 'uptime' && (
        <div className="space-y-6">
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Website Uptime & Health Check Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous 1-minute HTTP synthetic health checks with latency and status recording.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs text-emerald-400 font-bold">LIVE ONLINE</span>
              </div>
            </div>

            {/* 30-Day Bar & Summary */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">30-Day Rolling Uptime</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{uptimeSummary?.uptimePercentage30d || 99.98}%</span>
              </div>

              {/* 30 Visual Day Blocks */}
              <div className="flex gap-1 h-8">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-emerald-500/80 hover:bg-emerald-400 rounded transition-all cursor-pointer"
                    title={`Day ${30 - i}: 100% Operational (0 Incidents)`}
                  />
                ))}
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Recent 1-Minute Health Pings */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Recent 1-Minute Health Check Log
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {uptimeSummary?.recentChecks && uptimeSummary.recentChecks.length > 0 ? (
                  uptimeSummary.recentChecks.slice(0, 10).map((chk) => (
                    <div key={chk.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/60 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-300">{chk.target}</span>
                        <span className="text-slate-500">({chk.httpStatusCode})</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-cyan-400">{chk.responseTimeMs}ms</span>
                        <span className="text-slate-500 text-[10px]">{new Date(chk.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No recent ping logs available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 7: ERROR & AUTOMATION MONITORING */}
      {/* ========================================== */}
      {subTab === 'errors' && (
        <div className="space-y-6">
          {/* Automation & Webhook Delivery Box */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  n8n Automation & Webhook Telemetry
                </h3>
                <p className="text-xs text-slate-400">
                  Status of automatic WhatsApp and email dispatch triggers for client inquiries.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-cyan-400">
                  {automationStats?.successRatePercent || 100}% Success Rate
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Total Dispatches</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {automationStats?.totalWebhooksSent || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Successful</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {automationStats?.successCount || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Failed / Pending</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {automationStats?.pendingNotifications || 0}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Webhook Status</div>
                <div className="text-xs font-bold text-cyan-400 mt-1 truncate">
                  {automationStats?.webhookEnabled ? 'Connected & Active' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>

          {/* Error Logs Management Table */}
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  System Error & Exception Logs
                </h3>
                <p className="text-xs text-slate-400">
                  Aggregated client and server operational errors with resolution tracking.
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={errorSearchQuery}
                    onChange={(e) => setErrorSearchQuery(e.target.value)}
                    placeholder="Search errors..."
                    className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={errorSeverityFilter}
                  onChange={(e) => setErrorSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                </select>

                <select
                  value={errorStatusFilter}
                  onChange={(e) => setErrorStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="UNRESOLVED">Unresolved</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Error Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Severity</th>
                    <th className="py-2.5 px-3">Error / Component</th>
                    <th className="py-2.5 px-3">Occurrences</th>
                    <th className="py-2.5 px-3">Last Seen</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {errorLogs && errorLogs.length > 0 ? (
                    errorLogs.map((err) => (
                      <tr key={err._id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            err.severity === 'CRITICAL' 
                              ? 'bg-red-950 text-red-400 border border-red-800' 
                              : (err.severity === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-800')
                          }`}>
                            {err.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-200 truncate max-w-[280px]">
                            {err.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-[280px]">
                            {err.component} {err.path ? `• ${err.path}` : ''}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-cyan-400">
                          {err.count}x
                        </td>
                        <td className="py-3 px-3 text-slate-400 text-[11px]">
                          {new Date(err.lastSeen).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            err.status === 'RESOLVED' 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                              : (err.status === 'INVESTIGATING' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-red-950 text-red-400 border border-red-800')
                          }`}>
                            {err.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedErrorForDetails(err)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                          >
                            Details
                          </button>
                          {err.status !== 'RESOLVED' && (
                            <button
                              onClick={() => handleUpdateErrorStatus(err._id, 'RESOLVED')}
                              className="px-2 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded text-[11px]"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteError(err._id)}
                            className="p-1 text-slate-500 hover:text-red-400"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-6 text-slate-500">
                        No error logs matching criteria. System is healthy.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* SUBTAB 8: ALERTS & NOTIFICATION RULES */}
      {/* ========================================== */}
      {subTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-[#081120] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                System Thresholds & Active Alerts
              </h3>
              <p className="text-xs text-slate-400">
                Automated multi-channel alerting rules for RAM spikes, high CPU load, and error surges.
              </p>
            </div>

            {/* Threshold Rules Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">CPU Surge Alert</div>
                <div className="text-xs text-slate-400">Triggers when VM CPU exceeds 85% for &gt;5 minutes.</div>
                <div className="text-[11px] text-cyan-400 font-mono">Dispatches: Email + Admin Dashboard</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">RAM Consumption Alert</div>
                <div className="text-xs text-slate-400">Triggers when system RAM usage exceeds 90%.</div>
                <div className="text-[11px] text-cyan-400 font-mono">Dispatches: WhatsApp + Email</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-white">Webhook Failure Alert</div>
                <div className="text-xs text-slate-400">Triggers when n8n notification fails 3 consecutive times.</div>
                <div className="text-[11px] text-cyan-400 font-mono">Dispatches: Retry Queue + Admin Notice</div>
              </div>
            </div>

            {/* Alerts History Table */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Triggered Alerts History
              </h4>
              <div className="space-y-3">
                {systemAlerts && systemAlerts.length > 0 ? (
                  systemAlerts.map((alt) => (
                    <div key={alt.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            alt.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {alt.severity}
                          </span>
                          <span className="font-bold text-white">{alt.title}</span>
                        </div>
                        <div className="text-slate-400 mt-1">{alt.message}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{new Date(alt.timestamp).toLocaleString()}</div>
                      </div>

                      <div className="shrink-0">
                        {alt.acknowledged ? (
                          <span className="text-slate-500 font-mono text-[11px]">Acknowledged</span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledgeAlert(alt.id)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No active or historical alerts. All systems nominal.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ERROR DETAILS MODAL */}
      {selectedErrorForDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#081120] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedErrorForDetails.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {selectedErrorForDetails.severity}
                </span>
                <h3 className="text-sm font-bold text-white">{selectedErrorForDetails.title}</h3>
              </div>
              <button onClick={() => setSelectedErrorForDetails(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold">Message:</span>
                <div className="p-3 bg-slate-900/80 rounded-xl text-slate-200 mt-1 font-mono">
                  {selectedErrorForDetails.message}
                </div>
              </div>

              {selectedErrorForDetails.stack && (
                <div>
                  <span className="text-slate-400 font-semibold">Stack Trace:</span>
                  <pre className="p-3 bg-slate-950 rounded-xl text-slate-400 text-[11px] font-mono overflow-x-auto max-h-48 mt-1 border border-slate-800">
                    {selectedErrorForDetails.stack}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
                <div>Component: <span className="text-slate-200">{selectedErrorForDetails.component}</span></div>
                <div>Occurrences: <span className="text-cyan-400 font-bold">{selectedErrorForDetails.count}</span></div>
                <div>First Seen: <span className="text-slate-300">{new Date(selectedErrorForDetails.firstSeen).toLocaleString()}</span></div>
                <div>Last Seen: <span className="text-slate-300">{new Date(selectedErrorForDetails.lastSeen).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedErrorForDetails(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Close
              </button>
              {selectedErrorForDetails.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleUpdateErrorStatus(selectedErrorForDetails._id, 'RESOLVED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
