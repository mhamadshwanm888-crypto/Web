import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Trash2, 
  Edit3, 
  Phone, 
  CreditCard, 
  GraduationCap, 
  Briefcase, 
  CheckSquare, 
  Square, 
  MessageCircle, 
  IdCard,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { exportVotersToExcel, exportSingleVoterToExcel } from '../services/excelService';

interface VoterTableProps {
  voters: VoterRecord[];
  onEdit: (voter: VoterRecord) => void;
  onDelete: (voter: VoterRecord) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onViewCard: (voter: VoterRecord) => void;
}

export const VoterTable: React.FC<VoterTableProps> = ({
  voters,
  onEdit,
  onDelete,
  onDeleteMultiple,
  onViewCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQualification, setSelectedQualification] = useState<string>('هەموو');
  const [selectedRole, setSelectedRole] = useState<string>('هەموو');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'age' | 'voterNumber'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Unique qualifications and roles for filter dropdowns
  const uniqueQualifications = useMemo(() => {
    const list = Array.from(new Set(voters.map(v => v.qualification))).filter(Boolean);
    return ['هەموو', ...list];
  }, [voters]);

  const uniqueRoles = useMemo(() => {
    const list = Array.from(new Set(voters.map(v => v.role))).filter(Boolean);
    return ['هەموو', ...list];
  }, [voters]);

  // Filtered & sorted voters
  const filteredVoters = useMemo(() => {
    const cleanSearch = searchTerm.trim().toLowerCase();

    return voters
      .filter((voter) => {
        const matchesSearch =
          !cleanSearch ||
          voter.fullName.toLowerCase().includes(cleanSearch) ||
          voter.voterNumber.includes(cleanSearch) ||
          voter.phoneNumber.includes(cleanSearch) ||
          voter.qualification.toLowerCase().includes(cleanSearch) ||
          voter.role.toLowerCase().includes(cleanSearch) ||
          (voter.notes && voter.notes.toLowerCase().includes(cleanSearch));

        const matchesQual =
          selectedQualification === 'هەموو' || voter.qualification === selectedQualification;

        const matchesRole = selectedRole === 'هەموو' || voter.role === selectedRole;

        return matchesSearch && matchesQual && matchesRole;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'createdAt') {
          comp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else if (sortField === 'fullName') {
          comp = a.fullName.localeCompare(b.fullName);
        } else if (sortField === 'age') {
          comp = a.age - b.age;
        } else if (sortField === 'voterNumber') {
          comp = a.voterNumber.localeCompare(b.voterNumber);
        }
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [voters, searchTerm, selectedQualification, selectedRole, sortField, sortOrder]);

  // Selection logic
  const handleSelectAll = () => {
    if (selectedIds.size === filteredVoters.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredVoters.map((v) => v.id)));
    }
  };

  const handleToggleRow = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Export selected
  const handleExportSelected = () => {
    const selectedList = voters.filter((v) => selectedIds.has(v.id));
    if (selectedList.length === 0) return;
    exportVotersToExcel(selectedList, `دەنگدەرانی_دیاریکراو_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export all filtered
  const handleExportFiltered = () => {
    exportVotersToExcel(filteredVoters, `لیستی_فلتەرکراو_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Delete selected
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`ئایا دڵنیایت لە سڕینەوەی ${selectedIds.size} کەسی دیاریکراو؟ ئەم کارە ناگەڕێتەوە.`)) {
      onDeleteMultiple(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const toggleSort = (field: 'createdAt' | 'fullName' | 'age' | 'voterNumber') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="گەڕان بەپێی ناو، ٨ ژمارەی دەنگدەر، مۆبایل، بڕوانامە، ئەرک..."
              className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-hidden transition text-sm text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
              >
                پاککردنەوە
              </button>
            )}
          </div>

          {/* Dropdown Filters & Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Qualification Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <select
                value={selectedQualification}
                onChange={(e) => setSelectedQualification(e.target.value)}
                className="bg-transparent outline-hidden font-medium cursor-pointer"
              >
                {uniqueQualifications.map((q) => (
                  <option key={q} value={q}>
                    {q === 'هەموو' ? 'هەموو بڕوانامەکان' : q}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent outline-hidden font-medium cursor-pointer"
              >
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>
                    {r === 'هەموو' ? 'هەموو ئەرکەکان' : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Filtered button */}
            <button
              onClick={handleExportFiltered}
              disabled={filteredVoters.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 rounded-xl transition cursor-pointer border border-emerald-300"
              title="ڕاکێشانی ئەنجامی گەڕان بە فایلی ئێکسڵ"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>ئێکسڵی ئەم لیستە ({filteredVoters.length})</span>
            </button>
          </div>
        </div>

        {/* Multi-Selection Action Bar */}
        {selectedIds.size > 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <span>{selectedIds.size} کەس دیاریکراوە لە کۆی {filteredVoters.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportSelected}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ڕاکێشانی ئێکسڵ بۆ دیاریکراوەکان</span>
              </button>

              <button
                onClick={handleDeleteSelected}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>سڕینەوەی دیاریکراوەکان</span>
              </button>

              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 cursor-pointer"
              >
                پەشیمانبوونەوە
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-100 text-slate-700 text-xs font-bold uppercase border-y border-slate-200 select-none">
            <tr>
              {/* Checkbox column */}
              <th className="py-3 px-4 w-10 text-center">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  title="دیاریکردنی هەموو"
                >
                  {selectedIds.size === filteredVoters.length && filteredVoters.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              {/* No. */}
              <th className="py-3 px-3 w-12 text-center text-slate-400">#</th>

              {/* Full Name */}
              <th 
                onClick={() => toggleSort('fullName')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition"
              >
                <div className="flex items-center gap-1">
                  <span>ناوی سیانی</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Age */}
              <th 
                onClick={() => toggleSort('age')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/60 transition text-center"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>تەمەن</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Voter Number (8 digits) */}
              <th 
                onClick={() => toggleSort('voterNumber')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-200/60 transition"
              >
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ژمارەی دەنگدەر (٨ ژمارە)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>

              {/* Mobile Phone (11 digits) */}
              <th className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ژمارە مۆبایل (١١ ژمارە)</span>
                </div>
              </th>

              {/* Qualification */}
              <th className="py-3 px-4">بڕوانامە</th>

              {/* Role */}
              <th className="py-3 px-4">ئەرک و بەرپرسیارێتی</th>

              {/* Action column */}
              <th className="py-3 px-4 text-center">کردارەکان و ئێکسڵ</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredVoters.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                    <p className="font-semibold text-slate-600">هیچ داتایەک نەدۆزرایەوە!</p>
                    <p className="text-xs text-slate-400">
                      {searchTerm ? 'هیچ دەنگدەرێک لەگەڵ ئەم گەڕانە ناگونجێت.' : 'تا ئێستا هیچ دەنگدەرێک داخل نەکراوە.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredVoters.map((voter, index) => {
                const isSelected = selectedIds.has(voter.id);
                return (
                  <tr
                    key={voter.id}
                    className={`hover:bg-emerald-50/40 transition-colors ${
                      isSelected ? 'bg-emerald-50/60' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleRow(voter.id)}
                        className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Index */}
                    <td className="py-3.5 px-3 text-center text-xs text-slate-400 font-mono">
                      {index + 1}
                    </td>

                    {/* Full Name */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{voter.fullName}</span>
                        {voter.notes && (
                          <span className="text-xs text-slate-400 font-normal truncate max-w-xs" title={voter.notes}>
                            {voter.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {voter.age} ساڵ
                      </span>
                    </td>

                    {/* Voter Number (Strictly 8 digits) */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold text-sm tracking-wider">
                        <span>{voter.voterNumber}</span>
                        <span className="text-[10px] text-emerald-600 font-sans font-medium">٨ ژمارە</span>
                      </div>
                    </td>

                    {/* Mobile Number (Strictly 11 digits) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-800 text-sm tracking-wide" dir="ltr">
                          {voter.phoneNumber}
                        </span>
                        
                        {/* Quick Call & WhatsApp links */}
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${voter.phoneNumber}`}
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 transition"
                            title="پەیوەندیکردن"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/964${voter.phoneNumber.replace(/^0+/, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 transition"
                            title="ناردنی نامەی واتسئەپ"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Qualification */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {voter.qualification}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        {voter.role}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Single Excel Export */}
                        <button
                          type="button"
                          onClick={() => exportSingleVoterToExcel(voter)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition cursor-pointer"
                          title="ڕاکێشانی ئێکسڵ بۆ ئەم کەسە"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>

                        {/* ID Card preview */}
                        <button
                          type="button"
                          onClick={() => onViewCard(voter)}
                          className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-100 active:bg-teal-200 transition cursor-pointer"
                          title="بینینی باج / کارتی فەرمی"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit(voter)}
                          className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 active:bg-amber-200 transition cursor-pointer"
                          title="دەستکاریکردن"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete(voter)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 active:bg-red-200 transition cursor-pointer"
                          title="سڕینەوە"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          پیشاندانی <span className="font-bold text-slate-800">{filteredVoters.length}</span> لە کۆی{' '}
          <span className="font-bold text-slate-800">{voters.length}</span> دەنگدەری تۆمارکراو
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            دەنگدەر: بە تەواوی ٨ ژمارە
          </span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            مۆبایل: بە تەواوی ١١ ژمارە
          </span>
        </div>
      </div>
    </div>
  );
};
