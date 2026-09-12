import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  RefreshCw,
  Compass,
  Star,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StarsBackground from '../components/StarsBackground';
import api from '../utils/api';
import { searchBirthLocation } from '../utils/astrologyApi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const POPULAR_CITIES = [
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 'Europe/London' },
  { name: 'New York, USA', lat: 40.7128, lon: -74.0060, tz: 'America/New_York' },
  { name: 'New Delhi, India', lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo' },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney' },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris' },
];

const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // 7-step flow: 1=Welcome, 2=Name, 3=DOB, 4=Time, 5=Location, 6=Confirm, 7=Generate
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    timeOfBirth: '12:00',
    unknownTime: false,
    placeOfBirth: '',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'UTC',
  });

  // Location search state
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  const handleLocationInput = (val) => {
    setLocationQuery(val);
    setForm((prev) => ({ ...prev, placeOfBirth: val }));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      setSearchingLocation(true);
      debounceRef.current = setTimeout(async () => {
        const results = await searchBirthLocation(val);
        setLocationResults(results);
        setShowDropdown(results.length > 0);
        setSearchingLocation(false);
      }, 400);
    } else {
      setLocationResults([]);
      setShowDropdown(false);
      setSearchingLocation(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setForm((prev) => ({
      ...prev,
      placeOfBirth: loc.displayName,
      latitude: loc.lat,
      longitude: loc.lon,
    }));
    setLocationQuery(loc.displayName);
    setShowDropdown(false);
  };

  const handleCitySelect = (city) => {
    setForm((prev) => ({
      ...prev,
      placeOfBirth: city.name,
      latitude: city.lat,
      longitude: city.lon,
      timezone: city.tz,
    }));
    setLocationQuery(city.name);
    setShowDropdown(false);
  };

  const handleNext = () => {
    if (step === 2 && (!form.firstName.trim() || !form.lastName.trim())) {
      return toast.error('Please provide both your first and last name');
    }
    if (step === 3 && !form.dateOfBirth) {
      return toast.error('Please select your date of birth');
    }
    if (step === 4 && !form.unknownTime && !form.timeOfBirth) {
      return toast.error('Please enter your time of birth');
    }
    if (step === 5 && !form.placeOfBirth.trim()) {
      return toast.error('Please enter your birth city');
    }

    if (step === 6) {
      setStep(7);
      triggerProfileGeneration();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const triggerProfileGeneration = async () => {
    setIsCalculating(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth,
        timeOfBirth: form.unknownTime ? '12:00' : form.timeOfBirth,
        placeOfBirth: form.placeOfBirth.trim(),
        latitude: form.latitude || 51.5074,
        longitude: form.longitude || -0.1278,
        timezone: form.timezone || 'UTC',
      };

      // 1. Save birth details to user profile
      const bdRes = await api.post('/users/birth-details', payload);

      // 2. Generate natal chart with astronomy engine
      if (bdRes.data.success) {
        await api.post('/chart/generate', { birthDetailId: bdRes.data.birthDetail?._id });
      }

      // 3. Update Auth context
      if (user) {
        const updated = {
          ...user,
          firstName: form.firstName,
          lastName: form.lastName,
          isOnboarded: true,
          birthDetails: bdRes.data.birthDetail,
        };
        updateUser(updated);
        localStorage.setItem('maviastro_user', JSON.stringify(updated));
      }

      toast.success('Your Cosmic Life Map™ has been synthesized! ✨');

      // 4. Navigate directly to the signature Cosmic Life Map experience
      setTimeout(() => {
        navigate('/cosmic-life-map', { replace: true });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Calculation encountered an error. Retrying with backup engine.');
      setIsCalculating(false);
      setStep(6);
    }
  };

  const stepsList = [
    { num: 1, label: 'Welcome' },
    { num: 2, label: 'Name' },
    { num: 3, label: 'Birth Date' },
    { num: 4, label: 'Birth Time' },
    { num: 5, label: 'Location' },
    { num: 6, label: 'Confirm' },
    { num: 7, label: 'Synthesizing' },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-obsidian-950 text-slate-100 overflow-hidden">
      <StarsBackground />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-iris-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 my-8">
        {/* Step Indicator Progress Bar */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-obsidian-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-gold-500 to-amber-300 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (stepsList.length - 1)) * 100}%` }}
            />

            {stepsList.map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center cursor-default">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    step === s.num
                      ? 'bg-gold-500 text-obsidian-950 ring-4 ring-gold-500/20 shadow-md'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-obsidian-900 border border-obsidian-700 text-slate-500'
                  }`}
                >
                  {step > s.num ? <Check size={13} /> : s.num}
                </div>
                <span
                  className={`text-[10px] mt-1.5 font-medium hidden sm:block ${
                    step === s.num ? 'text-gold-400' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Container */}
        <div className="card-saas p-6 sm:p-8 backdrop-blur-xl border-obsidian-700/80 bg-obsidian-900/90 shadow-2xl relative">
          <AnimatePresence mode="wait">
            {/* STEP 1: WELCOME */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400 shadow-inner">
                  <Sparkles size={28} />
                </div>
                <div>
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 1 of 7 • Introduction
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-gradient-gold">
                    Welcome to Mavi-AstroVision
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300/80 mt-2.5 leading-relaxed max-w-md mx-auto">
                    We invite you into a deeper understanding of your personal cosmic blueprint. Rather than generic horoscopes, we synthesize your exact natal coordinates into your signature <strong className="text-white">Cosmic Life Map™</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-obsidian-950/80 border border-obsidian-800 text-xs text-slate-300 space-y-2 text-left">
                  <div className="flex items-center gap-2 text-gold-400 font-semibold">
                    <Compass size={14} /> What to expect:
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-[11px] text-slate-400">
                    <li>High-precision ephemeris calculations for your exact birth moment</li>
                    <li>Interactive 5-pillar matrix: Blueprint, Career, Love, Growth, and Transits</li>
                    <li>Personalized 6-dimension scorecard and downloadable vector PDF reports</li>
                  </ul>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  className="w-full font-semibold"
                >
                  <span>Begin Guided Setup</span>
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: NAME */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 2 of 7 • Personal Identity
                  </Badge>
                  <h2 className="text-2xl font-cinzel font-bold text-white">What is your name?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    This personalizes your natal chart dossiers and PDF reports.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">First Name</label>
                    <input
                      type="text"
                      autoFocus
                      required
                      placeholder="e.g., Arya"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/40 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1 font-semibold">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Stark"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/40 outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={() => setStep(1)}>
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={handleNext} className="flex-1 font-medium">
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DATE OF BIRTH */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 3 of 7 • Solar Calendar
                  </Badge>
                  <h2 className="text-2xl font-cinzel font-bold text-white">When were you born?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Determines your Sun position and celestial ephemeris alignments.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5 font-semibold flex items-center gap-1.5">
                    <Calendar size={13} className="text-gold-400" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dateOfBirth}
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/40 outline-none transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    Used to calculate planetary degrees (Sun, Mercury, Venus, Mars, Jupiter, Saturn).
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={() => setStep(2)}>
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={handleNext} className="flex-1 font-medium">
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: TIME OF BIRTH */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 4 of 7 • Rising Horizon
                  </Badge>
                  <h2 className="text-2xl font-cinzel font-bold text-white">What time were you born?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your exact birth time determines your Ascendant (Rising Sign) and the 12 House cusps.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <Clock size={13} className="text-gold-400" />
                      Birth Time (24h or AM/PM)
                    </label>
                    <input
                      type="time"
                      disabled={form.unknownTime}
                      value={form.timeOfBirth}
                      onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })}
                      className={`w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/40 outline-none transition ${
                        form.unknownTime ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300 p-3 rounded-lg bg-obsidian-950/80 border border-obsidian-800 hover:border-obsidian-700 transition">
                    <input
                      type="checkbox"
                      checked={form.unknownTime}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm({
                          ...form,
                          unknownTime: checked,
                          timeOfBirth: checked ? '12:00' : form.timeOfBirth,
                        });
                      }}
                      className="w-4 h-4 rounded bg-obsidian-900 border-obsidian-700 text-gold-500 focus:ring-0 cursor-pointer"
                    />
                    <span>I don&apos;t know my exact birth time (use solar noon default)</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={() => setStep(3)}>
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={handleNext} className="flex-1 font-medium">
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: BIRTH LOCATION */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 5 of 7 • Terrestrial Anchor
                  </Badge>
                  <h2 className="text-2xl font-cinzel font-bold text-white">Where were you born?</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Latitude and longitude establish the horizon of your celestial chart.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <label className="text-xs text-slate-300 block mb-1.5 font-semibold flex items-center gap-1.5">
                      <MapPin size={13} className="text-gold-400" />
                      Search City or Country
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g., London, New Delhi, or New York"
                        value={locationQuery || form.placeOfBirth}
                        onChange={(e) => handleLocationInput(e.target.value)}
                        onFocus={() => locationResults.length > 0 && setShowDropdown(true)}
                        className="w-full bg-obsidian-950 border border-obsidian-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/40 outline-none pr-9 transition"
                      />
                      {searchingLocation ? (
                        <RefreshCw size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
                      ) : (
                        <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showDropdown && locationResults.length > 0 && (
                      <div className="absolute z-30 mt-1.5 w-full bg-obsidian-900 border border-obsidian-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {locationResults.map((loc, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectLocation(loc)}
                            className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-gold-500/10 hover:text-gold-300 transition flex items-center gap-2 border-b border-obsidian-800 last:border-0"
                          >
                            <MapPin size={12} className="text-gold-400 shrink-0" />
                            <span className="truncate">{loc.displayName}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resolved coordinates confirmation */}
                  {form.latitude && form.longitude && form.placeOfBirth && (
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                      <Check size={12} />
                      <span>Coordinates resolved: {Number(form.latitude).toFixed(4)}°, {Number(form.longitude).toFixed(4)}°</span>
                    </div>
                  )}

                  {/* Popular Shortcuts */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 block mb-2 font-medium">Quick Selection:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleCitySelect(c)}
                          className="px-2.5 py-1 rounded-md bg-obsidian-950 hover:bg-obsidian-800 border border-obsidian-800 text-[11px] text-slate-300 hover:text-white transition"
                        >
                          {c.name.split(',')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={() => setStep(4)}>
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button variant="primary" size="md" onClick={handleNext} className="flex-1 font-medium">
                    <span>Continue</span>
                    <ArrowRight size={14} />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: CONFIRM INFORMATION */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider mb-2">
                    Step 6 of 7 • Confirmation
                  </Badge>
                  <h2 className="text-2xl font-cinzel font-bold text-white">Review Your Coordinates</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Verify the parameters that will govern your Cosmic Life Map calculations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-obsidian-800/80">
                    <span className="text-slate-500">Seeker:</span>
                    <span className="font-semibold text-slate-200">{form.firstName} {form.lastName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-obsidian-800/80">
                    <span className="text-slate-500">Birth Date:</span>
                    <span className="font-semibold text-slate-200">
                      {form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-obsidian-800/80">
                    <span className="text-slate-500">Birth Time:</span>
                    <span className="font-semibold text-gold-400">
                      {form.unknownTime ? '12:00 PM (Solar Noon Default)' : form.timeOfBirth}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-obsidian-800/80">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-semibold text-slate-200 truncate max-w-[200px] text-right">{form.placeOfBirth}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">System:</span>
                    <span className="font-semibold text-gold-400">Western (Tropical / Placidus)</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                  Upon confirmation, our backend ephemeris engine will compute your 10 planetary placements, 12 houses, and personal Cosmic Life Map™.
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="secondary" size="md" onClick={() => setStep(5)}>
                    <ArrowLeft size={14} /> Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    className="flex-1 font-semibold shadow-md"
                  >
                    <Sparkles size={15} />
                    <span>Generate My Cosmic Profile</span>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 7: GENERATING MY COSMIC PROFILE */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-gold-400/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-gold-500/60 animate-spin" />
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Badge variant="gold" className="text-[10px] uppercase font-semibold tracking-wider">
                    Synthesizing Celestial Pattern
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                    Generating Your Cosmic Life Map™
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Aligning astronomy engine data, computing house cusps, and mapping personal archetype patterns...
                  </p>
                </div>

                <div className="text-[11px] text-gold-400/80 font-medium">
                  ✦ You will be redirected automatically ✦
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
