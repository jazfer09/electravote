/**
 * ElectraVote Pro - Secure PWA Voting Portal
 * Built with Multi-Factor Authentication, Role-Based Access Control,
 * Cryptographic SHA-256 Ballot Hashing, and Real-Time Turnout Auditing.
 */

import React, { useState } from 'react';
import { VotingProvider, useVoting } from './context/VotingContext';
import { Navbar } from './components/Navbar';
import { OfflineIndicator } from './components/OfflineIndicator';
import { VoterBallotView } from './views/VoterBallotView';
import { TurnoutDashboardView } from './views/TurnoutDashboardView';
import { AuditDeskView } from './views/AuditDeskView';
import { AdminConsoleView } from './views/AdminConsoleView';
import { LoginView } from './views/LoginView';
import { ShieldCheck, X } from 'lucide-react';

function MainAppContent() {
  const { currentUser } = useVoting();
  const [activeTab, setActiveTab] = useState<'ballot' | 'turnout' | 'audit' | 'admin'>('ballot');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'ballot' && (
          <VoterBallotView
            onGoToAuditDesk={() => setActiveTab('audit')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'turnout' && <TurnoutDashboardView />}

        {activeTab === 'audit' && <AuditDeskView />}

        {activeTab === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminConsoleView />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
              <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">Restricted Official Area</h2>
              <p className="text-xs text-slate-400 mb-6">
                The Election Official Console requires commissioner-level role-based authorization.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition"
              >
                Sign In as Election Official
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ElectraVote Pro</span>
            <span>·</span>
            <span>Progressive Web App Voting Portal</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>SHA-256 Tamper Evident</span>
            <span>Zero-Knowledge Proofs</span>
            <span>WebAuthn MFA</span>
          </div>
        </div>
      </footer>

      {/* Login / MFA Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <LoginView
              onSuccess={() => setIsLoginModalOpen(false)}
              onCancel={() => setIsLoginModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <VotingProvider>
      <MainAppContent />
    </VotingProvider>
  );
}
