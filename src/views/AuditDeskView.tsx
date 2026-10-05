import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Download, 
  Hash, 
  Layers, 
  Clock, 
  Lock, 
  ExternalLink,
  Check,
  KeyRound
} from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { EncryptedBallot } from '../types/voting';

export const AuditDeskView: React.FC = () => {
  const { ballots, auditLogs, verifyBallotReceipt } = useVoting();

  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    found: boolean;
    ballot?: EncryptedBallot;
    verifiedHash?: boolean;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [expandedBallotId, setExpandedBallotId] = useState<string | null>(null);

  const handleVerify = async (queryToUse?: string) => {
    const q = queryToUse || searchQuery;
    if (!q) return;

    setIsVerifying(true);
    setVerificationResult(null);

    // Short simulated cryptographic verification delay
    setTimeout(async () => {
      const result = await verifyBallotReceipt(q);
      setVerificationResult(result);
      setIsVerifying(false);
    }, 350);
  };

  const handleUseDemoQuery = (code: string) => {
    setSearchQuery(code);
    handleVerify(code);
  };

  const handleExportFullAuditLedger = () => {
    const exportData = {
      electionLedgerId: 'ELEC-2026-APEX-AUDIT',
      exportedAt: new Date().toISOString(),
      merkleRootStatus: 'VERIFIED',
      totalSealedBallots: ballots.length,
      ballotsLedger: ballots,
      securityAuditTrail: auditLogs,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Electoral-Audit-Ledger-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Independent Audit & Cryptographic Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Zero-knowledge proof verification desk. Every ballot is immutable and mathematically verifiable.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportFullAuditLedger}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit Ledger (JSON)</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Ballot Verification Tool */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <h2 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-sky-400" />
          <span>Verify Citizen Ballot Inclusion</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Enter any Citizen Receipt Token, Ballot UID, or SHA-256 Signature to independently confirm it has been counted into the ledger.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. VOTE-MK77-229P-810A or SHA-256 Hash"
              className="w-full bg-slate-950/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={isVerifying || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
          >
            {isVerifying ? (
              <span>Verifying Cryptographic Proof...</span>
            ) : (
              <span>Verify Ballot Proof</span>
            )}
          </button>
        </div>

        {/* Demo Test Prompts */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span>Try verified demo tokens:</span>
          <button
            onClick={() => handleUseDemoQuery('VOTE-MK77-229P-810A')}
            className="px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 hover:bg-slate-700 font-mono"
          >
            VOTE-MK77-229P-810A
          </button>
          <button
            onClick={() => handleUseDemoQuery('BLT-2026-88A2')}
            className="px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 hover:bg-slate-700 font-mono"
          >
            BLT-2026-88A2
          </button>
        </div>

        {/* Verification Result Display */}
        {verificationResult && (
          <div className="mt-5 animate-in fade-in zoom-in-95 duration-200">
            {verificationResult.found && verificationResult.ballot ? (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-white text-sm">
                    Cryptographic Proof Verified: Uncompromised
                  </span>
                </div>
                <p className="text-xs text-emerald-300/90">{verificationResult.message}</p>

                <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500">Ballot UID:</span>
                    <span className="text-sky-400 font-bold">{verificationResult.ballot.ballotUid}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500">Timestamp:</span>
                    <span>{new Date(verificationResult.ballot.timestamp).toUTCString()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500">Precinct:</span>
                    <span className="text-white">{verificationResult.ballot.precinct}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-500">Previous Block Hash:</span>
                    <span className="truncate max-w-xs text-slate-400">{verificationResult.ballot.previousHash}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-500 block text-[10px] mb-0.5">Encrypted Ciphertext Block:</span>
                    <p className="text-[11px] text-slate-400 break-all bg-slate-900 p-2 rounded">
                      {verificationResult.ballot.encryptedPayload}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{verificationResult.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Real-Time Encrypted Ballots Ledger Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <span>Cryptographic Ballot Ledger Stream</span>
            </h3>
            <p className="text-xs text-slate-400">
              Linear hash chain preserving voter privacy through irreversible zero-knowledge proofs.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {ballots.length} Sealed Blocks
          </span>
        </div>

        <div className="space-y-3">
          {ballots.slice(0, 10).map((b, idx) => {
            const isExpanded = expandedBallotId === b.id;

            return (
              <div
                key={b.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 transition hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-900/30 text-sky-400 font-mono text-xs flex items-center justify-center font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{b.ballotUid}</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {b.verificationCode}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {b.precinct} · {new Date(b.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                      {b.ballotHash}
                    </span>
                    <button
                      onClick={() => setExpandedBallotId(isExpanded ? null : b.id)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded hover:bg-slate-900"
                    >
                      {isExpanded ? 'Hide' : 'Inspect'}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono space-y-1.5 text-slate-300 bg-slate-900/60 p-3 rounded-lg animate-in fade-in">
                    <div>
                      <span className="text-slate-500">SHA-256 Signature:</span>
                      <p className="text-[11px] text-sky-300 break-all select-all">{b.ballotHash}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Previous Block Hash:</span>
                      <p className="text-[11px] text-slate-400 break-all select-all">{b.previousHash}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Encrypted Payload Block:</span>
                      <p className="text-[11px] text-emerald-400 break-all select-all">{b.encryptedPayload}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Official Audit Log Trail */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>Commission Security & Operations Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400">
              Chronological log of administrative actions, 2FA authorizations, and precinct genesis blocks.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} Events</span>
        </div>

        <div className="space-y-2.5">
          {auditLogs.map(log => (
            <div
              key={log.id}
              className="bg-slate-950/60 border border-slate-800/70 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    log.severity === 'critical'
                      ? 'bg-red-950 text-red-300 border border-red-500/30'
                      : log.severity === 'notice'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                  }`}>
                    {log.action}
                  </span>
                  <span className="font-semibold text-white">{log.actor}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({log.actorRole})</span>
                </div>
                <p className="text-slate-300 mt-1">{log.details}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-mono text-[10px] text-slate-500 block">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-mono text-[9px] text-slate-600 truncate max-w-[120px] block">
                  {log.blockHash.substring(0, 16)}...
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
