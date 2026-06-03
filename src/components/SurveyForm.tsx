import React, { useState } from 'react';
import { CheckCircle2, Stethoscope, Building2, Sparkles, User, Phone, Loader2 } from 'lucide-react';
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
        className="glass-card text-center max-w-2xl mx-auto py-20"
        style={{
          backgroundColor: 'rgba(255,255,255,0.94)',
          boxShadow: '0 24px 60px rgba(99,102,241,0.07), 0 0 0 1px rgba(16,185,129,0.08)',
          animation: 'fadeIn 0.5s ease forwards',
        }}
      >
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ backgroundColor: 'rgba(16,185,129,0.08)', animationDuration: '2s' }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '2px solid rgba(16,185,129,0.15)' }}
            >
              <Sparkles size={44} style={{ color: 'var(--accent-emerald)' }} />
            </div>
          </div>
        </div>

        <h2
          className="text-3xl font-extrabold mb-3"
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          투표에 참여해 주셔서<br />진심으로 감사합니다! 🙏
        </h2>
        <p className="text-base font-semibold text-slate-600 mb-2">
          소중한 추천이 안전하게 접수되었습니다.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto mb-10">
          직원들의 따뜻한 친절함을 기억해 주시고 추천해 주신 덕분에<br />
          더욱 행복한 병원 환경을 만들어 갈 수 있습니다.<br />
          <span className="font-semibold text-slate-500 mt-1 block">
            귀하의 참여에 다시 한번 깊이 감사드립니다.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10 px-4">
          <div
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-rose-600 text-left"
            style={{ backgroundColor: 'rgba(225,29,72,0.04)', border: '1px solid rgba(225,29,72,0.12)' }}
          >
            <span className="text-xs text-rose-400 font-bold block mb-0.5">🩺 간호부 추천 사원</span>
            <span className="text-slate-700 font-bold">{submittedNurseName}</span>
          </div>
          <div
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-emerald-600 text-left"
            style={{ backgroundColor: 'rgba(5,150,105,0.04)', border: '1px solid rgba(5,150,105,0.12)' }}
          >
            <span className="text-xs text-emerald-500 font-bold block mb-0.5">🏢 행정부서 추천 사원</span>
            <span className="text-slate-700 font-bold">{submittedAdminName}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setVoterName(''); setVoterPhone('');
            setNurseName(''); setNurseReason('');
            setAdminName(''); setAdminReason('');
            setIsSubmitted(false);
          }}
          className="btn-premium px-10 py-3"
        >
          추가로 투표하기
        </button>
      </div>
    );
  }

  /* ─── VOTE FORM ─── */
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* VOTER INFO CARD */}
        <div
          className="glass-card"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(99,102,241,0.12)' }}
        >
          <div className="flex items-center gap-2.5 mb-6 pb-4" style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(99,102,241,0.08)', color: 'var(--primary)' }}>
              <User size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">투표자 정보</h3>
              <p className="text-xs text-slate-400">투표하시는 분의 기본 정보를 입력해 주세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="form-label text-slate-700 flex items-center gap-1">
                <User size={13} style={{ color: 'var(--primary)' }} />
                투표자 이름 <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                className="form-input text-sm"
                placeholder="성함을 입력해 주세요"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <label className="form-label text-slate-700 flex items-center gap-1">
                <Phone size={13} style={{ color: 'var(--primary)' }} />
                핸드폰 뒷자리 (4자리) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-input text-sm font-mono tracking-widest text-center"
                  placeholder="0000"
                  value={voterPhone}
                  onChange={handlePhoneInput}
                  maxLength={4}
                  style={{ letterSpacing: voterPhone.length > 0 ? '0.3em' : undefined }}
                />
                {voterPhone.length > 0 && voterPhone.length < 4 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{voterPhone.length}/4</span>
                )}
                {voterPhone.length === 4 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <CheckCircle2 size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: NURSING */}
        <div className="glass-card border-rose-500/10 hover:border-rose-500/20" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-rose-100/50">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Stethoscope size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">1. 간호부 친절 사원 추천</h3>
              <p className="text-xs text-slate-400">병동, 외래, 수술실 등 성심껏 응대해준 간호부 직원을 추천해주세요.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="form-label text-slate-700">추천할 간호부 사원 이름</label>
              <input type="text" className="form-input text-sm" placeholder="간호사 성함 및 직급을 입력해 주세요 (예: 홍길동 간호사)" value={nurseName} onChange={(e) => setNurseName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="form-label text-slate-700">친절 사원 추천 이유</label>
              <textarea className="form-input h-28 text-sm leading-relaxed resize-none" placeholder="환자 또는 동료로 대하며 느꼈던 구체적인 칭찬 사례를 적어 주세요." value={nurseReason} onChange={(e) => setNurseReason(e.target.value)} />
            </div>
          </div>
        </div>

        {/* SECTION 2: ADMIN */}
        <div className="glass-card border-emerald-500/10 hover:border-emerald-500/20" style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}>
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-emerald-100/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <Building2 size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">2. 행정부서 친절 사원 추천</h3>
              <p className="text-xs text-slate-400">원무과, 총무과, 기획 등 행정 부서에서 큰 도움을 준 직원을 추천해주세요.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="form-label text-slate-700">추천할 행정부서 사원 이름</label>
              <input type="text" className="form-input text-sm" placeholder="성함 및 부서/직급을 입력해 주세요 (예: 이민지 대리)" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="form-label text-slate-700">친절 사원 추천 이유</label>
              <textarea className="form-input h-28 text-sm leading-relaxed resize-none" placeholder="빠르고 세심한 안내 등 칭찬하고 싶었던 점을 적어 주세요." value={adminReason} onChange={(e) => setAdminReason(e.target.value)} />
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-2 space-y-3">
          {errorMsg && (
            <p className="text-center text-xs text-rose-500 font-bold">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="btn-premium w-full py-4 text-center justify-center font-bold"
          >
            {isLoading ? (
              <><Loader2 size={20} className="animate-spin" /> 제출 중...</>
            ) : (
              <><CheckCircle2 size={20} /> 두 부서 투표 동시에 제출하기</>
            )}
          </button>
          {(!voterName.trim() || voterPhone.length < 4) && !isLoading && (
            <p className="text-center text-xs text-slate-400">
              투표자 이름과 핸드폰 뒷자리를 모두 입력해야 제출할 수 있습니다.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
