import React, { useState } from 'react';
import { 
  User, 
  X, 
  Zap, 
  Target, 
  Clock, 
  Award, 
  History, 
  Edit2, 
  Check, 
  Trash2,
  Calendar
} from 'lucide-react';
import { UserProfile, ThemeColors } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  theme: ThemeColors;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  theme
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');

  if (!isOpen) return null;

  const handleSave = () => {
    if (username.trim()) {
      onUpdateProfile({ username: username.trim(), bio: bio.trim() });
    }
    setIsEditing(false);
  };

  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = (mins / 60).toFixed(1);
    if (mins < 60) return `${mins} mins`;
    return `${hrs} hours`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl glass-panel border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${theme.primary}25`, color: theme.primary }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Player Profile & Stats</h3>
              <p className="text-xs text-slate-400">Track your progress and personal typing history</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card & Stats */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* User Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatar}
                alt={profile.username}
                className="w-16 h-16 rounded-2xl border-2 border-indigo-500/40 object-cover shadow-lg"
              />
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white font-bold"
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 w-full"
                      placeholder="Short bio"
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {profile.username}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{profile.bio}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>Member since {new Date(profile.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Edit / Save Button */}
            <div>
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Metric Quad */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Best Speed</span>
              </div>
              <div className="text-2xl font-black text-amber-300">
                {profile.bestWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>Average Speed</span>
              </div>
              <div className="text-2xl font-black text-indigo-300">
                {profile.averageWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>Avg Accuracy</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {profile.averageAccuracy}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono">
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Total Time</span>
              </div>
              <div className="text-lg font-bold text-sky-300 mt-1">
                {formatTotalTime(profile.totalTimeTypedSeconds)}
              </div>
            </div>
          </div>

          {/* Test History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-semibold text-white">Recent Test Sessions</h4>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {profile.history.length} tests logged
              </span>
            </div>

            {profile.history.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm rounded-xl border border-dashed border-slate-800">
                No typing tests completed yet. Start your first session!
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800/80">
                {profile.history.map(item => (
                  <div key={item.id} className="p-3 bg-slate-900/40 hover:bg-slate-900 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white capitalize">
                        {item.mode} • {item.modeDetail}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-slate-400">Acc</div>
                        <div className="text-emerald-400 font-semibold">{item.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-slate-400">Speed</div>
                        <div className="text-amber-300 font-bold text-sm">{item.wpm} WPM</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-500">
          Personal data and statistics are saved safely and synced locally.
        </div>
      </div>
    </div>
  );
};
