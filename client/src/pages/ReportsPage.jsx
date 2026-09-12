import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  Heart,
  RefreshCw,
  Compass,
  X,
  Calendar,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';

export default function ReportsPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [charts, setCharts] = useState([]);
  const [selectedChartId, setSelectedChartId] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Synastry PDF modal
  const [showSynastryModal, setShowSynastryModal] = useState(false);
  const [partnerData, setPartnerData] = useState({
    name: 'Partner',
    dateOfBirth: '1998-09-15',
    timeOfBirth: '14:30',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: -4,
  });

  useEffect(() => {
    fetchTemplatesAndCharts();
  }, []);

  const fetchTemplatesAndCharts = async () => {
    try {
      setLoading(true);
      const [tRes, cRes] = await Promise.all([
        api.get('/reports/templates'),
        api.get('/chart/user/all').catch(() => ({ data: { charts: [] } })),
      ]);

      if (tRes.data.success) {
        setTemplates(tRes.data.templates || []);
      }
      if (cRes.data.charts) {
        setCharts(cRes.data.charts || []);
        if (cRes.data.charts.length > 0) {
          setSelectedChartId(cRes.data.charts[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadNatalPDF = async () => {
    if (!selectedChartId) {
      toast.error('Please calculate your birth chart first in the Birth Chart page');
      return;
    }

    try {
      setDownloading(true);
      const token = localStorage.getItem('maviastro_token');
      const response = await fetch(`/api/reports/birth-chart/${selectedChartId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MaviAstro_Natal_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Your Natal Dossier has been downloaded! ✨');
    } catch {
      toast.error('Failed to download PDF report');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadSynastryPDF = async (e) => {
    e.preventDefault();
    try {
      setDownloading(true);
      const previewRes = await api.post('/chart/preview', {
        dateOfBirth: partnerData.dateOfBirth,
        timeOfBirth: partnerData.timeOfBirth,
        latitude: partnerData.latitude,
        longitude: partnerData.longitude,
        timezone: partnerData.timezone,
      });

      if (!previewRes.data.success) throw new Error('Partner chart calculation failed');

      const myChartRes = await api.get('/chart/primary');
      if (!myChartRes.data.chart?.chartData) throw new Error('Please add your own birth details first');

      const token = localStorage.getItem('maviastro_token');
      const pdfResponse = await fetch('/api/reports/synastry/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          personAName: user?.name || 'You',
          personBName: partnerData.name,
          chartAData: myChartRes.data.chart.chartData,
          chartBData: previewRes.data.chartData,
        }),
      });

      if (!pdfResponse.ok) throw new Error('PDF Generation failed');

      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MaviAstro_Synastry_${partnerData.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setShowSynastryModal(false);
      toast.success('Synastry Dossier downloaded! ✨');
    } catch (err) {
      toast.error(err.message || 'Synastry PDF download failed');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <Loader text="Loading certified astrological reports..." />;

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ─── Page Header ─── */}
      <PageHeader
        title="Astrological Reports Hub"
        subtitle="Export comprehensive, publication-grade astrological dossiers formatted with verified ephemeris coordinates"
        badge={
          <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold">
            <FileText size={11} className="mr-1 inline" /> Certified Vector Dossiers
          </Badge>
        }
      />

      {/* ─── Chart Selector ─── */}
      {charts.length > 1 && (
        <div className="card-saas p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-medium">Select active chart for report generation:</span>
          <select
            value={selectedChartId}
            onChange={(e) => setSelectedChartId(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-gold-500/60"
          >
            {charts.map((c) => (
              <option key={c._id} value={c._id}>
                {c.firstName} {c.lastName} ({c.sunSign || 'Chart'})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ─── Report Templates Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Template 1: Natal Blueprint */}
        <motion.div
          whileHover={{ y: -4 }}
          className="card-saas p-6 sm:p-7 flex flex-col justify-between border-obsidian-700/80 hover:border-gold-500/50 relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🌌
              </div>
              <Badge variant="gold" className="text-[10px] font-bold uppercase">
                Signature
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-cinzel font-bold text-white">Natal Blueprint Dossier</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Complete 10-Planet Ephemeris positions, 12 House Cusps, and psychological soul synthesis.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-obsidian-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Exact degrees & minutes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Big Three psychological blend
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> High-resolution Vector PDF
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadNatalPDF}
              loading={downloading}
              className="w-full font-medium"
            >
              <Download size={14} /> Download Natal PDF
            </Button>
          </div>
        </motion.div>

        {/* Template 2: Synastry Dossier */}
        <motion.div
          whileHover={{ y: -4 }}
          className="card-saas p-6 sm:p-7 flex flex-col justify-between border-obsidian-700/80 hover:border-rose-500/50 relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                💑
              </div>
              <Badge variant="outline" className="text-[10px] font-bold uppercase text-rose-400 border-rose-500/30">
                Compatibility
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-cinzel font-bold text-white">Synastry Compatibility Dossier</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cross-planetary aspects, chemistry, emotional synergy, and conscious relationship guidance.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-obsidian-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400" /> 5-Domain compatibility breakdown
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400" /> Inter-chart cross aspects list
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-rose-400" /> Relationship archetype guide
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowSynastryModal(true)}
              className="w-full font-medium text-rose-300 hover:text-rose-200 border-rose-500/30"
            >
              <Heart size={14} className="text-rose-400" /> Configure & Download PDF
            </Button>
          </div>
        </motion.div>

        {/* Template 3: Annual Transit Forecast */}
        <motion.div
          whileHover={{ y: -4 }}
          className="card-saas p-6 sm:p-7 flex flex-col justify-between border-obsidian-700/80 hover:border-iris-500/50 relative overflow-hidden group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-iris-500/10 border border-iris-500/30 text-iris-400 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🔮
              </div>
              <Badge variant="iris" className="text-[10px] font-bold uppercase">
                Annual Road
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-cinzel font-bold text-white">Yearly Transits & Solar Return</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                12-Month transit roadmap identifying optimal windows for career leaps, wealth, and love.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-obsidian-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-iris-400" /> Major outer planet transits
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-iris-400" /> Retrograde mitigation dates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-iris-400" /> Solar Return chart analysis
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={handleDownloadNatalPDF}
              className="w-full font-medium"
            >
              <Download size={14} /> Download Annual Report
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ─── Modal: Synastry PDF Configuration ─── */}
      <AnimatePresence>
        {showSynastryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="card-saas p-6 sm:p-7 max-w-lg w-full relative space-y-4 border-obsidian-700 bg-obsidian-900"
            >
              <div className="flex items-center justify-between border-b border-obsidian-800 pb-3">
                <h3 className="text-base font-cinzel font-bold text-white flex items-center gap-2">
                  <Heart size={16} className="text-rose-400" /> Generate Synastry PDF Dossier
                </h3>
                <button
                  onClick={() => setShowSynastryModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-obsidian-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleDownloadSynastryPDF} className="space-y-4">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Partner&apos;s Name</label>
                  <input
                    type="text"
                    required
                    value={partnerData.name}
                    onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-rose-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={partnerData.dateOfBirth}
                      onChange={(e) => setPartnerData({ ...partnerData, dateOfBirth: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-rose-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">Time of Birth</label>
                    <input
                      type="time"
                      value={partnerData.timeOfBirth}
                      onChange={(e) => setPartnerData({ ...partnerData, timeOfBirth: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={partnerData.latitude}
                      onChange={(e) => setPartnerData({ ...partnerData, latitude: Number(e.target.value) })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={partnerData.longitude}
                      onChange={(e) => setPartnerData({ ...partnerData, longitude: Number(e.target.value) })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Timezone</label>
                    <input
                      type="number"
                      step="0.5"
                      value={partnerData.timezone}
                      onChange={(e) => setPartnerData({ ...partnerData, timezone: Number(e.target.value) })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={downloading}
                    className="w-full font-medium"
                  >
                    <Download size={14} /> Download Synastry PDF
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
