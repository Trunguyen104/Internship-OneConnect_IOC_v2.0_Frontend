'use client';

import { ArrowRight, Phone } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LANDING_UI } from '@/constants/landing/uiText';

export function ReservationSection() {
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    area: '',
    hiringCount: '',
    consultationDate: '',
    note: '',
  });
  const [selectedTime, setSelectedTime] = useState('');

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const timeSlots = ['08:00 - 10:00', '10:00 - 12:00', '13:30 - 15:30', '15:30 - 17:00'];
  const areas = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Cần Thơ', 'Khác'];

  return (
    <section id="reservation-form" className="py-24 bg-slate-50/50 scroll-mt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-slate-900">
              {LANDING_UI.RESERVATION.TITLE_PREFIX}{' '}
              <span className="text-primary">{LANDING_UI.RESERVATION.TITLE_HIGHLIGHT}</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {LANDING_UI.RESERVATION.DESCRIPTION}
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
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
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label={LANDING_UI.RESERVATION.FORM.COMPANY_NAME}
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder={LANDING_UI.RESERVATION.FORM.COMPANY_PLACEHOLDER}
                required
              />

              <Input
                label={LANDING_UI.RESERVATION.FORM.PHONE}
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder={LANDING_UI.RESERVATION.FORM.PHONE_PLACEHOLDER}
                required
              />

              <Input
                label={LANDING_UI.RESERVATION.FORM.DATE}
                type="date"
                value={formData.consultationDate}
                onChange={(e) => updateField('consultationDate', e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {LANDING_UI.RESERVATION.FORM.TIME_SLOT}
                </label>
                <Select
                  value={selectedTime}
                  onChange={setSelectedTime}
                  placeholder={LANDING_UI.RESERVATION.FORM.TIME_PLACEHOLDER}
                  options={timeSlots.map((t) => ({ label: t, value: t }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {LANDING_UI.RESERVATION.FORM.AREA}
                </label>
                <Select
                  value={formData.area}
                  onChange={(val) => updateField('area', val)}
                  placeholder={LANDING_UI.RESERVATION.FORM.AREA_PLACEHOLDER}
                  options={areas.map((area) => ({ label: area, value: area }))}
                />
              </div>

              <Input
                label={LANDING_UI.RESERVATION.FORM.HIRING_COUNT}
                type="number"
                min={1}
                value={formData.hiringCount}
                onChange={(e) => updateField('hiringCount', e.target.value)}
                placeholder={LANDING_UI.RESERVATION.FORM.HIRING_PLACEHOLDER}
              />

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {LANDING_UI.RESERVATION.FORM.NOTE}
                </label>
                <Textarea
                  value={formData.note}
                  onChange={(e) => updateField('note', e.target.value)}
                  placeholder={LANDING_UI.RESERVATION.FORM.NOTE_PLACEHOLDER}
                  className="min-h-[100px]"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <Button size="lg" className="w-full h-12 rounded-lg text-base font-bold shadow-md">
                  {LANDING_UI.RESERVATION.FORM.SUBMIT_BUTTON}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-center text-[11px] text-slate-400 mt-6 uppercase tracking-wider">
                  {LANDING_UI.RESERVATION.FORM.SECURITY_NOTICE}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
