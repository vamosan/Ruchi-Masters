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
  Globe, 
  Link2,
  AtSign,
  Share2,
  Calendar, 
  Building2, 
  Save, 
  FileText,
  Image as ImageIcon
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
];

const PRESET_BANNERS = [
  { label: 'Floodlit Stadium', url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Night Arena', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Lush Ground', url: 'https://images.unsplash.com/photo-1562077772-3b12ab86a810?auto=format&fit=crop&w=1600&q=80' },
  { label: 'Sunset Ground', url: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3ce?auto=format&fit=crop&w=1600&q=80' },
];

export const EditTeamModal: React.FC<Props> = ({ team, onClose, onSave }) => {
  const { updateTeam } = useTournament();

  // Basic Details
  const [name, setName] = useState(team.name);
  const [establishedYear, setEstablishedYear] = useState<number | string>(team.establishedYear || 2022);
  const [homeGround, setHomeGround] = useState(team.homeGround || '');
  const [address, setAddress] = useState(team.address || '');
  const [description, setDescription] = useState(team.description || '');

  // Online & Social Links
  const [website, setWebsite] = useState(team.website || team.socialLinks?.website || '');
  const [instagram, setInstagram] = useState(team.instagram || team.socialLinks?.instagram || '');
  const [facebook, setFacebook] = useState(team.facebook || team.socialLinks?.facebook || '');
  const [twitter, setTwitter] = useState(team.socialLinks?.twitter || '');

  // Colors
  const [primaryColor, setPrimaryColor] = useState(team.primaryColor || '#0284c7');
  const [secondaryColor, setSecondaryColor] = useState(team.secondaryColor || '#38bdf8');

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

  const [activeTab, setActiveTab] = useState<'info' | 'social' | 'media' | 'staff'>('info');

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

    const updatedPlayers: Player[] = team.players.map(p => ({
      ...p,
      isCaptain: p.id === captainId,
      isViceCaptain: p.id === viceCaptainId,
    }));

    const updatedTeam: Team = {
      ...team,
      name,
      establishedYear: Number(establishedYear) || 2022,
      homeGround,
      address,
      description,
      website,
      instagram,
      facebook,
      socialLinks: {
        website,
        instagram,
        facebook,
        twitter
      },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white text-slate-900 border-3 border-slate-950 shadow-[10px_10px_0px_#0f172a] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-slate-950 text-white flex items-center justify-between gap-4 border-b-2 border-slate-900 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-white/20 text-white shadow"
              style={{ backgroundColor: primaryColor }}
            >
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-cabinet leading-tight">Edit Franchise Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {name} • Update ground, EST., address, website & social pages
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b-2 border-slate-900 bg-slate-50 text-xs overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'info'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>Venue, Estd & Address</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'social'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Website & Social Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'media'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Team Photos & Colors</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2 rounded-xl font-black transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'staff'
                ? 'bg-slate-950 text-white shadow'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Captain & Staff</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-900">
          
          {/* TAB 1: VENUE, ESTD, ADDRESS & BIO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                  Franchise Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. FC KVM Royal Warriors"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none text-sm focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    Home Ground / Stadium Venue *
                  </label>
                  <input
                    type="text"
                    required
                    value={homeGround}
                    onChange={e => setHomeGround(e.target.value)}
                    placeholder="e.g. Apex Oval Complex, Ground 1"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    Established Year (EST.) *
                  </label>
                  <input
                    type="number"
                    min={1950}
                    max={2030}
                    required
                    value={establishedYear}
                    onChange={e => setEstablishedYear(e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-mono font-bold outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  Club Headquarters / Physical Address / City
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. Sportpark Nord, Frankfurt am Main, Germany"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  Franchise Story & About Biography
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief history, team vision, home ground atmosphere, and achievements..."
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-medium outline-none focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 2: WEBSITE & SOCIAL PAGES */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-50 border-2 border-cyan-200 text-cyan-950 font-medium">
                Connect official club website and social media pages so tournament fans and scouts can visit your profiles directly from your franchise banner.
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-cyan-600" />
                  Official Club Website
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://www.yourteamwebsite.com"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-mono text-xs font-bold outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <AtSign className="w-4 h-4 text-pink-600" />
                  Instagram Page / Handle
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="e.g. @fckvm_warriors or https://instagram.com/fckvm"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Facebook Page / URL
                </label>
                <input
                  type="text"
                  value={facebook}
                  onChange={e => setFacebook(e.target.value)}
                  placeholder="https://facebook.com/yourteampage"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-black uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-slate-900" />
                  Twitter / X / Social Profile
                </label>
                <input
                  type="text"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="e.g. @fckvm or https://x.com/fckvm"
                  className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: MEDIA (TEAM PHOTO, BANNER & COLORS) */}
          {activeTab === 'media' && (
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
                  <span className="text-[11px] text-slate-500 font-bold">Recommended: 16:9 photo</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={teamPhotoUrl || PRESET_TEAM_PHOTOS[0].url}
                    alt="Team Preview"
                    className="w-full sm:w-44 h-28 rounded-2xl object-cover border-2 border-slate-900 shadow"
                  />

                  <div className="space-y-2 flex-1 w-full">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#00F59B] hover:bg-[#00e08c] text-slate-950 font-black text-xs inline-flex items-center gap-2 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Squad Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                    <p className="text-[10px] text-slate-500">Upload directly from device or select a preset below.</p>
                  </div>
                </div>

                {/* Preset Options */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_TEAM_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTeamPhotoUrl(preset.url)}
                        className={`p-1 rounded-xl border-2 transition-all text-left overflow-hidden ${
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
                </div>

                <div className="space-y-3">
                  <div className="relative w-full h-24 rounded-2xl overflow-hidden border-2 border-slate-900 shadow">
                    <img
                      src={bannerUrl || PRESET_BANNERS[0].url}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-[#FFE600] hover:bg-[#ebd300] text-slate-950 font-black text-xs inline-flex items-center gap-2 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Banner Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBannerUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {/* 3. Theme Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-900">
                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-900 bg-white"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={e => setPrimaryColor(e.target.value)}
                      className="p-2 rounded-xl border-2 border-slate-900 font-mono font-bold text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Secondary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-2 border-slate-900 bg-white"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={e => setSecondaryColor(e.target.value)}
                      className="p-2 rounded-xl border-2 border-slate-900 font-mono font-bold text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STAFF & MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                    Captain Assignment
                  </label>
                  <select
                    value={captainId}
                    onChange={e => setCaptainId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                  >
                    <option value="">-- Select Captain from Squad --</option>
                    {team.players.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.jerseyNumber} {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black uppercase tracking-wider text-slate-700 mb-1">
                    Vice Captain Assignment
                  </label>
                  <select
                    value={viceCaptainId}
                    onChange={e => setViceCaptainId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                  >
                    <option value="">-- Select Vice-Captain from Squad --</option>
                    {team.players.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.jerseyNumber} {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-3">
                <h4 className="font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-600" />
                  Management & Contact Details
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Head Coach
                  </label>
                  <input
                    type="text"
                    value={coach}
                    onChange={e => setCoach(e.target.value)}
                    placeholder="Coach Name"
                    className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" /> Contact Email
                    </label>
                    <input
                      type="email"
                      value={managerEmail}
                      onChange={e => setManagerEmail(e.target.value)}
                      placeholder="team@franchise.com"
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> Contact Phone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={managerPhone}
                      onChange={e => setManagerPhone(e.target.value)}
                      placeholder="+49 ..."
                      className="w-full p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 font-bold outline-none focus:bg-white"
                    />
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
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs border border-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-7 py-2.5 rounded-2xl bg-[#00F59B] hover:bg-[#00e08c] text-slate-950 font-black text-xs flex items-center gap-2 border-2 border-slate-950 shadow-[2px_2px_0px_#0f172a] transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Franchise Info</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
