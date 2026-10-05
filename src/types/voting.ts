export type UserRole = 'voter' | 'admin' | 'auditor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department: string;
  avatarUrl?: string;
  mfaMethod: 'authenticator' | 'sms' | 'passkey';
  hasVoted: boolean;
  votedAt?: string;
  ballotHash?: string;
  verificationCode?: string;
}

export interface Candidate {
  id: string;
  name: string;
  slate: string;
  positionId: string;
  bio: string;
  photoUrl?: string;
  platformPoints: string[];
  votesCount: number;
}

export interface Position {
  id: string;
  title: string;
  category: string;
  description: string;
  maxChoices: number;
  candidates: Candidate[];
}

export interface EncryptedBallot {
  id: string;
  ballotUid: string;
  timestamp: string;
  precinct: string;
  ballotHash: string; // SHA-256 tamper-evident hash
  previousHash: string; // Blockchain-style hash chain link
  encryptedPayload: string; // AES-GCM simulation block
  verificationCode: string; // Citizen receipt code: VOTE-XXXX-XXXX
  selectionsSummary: Record<string, string[]>; // PositionId -> CandidateIds
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  blockHash: string;
  severity: 'info' | 'notice' | 'critical';
}

export interface PrecinctTurnout {
  name: string;
  code: string;
  totalVoters: number;
  votedCount: number;
  targetTurnout: number;
}

export interface ElectionConfig {
  id: string;
  title: string;
  organization: string;
  status: 'active' | 'paused' | 'concluded';
  totalRegisteredVoters: number;
  startTime: string;
  endTime: string;
  showLiveTalliesToVoters: boolean;
  strictMFAEnforced: boolean;
}
