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

  // Calculate popup position when open
  useEffect(() => {
    if (open && buttonRef.current && typeof window !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupStyle({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.max(8, rect.right - 330),
      });
    }
  }, [open]);

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

  const handleOpen = () => {
    const initDate = value ? dayjs(value) : dayjs();
    setViewDate(initDate);
    setSelectedDate(value ? dayjs(value) : null);
    setInputValue(value ? dayjs(value).format('MM/DD/YYYY') : '');
    setOpen(true);
  };

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
        onClick={handleOpen}
        className='flex h-10 w-full items-center justify-between rounded-full border border-red-100 bg-red-50/50 px-4 text-[13.5px] font-semibold text-red-500 transition-colors hover:bg-red-50'
      >
        <span className={value ? 'text-slate-700' : 'font-medium text-slate-400'}>
          {value ? dayjs(value).format('MM/DD/YYYY') : 'Select Date'}
        </span>
        <CalendarIcon className='h-4 w-4 text-red-500' />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className='pointer-events-none fixed inset-0 z-100000'>
            {/* We do not block clicks outside because we handle it via mousedown listener, letting users interact naturally with the rest of the app */}
            <div
              ref={popupRef}
              className='pointer-events-auto absolute w-[330px] origin-bottom-right rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0px_4px_30px_rgba(0,0,0,0.12)] transition-all'
              style={popupStyle}
            >
              {/* Header */}
              <div className='mb-5 flex items-center justify-between px-1'>
                <button
                  type='button'
                  onClick={() => setViewDate(viewDate.subtract(1, 'month'))}
                  className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700'
                >
                  <ChevronLeft className='h-5 w-5' />
                </button>
                <span className='text-[15px] font-bold text-slate-800'>
                  {viewDate.format('MMMM YYYY')}
                </span>
                <button
                  type='button'
                  onClick={() => setViewDate(viewDate.add(1, 'month'))}
                  className='flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700'
                >
                  <ChevronRight className='h-5 w-5' />
                </button>
              </div>

              {/* Quick Input Row */}
              <div className='mb-5 flex items-center gap-2'>
                <input
                  className='h-10 flex-1 rounded-full border border-slate-200 px-4 text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#A32A2A] focus:ring-1 focus:ring-[#A32A2A]'
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
                  className='h-10 shrink-0 rounded-full bg-red-50 px-[14px] text-[13px] font-bold text-[#A32A2A] transition-colors hover:bg-red-100'
                >
                  Today
                </button>
              </div>

              {/* Weekdays */}
              <div className='mb-2 grid grid-cols-7'>
                {weekDays.map((d) => (
                  <div key={d} className='text-center text-[12px] font-bold text-slate-800'>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className='mb-5 grid grid-cols-7 gap-y-1'>
                {days.map((d) => {
                  const isCurrentMonth = d.month() === viewDate.month();
                  const isSelected = selectedDate && d.isSame(selectedDate, 'day');
                  const isToday = d.isSame(dayjs(), 'day');

                  return (
                    <div
                      key={d.format('YYYYMMDD')}
                      className='flex h-10 items-center justify-center'
                    >
                      <button
                        type='button'
                        onClick={() => {
                          setSelectedDate(d);
                          setInputValue(d.format('MM/DD/YYYY'));
                        }}
                        className={`relative flex h-[32px] w-[32px] items-center justify-center rounded-full text-[13.5px] font-medium transition-colors ${!isCurrentMonth ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'} ${isSelected ? 'bg-[#A32A2A] font-bold text-white hover:bg-red-800' : ''} `}
                      >
                        {d.date()}
                        {isToday && !isSelected && (
                          <span className='absolute bottom-[4px] h-[3px] w-1 rounded-full bg-[#A32A2A]' />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className='-mx-5 mb-4 h-px bg-slate-100'></div>

              {/* Footer Buttons */}
              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setOpen(false)}
                  className='h-11 flex-1 rounded-full bg-red-50 text-[14px] font-bold text-[#A32A2A] transition-colors hover:bg-red-100'
                >
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={handleApply}
                  className='h-11 flex-1 rounded-full bg-[#A32A2A] text-[14px] font-bold text-white transition-colors hover:bg-red-800'
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
