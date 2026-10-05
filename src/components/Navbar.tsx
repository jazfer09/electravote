import React, { useState } from 'react';
import { ShieldCheck, Vote, BarChart3, SearchCheck, Settings, LogOut, ChevronDown, Check, User, Radio } from 'lucide-react';
import { useVoting } from '../context/VotingContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserRole } from '../types/voting';

interface NavbarProps {
  activeTab: 'ballot' | 'turnout' | 'audit' | 'admin';
  setActiveTab: (tab: 'ballot' | 'turnout' | 'audit' | 'admin') => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const { currentUser, logout, quickSwitchUser, electionConfig, isLiveSimulating, toggleLiveSimulation } = useVoting();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    quickSwitchUser(role);
    setRoleMenuOpen(false);
    if (role === 'admin') setActiveTab('admin');
    else if (role === 'auditor') setActiveTab('audit');
    else setActiveTab('ballot');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      {/* 3-Zone Contract: Brand Zone - Nav Zone - Action Zone */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab(currentUser?.role === 'admin' ? 'admin' : 'ballot')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              ElectraVote
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                PRO
              </span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Clean text links with subtle active states) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('ballot')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ballot'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>Official Ballot</span>
          </button>

          <button
            onClick={() => setActiveTab('turnout')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'turnout'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Live Turnout</span>
            {isLiveSimulating && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <SearchCheck className="w-4 h-4" />
            <span>Audit Desk</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions + User Profile + PWA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live stream ticker toggle */}
          <button
            onClick={toggleLiveSimulation}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition border ${
              isLiveSimulating
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle simulated live voting stream to observe dynamic progress bar updates"
          >
            <Radio className={`w-3 h-3 ${isLiveSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isLiveSimulating ? 'Live Feed ON' : 'Simulate Feed'}</span>
          </button>

          {/* PWA In-App Install Button */}
          <PWAInstallButton />

          {/* User Profile or Sign In */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 transition text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher & Account Dropdown */}
              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-blue-400 mt-1 font-mono">{currentUser.department}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Switch Role (Testing)
                    </p>
                    <button
                      onClick={() => handleRoleSelect('voter')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span>Voter (Elena Vance)</span>
                      {currentUser.role === 'voter' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span>Election Officer (Marcus)</span>
                      {currentUser.role === 'admin' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                    <button
                      onClick={() => handleRoleSelect('auditor')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200"
                    >
                      <span>Observer (Dr. Thorne)</span>
                      {currentUser.role === 'auditor' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        logout();
                        setRoleMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In with MFA</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile subnavigation bar for small screens */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950/90 px-3 py-2 justify-around">
        <button
          onClick={() => setActiveTab('ballot')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md ${
            activeTab === 'ballot' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400'
          }`}
        >
          <Vote className="w-3.5 h-3.5" />
          <span>Ballot</span>
        </button>
        <button
          onClick={() => setActiveTab('turnout')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md ${
            activeTab === 'turnout' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Turnout</span>
          {isLiveSimulating && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md ${
            activeTab === 'audit' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400'
          }`}
        >
          <SearchCheck className="w-3.5 h-3.5" />
          <span>Audit</span>
        </button>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md ${
              activeTab === 'admin' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
