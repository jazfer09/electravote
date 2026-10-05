import { Position, UserProfile, EncryptedBallot, AuditLog, PrecinctTurnout, ElectionConfig } from '../types/voting';

// Imported images from assets
import avatarCandidateSarah from '../assets/images/avatar_candidate_sarah_1791194181957.jpg';
import avatarCandidateDavid from '../assets/images/avatar_candidate_david_1791194193068.jpg';

export const INITIAL_ELECTION_CONFIG: ElectionConfig = {
  id: 'ELEC-2026-APEX',
  title: '2026 University Student Council & Board Elections',
  organization: 'Apex Technological University Electoral Commission',
  status: 'active',
  totalRegisteredVoters: 4850,
  startTime: '2026-10-05T08:00:00Z',
  endTime: '2026-10-06T18:00:00Z',
  showLiveTalliesToVoters: true,
  strictMFAEnforced: true,
};

export const INITIAL_PRECINCTS: PrecinctTurnout[] = [
  { name: 'College of Engineering & Tech', code: 'PREC-ENG', totalVoters: 1620, votedCount: 1248, targetTurnout: 85 },
  { name: 'College of Health Sciences', code: 'PREC-MED', totalVoters: 1100, votedCount: 884, targetTurnout: 80 },
  { name: 'College of Business & Economics', code: 'PREC-BUS', totalVoters: 1250, votedCount: 820, targetTurnout: 75 },
  { name: 'College of Arts & Sciences', code: 'PREC-ART', totalVoters: 880, votedCount: 615, targetTurnout: 70 },
];

export const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos_president',
    title: 'University Council President',
    category: 'Executive Council',
    description: 'Chief executive officer representing the entire student body in university senate policies.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_sarah_lin',
        name: 'Sarah Lin',
        slate: 'Forward Coalition',
        positionId: 'pos_president',
        bio: 'Senior Computer Engineering major with 3 terms on the Student Senate. Focused on transparent budget allocations, campus-wide 24/7 library power hubs, and automated mental health counseling access.',
        photoUrl: avatarCandidateSarah,
        platformPoints: [
          'Transparent open-ledger quarterly council spending',
          'Zero-fee campus digital course materials repository',
          '24/7 study hubs with emergency shuttle routes'
        ],
        votesCount: 1845,
      },
      {
        id: 'cand_david_mendoza',
        name: 'David Mendoza',
        slate: 'Alliance for Progress',
        positionId: 'pos_president',
        bio: 'Business Economics scholar and varsity team captain. Championing student athlete stipends, career tech incubators, and subsidized student transit passes.',
        photoUrl: avatarCandidateDavid,
        platformPoints: [
          'High-speed Wi-Fi 7 expansion in all student dormitories',
          'Alumni-funded startup micro-grant programs ($50,000 pool)',
          'Expanded campus dining subsidies and eco-canteens'
        ],
        votesCount: 1422,
      },
      {
        id: 'cand_maya_reyes',
        name: 'Maya Reyes',
        slate: 'Vanguard Independent',
        positionId: 'pos_president',
        bio: 'Biomedical Science junior and environmental activist. Advocating for zero-waste campus dining, direct digital referendums on tuition, and disability access ramps.',
        photoUrl: '',
        platformPoints: [
          'Direct quarterly student body digital referendums',
          'Renewable solar micro-grid pilot for research labs',
          'Universal accessibility audit for all older halls'
        ],
        votesCount: 300,
      }
    ]
  },
  {
    id: 'pos_vice_president',
    title: 'Executive Vice President',
    category: 'Executive Council',
    description: 'Leads internal council committees, student club affiliations, and academic grievances.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_chloe_valencia',
        name: 'Chloe Valencia',
        slate: 'Forward Coalition',
        positionId: 'pos_vice_president',
        bio: 'Industrial Engineering honors student and lead organizer for University Innovation Week.',
        photoUrl: '',
        platformPoints: [
          'Streamlined budget disbursement for student organizations within 48 hours',
          'Unified campus club portal with automated room bookings'
        ],
        votesCount: 1910,
      },
      {
        id: 'cand_marcus_sterling',
        name: 'Marcus Sterling',
        slate: 'Alliance for Progress',
        positionId: 'pos_vice_president',
        bio: 'Political Science junior and debater focusing on student legal rights and mediation services.',
        photoUrl: '',
        platformPoints: [
          'Free student legal clinic for off-campus tenant disputes',
          'Academic appeal fast-track ombudsman office'
        ],
        votesCount: 1657,
      }
    ]
  },
  {
    id: 'pos_secretary_general',
    title: 'Secretary General',
    category: 'Administrative Board',
    description: 'Responsible for public disclosures, council records, voting minutes, and official communiques.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_liam_chen',
        name: 'Liam Chen',
        slate: 'Forward Coalition',
        positionId: 'pos_secretary_general',
        bio: 'Data Science junior specializing in open data systems and FOI compliance.',
        photoUrl: '',
        platformPoints: [
          'Public minutes published within 24 hours in searchable JSON/PDF format',
          'Real-time council resolution tracker with mobile alerts'
        ],
        votesCount: 2012,
      },
      {
        id: 'cand_sofia_alvarez',
        name: 'Sofia Alvarez',
        slate: 'Alliance for Progress',
        positionId: 'pos_secretary_general',
        bio: 'Communications major and former editor of the university herald.',
        photoUrl: '',
        platformPoints: [
          'Weekly video briefings and open student mic forum streaming',
          'Campus-wide SMS emergency advisory overhaul'
        ],
        votesCount: 1555,
      }
    ]
  },
  {
    id: 'pos_representatives',
    title: 'Student Body Board of Regents Representatives',
    category: 'Legislative Assembly',
    description: 'Vote for up to TWO (2) representatives to sit on the University Board of Trustees.',
    maxChoices: 2,
    candidates: [
      {
        id: 'cand_julian_tech',
        name: 'Julian Ramos',
        slate: 'Engineering & Technology Slate',
        positionId: 'pos_representatives',
        bio: 'Advocating for lab equipment upgrades, modern GPU clusters, and student patent protections.',
        photoUrl: '',
        platformPoints: ['Free access to cloud compute clusters for STEM theses', 'Safety equipment grants for student labs'],
        votesCount: 2420,
      },
      {
        id: 'cand_alyssa_biz',
        name: 'Alyssa Ramos',
        slate: 'Business & Management Slate',
        positionId: 'pos_representatives',
        bio: 'Focused on paid internship matching and career development corporate sponsorships.',
        photoUrl: '',
        platformPoints: ['Guaranteed paid co-op placements with accredited partners', 'Financial literacy bootcamps'],
        votesCount: 1980,
      },
      {
        id: 'cand_carlos_health',
        name: 'Carlos Gutierrez',
        slate: 'Health Sciences Slate',
        positionId: 'pos_representatives',
        bio: 'Advocating for mental health days and clinical stipend protections.',
        photoUrl: '',
        platformPoints: ['3 mental health rest days per semester with no grading penalties', 'Subsidized hospital duty scrubs & vaccines'],
        votesCount: 1720,
      }
    ]
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'usr_voter_elena',
    name: 'Elena Vance',
    email: 'voter@university.edu',
    role: 'voter',
    studentId: 'STU-2026-8941',
    department: 'College of Engineering & Tech',
    mfaMethod: 'authenticator',
    hasVoted: false,
  },
  {
    id: 'usr_admin_marcus',
    name: 'Marcus Reyes',
    email: 'admin@election.org',
    role: 'admin',
    department: 'Central Electoral Commission',
    mfaMethod: 'sms',
    hasVoted: true,
    votedAt: '2026-10-05T08:15:22Z',
    ballotHash: '3a9f029c7b801a2d109f6b49e1e779a1d4b684e4e93d567bb8e7880949f99201',
    verificationCode: 'VOTE-MK77-229P-810A',
  },
  {
    id: 'usr_auditor_aris',
    name: 'Dr. Aris Thorne',
    email: 'auditor@auditboard.org',
    role: 'auditor',
    department: 'Independent Transparency Board',
    mfaMethod: 'passkey',
    hasVoted: false,
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-10-05T08:00:00Z',
    actor: 'Electoral Commissioner M. Reyes',
    actorRole: 'admin',
    action: 'ELECTION_OPENED',
    details: 'Cryptographic genesis block verified. Smart ledger initialized with 4,850 authorized voters.',
    blockHash: '0000a941e7f12c8b82e1467a80b332c91823ab49a37e10dfbc83281048bcae91',
    severity: 'notice'
  },
  {
    id: 'log_002',
    timestamp: '2026-10-05T08:05:14Z',
    actor: 'Precinct System ENG-01',
    actorRole: 'voter',
    action: 'MFA_BATCH_AUTHENTICATED',
    details: '142 registered voters successfully verified via TOTP / WebAuthn passkey handshake.',
    blockHash: 'd7a8fbb301e29c7192837bc9910283e74b6192841029487bcf82716382910294',
    severity: 'info'
  },
  {
    id: 'log_003',
    timestamp: '2026-10-05T08:15:22Z',
    actor: 'Precinct System MED-04',
    actorRole: 'voter',
    action: 'BALLOT_SEALED_HASH_CHAIN',
    details: 'Encrypted ballot block #1209 validated with zero-knowledge cryptographic signature.',
    blockHash: '3a9f029c7b801a2d109f6b49e1e779a1d4b684e4e93d567bb8e7880949f99201',
    severity: 'info'
  },
  {
    id: 'log_004',
    timestamp: '2026-10-05T09:20:41Z',
    actor: 'Lead Auditor Dr. A. Thorne',
    actorRole: 'auditor',
    action: 'LEDGER_INTEGRITY_AUDIT',
    details: 'Continuous verification completed. 3,567 ballot hashes checked against merkle chain. 100% integrity score.',
    blockHash: '992a71bf0283c8192a019284bbcaef1928372648102938475618293049182736',
    severity: 'notice'
  }
];

export const INITIAL_BALLOTS: EncryptedBallot[] = [
  {
    id: 'blt_init_1',
    ballotUid: 'BLT-2026-88A2',
    timestamp: '2026-10-05T08:15:22Z',
    precinct: 'College of Engineering & Tech',
    ballotHash: '3a9f029c7b801a2d109f6b49e1e779a1d4b684e4e93d567bb8e7880949f99201',
    previousHash: '0000a941e7f12c8b82e1467a80b332c91823ab49a37e10dfbc83281048bcae91',
    encryptedPayload: 'AES-GCM:IV-78AC198B:dHJ1ZSB2b3RlIGVuY3J5cHRpb24gbG9ja...[PUB-KEY-AUDIT-VERIFIED]',
    verificationCode: 'VOTE-MK77-229P-810A',
    selectionsSummary: {
      pos_president: ['cand_sarah_lin'],
      pos_vice_president: ['cand_chloe_valencia'],
      pos_secretary_general: ['cand_liam_chen'],
      pos_representatives: ['cand_julian_tech', 'cand_alyssa_biz']
    }
  },
  {
    id: 'blt_init_2',
    ballotUid: 'BLT-2026-99C4',
    timestamp: '2026-10-05T08:32:10Z',
    precinct: 'College of Health Sciences',
    ballotHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    previousHash: '3a9f029c7b801a2d109f6b49e1e779a1d4b684e4e93d567bb8e7880949f99201',
    encryptedPayload: 'AES-GCM:IV-99F12A01:c2VjdXJlIGVuY2xldmUgY2hvaWNlcyBzaWdu...[PUB-KEY-AUDIT-VERIFIED]',
    verificationCode: 'VOTE-9K2L-5Q99-012X',
    selectionsSummary: {
      pos_president: ['cand_david_mendoza'],
      pos_vice_president: ['cand_marcus_sterling'],
      pos_secretary_general: ['cand_sofia_alvarez'],
      pos_representatives: ['cand_carlos_health', 'cand_julian_tech']
    }
  }
];
