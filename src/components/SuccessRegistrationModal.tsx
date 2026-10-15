import React from 'react';
import { CheckCircle2, FileSpreadsheet, Download, UserPlus, X, Phone, CreditCard, GraduationCap, Briefcase } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { exportSingleVoterToExcel, exportVotersToExcel } from '../services/excelService';

interface SuccessRegistrationModalProps {
  voter: VoterRecord;
  allVoters: VoterRecord[];
  onClose: () => void;
  onAddAnother: () => void;
}

export const SuccessRegistrationModal: React.FC<SuccessRegistrationModalProps> = ({
  voter,
  allVoters,
  onClose,
  onAddAnother,
}) => {
  const handleExportThis = () => {
    exportSingleVoterToExcel(voter);
  };

  const handleExportAll = () => {
    exportVotersToExcel(allVoters);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden text-right">
        {/* Top green celebration banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            title="داخستن"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/40 shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>

          <h3 className="text-xl font-extrabold">بەسەرکەوتوویی تۆمارکرا!</h3>
          <p className="text-sm text-emerald-100 mt-1">
            زانیارییەکانی دەنگدەر بە دروستی لە داتابەیس پاشەکەوت کران.
          </p>
        </div>

        {/* Voter Details Card */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs text-slate-500 font-medium">ناوی سیانی:</span>
              <span className="text-sm font-bold text-slate-900">{voter.fullName}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                ژمارەی دەنگدەر (٨ ژمارە):
              </span>
              <span className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {voter.voterNumber}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                ژمارە مۆبایل (١١ ژمارە):
              </span>
              <span className="text-sm font-mono font-bold text-slate-800" dir="ltr">
                {voter.phoneNumber}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5">بڕوانامە:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  {voter.qualification}
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-400 block mb-0.5">ئەرک و بەرپرسیارێتی:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                  {voter.role}
                </span>
              </div>
            </div>
          </div>

          {/* Excel Export Notice */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="text-xs text-emerald-900 leading-snug">
              دەتوانیت ئێستا یەکسەر فایلی ئێکسڵ (Excel) بۆ ئەم کەسە یان سەرجەم تۆمارکراوەکان دابەزێنیت.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportThis}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ئێکسڵی ئەم کەسە</span>
              </button>

              <button
                type="button"
                onClick={handleExportAll}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 rounded-xl transition cursor-pointer border border-emerald-300"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>ئێکسڵی هەموو ({allVoters.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onAddAnother}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-slate-500" />
              <span>داخلکردنی کەسی دواتر</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
