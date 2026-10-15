import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { VoterRecord } from '../types/voter';

interface DeleteConfirmModalProps {
  voter: VoterRecord;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  voter,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-right">
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-2">
            ئایا دڵنیایت لە سڕینەوەی ئەم دەنگدەرە؟
          </h3>

          <p className="text-sm text-slate-600 mb-4">
            تۆ دەنگدەری بەڕێز <span className="font-bold text-slate-900">"{voter.fullName}"</span> بە ژمارەی دەنگدەر{' '}
            <span className="font-mono font-bold text-red-700">{voter.voterNumber}</span> دەسڕیتەوە. ئەم کردارە
            پاشگەزبوونەوەی نییە!
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              پاشگەزبوونەوە
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>بەڵێ، بیسڕەوە</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
