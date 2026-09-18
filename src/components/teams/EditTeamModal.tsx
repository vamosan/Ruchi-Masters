import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Palette, 
  Shield, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Sparkles, 
  Check, 
  Image as ImageIcon,
  Layers,
  Save,
  Trash2
} from 'lucide-react';
import { Team, Player } from '../../types/cricket';
import { useTournament } from '../../context/TournamentContext';
import { processPlayerPhoto } from '../../utils/imageUtils';

interface Props {
  team: Team;
  onClose: () => void;
  onSave?: (updated: Team) => void;
}

const PRESET_TEAM_PHOTOS = [
  { label: 'Victory Celebration', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Squad Huddle', url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Trophy Lineup', url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Training Ground', url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Match Day Tunnel', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Power Strikers', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1000&q=80' },
];

const PRESET_BANNERS = [
  { label: 'Floodlit Stadium', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Night Arena', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Lush Ground', url: 'https://images.unsplash.com/photo-1562077772-3b12ab86a810?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Cricket Pitch Sunset', url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1600&q=80' },
];

const LOGO_EMOJIS = ['🦁', '🌊', '👑', '⚡', '⚔️', '🔥', '🦅', '🏏', '🐯', '🐺', '🌪️', '🛡️', '🎯', '🚀'];

export const EditTeamModal: React.FC<Props> = ({ team, onClose, onSave }) => {
  const { updateTeam } = useTournament();

  const [name, setName] = useState(team.name);
  const [shortName, setShortName] = useState(team.shortName || '');
  const [code, setCode] = useState(team.code);
  const [logo, setLogo] = useState(team.logo || '🏏');
  const [group, setGroup] = useState(team.group || 'Group A');
  const [homeGround, setHomeGround] = useState(team.homeGround || '');
  const [slogan, setSlogan] = useState(team.slogan || '');
  const [description, setDescription] = useState(team.description || '');
  const [establishedYear, setEstablishedYear] = useState(team.establishedYear || 2022);
  
  const [primaryColor, setPrimaryColor] = useState(team.primaryColor || '#dc2626');
  const [secondaryColor, setSecondaryColor] = useState(team.secondaryColor || '#f59e0b');

  // Media
  const [teamPhotoUrl, setTeamPhotoUrl] = useState(team.teamPhotoUrl || PRESET_TEAM_PHOTOS[0].url);
  const [bannerUrl, setBannerUrl] = useState(team.bannerUrl || PRESET_BANNERS[0].url);

  // Staff & Management
  const [coach, setCoach] = useState(team.coach || '');
  const [managerName, setManagerName] = useState(team.managerName || '');
  const [managerEmail, setManagerEmail] = useState(team.managerEmail || '');
  const [managerPhone, setManagerPhone] = useState(team.managerPhone || '');

  // Leadership assignments
  const [captainId, setCaptainId] = useState(team.captainId || team.players.find(p => p.isCaptain)?.id || '');
  const [viceCaptainId, setViceCaptainId] = useState(team.viceCaptainId || team.players.find(p => p.isViceCaptain)?.id || '');

  // Active sub-tab in edit modal
  const [activeEditTab, setActiveEditTab] = useState<'general' | 'media' | 'branding' | 'staff'>('general');

  // Handle local file uploads (Team Photo & Banner)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await processPlayerPhoto(file);
        setTeamPhotoUrl(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const compressed = await processPlayerPhoto(file);
        setBannerUrl(compressed);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update Captain & Vice-Captain flags in players roster
    const updatedPlayers: Player[] = team.players.map(p => ({
      ...p,
      isCaptain: p.id === captainId,
      isViceCaptain: p.id === viceCaptainId,
    }));

    const updatedTeam: Team = {
      ...team,
      name,
      shortName: shortName || name.split(' ')[0] || name,
      code: code.toUpperCase().slice(0, 4),
      logo,
      group,
      homeGround,
      slogan,
      description,
      establishedYear,
      primaryColor,
      secondaryColor,
      teamPhotoUrl,
      bannerUrl,
      coach,
      managerName,
      managerEmail,
      managerPhone,
      captainId: captainId || undefined,
      viceCaptainId: viceCaptainId || undefined,
      players: updatedPlayers
    };

    updateTeam(updatedTeam);
    if (onSave) onSave(updatedTeam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 border-2 border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div 
          className="p-5 sm:p-6 border-b-2 border-slate-900 flex items-center justify-between gap-4 shrink-0"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}15, #ffffff)`
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl neo-pill border-2 border-slate-900"
              style={{ backgroundColor: `${primaryColor}30` }}
            >
              {logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-cabinet leading-tight">Edit Franchise Profile</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#FFE600] text-slate-950 neo-pill">
                  {code}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Update franchise info, upload team photos, customize brand colors & management
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 neo-pill flex items-center justify-center font-bold text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveEditTab('general')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeEditTab === 'general'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Franchise Identity</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditTab('media')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeEditTab === 'media'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Team Photos & Banner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditTab('branding')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeEditTab === 'branding'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Colors & Theme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveEditTab('staff')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeEditTab === 'staff'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Staff & Leadership</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: FRANCHISE IDENTITY */}
          {activeEditTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Franchise Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Royal Strikers"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Short Display Name
                  </label>
                  <input
                    type="text"
                    value={shortName}
                    onChange={e => setShortName(e.target.value)}
                    placeholder="e.g. Strikers"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Team Code (2-4 Chars) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. RS"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-mono font-bold outline-none text-sm uppercase focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Tournament Group
                  </label>
                  <select
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                  >
                    <option value="Group A">Group A</option>
                    <option value="Group B">Group B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Established Year
                  </label>
                  <input
                    type="number"
                    min={1990}
                    max={2030}
                    value={establishedYear}
                    onChange={e => setEstablishedYear(parseInt(e.target.value, 10) || 2022)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-mono font-bold outline-none text-sm focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Team Slogan / Motto
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={e => setSlogan(e.target.value)}
                  placeholder="e.g. Roar with Royal Pride"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Home Ground Stadium
                </label>
                <input
                  type="text"
                  value={homeGround}
                  onChange={e => setHomeGround(e.target.value)}
                  placeholder="e.g. Royal Park Stadium"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                  Franchise Bio / Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tell the story of the franchise, playing style, championship achievements..."
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-medium outline-none text-xs focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA (TEAM PHOTO & BANNER) */}
          {activeEditTab === 'media' && (
            <div className="space-y-6">
              {/* 1. Team Group Picture */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan-600" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      Team Squad Photograph / Group Picture
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold">Recommended: 16:9 high-res photo</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={teamPhotoUrl || PRESET_TEAM_PHOTOS[0].url}
                    alt="Team Preview"
                    className="w-full sm:w-44 h-28 rounded-xl object-cover border-2 border-slate-900 shadow-[3px_3px_0px_#0f172a]"
                  />

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 rounded-full bg-[#00F59B] text-slate-950 font-black text-xs inline-flex items-center gap-2 neo-btn">
                        <Upload className="w-3.5 h-3.5" />
                        Upload Team Picture
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      Or paste an online image URL:
                    </div>
                    <input
                      type="url"
                      value={teamPhotoUrl}
                      onChange={e => setTeamPhotoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white font-mono text-[11px] outline-none"
                    />
                  </div>
                </div>

                {/* Preset Options */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                    Or select from high-res presets:
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_TEAM_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTeamPhotoUrl(preset.url)}
                        className={`p-1 rounded-xl border-2 transition-all text-left group overflow-hidden ${
                          teamPhotoUrl === preset.url ? 'border-emerald-600 ring-2 ring-emerald-400' : 'border-slate-300 hover:border-slate-800'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg" />
                        <span className="text-[9px] font-bold text-slate-700 block truncate mt-0.5 text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Team Stadium Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span className="font-black text-xs uppercase tracking-wider text-slate-900">
                      Team Cover Banner (Stadium Backdrop)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold">Panoramic Header</span>
                </div>

                <div className="space-y-3">
                  <div className="relative w-full h-24 rounded-xl overflow-hidden border-2 border-slate-900 shadow">
                    <img
                      src={bannerUrl || PRESET_BANNERS[0].url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-white text-xs font-black">{name} Banner Preview</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 rounded-full bg-[#FFE600] text-slate-950 font-black text-xs inline-flex items-center gap-2 neo-btn">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Banner Image
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleBannerUpload} 
                        className="hidden" 
                      />
                    </label>

                    <input
                      type="url"
                      value={bannerUrl}
                      onChange={e => setBannerUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 min-w-[200px] p-2 rounded-xl border border-slate-300 bg-white font-mono text-[11px] outline-none"
                    />
                  </div>

                  {/* Preset Banners */}
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-500 block mb-1.5">
                      Or select stadium preset:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_BANNERS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBannerUrl(preset.url)}
                          className={`p-1 rounded-xl border-2 transition-all text-left overflow-hidden ${
                            bannerUrl === preset.url ? 'border-amber-500 ring-2 ring-amber-400' : 'border-slate-300 hover:border-slate-800'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-10 object-cover rounded-lg" />
                          <span className="text-[9px] font-bold text-slate-700 block truncate mt-0.5 text-center">
                            {preset.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COLORS & BRANDING */}
          {activeEditTab === 'branding' && (
            <div className="space-y-6">
              {/* Logo Emoji Selector */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Franchise Mascot Badge / Icon
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {LOGO_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setLogo(emoji)}
                      className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all border-2 ${
                        logo === emoji 
                          ? 'border-slate-950 bg-[#00F59B] scale-110 shadow-[3px_3px_0px_#0f172a]' 
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-900">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-900 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="p-2 rounded-xl border border-slate-300 font-mono font-bold text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-slate-900 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="p-2 rounded-xl border border-slate-300 font-mono font-bold text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div 
                className="p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a] text-white flex items-center justify-between"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-black/30 backdrop-blur">{logo}</span>
                  <div>
                    <h3 className="text-lg font-black">{name || 'Franchise Name'}</h3>
                    <p className="text-xs opacity-90 font-medium">{slogan || 'Team Slogan Preview'}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white text-slate-950 shadow">
                  {code || 'CODE'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF & LEADERSHIP */}
          {activeEditTab === 'staff' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Captain Assignment
                  </label>
                  <select
                    value={captainId}
                    onChange={e => setCaptainId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                  >
                    <option value="">-- Select Captain from Squad --</option>
                    {team.players.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.jerseyNumber} {p.name} ({p.role.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Vice Captain Assignment
                  </label>
                  <select
                    value={viceCaptainId}
                    onChange={e => setViceCaptainId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                  >
                    <option value="">-- Select Vice-Captain from Squad --</option>
                    {team.players.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.jerseyNumber} {p.name} ({p.role.replace('_', ' ')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" />
                  Leadership & Coaching Staff
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Head Coach
                    </label>
                    <input
                      type="text"
                      value={coach}
                      onChange={e => setCoach(e.target.value)}
                      placeholder="e.g. Brendon McCullum"
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Franchise Representative / Lead Full Name
                    </label>
                    <input
                      type="text"
                      value={managerName}
                      onChange={e => setManagerName(e.target.value)}
                      placeholder="e.g. Vikram Sethi"
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact / Team Email
                      </label>
                      <input
                        type="email"
                        value={managerEmail}
                        onChange={e => setManagerEmail(e.target.value)}
                        placeholder="team@franchise.com"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={managerPhone}
                        onChange={e => setManagerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-xs focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs neo-pill"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#00F59B] hover:bg-[#00e08c] text-slate-950 font-black text-xs neo-btn flex items-center gap-2 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Franchise Profile</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
