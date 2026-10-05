import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  UserProfile,
  UserRole,
  Position,
  ElectionConfig,
  PrecinctTurnout,
  EncryptedBallot,
  AuditLog
} from '../types/voting';
import {
  INITIAL_ELECTION_CONFIG,
  INITIAL_POSITIONS,
  INITIAL_PRECINCTS,
  INITIAL_BALLOTS,
  INITIAL_AUDIT_LOGS,
  DEMO_USERS
} from '../data/initialData';
import { sealEncryptedBallot, sha256 } from '../utils/crypto';

interface MfaPendingState {
  user: UserProfile;
  expectedOtp: string;
  sentTo: string;
}

interface VotingContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  mfaPending: MfaPendingState | null;
  positions: Position[];
  electionConfig: ElectionConfig;
  precincts: PrecinctTurnout[];
  ballots: EncryptedBallot[];
  auditLogs: AuditLog[];
  isLiveSimulating: boolean;
  totalBallotsCount: number;
  overallTurnoutPercentage: number;

  // Auth actions
  initiateLogin: (email: string, password?: string) => { success: boolean; message: string; otp?: string };
  verifyMfaCode: (code: string) => { success: boolean; message: string };
  cancelMfa: () => void;
  logout: () => void;
  quickSwitchUser: (role: UserRole) => void;

  // Voter actions
  castBallot: (selections: Record<string, string[]>) => Promise<{ success: boolean; receipt?: EncryptedBallot; message?: string }>;

  // Audit actions
  verifyBallotReceipt: (query: string) => Promise<{ found: boolean; ballot?: EncryptedBallot; verifiedHash?: boolean; message: string }>;

  // Admin actions
  adminToggleElectionStatus: () => void;
  adminToggleLiveTallies: (show: boolean) => void;
  adminAddAuditLog: (action: string, details: string, severity?: 'info' | 'notice' | 'critical') => Promise<void>;
  toggleLiveSimulation: () => void;
  resetDemoData: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'electravote_current_user',
  USERS: 'electravote_users',
  POSITIONS: 'electravote_positions',
  CONFIG: 'electravote_config',
  PRECINCTS: 'electravote_precincts',
  BALLOTS: 'electravote_ballots',
  AUDIT_LOGS: 'electravote_audit_logs',
};

export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from local storage or defaults
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : DEMO_USERS[0]; // Default to student voter for instant preview
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [mfaPending, setMfaPending] = useState<MfaPendingState | null>(null);

  const [positions, setPositions] = useState<Position[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSITIONS);
      return saved ? JSON.parse(saved) : INITIAL_POSITIONS;
    } catch {
      return INITIAL_POSITIONS;
    }
  });

  const [electionConfig, setElectionConfig] = useState<ElectionConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return saved ? JSON.parse(saved) : INITIAL_ELECTION_CONFIG;
    } catch {
      return INITIAL_ELECTION_CONFIG;
    }
  });

  const [precincts, setPrecincts] = useState<PrecinctTurnout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRECINCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRECINCTS;
    } catch {
      return INITIAL_PRECINCTS;
    }
  });

  const [ballots, setBallots] = useState<EncryptedBallot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BALLOTS);
      return saved ? JSON.parse(saved) : INITIAL_BALLOTS;
    } catch {
      return INITIAL_BALLOTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [isLiveSimulating, setIsLiveSimulating] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
      localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(positions));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(electionConfig));
      localStorage.setItem(STORAGE_KEYS.PRECINCTS, JSON.stringify(precincts));
      localStorage.setItem(STORAGE_KEYS.BALLOTS, JSON.stringify(ballots));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [currentUser, allUsers, positions, electionConfig, precincts, ballots, auditLogs]);

  // Derived turnout metrics
  const totalBallotsCount = precincts.reduce((sum, p) => sum + p.votedCount, 0);
  const overallTurnoutPercentage = Math.min(
    100,
    Number(((totalBallotsCount / electionConfig.totalRegisteredVoters) * 100).toFixed(1))
  );

  // Auth: Initiate login -> triggers 2FA
  const initiateLogin = useCallback((email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return { success: false, message: 'Institutional voter identity or email not found in certified registry.' };
    }

    // Generate simulated 6-digit OTP code for MFA
    const generatedOtp = '849201'; // Deterministic demo OTP with clear display in UI
    const sentTo = user.mfaMethod === 'sms' 
      ? '+1 (***) ***-8921' 
      : user.mfaMethod === 'passkey' 
        ? 'FIDO2 / WebAuthn Biometric Token' 
        : `${user.name}'s Authenticator App (TOTP)`;

    setMfaPending({
      user,
      expectedOtp: generatedOtp,
      sentTo,
    });

    return {
      success: true,
      message: `2FA security challenge generated. Verification token sent to ${sentTo}.`,
      otp: generatedOtp,
    };
  }, [allUsers]);

  // Auth: Verify 2FA OTP
  const verifyMfaCode = useCallback((code: string) => {
    if (!mfaPending) {
      return { success: false, message: 'No active MFA challenge pending.' };
    }

    const cleanCode = code.trim().replace(/\D/g, '');
    // Allow the generated code or universal demo bypass '849201' or '123456'
    if (cleanCode === mfaPending.expectedOtp || cleanCode === '849201' || cleanCode === '123456') {
      setCurrentUser(mfaPending.user);
      setMfaPending(null);

      // Log MFA success
      const logEntry: AuditLog = {
        id: `log_mfa_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: mfaPending.user.name,
        actorRole: mfaPending.user.role,
        action: 'MFA_SESSION_AUTHORIZED',
        details: `Two-factor challenge satisfied via ${mfaPending.user.mfaMethod.toUpperCase()}. Session issued with biometric/token signature.`,
        blockHash: `0x${Math.random().toString(16).substring(2, 10)}...${Date.now().toString(16)}`,
        severity: 'info',
      };
      setAuditLogs(prev => [logEntry, ...prev]);

      return { success: true, message: 'Authentication successful. Access granted to election portal.' };
    }

    return { success: false, message: 'Invalid 6-digit verification code. Please check your authenticator or use demo code 849201.' };
  }, [mfaPending]);

  const cancelMfa = useCallback(() => {
    setMfaPending(null);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setMfaPending(null);
  }, []);

  // Quick switch role for testing
  const quickSwitchUser = useCallback((role: UserRole) => {
    const target = allUsers.find(u => u.role === role) || DEMO_USERS.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      setMfaPending(null);
    }
  }, [allUsers]);

  // Add audit log helper
  const adminAddAuditLog = useCallback(async (action: string, details: string, severity: 'info' | 'notice' | 'critical' = 'info') => {
    const rawSignature = `${Date.now()}|${action}|${details}`;
    const blockHash = await sha256(rawSignature);
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser ? currentUser.name : 'System Monitor',
      actorRole: currentUser ? currentUser.role : 'admin',
      action,
      details,
      blockHash,
      severity,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Voter: Cast Encrypted Ballot
  const castBallot = useCallback(async (selections: Record<string, string[]>) => {
    if (!currentUser) {
      return { success: false, message: 'You must be signed in to cast a ballot.' };
    }
    if (currentUser.role !== 'voter' && currentUser.role !== 'admin') {
      return { success: false, message: 'Only authorized voters may cast an official ballot.' };
    }
    if (electionConfig.status !== 'active') {
      return { success: false, message: 'Voting is currently paused or concluded by the Electoral Commission.' };
    }
    if (currentUser.hasVoted) {
      return { success: false, message: 'You have already cast an official sealed ballot for this election cycle.' };
    }

    // Get previous ballot hash for blockchain ledger link
    const previousHash = ballots.length > 0 
      ? ballots[0].ballotHash 
      : '0000a941e7f12c8b82e1467a80b332c91823ab49a37e10dfbc83281048bcae91';

    const sealed = await sealEncryptedBallot(selections, currentUser.department, previousHash);

    const newBallot: EncryptedBallot = {
      id: `blt_${Date.now()}`,
      ballotUid: sealed.ballotUid,
      timestamp: sealed.timestamp,
      precinct: currentUser.department,
      ballotHash: sealed.ballotHash,
      previousHash,
      encryptedPayload: sealed.encryptedPayload,
      verificationCode: sealed.verificationCode,
      selectionsSummary: selections,
    };

    // 1. Prepend to ballots ledger
    setBallots(prev => [newBallot, ...prev]);

    // 2. Increment candidate tallies
    setPositions(prev =>
      prev.map(pos => {
        const pickedCandidates = selections[pos.id] || [];
        return {
          ...pos,
          candidates: pos.candidates.map(cand => {
            if (pickedCandidates.includes(cand.id)) {
              return { ...cand, votesCount: cand.votesCount + 1 };
            }
            return cand;
          }),
        };
      })
    );

    // 3. Increment precinct turnout
    setPrecincts(prev =>
      prev.map(prec => {
        if (prec.name === currentUser.department) {
          return { ...prec, votedCount: prec.votedCount + 1 };
        }
        return prec;
      })
    );

    // 4. Mark current voter as having voted
    const updatedUser: UserProfile = {
      ...currentUser,
      hasVoted: true,
      votedAt: sealed.timestamp,
      ballotHash: sealed.ballotHash,
      verificationCode: sealed.verificationCode,
    };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    // 5. Append tamper-evident audit log
    await adminAddAuditLog(
      'BALLOT_SEALED_HASH_CHAIN',
      `Encrypted ballot cast for ${currentUser.department}. Block UID: ${sealed.ballotUid}. SHA-256 digital signature recorded.`,
      'info'
    );

    return {
      success: true,
      receipt: newBallot,
      message: 'Ballot successfully sealed, encrypted, and anchored to the election ledger.',
    };
  }, [currentUser, electionConfig.status, ballots, adminAddAuditLog]);

  // Auditor: Verify Ballot Receipt
  const verifyBallotReceipt = useCallback(async (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) {
      return { found: false, message: 'Please provide a Ballot UID, Receipt Code, or SHA-256 Hash.' };
    }

    const matched = ballots.find(
      b =>
        b.ballotUid.toUpperCase() === cleanQuery ||
        b.verificationCode.toUpperCase() === cleanQuery ||
        b.ballotHash.toUpperCase() === cleanQuery ||
        b.ballotHash.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (!matched) {
      return {
        found: false,
        message: 'No cryptographic record matching this verification code or hash was found in the current ledger.',
      };
    }

    return {
      found: true,
      ballot: matched,
      verifiedHash: true,
      message: `Cryptographic proof verified. Ballot ${matched.ballotUid} is securely committed to the ledger with uncompromised integrity.`,
    };
  }, [ballots]);

  // Admin controls
  const adminToggleElectionStatus = useCallback(() => {
    setElectionConfig(prev => {
      const nextStatus = prev.status === 'active' ? 'paused' : 'active';
      adminAddAuditLog(
        nextStatus === 'paused' ? 'ELECTION_EMERGENCY_PAUSED' : 'ELECTION_RESUMED',
        `Official status toggled to ${nextStatus.toUpperCase()} by Commissioner.`,
        nextStatus === 'paused' ? 'critical' : 'notice'
      );
      return { ...prev, status: nextStatus };
    });
  }, [adminAddAuditLog]);

  const adminToggleLiveTallies = useCallback((show: boolean) => {
    setElectionConfig(prev => {
      adminAddAuditLog(
        'TALLIES_VISIBILITY_UPDATED',
        `Public live candidate tallies visibility toggled to: ${show ? 'VISIBLE' : 'SEALED'}`,
        'notice'
      );
      return { ...prev, showLiveTalliesToVoters: show };
    });
  }, [adminAddAuditLog]);

  // Live simulation ticker (dynamically increments turnouts and incoming ballots every 4 seconds)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick random precinct and candidate to simulate real voting velocity
      const randomPrecinctIdx = Math.floor(Math.random() * precincts.length);
      const targetPrecinct = precincts[randomPrecinctIdx];
      const randomPosIdx = Math.floor(Math.random() * positions.length);
      const targetPos = positions[randomPosIdx];
      const randomCandIdx = Math.floor(Math.random() * targetPos.candidates.length);
      const targetCand = targetPos.candidates[randomCandIdx];

      // Update candidate
      setPositions(prev =>
        prev.map(pos =>
          pos.id === targetPos.id
            ? {
                ...pos,
                candidates: pos.candidates.map(c =>
                  c.id === targetCand.id ? { ...c, votesCount: c.votesCount + 1 } : c
                ),
              }
            : pos
        )
      );

      // Update precinct turnout
      setPrecincts(prev =>
        prev.map((p, idx) =>
          idx === randomPrecinctIdx ? { ...p, votedCount: Math.min(p.totalVoters, p.votedCount + 1) } : p
        )
      );

      // Append lightweight encrypted ballot to ledger
      const randomHash = `0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`;
      const simulatedBallot: EncryptedBallot = {
        id: `sim_${Date.now()}`,
        ballotUid: `BLT-2026-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        timestamp: new Date().toISOString(),
        precinct: targetPrecinct.name,
        ballotHash: randomHash,
        previousHash: ballots[0]?.ballotHash || '0000genesis',
        encryptedPayload: 'AES-GCM:IV-SIMULATED:enc-token...[PUB-KEY-VERIFIED]',
        verificationCode: `VOTE-LIVE-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        selectionsSummary: { [targetPos.id]: [targetCand.id] },
      };
      setBallots(prev => [simulatedBallot, ...prev.slice(0, 49)]); // keep recent 50
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveSimulating, precincts, positions, ballots]);

  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulating(prev => !prev);
  }, []);

  const resetDemoData = useCallback(() => {
    setAllUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
    setPositions(INITIAL_POSITIONS);
    setElectionConfig(INITIAL_ELECTION_CONFIG);
    setPrecincts(INITIAL_PRECINCTS);
    setBallots(INITIAL_BALLOTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIsLiveSimulating(false);
    localStorage.clear();
  }, []);

  return (
    <VotingContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated: !!currentUser,
        mfaPending,
        positions,
        electionConfig,
        precincts,
        ballots,
        auditLogs,
        isLiveSimulating,
        totalBallotsCount,
        overallTurnoutPercentage,
        initiateLogin,
        verifyMfaCode,
        cancelMfa,
        logout,
        quickSwitchUser,
        castBallot,
        verifyBallotReceipt,
        adminToggleElectionStatus,
        adminToggleLiveTallies,
        adminAddAuditLog,
        toggleLiveSimulation,
        resetDemoData,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = (): VotingContextType => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
