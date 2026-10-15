/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Users, 
  RotateCcw, 
  UploadCloud,
  CheckCircle2,
  Monitor,
  Download
} from 'lucide-react';
import { VoterRecord } from './types/voter';
import { 
  getVoters, 
  deleteVoter, 
  deleteMultipleVoters, 
  clearAllVoters, 
  resetSampleVoters, 
  saveVoters 
} from './services/storage';
import { exportVotersToExcel } from './services/excelService';
import { downloadOfflineHTML } from './services/offlineExporter';
import { Header } from './components/Header';
import { VoterForm } from './components/VoterForm';
import { VoterTable } from './components/VoterTable';
import { StatsDashboard } from './components/StatsDashboard';
import { SuccessRegistrationModal } from './components/SuccessRegistrationModal';
import { EditVoterModal } from './components/EditVoterModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { VoterCardModal } from './components/VoterCardModal';
import { IOSInstallGuideModal } from './components/IOSInstallGuideModal';

const APP_URL = 'https://ais-dev-enehd5bmt43bjhg5njquev-578291474932.europe-west3.run.app';

export default function App() {
  const [voters, setVoters] = useState<VoterRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'entry' | 'list' | 'stats'>('entry');
  
  // Modals
  const [justAddedVoter, setJustAddedVoter] = useState<VoterRecord | null>(null);
  const [editingVoter, setEditingVoter] = useState<VoterRecord | null>(null);
  const [deletingVoter, setDeletingVoter] = useState<VoterRecord | null>(null);
  const [viewingCardVoter, setViewingCardVoter] = useState<VoterRecord | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load from storage on mount
  useEffect(() => {
    const loaded = getVoters();
    setVoters(loaded);
  }, []);

  // When a new voter is registered
  const handleVoterAdded = (newVoter: VoterRecord) => {
    const updated = [newVoter, ...voters.filter(v => v.id !== newVoter.id)];
    setVoters(updated);
    setJustAddedVoter(newVoter);
    showToast(`دەنگدەر "${newVoter.fullName}" بە سەرکەوتوویی تۆمارکرا.`);
  };

  // When a voter is updated
  const handleVoterUpdated = (updatedVoter: VoterRecord) => {
    const updated = voters.map(v => v.id === updatedVoter.id ? updatedVoter : v);
    setVoters(updated);
    setEditingVoter(null);
    showToast(`زانیارییەکانی "${updatedVoter.fullName}" بە سەرکەوتوویی نوێکرانەوە.`);
  };

  // When a voter is deleted
  const handleConfirmDelete = () => {
    if (!deletingVoter) return;
    deleteVoter(deletingVoter.id);
    setVoters(voters.filter(v => v.id !== deletingVoter.id));
    showToast(`دەنگدەر "${deletingVoter.fullName}" سڕایەوە.`);
    setDeletingVoter(null);
  };

  // When multiple voters are deleted
  const handleDeleteMultiple = (ids: string[]) => {
    const removedCount = deleteMultipleVoters(ids);
    setVoters(voters.filter(v => !ids.includes(v.id)));
    showToast(`${removedCount} کەس بە سەرکەوتوویی سڕانەوە.`);
  };

  // Reset sample data
  const handleResetSampleData = () => {
    if (window.confirm('ئایا دەتەوێت داتای نموونەیی سەرەتایی دابنێیتەوە؟')) {
      const reset = resetSampleVoters();
      setVoters(reset);
      showToast('داتای نموونەیی سەرەتایی گەڕێندرایەوە.');
    }
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('ئاگاداری: هەموو تۆمارکراوان دەسڕدرێنەوە! ئایا دڵنیایت؟')) {
      clearAllVoters();
      setVoters([]);
      showToast('سەرجەم داتاکان سڕانەوە.');
    }
  };

  // Import JSON backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          const valid = json.filter(item => item.fullName && item.voterNumber && item.phoneNumber);
          if (valid.length > 0) {
            saveVoters(valid);
            setVoters(valid);
            showToast(`${valid.length} کەس بە سەرکەوتوویی هێنرانە ناو داتابەیس.`);
          } else {
            alert('فایلەکە هیچ داتایەکی گونجاوی دەنگدەری تێدا نەبوو.');
          }
        }
      } catch {
        alert('فایلی هەڵبژێردراو ناتەواوە یان کێشەی هەیە.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white" dir="rtl">
      {/* Top Header */}
      <Header
        voters={voters}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIOSGuide={() => setShowIOSGuide(true)}
      />

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Banner with PC Download and Rules */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm border border-emerald-800/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" />
                  سازاو بۆ کۆمپیوتەر و مۆبایل
                </span>
                <h2 className="text-base font-bold">یاسا و مەرجەکانی داتابەیس بە تەواوی کاران</h2>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                • <strong>ژمارەی دەنگدەر:</strong> نابێت لە ٨ ژمارە کەمتر و زیاتر بێت، وە نابێت دووبارە ببێتەوە.
                <br className="hidden sm:block" />
                • <strong>ژمارەی مۆبایل:</strong> دەبێت بە تەواوی ١١ ژمارە بێت.
                <br className="hidden sm:block" />
                • <strong>ڕاکێشانی ئێکسڵ (Excel):</strong> دوای داخلکردنی هەرکەسێک یان لە لیستی گشتی دەتوانیت فایلی ئێکسڵ دابەزێنیت.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Standalone PC File Button */}
              <button
                type="button"
                onClick={downloadOfflineHTML}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-600 rounded-xl transition cursor-pointer shadow-xs"
                title="دابەزاندنی فایلێک کە ڕاستەوخۆ لەسەر کۆمپیوتەرەکەت دەکرێتەوە بەبێ ئینتەرنێت"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>داگرتنی فایلی کۆمپیوتەر (.html)</span>
              </button>

              {/* Excel Export Button */}
              <button
                type="button"
                onClick={() => exportVotersToExcel(voters)}
                disabled={voters.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-950" />
                <span>داگرتنی ئێکسڵ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: داخلکردنی نوێ (Form Entry) */}
        {activeTab === 'entry' && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            <VoterForm 
              onSuccess={handleVoterAdded} 
              votersCount={voters.length} 
            />

            {/* Quick overview of latest records */}
            {voters.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    دواین تۆمارکراوەکانی داتابەیس
                  </h3>
                  <button
                    onClick={() => setActiveTab('list')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition cursor-pointer"
                  >
                    بینینی هەموو ({voters.length} کەس) ←
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {voters.slice(0, 3).map((v) => (
                    <div
                      key={v.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-emerald-300 transition space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{v.fullName}</span>
                        <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {v.voterNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono" dir="ltr">{v.phoneNumber}</span>
                        <span>{v.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: لیستی دەنگدەران (Table & Search) */}
        {activeTab === 'list' && (
          <div className="space-y-4 animate-fade-in">
            <VoterTable
              voters={voters}
              onEdit={(voter) => setEditingVoter(voter)}
              onDelete={(voter) => setDeletingVoter(voter)}
              onDeleteMultiple={handleDeleteMultiple}
              onViewCard={(voter) => setViewingCardVoter(voter)}
            />
          </div>
        )}

        {/* Tab 3: ئامارەکان (Stats Dashboard) */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fade-in">
            <StatsDashboard voters={voters} />
          </div>
        )}

        {/* Bottom Tools & Database Utilities */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>داتابەیسی لۆکاڵ پارێزراوە لەسەر ئەم ئامێرە و پەیوەندی هەمیشەیی هەیە.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Import Backup JSON */}
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer transition">
              <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
              <span>هێنانەناوەی باکئەپ (JSON)</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            {/* Reset sample data */}
            <button
              onClick={handleResetSampleData}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>نموونەی سەرەتایی</span>
            </button>

            {/* Clear database */}
            {voters.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50/50 hover:bg-red-100 text-red-700 transition cursor-pointer"
              >
                <span>سڕینەوەی گشتی</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modal: Success Registration with Instant Excel Export */}
      {justAddedVoter && (
        <SuccessRegistrationModal
          voter={justAddedVoter}
          allVoters={voters}
          onClose={() => setJustAddedVoter(null)}
          onAddAnother={() => {
            setJustAddedVoter(null);
            setActiveTab('entry');
          }}
        />
      )}

      {/* Modal: Edit Voter */}
      {editingVoter && (
        <EditVoterModal
          voter={editingVoter}
          onClose={() => setEditingVoter(null)}
          onUpdated={handleVoterUpdated}
        />
      )}

      {/* Modal: Delete Confirmation */}
      {deletingVoter && (
        <DeleteConfirmModal
          voter={deletingVoter}
          onClose={() => setDeletingVoter(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Modal: Printable Official Voter Badge / ID Card */}
      {viewingCardVoter && (
        <VoterCardModal
          voter={viewingCardVoter}
          onClose={() => setViewingCardVoter(null)}
        />
      )}

      {/* Modal: iPhone / iOS installation guide */}
      {showIOSGuide && (
        <IOSInstallGuideModal
          appUrl={APP_URL}
          onClose={() => setShowIOSGuide(false)}
        />
      )}
    </div>
  );
}
