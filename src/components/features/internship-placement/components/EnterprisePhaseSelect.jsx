'use client';

import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React from 'react';

import { PLACEMENT_UI_TEXT } from '@/constants/internship-placement/placement.constants';

import { PlacementService } from '../services/placement.service';

/**
 * Custom searchable dropdown for (Enterprise + Intern Phase).
 * AC-01: Displays Enterprise, Phase, Majors, and Capacity.
 */
const EnterprisePhaseSelect = ({
  value,
  onChange,
  placeholder = PLACEMENT_UI_TEXT.SELECT.PHASE_PLACEHOLDER,
  className = '',
  searchTerm = '',
  termName,
}) => {
  const { data: res, isLoading } = useQuery({
    queryKey: ['eligible-phases', searchTerm],
    queryFn: () => PlacementService.getEligiblePhases({ searchTerm }),
  });

  const UI = PLACEMENT_UI_TEXT.SELECT;
  let phases = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

  // AC-01: Filter phases by current term name to avoid showing phases from other terms (e.g. show Spring 2026 only)
  if (termName) {
    // Robust cleaning: remove "(Active)", "(Ended)", etc. and trim
    const cleanTermName = termName
      .toLowerCase()
      .replace(/\(.*\)/g, '')
      .trim();
    const termYear = cleanTermName.match(/\d{4}/)?.[0];

    phases = phases.filter((phase) => {
      const pName = (phase.internPhaseName || phase.phaseName || '').toLowerCase();
      // Match if phase name contains the term name (e.g. "spring 2026")
      const matchesFullName = pName.includes(cleanTermName);
      // Fallback: match if it contains the year (e.g. "2026") to be safe but helpful
      const matchesYear = termYear && pName.includes(termYear);

      return matchesFullName || matchesYear;
    });
  }

  // Group phases by enterprise
  const groupedPhases = phases.reduce((acc, phase) => {
    const enterpriseId = phase.enterpriseId;
    if (!acc[enterpriseId]) {
      acc[enterpriseId] = {
        enterpriseName: phase.enterpriseName,
        phases: [],
      };
    }
    acc[enterpriseId].phases.push(phase);
    return acc;
  }, {});

  return (
    <Select
      showSearch
      loading={isLoading}
      value={value}
      onChange={(id) => {
        const selected = phases.find((p) => (p.internPhaseId || p.id) === id);
        onChange(id, selected);
      }}
      placeholder={placeholder}
      className={`w-full ${className}`}
      optionLabelProp="label"
      notFoundContent={
        <span className="text-muted text-[11px] p-4 text-center block italic">{UI.EMPTY}</span>
      }
      filterOption={(input, option) => {
        return (option.searchString || '').includes(input.toLowerCase());
      }}
    >
      {Object.entries(groupedPhases).map(([entId, group]) => (
        <Select.OptGroup
          key={entId}
          label={
            <div className="flex items-center gap-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="text-[11px] font-black tracking-widest text-muted uppercase">
                {group.enterpriseName}
              </span>
            </div>
          }
        >
          {group.phases.map((phase) => {
            const phaseName = phase.internPhaseName || phase.phaseName;
            const total = phase.capacity || phase.totalCapacity;
            const remaining = phase.remainingCapacity;
            const majors =
              typeof phase.majorFields === 'string'
                ? phase.majorFields.split(',').map((m) => m.trim())
                : Array.isArray(phase.majorFields)
                  ? phase.majorFields
                  : [UI.ALL];

            return (
              <Select.Option
                key={phase.internPhaseId || phase.id}
                value={phase.internPhaseId || phase.id}
                label={`${group.enterpriseName} — ${phaseName}`}
                enterpriseName={group.enterpriseName}
                phaseName={phaseName}
                // Custom prop for filtering
                searchString={`${group.enterpriseName} ${phaseName}`.toLowerCase()}
              >
                <div className="flex flex-col py-2 px-1 group/opt transition-all">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-text group-hover/opt:text-primary transition-colors">
                      {phaseName}
                    </span>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                        remaining <= 2
                          ? 'bg-danger-surface text-danger ring-1 ring-danger/20'
                          : remaining < total * 0.5
                            ? 'bg-warning-surface text-warning ring-1 ring-warning/20'
                            : 'bg-success-surface text-success ring-1 ring-success/20'
                      }`}
                    >
                      {remaining}/{total} {UI.SLOTS}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-[9px] font-black text-muted/40 uppercase tracking-widest shrink-0">
                        {UI.MAJORS}:
                      </span>
                      <div className="flex flex-wrap gap-1 items-center min-w-0">
                        {majors.slice(0, 3).map((m, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold text-muted bg-bg px-1.5 py-0 rounded border border-border/50 whitespace-nowrap"
                          >
                            {m}
                          </span>
                        ))}
                        {majors.length > 3 && (
                          <span className="text-[9px] text-muted font-bold">
                            +{majors.length - 3} {UI.MORE}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Select.Option>
            );
          })}
        </Select.OptGroup>
      ))}
    </Select>
  );
};

export default EnterprisePhaseSelect;
