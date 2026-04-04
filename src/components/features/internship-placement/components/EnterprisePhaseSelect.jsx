'use client';

import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import React from 'react';

import { PLACEMENT_UI_TEXT } from '../constants/placement.constants';
import { PlacementService } from '../services/placement.service';

/**
 * Custom searchable dropdown for (Enterprise + Intern Phase).
 * AC-01: Displays Enterprise, Phase, Majors, and Capacity.
 */
const EnterprisePhaseSelect = ({
  semesterId,
  value,
  onChange,
  placeholder = PLACEMENT_UI_TEXT.SELECT.PHASE_PLACEHOLDER,
  className = '',
}) => {
  const { data: res, isLoading } = useQuery({
    queryKey: ['eligible-phases', semesterId],
    queryFn: () => PlacementService.getEligiblePhases(semesterId),
    enabled: !!semesterId,
  });

  const UI = PLACEMENT_UI_TEXT.SELECT;
  const phases = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

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
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full ${className}`}
      optionLabelProp="label"
      filterOption={(input, option) => {
        const searchStr =
          `${option.children.props.enterpriseName} ${option.children.props.phaseName}`.toLowerCase();
        return searchStr.includes(input.toLowerCase());
      }}
    >
      {Object.entries(groupedPhases).map(([entId, group]) => (
        <Select.OptGroup key={entId} label={group.enterpriseName}>
          {group.phases.map((phase) => (
            <Select.Option
              key={phase.internPhaseId || phase.id}
              value={phase.internPhaseId || phase.id}
              label={`${group.enterpriseName} — ${phase.phaseName}`}
            >
              <div
                className="flex flex-col py-1"
                enterpriseName={group.enterpriseName}
                phaseName={phase.phaseName}
              >
                <div className="flex justify-between font-medium">
                  <span>{phase.phaseName}</span>
                  <span
                    className={`text-xs ${
                      phase.remainingCapacity <= 2 ? 'text-red-500 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {phase.remainingCapacity}/{phase.totalCapacity} {UI.LEFT}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {UI.MAJORS}{' '}
                  {Array.isArray(phase.majorFields) ? phase.majorFields.join(', ') : 'All'}
                </div>
              </div>
            </Select.Option>
          ))}
        </Select.OptGroup>
      ))}
    </Select>
  );
};

export default EnterprisePhaseSelect;
