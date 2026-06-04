import React, { useState, useEffect } from 'react';
import { Database, ArrowLeft, Download, PlusCircle, Award, Heart, Stethoscope, Building2, Quote, Trash, RefreshCw, Loader2 } from 'lucide-react';
import { fetchResponses, saveResponse, clearResponses } from '../lib/api';

type SurveyResponse = Awaited<ReturnType<typeof fetchResponses>>[number];

interface AdminDashboardProps {
  onBackToSurvey: () => void;
}

interface EmployeeStats {
  name: string;
  votes: number;
  reasons: string[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSurvey }) => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'nursing' | 'admin'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadResponses = async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const data = await fetchResponses();
      setResponses(data);
    } catch (err) {
      console.error(err);
      setLoadError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const generateMockData = () => {
    const mockNursingNames = [
      '김지은 간호사',
      '이소연 간호사',
      '박하은 간호사',
      '최다혜 수간호사',
      '정우진 간호사',
    ];
    const mockAdminNames = [
      '이지훈 대리 (원무과)',
      '김민수 과장 (행정지원)',
      '한예지 주임 (원무과)',
      '서동현 사원 (기획팀)',
      '윤서아 계장 (인사과)',
    ];

    const nurseReasons = [
      '새벽에도 환자 상태를 꼼꼼히 살피고 상냥한 목소리로 위로해 주셨습니다.',
      '수액 교체할 때 아프지 않게 잘 놔주시고 친절하게 웃어 주셔서 감동받았습니다.',
      '질문이 많아 귀찮으셨을 텐데 막힘없이 하나하나 친절하게 설명해 주셨어요.',
      '항상 바쁜 와중에도 밝은 미소로 병동의 모든 환자들을 대하시는 모습이 인상적입니다.',
      '설명이 명확하고 치료 과정 내내 환자를 안심시켜 주는 다정함이 돋보였습니다.',
    ];
    
    const adminReasons = [
      '원무과 접수 대기 시간이 길었음에도 불구하고 침착하고 신속하게 응대해 주셨습니다.',
      '복잡한 서류 발급 절차를 친절하고 명확하게 안내해 주셔서 빠르게 처리할 수 있었습니다.',
      '주차 등록 및 길 안내를 물어보았을 때 가던 길을 멈추고 직접 동행하며 안내해 주셨습니다.',
      '불편사항 접수 시 끝까지 귀 기울여 들어주시고 적극적으로 해결해 주려는 태도에 감사했습니다.',
      '전화 문의 시 처음부터 끝까지 친절하고 상세하게 안내해 주셨습니다.',
    ];

    const mockVoterNames = ['김철수', '이영희', '박민준', '최수연', '정지호', '한미소', '윤태양', '송은비', '임대한', '강하늘'];
    const mockRows = [];
    const count = 10 + Math.floor(Math.random() * 5);

    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 5));
      date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      let nIndex = 0;
      const randN = Math.random();
      if (randN < 0.4) nIndex = 0;
      else if (randN < 0.7) nIndex = 1;
      else nIndex = Math.floor(Math.random() * (mockNursingNames.length - 2)) + 2;

      let aIndex = 0;
      const randA = Math.random();
      if (randA < 0.4) aIndex = 0;
      else if (randA < 0.7) aIndex = 1;
      else aIndex = Math.floor(Math.random() * (mockAdminNames.length - 2)) + 2;

      mockRows.push({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: date.toISOString(),
        voter_name: mockVoterNames[Math.floor(Math.random() * mockVoterNames.length)],
        voter_phone_last4: String(Math.floor(Math.random() * 9000) + 1000),
        answers: {
          nursing: {
            employee_name: mockNursingNames[nIndex],
            nomination_reason: nurseReasons[Math.floor(Math.random() * nurseReasons.length)],
          },
          admin: {
            employee_name: mockAdminNames[aIndex],
            nomination_reason: adminReasons[Math.floor(Math.random() * adminReasons.length)],
          },
        },
      });
    }

    // Save mock rows to Supabase
    Promise.all(mockRows.map((r) => saveResponse(r)))
      .then(() => loadResponses())
      .catch((err) => console.error('Mock data error', err));
  };

  const clearData = async () => {
    if (window.confirm('정말 모든 투표 데이터를 삭제하고 초기화하시겠습니까?')) {
      try {
        await clearResponses();
        setResponses([]);
      } catch (err) {
        console.error(err);
        alert('데이터 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // Compile Leaderboard Stats
  const getLeaderboard = (dept: '간호부' | '행정부서'): EmployeeStats[] => {
    const statsMap: Record<string, { votes: number; reasons: string[] }> = {};
    
    responses.forEach((r) => {
      const nom = dept === '간호부' ? r.answers.nursing : r.answers.admin;
      if (!nom || !nom.employee_name) return;

      const name = nom.employee_name.trim();
      if (!name) return;

      if (!statsMap[name]) {
        statsMap[name] = { votes: 0, reasons: [] };
      }
      statsMap[name].votes += 1;
      if (nom.nomination_reason) {
        statsMap[name].reasons.push(nom.nomination_reason);
      }
    });

    return Object.entries(statsMap)
      .map(([name, data]) => ({
        name,
        votes: data.votes,
        reasons: data.reasons,
      }))
      .sort((a, b) => b.votes - a.votes);
  };

  const nurseLeaderboard = getLeaderboard('간호부');
  const adminLeaderboard = getLeaderboard('행정부서');

  // Overall metrics
  const totalSubmissions = responses.length;
  const nurseCount = responses.filter(r => r.answers.nursing?.employee_name).length;
  const adminCount = responses.filter(r => r.answers.admin?.employee_name).length;
  const totalVotes = nurseCount + adminCount;

  // Max votes in each department for relative progress bars
  const maxNurseVotes = nurseLeaderboard.length > 0 ? nurseLeaderboard[0].votes : 1;
  const maxAdminVotes = adminLeaderboard.length > 0 ? adminLeaderboard[0].votes : 1;

  // Flatten comments for timelines
  const allComments = responses.flatMap((r) => {
    const list = [];
    if (r.answers.nursing?.employee_name) {
      list.push({
        id: `${r.id}-nursing`,
        timestamp: r.timestamp,
        department: '간호부' as const,
        employee_name: r.answers.nursing.employee_name,
        nomination_reason: r.answers.nursing.nomination_reason,
        voter_name: r.voter_name || '',
        voter_phone_last4: r.voter_phone_last4 || '',
      });
    }
    if (r.answers.admin?.employee_name) {
      list.push({
        id: `${r.id}-admin`,
        timestamp: r.timestamp,
        department: '행정부서' as const,
        employee_name: r.answers.admin.employee_name,
        nomination_reason: r.answers.admin.nomination_reason,
        voter_name: r.voter_name || '',
        voter_phone_last4: r.voter_phone_last4 || '',
      });
    }
    return list;
  });

  const exportToCSV = () => {
    if (responses.length === 0) return;
    
    let csvContent = '\uFEFF';
    csvContent += '투표ID,투표일시,투표자이름,핸드폰뒷자리,부서,피추천직원,추천사유\n';

    responses.forEach((r) => {
      const date = new Date(r.timestamp).toLocaleString();
      const voterName = `"${(r.voter_name || '').replace(/"/g, '""')}"`;
      const voterPhone = r.voter_phone_last4 || '';
      if (r.answers.nursing) {
        const emp = `"${r.answers.nursing.employee_name.replace(/"/g, '""')}"`;
        const reason = `"${r.answers.nursing.nomination_reason.replace(/\n/g, ' ').replace(/"/g, '""')}"`;
        csvContent += `${r.id},${date},${voterName},${voterPhone},간호부,${emp},${reason}\n`;
      }
      if (r.answers.admin) {
        const emp = `"${r.answers.admin.employee_name.replace(/"/g, '""')}"`;
        const reason = `"${r.answers.admin.nomination_reason.replace(/\n/g, ' ').replace(/"/g, '""')}"`;
        csvContent += `${r.id},${date},${voterName},${voterPhone},행정부서,${emp},${reason}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `친절직원_이중투표결과_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <button onClick={onBackToSurvey} className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition-all mb-2" style={{ color: 'var(--primary)' }}>
            <ArrowLeft size={14} />
            친절 직원 투표 폼으로 이동
          </button>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">친절 직원 실시간 집계판</h2>
          <p className="text-slate-400 text-xs mt-1">간호부 및 행정부서에 들어온 실시간 투표 데이터를 분석하고 순위를 갱신합니다.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={loadResponses} disabled={isLoading} className="btn-secondary text-xs py-2.5 px-4 gap-1.5 font-bold" title="새로고침">
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            새로고침
          </button>
          <button onClick={generateMockData} className="btn-secondary text-xs py-2.5 px-4 gap-1.5 font-bold border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400" style={{ color: 'var(--accent-emerald)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <PlusCircle size={15} />
            이중 투표 시뮬레이터
          </button>
          <button onClick={exportToCSV} disabled={totalSubmissions === 0} className="btn-secondary text-xs py-2.5 px-4 gap-1.5 font-bold disabled:opacity-35">
            <Download size={15} />
            CSV 결과 저장
          </button>
          <button onClick={clearData} disabled={totalSubmissions === 0} className="btn-secondary text-xs py-2.5 px-4 gap-1.5 font-bold text-rose-400 border-rose-500/20 hover:bg-rose-500/10" style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.2)' }}>
            <Trash size={15} />
            전체 비우기
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      )}
      {loadError && !isLoading && (
        <div className="glass-card text-center py-10 border-rose-500/10">
          <p className="text-rose-500 font-bold text-sm mb-3">{loadError}</p>
          <button onClick={loadResponses} className="btn-secondary text-xs gap-1.5"><RefreshCw size={14} /> 다시 시도</button>
        </div>
      )}
      {!isLoading && !loadError && totalSubmissions === 0 ? (
        <div className="glass-card text-center py-20 border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/2 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
            <Database size={28} className="text-slate-500" />
          </div>
          <h3 className="text-lg font-bold mb-1 text-slate-200">집계된 투표 결과가 비어 있습니다</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-6 text-xs leading-relaxed">
            두 부서 투표 폼에서 추천을 완료하거나 '이중 투표 시뮬레이터'를 클릭해 양 부서의 득표 데이터를 즉시 로드해 보세요.
          </p>
          <button onClick={onBackToSurvey} className="btn-premium">
            첫 추천 투표하기
          </button>
        </div>
      ) : (
        <>
          {/* Dashboard Metric Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass-card p-6 flex items-center justify-between border-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">총 제출 인원</span>
                <div className="text-3xl font-extrabold mt-1 text-indigo-600" style={{ color: 'var(--primary)' }}>
                  {totalSubmissions} <span className="text-sm font-medium text-slate-500 font-normal">명 참여</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-bold">누적 전체 득표수: {totalVotes}표</div>
              </div>
              <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                <Award size={24} className="text-indigo-500" />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between border-rose-500/10" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">🩺 간호부 추천</span>
                <div className="text-3xl font-extrabold mt-1 text-rose-600" style={{ color: 'var(--accent-rose)' }}>
                  {nurseCount} <span className="text-sm font-medium text-slate-500 font-normal">표 집계</span>
                </div>
                <div className="text-[10px] text-rose-400 mt-1 font-bold">참여율 100% (필수 제출)</div>
              </div>
              <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                <Stethoscope size={24} className="text-rose-500" />
              </div>
            </div>

            <div className="glass-card p-6 flex items-center justify-between border-emerald-500/10" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">🏢 행정부서 추천</span>
                <div className="text-3xl font-extrabold mt-1 text-emerald-600" style={{ color: 'var(--accent-emerald)' }}>
                  {adminCount} <span className="text-sm font-medium text-slate-500 font-normal">표 집계</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-bold">참여율 100% (필수 제출)</div>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <Building2 size={24} className="text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Department Rankings (Leaderboards) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nursing Leaderboard */}
            <div className="glass-card border-white/5 space-y-6" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
              <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">간호부 추천 순위</h3>
                  <p className="text-[10px] text-slate-400">간호 파트 누적 득표 현황</p>
                </div>
              </div>

              {nurseLeaderboard.length === 0 ? (
                <p className="text-center text-slate-500 py-10 text-xs">등록된 간호부 후보가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {nurseLeaderboard.map((emp, index) => {
                    const relativePct = (emp.votes / maxNurseVotes) * 100;
                    return (
                      <div key={emp.name} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-rose-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              index === 0 ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.2)]' : index === 1 ? 'bg-slate-300 text-slate-950' : 'bg-slate-200 text-slate-500 border border-slate-300'
                            }`}>
                              {index + 1}
                            </span>
                            <div>
                              <span className="font-bold text-slate-700 text-sm">{emp.name}</span>
                              {index === 0 && <span className="text-[9px] font-bold text-rose-600 px-2 py-0.5 rounded-full bg-rose-500/10 ml-2 border border-rose-500/20">👑 1위</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-slate-700 text-base">{emp.votes}</span>
                            <span className="text-[10px] text-slate-500 ml-1">표</span>
                          </div>
                        </div>

                        {/* Relative Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full transition-all duration-500"
                            style={{ width: `${relativePct}%`, backgroundColor: 'var(--accent-rose)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin Leaderboard */}
            <div className="glass-card border-white/5 space-y-6" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
              <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">행정부서 추천 순위</h3>
                  <p className="text-[10px] text-slate-400">행정 파트 누적 득표 현황</p>
                </div>
              </div>

              {adminLeaderboard.length === 0 ? (
                <p className="text-center text-slate-500 py-10 text-xs">등록된 행정부서 후보가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {adminLeaderboard.map((emp, index) => {
                    const relativePct = (emp.votes / maxAdminVotes) * 100;
                    return (
                      <div key={emp.name} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-emerald-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              index === 0 ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.2)]' : index === 1 ? 'bg-slate-300 text-slate-950' : 'bg-slate-200 text-slate-500 border border-slate-300'
                            }`}>
                              {index + 1}
                            </span>
                            <div>
                              <span className="font-bold text-slate-700 text-sm">{emp.name}</span>
                              {index === 0 && <span className="text-[9px] font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-500/10 ml-2 border border-emerald-500/20">👑 1위</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-slate-700 text-base">{emp.votes}</span>
                            <span className="text-[10px] text-slate-500 ml-1">표</span>
                          </div>
                        </div>

                        {/* Relative Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${relativePct}%`, backgroundColor: 'var(--accent-emerald)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Timeline Messages Grid */}
          <div className="glass-card border-white/5 space-y-6" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500">
                  <Heart size={16} />
                </div>
                <h3 className="text-base font-bold text-slate-800">칭찬 추천 한마디 타임라인</h3>
              </div>

              {/* Department Tabs */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  전체보기
                </button>
                <button
                  onClick={() => setActiveTab('nursing')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    activeTab === 'nursing' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  간호부
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${
                    activeTab === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  행정부서
                </button>
              </div>
            </div>

            {/* Praise Card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allComments
                .filter((c) => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'nursing') return c.department === '간호부';
                  return c.department === '행정부서';
                })
                .map((comment) => {
                  const isNursing = comment.department === '간호부';
                  return (
                    <div
                      key={comment.id}
                      className="p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4"
                      style={{
                        backgroundColor: isNursing ? 'rgba(225,29,72,0.01)' : 'rgba(5,150,105,0.01)',
                        borderColor: isNursing ? 'rgba(225,29,72,0.1)' : 'rgba(5,150,105,0.1)',
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700 text-sm">{comment.employee_name}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                              isNursing ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            }`}>
                              {comment.department}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 text-slate-600">
                          <Quote size={14} className="text-slate-400 flex-shrink-0 mt-1" />
                          <p className="text-xs leading-relaxed italic text-slate-600">
                            {comment.nomination_reason}
                          </p>
                        </div>
                      </div>

                      <div className="text-[9px] text-slate-400 font-bold border-t border-slate-100 pt-3 flex justify-between">
                        <span className="flex items-center gap-1.5">
                          {comment.voter_name && (
                            <span className="text-indigo-500 font-bold">
                              👤 {comment.voter_name}
                              {comment.voter_phone_last4 && ` (뒷자리: ${comment.voter_phone_last4})`}
                            </span>
                          )}
                        </span>
                        <span>{new Date(comment.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
