import React from 'react';
import { X, Printer, FileSpreadsheet, ShieldCheck, User, CreditCard, Phone, GraduationCap, Briefcase } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { exportSingleVoterToExcel, formatKurdishDate } from '../services/excelService';

interface VoterCardModalProps {
  voter: VoterRecord;
  onClose: () => void;
}

export const VoterCardModal: React.FC<VoterCardModalProps> = ({ voter, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportSingleVoterToExcel(voter);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-right flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">کارتی فەرمی دەنگدەر / باجی ستاف</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              title="ڕاکێشانی ئێکسڵ"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              title="چاپکردن"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              title="داخستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card */}
        <div className="p-6 bg-slate-50">
          <div className="bg-white rounded-2xl border-2 border-emerald-600 shadow-md p-6 space-y-4 relative overflow-hidden">
            {/* Header of Badge */}
            <div className="border-b-2 border-emerald-500 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  کورد
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">سیستەمی تۆماری دەنگدەران</h4>
                  <p className="text-[10px] text-slate-500">پێناسی فەرمی ستاف و دەنگدەر</p>
                </div>
              </div>
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>

            {/* Content Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  ناوی سیانی:
                </span>
                <span className="font-bold text-slate-900">{voter.fullName}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  ژمارەی دەنگدەر:
                </span>
                <span className="font-mono font-extrabold text-emerald-800 text-base bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {voter.voterNumber}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  ژمارەی مۆبایل:
                </span>
                <span className="font-mono font-bold text-slate-800" dir="ltr">
                  {voter.phoneNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-emerald-600" />
                    بڕوانامە:
                  </span>
                  <span className="font-bold text-slate-800 text-xs">{voter.qualification}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block mb-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-teal-600" />
                    ئەرک:
                  </span>
                  <span className="font-bold text-slate-800 text-xs">{voter.role}</span>
                </div>
              </div>

              {voter.notes && (
                <div className="text-xs text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  <span className="font-bold text-emerald-900 ml-1">شوێن / تێبینی:</span>
                  {voter.notes}
                </div>
              )}
            </div>

            {/* Bottom Barcode Aesthetic */}
            <div className="pt-2 border-t border-slate-200 text-center flex flex-col items-center">
              <div className="flex gap-1 h-7 items-center opacity-70">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-slate-900 h-full"
                    style={{ width: `${(i % 3) + 1}px` }}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-1">
                تۆمارکراوە لە: {formatKurdishDate(voter.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer print / close button */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-500">دەتوانیت چاپ یان بە ئێکسڵ دابەزێنیت.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>چاپکردن</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              داخستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
