import React from 'react';
import { FileSpreadsheet, Users, PlusCircle, BarChart3, Database, Download, Monitor } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { exportVotersToExcel, exportBackupJSON } from '../services/excelService';
import { downloadOfflineHTML } from '../services/offlineExporter';

interface HeaderProps {
  voters: VoterRecord[];
  activeTab: 'entry' | 'list' | 'stats';
  setActiveTab: (tab: 'entry' | 'list' | 'stats') => void;
  onOpenIOSGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ voters, activeTab, setActiveTab }) => {
  const handleExportAll = () => {
    exportVotersToExcel(voters);
  };

  const handleBackup = () => {
    exportBackupJSON(voters);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & System Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  سیستەمی تۆماری دەنگدەران و ستاف
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {voters.length} تۆمارکراو
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                داتابەیسی داخلکردنی زانیاری، پشکنینی ژمارەی دەنگدەر و دەرهێنانی ئێکسڵ (Excel)
              </p>
            </div>
          </div>

          {/* Quick Action Buttons & Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab('entry')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'entry'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>داخلکردنی نوێ</span>
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'list'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>لیستی دەنگدەران ({voters.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer ${
                  activeTab === 'stats'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>ئامارەکان</span>
              </button>
            </nav>

            {/* Download as standalone computer file (.html) */}
            <button
              onClick={downloadOfflineHTML}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition cursor-pointer"
              title="دابەزاندنی تەواوی سیستەمەکە وەک یەک فایل بۆ سەر کۆمپیوتەرەکەت"
            >
              <Monitor className="w-4 h-4 text-emerald-700" />
              <span>داگرتن بۆ کۆمپیوتەر</span>
            </button>

            {/* Excel Export Button */}
            <button
              onClick={handleExportAll}
              disabled={voters.length === 0}
              title="ڕاکێشانی هەموو داتاکان بە فایلی ئێکسڵ"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>ڕاکێشانی ئێکسڵ</span>
            </button>

            {/* Backup Button */}
            <button
              onClick={handleBackup}
              disabled={voters.length === 0}
              title="دابەزاندنی باکئەپی پارێزراوی داتابەیس (JSON)"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>باکئەپ</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
