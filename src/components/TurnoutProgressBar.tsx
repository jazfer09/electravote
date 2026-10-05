import React from 'react';
import { Users, Activity, TrendingUp, CheckCircle, Radio } from 'lucide-react';
import { useVoting } from '../context/VotingContext';

interface TurnoutProgressBarProps {
  compact?: boolean;
}

export const TurnoutProgressBar: React.FC<TurnoutProgressBarProps> = ({ compact = false }) => {
  const { 
    totalBallotsCount, 
    overallTurnoutPercentage, 
    electionConfig, 
    precincts, 
    isLiveSimulating,
    toggleLiveSimulation 
  } = useVoting();

  const registeredTotal = electionConfig.totalRegisteredVoters;
  const remainingVotes = Math.max(0, registeredTotal - totalBallotsCount);

  if (compact) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">Live Election Turnout</span>
          </div>
          <span className="font-mono font-bold text-sky-400 tabular-nums">
            {overallTurnoutPercentage}%
          </span>
        </div>

        {/* Outer Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, overallTurnoutPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono tabular-nums">
          <span>{totalBallotsCount.toLocaleString()} Cast</span>
          <span>{registeredTotal.toLocaleString()} Registered</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Real-Time Turnout Ledger
            </span>
            {isLiveSimulating && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-300 bg-sky-950/70 border border-sky-500/30 px-2 py-0.5 rounded-full animate-in fade-in">
                <Activity className="w-3 h-3 animate-spin" />
                Live Feed Active
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
            Student Body Election Participation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cryptographically sealed ballots recorded into the decentralized precinct ledger.
          </p>
        </div>

        {/* Live Simulation Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={toggleLiveSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 border ${
              isLiveSimulating
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveSimulating ? 'animate-pulse' : ''}`} />
            <span>{isLiveSimulating ? 'Pause Simulation' : 'Simulate Live Votes'}</span>
          </button>
        </div>
      </div>

      {/* Main Big Metric Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Participation Rate
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums">
              {overallTurnoutPercentage}%
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Quorum reached (&gt;50%)
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Ballots Sealed
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
              {totalBallotsCount.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            verified on-chain
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Registered Roll
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono tabular-nums">
              {registeredTotal.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            biometrically credentialed
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Awaiting Ballots
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              {remainingVotes.toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80 mt-1 block">
            active eligible voters
          </span>
        </div>
      </div>

      {/* Main Master Progress Bar */}
      <div className="mt-2">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
          <div className="flex items-center gap-1.5">
            <span>Overall Turnout Progress</span>
            <span className="text-slate-500 font-mono tabular-nums">
              ({totalBallotsCount.toLocaleString()} of {registeredTotal.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Target: 75%</span>
            <span className="font-mono font-bold text-sky-400 tabular-nums text-sm">
              {overallTurnoutPercentage}%
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div className="relative w-full bg-slate-950 h-5 sm:h-6 rounded-xl overflow-hidden p-1 border border-slate-700/60 shadow-inner">
          {/* Target marker flag at 75% */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-amber-400/80 z-20 pointer-events-none"
            style={{ left: '75%' }}
            title="Quorum Target: 75%"
          />
          
          {/* Animated Fill Bar */}
          <div
            className="h-full bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400 rounded-lg shadow-lg shadow-blue-500/30 transition-all duration-700 ease-out relative"
            style={{ width: `${Math.min(100, overallTurnoutPercentage)}%` }}
          >
            {/* Subtle moving shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Precinct / College breakdown progress bars */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Turnout by Academic Precinct
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Updated continuously</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {precincts.map(p => {
            const pct = Math.min(100, Number(((p.votedCount / p.totalVoters) * 100).toFixed(1)));
            const isTargetMet = pct >= p.targetTurnout;

            return (
              <div key={p.code} className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-200 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.code}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-sky-400 tabular-nums text-xs">
                      {pct}%
                    </span>
                    <span className="block text-[10px] text-slate-500 font-mono tabular-nums">
                      {p.votedCount}/{p.totalVoters}
                    </span>
                  </div>
                </div>

                {/* Sub-bar */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTargetMet
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        : 'bg-gradient-to-r from-blue-600 to-sky-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
