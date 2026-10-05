import React, { useState } from 'react';
import { 
  CheckCircle, 
  ShieldCheck, 
  FileCheck2, 
  QrCode, 
  Copy, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  Lock, 
  Check, 
  Info, 
  UserCheck, 
  ChevronRight,
  Vote
} from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { TurnoutProgressBar } from '../components/TurnoutProgressBar';
import { EncryptedBallot } from '../types/voting';

interface VoterBallotViewProps {
  onGoToAuditDesk: () => void;
  onOpenLogin: () => void;
}

export const VoterBallotView: React.FC<VoterBallotViewProps> = ({ onGoToAuditDesk, onOpenLogin }) => {
  const { currentUser, positions, castBallot, electionConfig, ballots } = useVoting();

  // State for selections: { [positionId]: [candidateId, ...] }
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<EncryptedBallot | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // If user has already voted previously, retrieve their existing ballot or receipt info
  const existingBallot = ballots.find(
    b => b.ballotHash === currentUser?.ballotHash || b.verificationCode === currentUser?.verificationCode
  ) || submissionReceipt;

  // Single choice selector
  const handleSelectCandidate = (positionId: string, candidateId: string, maxChoices: number) => {
    if (currentUser?.hasVoted) return;

    setSelections(prev => {
      const current = prev[positionId] || [];

      if (maxChoices === 1) {
        // Toggle single choice
        return {
          ...prev,
          [positionId]: current.includes(candidateId) ? [] : [candidateId],
        };
      }

      // Multi-choice: add or remove up to maxChoices
      if (current.includes(candidateId)) {
        return {
          ...prev,
          [positionId]: current.filter(id => id !== candidateId),
        };
      } else {
        if (current.length < maxChoices) {
          return {
            ...prev,
            [positionId]: [...current, candidateId],
          };
        }
        return prev;
      }
    });
  };

  // Check if all positions have at least 1 selection
  const allPositionsAnswered = positions.every(pos => (selections[pos.id]?.length || 0) > 0);

  // Handle final submission
  const handleConfirmSealBallot = async () => {
    setIsSubmitting(true);
    const result = await castBallot(selections);
    setIsSubmitting(false);

    if (result.success && result.receipt) {
      setSubmissionReceipt(result.receipt);
      setIsReviewModalOpen(false);
    } else {
      alert(result.message || 'Submission failed');
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadReceipt = (ballot: EncryptedBallot) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(ballot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Ballot-Receipt-${ballot.ballotUid}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Real-time turnout progress bar */}
      <TurnoutProgressBar />

      {/* 2. Voter Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">
                {currentUser ? currentUser.name : 'Guest Observer'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {currentUser?.role ? currentUser.role.toUpperCase() : 'NOT SIGNED IN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Precinct: <span className="text-slate-200">{currentUser?.department || 'General Roll'}</span>
              {currentUser?.studentId && ` · ID: ${currentUser.studentId}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?.hasVoted ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Official Ballot Sealed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Eligible to Cast 1 Ballot</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. SCENARIO A: User has ALREADY voted (Display Cryptographic Receipt Card) */}
      {(currentUser?.hasVoted || submissionReceipt) && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Official Encrypted Ballot Receipt
              </h3>
              <p className="text-xs text-slate-400">
                Your vote is permanently sealed with zero-knowledge cryptographic authentication.
              </p>
            </div>
          </div>

          {/* Receipt Data Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                  Ballot UID
                </span>
                <span className="font-mono font-bold text-sky-400 text-sm">
                  {existingBallot?.ballotUid || currentUser?.verificationCode || 'BLT-2026-CONFIRMED'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                  Verification Code (Citizen Token)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-white text-sm bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                    {existingBallot?.verificationCode || currentUser?.verificationCode || 'VOTE-MK77-229P-810A'}
                  </span>
                  <button
                    onClick={() => handleCopyCode(existingBallot?.verificationCode || currentUser?.verificationCode || '')}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Copy verification code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedHash && <span className="text-[10px] text-emerald-400">Copied!</span>}
                </div>
              </div>

              <div className="sm:col-span-2">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                  SHA-256 Digital Signature Hash
                </span>
                <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 mt-1 select-all">
                  {existingBallot?.ballotHash || currentUser?.ballotHash || '3a9f029c7b801a2d109f6b49e1e779a1d4b684e4e93d567bb8e7880949f99201'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                  Timestamp Recorded
                </span>
                <span className="font-mono text-slate-300">
                  {existingBallot?.timestamp ? new Date(existingBallot.timestamp).toLocaleString() : 'October 5, 2026, 08:15:22 UTC'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-semibold">
                  Registered Precinct
                </span>
                <span className="text-slate-300">{currentUser?.department || 'College of Engineering'}</span>
              </div>
            </div>

            {/* Simulated QR Code & Payload */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white p-1 rounded-xl shrink-0 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-950" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200 block">Zero-Knowledge Verification</span>
                  <p className="text-slate-400 text-[11px]">
                    Your candidate picks are encrypted. Anyone can verify your ballot is counted without seeing whom you voted for.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {existingBallot && (
                  <button
                    onClick={() => handleDownloadReceipt(existingBallot)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON</span>
                  </button>
                )}

                <button
                  onClick={onGoToAuditDesk}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Audit Desk</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SCENARIO B: Voting Ballot Form (if not voted yet) */}
      {!currentUser?.hasVoted && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Official Ballot Paper</h2>
              <p className="text-xs text-slate-400">
                Mark your choices for each position. Ballots are cryptographically signed upon sealing.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-sky-400 font-bold">
                {Object.keys(selections).filter(k => selections[k]?.length > 0).length} of {positions.length}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase tracking-wider">Completed</span>
            </div>
          </div>

          {/* List of Positions */}
          <div className="space-y-6">
            {positions.map((position, pIdx) => {
              const selectedCandIds = selections[position.id] || [];

              return (
                <div
                  key={position.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 pb-3 border-b border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest block font-mono">
                        Position #{pIdx + 1} · {position.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">{position.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{position.description}</p>
                    </div>
                    <div className="self-start sm:self-auto shrink-0 mt-2 sm:mt-0">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800">
                        {position.maxChoices === 1 ? 'Select 1 Candidate' : `Select up to ${position.maxChoices} Candidates`}
                      </span>
                    </div>
                  </div>

                  {/* Candidates Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {position.candidates.map(candidate => {
                      const isSelected = selectedCandIds.includes(candidate.id);

                      return (
                        <div
                          key={candidate.id}
                          onClick={() => handleSelectCandidate(position.id, candidate.id, position.maxChoices)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-900/20'
                              : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                {/* Candidate Photo or Fallback */}
                                {candidate.photoUrl ? (
                                  <img
                                    src={candidate.photoUrl}
                                    alt={candidate.name}
                                    referrerPolicy="no-referrer"
                                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-lg shrink-0">
                                    {candidate.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
                                    {candidate.name}
                                  </h4>
                                  <span className="text-[11px] text-blue-400 font-medium block mt-0.5">
                                    {candidate.slate}
                                  </span>
                                </div>
                              </div>

                              {/* Radio or Checkbox visual */}
                              <div
                                className={`w-5 h-5 rounded-${position.maxChoices === 1 ? 'full' : 'md'} border flex items-center justify-center transition ${
                                  isSelected
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'border-slate-600 bg-slate-900'
                                }`}
                              >
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 line-clamp-3 mb-3">{candidate.bio}</p>

                            {/* Platform points */}
                            <div className="space-y-1 mb-2">
                              {candidate.platformPoints.map((point, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                                  <span className="text-sky-400 font-bold">·</span>
                                  <span>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <span className="text-slate-500">Party Slate: {candidate.slate}</span>
                            <span className={`font-semibold ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>
                              {isSelected ? 'Selected' : 'Click to select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Action Bar */}
          <div className="sticky bottom-4 z-30 bg-slate-950/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>
                {allPositionsAnswered
                  ? 'All positions selected. Ready to seal ballot.'
                  : `Please select candidates for all positions (${Object.keys(selections).filter(k => selections[k]?.length > 0).length}/${positions.length} complete).`}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!currentUser && (
                <button
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                >
                  Sign In to Cast
                </button>
              )}

              <button
                disabled={!allPositionsAnswered || isSubmitting}
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition disabled:opacity-50 disabled:pointer-events-none"
              >
                <Vote className="w-4 h-4" />
                <span>Review & Cryptographically Seal Ballot</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Review & Confirmation Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Confirm & Seal Ballot</h3>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3">
              Please inspect your chosen candidates. Once sealed with your cryptographic digital signature, this ballot is irreversible and cannot be changed.
            </p>

            {/* Choices Summary */}
            <div className="my-4 space-y-3">
              {positions.map(pos => {
                const candIds = selections[pos.id] || [];
                const chosen = pos.candidates.filter(c => candIds.includes(c.id));

                return (
                  <div key={pos.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block font-mono">
                      {pos.title}
                    </span>
                    <div className="mt-1 font-semibold text-white">
                      {chosen.length > 0 ? (
                        chosen.map(c => (
                          <div key={c.id} className="text-sky-300 flex items-center justify-between">
                            <span>{c.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{c.slate}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-amber-400">Abstain / No selection</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cryptographic Ledger Warning */}
            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-2 mb-5">
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                Your vote will generate a unique SHA-256 ballot hash and zero-knowledge citizen verification token for audit integrity.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmSealBallot}
                disabled={isSubmitting}
                className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Computing SHA-256 Seal...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm & Commit to Ledger</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
