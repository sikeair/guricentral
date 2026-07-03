import React, { useState } from 'react';
import { CheckCircle2, Stethoscope, Building2, Sparkles, User, Phone, Loader2, Heart, Award, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { saveResponse } from '../lib/api';

interface SurveyFormProps {
  onComplete: () => void;
  onNavigateToAdmin: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onComplete }) => {
  const [voterName, setVoterName] = useState('');
  const [voterPhone, setVoterPhone] = useState('');
  const [nurseName, setNurseName] = useState('');
  const [nurseReason, setNurseReason] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedNurseName, setSubmittedNurseName] = useState('');
  const [submittedAdminName, setSubmittedAdminName] = useState('');

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setVoterPhone(val);
  };

  const isFormValid = () =>
    voterName.trim() !== '' &&
    voterPhone.length === 4 &&
    nurseName.trim() !== '' &&
    nurseReason.trim() !== '' &&
    adminName.trim() !== '' &&
    adminReason.trim() !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsLoading(true);
    setErrorMsg('');

    const response = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      voter_name: voterName.trim(),
      voter_phone_last4: voterPhone,
      answers: {
        nursing: {
          employee_name: nurseName.trim(),
          nomination_reason: nurseReason.trim(),
        },
        admin: {
          employee_name: adminName.trim(),
          nomination_reason: adminReason.trim(),
        },
      },
    };

    try {
      await saveResponse(response);
      setSubmittedNurseName(nurseName.trim());
      setSubmittedAdminName(adminName.trim());
      setIsSubmitted(true);
      onComplete();
    } catch (err) {
      console.error(err);
      setErrorMsg('투표 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─── THANK YOU SCREEN ─── */
  if (isSubmitted) {
    return (
      <div
        className="glass-card text-center max-w-2xl mx-auto py-16 px-6 sm:px-12 relative overflow-hidden"
        style={{
          animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Decorative background glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary-light/10 blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: 'rgba(16,185,129,0.12)', animationDuration: '2.5s' }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 10px 25px rgba(16,185,129,0.3)',
              }}
            >
              <Sparkles size={36} className="text-white animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight leading-tight">
          투표가 성공적으로<br />
          <span className="bg-gradient-to-r from-emerald-500 to-indigo-500 bg-clip-text text-transparent" style={{
            background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>완료되었습니다!</span> 🙏
        </h2>
        
        <p className="text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          소중한 한 표를 통해 더욱 따뜻하고 신뢰받는 병원을 만들어가는 데 기여해주셨습니다. 남겨주신 마음은 직원분들께 잘 전달해 드리겠습니다.
        </p>

        {/* Highlight Card */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 mb-10 text-left space-y-4">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Award size={14} className="text-indigo-500" /> 내가 추천한 친절 직원
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/[0.02] dark:bg-rose-500/[0.01] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                <Stethoscope size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-500 block mb-0.5">간호부 부문</span>
                <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200">{submittedNurseName}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                <Building2 size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-500 block mb-0.5">기타 파트 부문</span>
                <span className="font-extrabold text-sm text-slate-700 dark:text-slate-200">{submittedAdminName}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setVoterName(''); setVoterPhone('');
            setNurseName(''); setNurseReason('');
            setAdminName(''); setAdminReason('');
            setIsSubmitted(false);
          }}
          className="btn-premium w-full sm:w-auto px-8 py-3.5 flex items-center justify-center gap-2 mx-auto"
        >
          <RefreshCw size={16} />
          <span>추가 투표 참여하기</span>
        </button>
      </div>
    );
  }

  /* ─── VOTE FORM ─── */
  return (
    <div className="max-w-2xl mx-auto">
      {/* Visual Welcome Banner inside voting area */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 mb-8 border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/20 backdrop-blur-md">
              <Heart size={12} className="fill-rose-500 text-rose-500" /> 친절직원 캠페인
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              가장 친절하고 따뜻했던<br />
              직원에게 마음을 전해주세요.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md">
              보내주신 따뜻한 격려와 지지는 직원들이 더 훌륭한 케어와 친절을 실천할 수 있는 가장 큰 원동력이 됩니다.
            </p>
          </div>
          <div className="hidden md:flex justify-end shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <Award size={36} className="text-yellow-400 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* CARD 1: VOTER INFO */}
        <div
          className="glass-card transition-all duration-300"
          style={{
            borderLeft: '4px solid var(--primary)',
          }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">투표자 정보 입력</h3>
              <p className="text-xs text-slate-400">올바른 투표 집계를 위해 정보를 기입해주세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="form-label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                성함 <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="form-input text-sm pl-10"
                  placeholder="예: 홍길동"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  maxLength={20}
                  required
                />
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="form-label text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                핸드폰 뒷자리 <span className="text-rose-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-input text-sm pl-10 pr-10 font-mono tracking-wider"
                  placeholder="숫자 4자리"
                  value={voterPhone}
                  onChange={handlePhoneInput}
                  maxLength={4}
                  required
                />
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                
                {voterPhone.length > 0 && voterPhone.length < 4 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {voterPhone.length}/4
                  </span>
                )}
                {voterPhone.length === 4 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-scaleIn">
                    <CheckCircle2 size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: NURSING */}
        <div
          className="glass-card transition-all duration-300 group hover:shadow-rose-500/[0.02]"
          style={{
            borderLeft: '4px solid var(--accent-rose)',
          }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-rose-100/50 dark:border-rose-950/20">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
              <Stethoscope size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">1. 간호부 추천</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-500">필수</span>
              </div>
              <p className="text-xs text-slate-400">병동, 외래, 수술실, 내시경실, 야간진료 등의 간호부 직원을 입력해주세요.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="form-label text-slate-700 dark:text-slate-300">
                추천 직원 성함
              </label>
              <input
                type="text"
                className="form-input text-sm"
                placeholder="성함 및 직급 (예: 김OO 간호사)"
                value={nurseName}
                onChange={(e) => setNurseName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="form-label text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MessageSquare size={13} className="text-rose-400" /> 구체적인 추천 이유
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {nurseReason.trim().length}자 입력됨
                </span>
              </div>
              <textarea
                className="form-input h-28 text-sm leading-relaxed resize-none transition-all duration-300"
                placeholder="감동받았던 친절 사례나 칭찬하고 싶은 내용을 구체적으로 들려주세요."
                value={nurseReason}
                onChange={(e) => setNurseReason(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* CARD 3: ADMIN */}
        <div
          className="glass-card transition-all duration-300 group hover:shadow-emerald-500/[0.02]"
          style={{
            borderLeft: '4px solid var(--accent-emerald)',
          }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-100/50 dark:border-emerald-950/20">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Building2 size={18} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">2. 기타 파트 추천</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-500">필수</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                <p><strong>• 진료지원:</strong> 약제과, 방사선과, 임상병리과, 물리치료실 등</p>
                <p><strong>• 행정/관리:</strong> 원무과, 총무과, 원내 미화/보안, 영양팀 등</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="form-label text-slate-700 dark:text-slate-300">
                추천 직원 성함
              </label>
              <input
                type="text"
                className="form-input text-sm"
                placeholder="성함 및 부서 (예: 원무과 홍길동, 약제과 김OO)"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="form-label text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MessageSquare size={13} className="text-emerald-400" /> 구체적인 추천 이유
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  {adminReason.trim().length}자 입력됨
                </span>
              </div>
              <textarea
                className="form-input h-28 text-sm leading-relaxed resize-none transition-all duration-300"
                placeholder="신속하고 세심한 행정 서비스나 도움을 준 칭찬 사례를 들려주세요."
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2 space-y-4">
          {errorMsg && (
            <div className="p-3.5 rounded-xl text-center text-xs font-bold text-rose-500 bg-rose-500/5 border border-rose-500/10">
              {errorMsg}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="btn-premium w-full py-4 text-center justify-center font-extrabold text-base tracking-wide flex items-center gap-2 group transition-all duration-300"
            style={{
              boxShadow: isFormValid() ? '0 12px 30px rgba(79, 70, 229, 0.25)' : 'none'
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>투표를 제출하는 중입니다...</span>
              </>
            ) : (
              <>
                <span>두 부서 추천 동시에 제출하기</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
          
          {!isFormValid() && !isLoading && (
            <p className="text-center text-xs text-slate-400 font-medium leading-normal">
              투표자 정보(이름, 핸드폰 뒷자리)와 각 부서별 추천 직원명 및 사유를<br />
              모두 작성해 주시면 제출 버튼이 활성화됩니다.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

