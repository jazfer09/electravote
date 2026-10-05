import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Pause, 
  Play, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Users, 
  Search, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { TurnoutProgressBar } from '../components/TurnoutProgressBar';

export const AdminConsoleView: React.FC = () => {
  const { 
    electionConfig, 
    allUsers, 
    precincts, 
    positions, 
    adminToggleElectionStatus, 
    adminToggleLiveTallies, 
    resetDemoData,
    adminAddAuditLog
  } = useVoting();

  const [voterSearch, setVoterSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'voted' | 'pending'>('all');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  // Filter voters
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(voterSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(voterSearch.toLowerCase()) ||
      (u.studentId && u.studentId.toLowerCase().includes(voterSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'voted') return u.hasVoted;
    if (statusFilter === 'pending') return !u.hasVoted;
    return true;
  });

  const handleSimulateNewRegistration = async () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    await adminAddAuditLog(
      'VOTER_REGISTRATION_APPROVED',
      `Manual biometric registration verified for student ID STU-2026-${randomId}. Certified by Electoral Commission.`,
      'info'
    );
    alert(`New certified voter token generated: STU-2026-${randomId}`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Live Turnout */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Electoral Commission Command Center
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OFFICIAL ACCESS
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Role-Based Administration & Real-Time Elector Registry Oversight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmResetOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              title="Reset sample election data to pristine default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Emergency Election Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Election State Governance</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pause / Resume Voting */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm">Emergency Poll Freeze</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Current status:{' '}
                <span className={`font-bold font-mono ${electionConfig.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {electionConfig.status.toUpperCase()}
                </span>
              </p>
            </div>

            <button
              onClick={adminToggleElectionStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
                electionConfig.status === 'active'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {electionConfig.status === 'active' ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Voting</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume Voting</span>
                </>
              )}
            </button>
          </div>

          {/* Public Tally Visibility */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm">Public Live Tallies</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Status:{' '}
                <span className="font-bold font-mono text-sky-400">
                  {electionConfig.showLiveTalliesToVoters ? 'LIVE PUBLIC' : 'SEALED UNTIL CLOSE'}
                </span>
              </p>
            </div>

            <button
              onClick={() => adminToggleLiveTallies(!electionConfig.showLiveTalliesToVoters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              {electionConfig.showLiveTalliesToVoters ? (
                <>
                  <EyeOff className="w-4 h-4 text-slate-400" />
                  <span>Seal Tallies</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-sky-400" />
                  <span>Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Real-Time Turnout Monitor */}
      <TurnoutProgressBar />

      {/* 4. Certified Elector Roll Registry */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" />
              <span>Certified Elector Roll & Participation Roster</span>
            </h3>
            <p className="text-xs text-slate-400">
              Biometrically verified student voters and election staff.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={voterSearch}
                onChange={e => setVoterSearch(e.target.value)}
                placeholder="Search voter or ID..."
                className="bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('voted')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  statusFilter === 'voted' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Voted
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pending
              </button>
            </div>

            <button
              onClick={handleSimulateNewRegistration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-sky-300 text-xs font-semibold border border-blue-500/40 transition"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Elector</span>
            </button>
          </div>
        </div>

        {/* Voters Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Elector Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department / Precinct</th>
                <th className="py-3 px-4">2FA Method</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Verification Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-950/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{user.name}</div>
                    <div className="text-[11px] text-slate-400">{user.email}</div>
                  </td>
                  <td className="py-3 px-4 font-mono uppercase text-[10px] text-sky-400">
                    {user.role}
                  </td>
                  <td className="py-3 px-4 text-slate-300">{user.department}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 capitalize">
                    {user.mfaMethod}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.hasVoted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Ballot Sealed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-400">
                        <Clock className="w-3 h-3" />
                        Pending Vote
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">
                    {user.verificationCode || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Reset Modal */}
      {confirmResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Reset Demo Data?</h3>
            </div>
            <p className="text-xs text-slate-300 mb-5">
              This will restore all candidate vote counts, precincts, and voter statuses back to clean initial demo states.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                Reset Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
