import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Building2, 
  Award, 
  Radio, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { TurnoutProgressBar } from '../components/TurnoutProgressBar';

export const TurnoutDashboardView: React.FC = () => {
  const { 
    positions, 
    precincts, 
    totalBallotsCount, 
    overallTurnoutPercentage, 
    electionConfig, 
    isLiveSimulating, 
    toggleLiveSimulation 
  } = useVoting();

  const [selectedPositionId, setSelectedPositionId] = useState<string>(positions[0]?.id || 'pos_president');

  const currentPosition = positions.find(p => p.id === selectedPositionId) || positions[0];
  const totalVotesForPos = currentPosition ? currentPosition.candidates.reduce((sum, c) => sum + c.votesCount, 0) : 1;

  // Sort candidates by votes desc
  const sortedCandidates = currentPosition ? [...currentPosition.candidates].sort((a, b) => b.votesCount - a.votesCount) : [];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Main Turnout Progress Section */}
      <TurnoutProgressBar />

      {/* 2. Turnout Analytics & Velocity Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Voting Velocity
            </span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {isLiveSimulating ? '18' : '14'}
            </span>
            <span className="text-xs text-slate-400 font-medium">ballots / minute</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Peak hours: 10:00 AM – 2:00 PM across all 4 collegiate terminals.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Election Status
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${electionConfig.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-white capitalize">
            {electionConfig.status} Polls
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Closing: <span className="text-slate-200 font-mono">Oct 6, 2026, 18:00 UTC</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Decentralized Quorum
            </span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            Quorum Validated
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Constitutional 50%+1 minimum turnout exceeded by +{Math.max(0, overallTurnoutPercentage - 50).toFixed(1)}%.
          </p>
        </div>
      </div>

      {/* 3. Real-Time Results & Candidate Standings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Live Ballot Tallies & Position Standings
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tally stream synchronized with unspent verifiable ballot receipts.
            </p>
          </div>

          {/* Position Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {positions.map(pos => (
              <button
                key={pos.id}
                onClick={() => setSelectedPositionId(pos.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedPositionId === pos.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {pos.title.replace('University Council ', '').replace('Student Body ', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Tallies Bar Graph */}
        <div className="mt-5 space-y-4">
          {sortedCandidates.map((cand, idx) => {
            const pct = totalVotesForPos > 0 ? Number(((cand.votesCount / totalVotesForPos) * 100).toFixed(1)) : 0;
            const isLeader = idx === 0;

            return (
              <div key={cand.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 transition hover:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                      isLeader ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                          {cand.name}
                        </h4>
                        {isLeader && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            Leading
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{cand.slate}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-lg sm:text-xl font-bold font-mono text-sky-400 tabular-nums">
                      {cand.votesCount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5 font-mono">({pct}%)</span>
                  </div>
                </div>

                {/* Percentage Bar */}
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isLeader
                        ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-amber-400'
                        : 'bg-gradient-to-r from-slate-700 to-slate-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Precinct Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Precinct Participation Ledger</h3>
            <p className="text-xs text-slate-400">Departmental breakdown of registered electors and cast ballots.</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{precincts.length} Active Precincts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Precinct / College</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4 text-right">Ballots Cast</th>
                <th className="py-3 px-4 text-right">Registered</th>
                <th className="py-3 px-4 text-right">Turnout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {precincts.map(p => {
                const pct = Math.min(100, Number(((p.votedCount / p.totalVoters) * 100).toFixed(1)));
                const isMet = pct >= p.targetTurnout;

                return (
                  <tr key={p.code} className="hover:bg-slate-950/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{p.code}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sky-400 tabular-nums">
                      {p.votedCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {p.totalVoters.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                      <span className={isMet ? 'text-emerald-400' : 'text-sky-300'}>{pct}%</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        isMet
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                      }`}>
                        {isMet ? 'Target Reached' : 'In Progress'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
