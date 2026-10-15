import React from 'react';
import { Users, GraduationCap, Briefcase, Calendar, FileSpreadsheet, ShieldAlert } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { exportVotersToExcel } from '../services/excelService';

interface StatsDashboardProps {
  voters: VoterRecord[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ voters }) => {
  const totalCount = voters.length;

  const avgAge = totalCount > 0
    ? Math.round(voters.reduce((acc, v) => acc + v.age, 0) / totalCount)
    : 0;

  const youthCount = voters.filter(v => v.age >= 18 && v.age <= 35).length;
  const youthPercentage = totalCount > 0 ? Math.round((youthCount / totalCount) * 100) : 0;

  // Qualification breakdown
  const qualificationCounts = voters.reduce<Record<string, number>>((acc, v) => {
    acc[v.qualification] = (acc[v.qualification] || 0) + 1;
    return acc;
  }, {});

  // Roles breakdown
  const roleCounts = voters.reduce<Record<string, number>>((acc, v) => {
    acc[v.role] = (acc[v.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">کۆی گشتی تۆمارکراوان</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">کەسی تۆمارکراو لە داتابەیس</span>
          </div>
        </div>

        {/* Average Age */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">تێکڕای تەمەن</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{avgAge} <span className="text-sm font-normal text-slate-400">ساڵ</span></div>
            <span className="text-[11px] text-blue-700 font-semibold">تێکڕای دەنگدەران</span>
          </div>
        </div>

        {/* Youth */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">توێژی گەنجان (١٨-٣٥)</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{youthCount} <span className="text-sm font-normal text-slate-400">({youthPercentage}%)</span></div>
            <span className="text-[11px] text-amber-700 font-semibold">ڕێژەی دەنگدەری گەنج</span>
          </div>
        </div>

        {/* Export All Shortcut */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs text-emerald-100 font-medium">دەرهێنانی داتای گشتی</span>
            <h4 className="text-base font-bold mt-1">ڕاکێشانی ڕاستەوخۆ بە ئێکسڵ</h4>
          </div>
          <button
            onClick={() => exportVotersToExcel(voters)}
            disabled={totalCount === 0}
            className="mt-3 inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>داگرتنی ئێکسڵی تەواو (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Breakdown grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Qualification */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              دابەشبوون بەپێی بڕوانامە
            </h3>
            <span className="text-xs text-slate-400">{Object.keys(qualificationCounts).length} جۆر بڕوانامە</span>
          </div>

          <div className="space-y-3">
            {Object.entries(qualificationCounts).length === 0 ? (
              <p className="text-xs text-slate-400">هیچ داتایەک نییە.</p>
            ) : (
              Object.entries(qualificationCounts).map(([qual, count]) => {
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={qual} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{qual}</span>
                      <span className="text-slate-500 font-mono font-bold">{count} کەس ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* By Role */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600" />
              دابەشبوون بەپێی ئەرک و بەرپرسیارێتی
            </h3>
            <span className="text-xs text-slate-400">{Object.keys(roleCounts).length} ناونیشانی ئەرک</span>
          </div>

          <div className="space-y-3">
            {Object.entries(roleCounts).length === 0 ? (
              <p className="text-xs text-slate-400">هیچ داتایەک نییە.</p>
            ) : (
              Object.entries(roleCounts).map(([role, count]) => {
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={role} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-700">{role}</span>
                      <span className="text-slate-500 font-mono font-bold">{count} کەس ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
