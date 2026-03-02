'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export default function DateInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const [viewDate, setViewDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [popupStyle, setPopupStyle] = useState({ bottom: 0, left: 0 });

  // Sync state when opening
  useEffect(() => {
    if (open) {
      const initDate = value ? dayjs(value) : dayjs();
      setViewDate(initDate);
      setSelectedDate(value ? dayjs(value) : null);
      setInputValue(value ? dayjs(value).format('MM/DD/YYYY') : '');

      if (buttonRef.current && typeof window !== 'undefined') {
        const rect = buttonRef.current.getBoundingClientRect();
        setPopupStyle({
          bottom: window.innerHeight - rect.top + 8,
          left: Math.max(8, rect.right - 330),
        });
      }
    }
  }, [open, value]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleApply = () => {
    if (selectedDate) {
      onChange?.(selectedDate.format('YYYY-MM-DD'));
    }
    setOpen(false);
  };

  const setToday = () => {
    const today = dayjs();
    setViewDate(today);
    setSelectedDate(today);
    setInputValue(today.format('MM/DD/YYYY'));
  };

  const startOfMonth = viewDate.startOf('month');
  const endOfMonth = viewDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const days = [];
  let current = startDate;
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    days.push(current);
    current = current.add(1, 'day');
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <>
      <button
        ref={buttonRef}
        type='button'
        onClick={() => setOpen(!open)}
        className='h-10 w-full rounded-full border border-red-100 bg-red-50/50 text-red-500 font-semibold text-[13.5px] flex items-center justify-between px-4 hover:bg-red-50 transition-colors'
      >
        <span className={value ? 'text-slate-700' : 'text-slate-400 font-medium'}>
          {value ? dayjs(value).format('MM/DD/YYYY') : 'Select Date'}
        </span>
        <CalendarIcon className='w-4 h-4 text-red-500' />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className='fixed inset-0 z-100000 pointer-events-none'>
            {/* We do not block clicks outside because we handle it via mousedown listener, letting users interact naturally with the rest of the app */}
            <div
              ref={popupRef}
              className='absolute bg-white rounded-[24px] shadow-[0px_4px_30px_rgba(0,0,0,0.12)] border border-slate-100 p-5 w-[330px] pointer-events-auto origin-bottom-right transition-all'
              style={popupStyle}
            >
              {/* Header */}
              <div className='flex items-center justify-between mb-5 px-1'>
                <button
                  type='button'
                  onClick={() => setViewDate(viewDate.subtract(1, 'month'))}
                  className='text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors'
                >
                  <ChevronLeft className='w-5 h-5' />
                </button>
                <span className='font-bold text-[15px] text-slate-800'>
                  {viewDate.format('MMMM YYYY')}
                </span>
                <button
                  type='button'
                  onClick={() => setViewDate(viewDate.add(1, 'month'))}
                  className='text-slate-400 hover:text-slate-700 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors'
                >
                  <ChevronRight className='w-5 h-5' />
                </button>
              </div>

              {/* Quick Input Row */}
              <div className='flex items-center gap-2 mb-5'>
                <input
                  className='flex-1 h-10 border border-slate-200 rounded-full px-4 text-[13px] font-medium text-slate-700 outline-none focus:border-[#A32A2A] focus:ring-1 focus:ring-[#A32A2A] placeholder:text-slate-400'
                  placeholder='MM / DD / YYYY'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const parsed = dayjs(e.target.value, 'MM/DD/YYYY', true);
                    if (parsed.isValid()) {
                      setSelectedDate(parsed);
                      setViewDate(parsed);
                    }
                  }}
                />
                <button
                  type='button'
                  onClick={setToday}
                  className='h-10 px-[14px] rounded-full text-[#A32A2A] font-bold text-[13px] bg-red-50 hover:bg-red-100 shrink-0 transition-colors'
                >
                  Today
                </button>
              </div>

              {/* Weekdays */}
              <div className='grid grid-cols-7 mb-2'>
                {weekDays.map((d) => (
                  <div key={d} className='text-center text-[12px] font-bold text-slate-800'>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className='grid grid-cols-7 gap-y-1 mb-5'>
                {days.map((d) => {
                  const isCurrentMonth = d.month() === viewDate.month();
                  const isSelected = selectedDate && d.isSame(selectedDate, 'day');
                  const isToday = d.isSame(dayjs(), 'day');

                  return (
                    <div
                      key={d.format('YYYYMMDD')}
                      className='flex items-center justify-center h-10'
                    >
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedDate(d);
                          setInputValue(d.format('MM/DD/YYYY'));
                        }}
                        className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-[13.5px] font-medium transition-colors relative
                        ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'}
                        ${isSelected ? 'bg-[#A32A2A] text-white hover:bg-red-800 font-bold' : ''}
                      `}
                      >
                        {d.date()}
                        {isToday && !isSelected && (
                          <span className='absolute bottom-[4px] w-1 h-[3px] bg-[#A32A2A] rounded-full' />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className='h-px bg-slate-100 -mx-5 mb-4'></div>

              {/* Footer Buttons */}
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='flex-1 h-11 rounded-full bg-red-50 text-[#A32A2A] font-bold text-[14px] hover:bg-red-100 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleApply}
                  className='flex-1 h-11 rounded-full bg-[#A32A2A] text-white font-bold text-[14px] hover:bg-red-800 transition-colors'
                >
                  Apply
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
