'use client';

import { message } from 'antd';
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LANDING_UI } from '@/constants/landing/uiText';
import { cn } from '@/lib/cn';
import { landingService } from '@/services/landing.service';

const OTP_COUNTDOWN_SEC = 60;

function isApiSuccess(response) {
  return response?.success === true || response?.isSuccess === true;
}

export function ReservationSection() {
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [formData, setFormData] = useState({
    partnerType: 'University', // Default to University
    partnerName: '',
    email: '',
    phone: '',
    area: '',
    hiringCount: '',
    consultationDate: '',
    note: '',
  });
  const [selectedTime, setSelectedTime] = useState('');

  const LL = LANDING_UI.RESERVATION.FORM;

  useEffect(() => {
    if (otpCountdown <= 0) return undefined;
    const t = setInterval(() => {
      setOtpCountdown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [otpCountdown]);

  const updateField = (field, value) => {
    if (field === 'email') {
      setOtpVerified(false);
      setOtpCode('');
      setShowOtpField(false);
      setOtpCountdown(0);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
      message.warning('Please enter your email.');
      return;
    }
    if (!emailRegex.test(formData.email)) {
      message.error('Invalid email address.');
      return;
    }
    if (otpCountdown > 0) return;

    setSendingOtp(true);
    try {
      // Step 1: Check if this email is already registered to skip OTP
      const checkResponse = await landingService.checkLandingEmailRegistered({
        email: formData.email.trim(),
      });
      if (isApiSuccess(checkResponse) && checkResponse.data === true) {
        // Registered User -> Bypass OTP
        message.success(checkResponse.message || 'Already a partner! OTP skipped.');
        setOtpVerified(true);
        setShowOtpField(false);
        setSendingOtp(false);
        setOtpCountdown(0);
        return;
      }

      // Step 2: Proceed with OTP send for new emails
      const response = await landingService.sendLandingOtp({ email: formData.email.trim() });
      if (isApiSuccess(response)) {
        message.success(response.message || 'Verification code sent!');
        setShowOtpField(true);
        setOtpVerified(false);
        setOtpCountdown(OTP_COUNTDOWN_SEC);
      } else {
        message.error(response.message || 'Failed to send code. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      if (error.status === 429) {
        message.error('Too many requests. Please try again later.');
      } else {
        message.error(error.message || 'Failed to send code at this time.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otpCode.trim())) {
      message.warning('Please enter the 6-digit OTP code.');
      return;
    }
    setVerifyingOtp(true);
    try {
      const response = await landingService.verifyLandingOtp({
        email: formData.email.trim(),
        otpCode: otpCode.trim(),
      });
      if (isApiSuccess(response)) {
        setOtpVerified(true);
        message.success(response.message || LL.VERIFIED_SUCCESS);
      } else {
        message.error(response.message || 'Invalid OTP code.');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      message.error(error.message || 'Failed to verify code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.partnerName ||
      !formData.email ||
      !formData.phone ||
      !formData.consultationDate ||
      !selectedTime
    ) {
      message.warning('Please fill in all required fields.');
      return;
    }

    if (!otpVerified) {
      message.warning('Please verify your email with OTP before submitting.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error('Invalid email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await landingService.sendReservation({
        ...formData,
        selectedTime,
      });

      if (isApiSuccess(response)) {
        message.success(response.message || 'Your request was sent successfully!');
        // Reset form
        setFormData({
          partnerType: 'University',
          partnerName: '',
          email: '',
          phone: '',
          area: '',
          hiringCount: '',
          consultationDate: '',
          note: '',
        });
        setSelectedTime('');
        setOtpCode('');
        setShowOtpField(false);
        setOtpVerified(false);
        setOtpCountdown(0);
      } else {
        message.error(response.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      if (error.status === 429) {
        message.error('Too many requests. Please try again after 10 minutes.');
      } else {
        message.error(error.message || 'Failed to send request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const partnerTypes = [
    {
      label: LL.PARTNER_TYPE_UNIVERSITY,
      value: 'University',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    {
      label: LL.PARTNER_TYPE_ENTERPRISE,
      value: 'Enterprise',
      icon: <Building2 className="h-4 w-4" />,
    },
  ];

  return (
    <section id="reservation-form" className="py-24 bg-slate-50/50 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {LL.REGISTRATION_TAG}
              </span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900">
                {LANDING_UI.RESERVATION.TITLE_PREFIX}{' '}
                <span className="text-primary tracking-tight">{LL.PARTNERS_HIGHLIGHT}</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                {LANDING_UI.RESERVATION.DESCRIPTION}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-primary group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {LANDING_UI.RESERVATION.HOTLINE_LABEL}
                  </p>
                  <p className="font-bold text-xl text-slate-900">
                    {LANDING_UI.RESERVATION.HOTLINE_NUMBER}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="font-bold text-sm">{LL.SECURITY_VERIFICATION_TITLE}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {LL.SECURITY_VERIFICATION_DESC}
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="relative space-y-10">
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {LL.PARTNER_INFO_TITLE}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {partnerTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateField('partnerType', type.value)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                        formData.partnerType === type.value
                          ? 'border-primary bg-primary/5 text-primary shadow-sm'
                          : 'border-slate-100 bg-slate-50/50 text-slate-500 hover:border-slate-200'
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-lg',
                          formData.partnerType === type.value
                            ? 'bg-primary text-white'
                            : 'bg-white text-slate-400 border border-slate-100'
                        )}
                      >
                        {type.icon}
                      </div>
                      <span className="font-bold text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label={
                      formData.partnerType === 'University'
                        ? LL.UNIVERSITY_LABEL
                        : LL.ENTERPRISE_LABEL
                    }
                    value={formData.partnerName}
                    onChange={(e) => updateField('partnerName', e.target.value)}
                    placeholder={
                      formData.partnerType === 'University'
                        ? LL.UNIVERSITY_PLACEHOLDER
                        : LL.ENTERPRISE_PLACEHOLDER
                    }
                    required
                    prefix={
                      formData.partnerType === 'University' ? (
                        <GraduationCap className="h-4 w-4 text-slate-400 mr-1" />
                      ) : (
                        <Building2 className="h-4 w-4 text-slate-400 mr-1" />
                      )
                    }
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    {LL.EMAIL} <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="email"
                        className={cn(
                          'flex-1',
                          otpVerified && 'border-emerald-200 bg-emerald-50/30 pr-10'
                        )}
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder={LL.EMAIL_PLACEHOLDER}
                        required
                        disabled={otpVerified}
                        prefix={<Mail className="h-4 w-4 text-slate-400 mr-1" />}
                      />
                      {otpVerified && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    {!otpVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        className="sm:w-[160px] h-10 shrink-0 font-bold text-xs"
                        disabled={sendingOtp || otpCountdown > 0}
                        onClick={handleSendOtp}
                      >
                        {sendingOtp
                          ? 'Sending...'
                          : otpCountdown > 0
                            ? `Resend (${otpCountdown}s)`
                            : LL.SEND_OTP}
                      </Button>
                    )}
                  </div>
                </div>

                {showOtpField && !otpVerified && (
                  <div className="md:col-span-2 flex flex-col gap-2 p-5 bg-slate-50 border border-slate-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {LL.OTP_LABEL}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        className="flex-1 tracking-[0.5em] font-mono text-center text-lg h-12"
                        value={otpCode}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setOtpCode(v);
                        }}
                        placeholder={LL.OTP_PLACEHOLDER}
                      />
                      <Button
                        type="button"
                        className="sm:w-[140px] h-12 font-bold bg-slate-900 hover:bg-slate-800"
                        disabled={verifyingOtp || otpCode.length !== 6}
                        onClick={handleVerifyOtp}
                      >
                        {verifyingOtp ? 'Wait...' : LL.VERIFY_OTP}
                      </Button>
                    </div>
                    <p className="text-[11px] text-slate-500 text-center sm:text-left italic">
                      {LL.OTP_HINT}
                    </p>
                  </div>
                )}

                <Input
                  label={LL.PHONE}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder={LL.PHONE_PLACEHOLDER}
                  required
                  prefix={<Phone className="h-4 w-4 text-slate-400 mr-1" />}
                />

                <Input
                  label={LL.DATE}
                  type="date"
                  value={formData.consultationDate}
                  onChange={(e) => updateField('consultationDate', e.target.value)}
                  required
                  prefix={<CalendarDays className="h-4 w-4 text-slate-400 mr-1" />}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {LL.TIME_SLOT} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedTime}
                    onChange={setSelectedTime}
                    placeholder={LL.TIME_PLACEHOLDER}
                    options={LL.TIME_SLOTS.map((t) => ({ label: t, value: t }))}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {LL.AREA}
                  </label>
                  <Select
                    value={formData.area}
                    onChange={(val) => updateField('area', val)}
                    placeholder={LL.AREA_PLACEHOLDER}
                    options={LL.AREAS.map((area) => ({ label: area, value: area }))}
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">{LL.NOTE}</label>
                  <Textarea
                    value={formData.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    placeholder={LL.NOTE_PLACEHOLDER}
                    className="min-h-[120px] rounded-xl border-slate-200 focus:border-primary transition-colors py-3"
                  />
                </div>
              </div>

              <div className="pt-6 space-y-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !otpVerified}
                  className={cn(
                    'w-full h-14 rounded-2xl text-lg font-black shadow-xl transition-all duration-300',
                    !otpVerified
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] shadow-primary/25'
                  )}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {LL.PROCESSING}
                    </div>
                  ) : (
                    <>{LL.SUBMIT_BUTTON}</>
                  )}
                </Button>

                <div className="flex flex-col items-center gap-4">
                  <p className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] text-center">
                    <ShieldCheck className="h-4 w-4" />
                    {LL.SECURITY_NOTICE}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
