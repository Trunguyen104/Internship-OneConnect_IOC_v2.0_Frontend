'use client';

import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Input, InputNumber } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import DataTable from '@/components/ui/datatable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';

import { EvaluationService } from '../../services/evaluation.service';

export default function CriteriaSettings({ cycle, open, onClose }) {
  const { LABELS, BUTTONS, MESSAGES, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // 'new' | record
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxScore: 10,
    weight: 1,
  });

  const fetchCriteria = useCallback(async () => {
    try {
      setLoading(true);
      const res = await EvaluationService.getCriteria(cycle.cycleId);
      setCriteria(res?.data || []);
    } catch {
      toast.error(MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  }, [cycle.cycleId, toast, MESSAGES.FETCH_ERROR]);

  useEffect(() => {
    if (open && cycle) fetchCriteria();
  }, [open, cycle, fetchCriteria]);

  const handleSave = async () => {
    if (!formData.name) return toast.error(MESSAGES.NAME_REQUIRED);
    if (formData.maxScore <= 0) return toast.error(MESSAGES.MAX_SCORE_POSITIVE);

    try {
      if (editingItem === 'new') {
        await EvaluationService.createCriteria(cycle.cycleId, formData);
        toast.success(MESSAGES.CREATE_SUCCESS);
      } else {
        await EvaluationService.updateCriteria(editingItem.criteriaId, formData);
        toast.success(MESSAGES.UPDATE_SUCCESS);
      }
      setEditingItem(null);
      fetchCriteria();
    } catch (error) {
      toast.error(error.response?.data?.message || MESSAGES.VALIDATION_ERROR);
    }
  };

  const handleDelete = async (criteriaId) => {
    try {
      await EvaluationService.deleteCriteria(criteriaId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchCriteria();
    } catch (error) {
      toast.error(error.response?.data?.message || MESSAGES.FETCH_ERROR);
    }
  };

  const columns = [
    {
      title: LABELS.CRITERIA_NAME,
      key: 'name',
      render: (text) => (
        <span className="block truncate font-medium" title={text}>
          {text}
        </span>
      ),
    },
    {
      title: LABELS.MAX_SCORE,
      key: 'maxScore',
      align: 'center',
      width: '110px',
    },
    {
      title: LABELS.WEIGHT,
      key: 'weight',
      align: 'center',
      width: '110px',
    },
    {
      title: TABLE_COLUMNS.ACTIONS,
      key: 'actions',
      align: 'right',
      width: '80px',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined className="text-blue-500" />,
            onClick: () => {
              setEditingItem(record);
              setFormData({
                name: record.name,
                description: record.description,
                maxScore: record.maxScore,
                weight: record.weight,
              });
            },
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined className="text-red-500" />,
            danger: true,
            onClick: () => handleDelete(record.criteriaId),
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0 transition-all hover:bg-slate-100"
            >
              <MoreOutlined className="text-muted text-lg" />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <CompoundModal
      title={
        <div className="flex items-center justify-between pr-8 min-h-[60px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              {editingItem
                ? editingItem === 'new'
                  ? LABELS.ADD_NEW
                  : BUTTONS.EDIT
                : LABELS.EDIT_CRITERIA}
            </span>
            <h3 className="m-0 text-xl font-black tracking-tighter text-text">
              {editingItem ? formData.name || 'New Criteria' : 'Evaluation Criteria'}
            </h3>
          </div>
          {!editingItem && (
            <Button
              variant="primary"
              size="lg"
              className="rounded-full px-8 h-11 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-[11px] flex items-center gap-2"
              onClick={() => {
                setEditingItem('new');
                setFormData({ name: '', description: '', maxScore: 10, weight: 1 });
              }}
            >
              <PlusOutlined /> {LABELS.ADD_NEW}
            </Button>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
    >
      <div className="py-6 min-h-[400px]">
        {editingItem ? (
          /* FORM VIEW - Replaces Table */
          <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 rounded-[32px] border border-gray-100 bg-gray-50/30 p-8 shadow-sm">
              <div className="col-span-2 space-y-2.5">
                <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
                  {LABELS.CRITERIA_NAME}
                </span>
                <Input
                  placeholder={LABELS.CRITERIA_NAME}
                  className="h-12 rounded-2xl border-none! bg-white shadow-sm font-bold text-sm focus:ring-4 focus:ring-primary/5 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
                  {LABELS.MAX_SCORE}
                </span>
                <InputNumber
                  className="h-12 w-full rounded-2xl border-none! bg-white shadow-sm font-black text-lg [&_.ant-input-number-input]:h-12 [&_.ant-input-number-input]:leading-[48px] focus:ring-4 focus:ring-primary/5 transition-all"
                  min={1}
                  value={formData.maxScore}
                  onChange={(val) => setFormData({ ...formData, maxScore: val })}
                  controls={false}
                />
              </div>

              <div className="space-y-2.5">
                <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
                  {LABELS.WEIGHT}
                </span>
                <InputNumber
                  className="h-12 w-full rounded-2xl border-none! bg-white shadow-sm font-black text-lg [&_.ant-input-number-input]:h-12 [&_.ant-input-number-input]:leading-[48px] focus:ring-4 focus:ring-primary/5 transition-all"
                  min={0}
                  step={0.1}
                  value={formData.weight}
                  onChange={(val) => setFormData({ ...formData, weight: val })}
                  controls={false}
                />
              </div>

              <div className="col-span-2 space-y-2.5">
                <span className="text-[10px] font-black text-muted/50 uppercase tracking-widest ml-1 leading-none">
                  {LABELS.DESCRIPTION}
                </span>
                <Input.TextArea
                  placeholder={LABELS.DESCRIPTION}
                  className="rounded-[24px] border-none! bg-white shadow-sm p-4 text-sm font-medium focus:ring-4 focus:ring-primary/5 transition-all"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                className="rounded-full h-12 px-8 font-black uppercase tracking-widest text-[11px] border-gray-200 transition-all hover:bg-white active:scale-95"
                onClick={() => setEditingItem(null)}
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant="primary"
                className="rounded-full h-12 px-12 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                onClick={handleSave}
              >
                {BUTTONS.SAVE}
              </Button>
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar-minimal rounded-[32px] border border-gray-100 bg-white shadow-sm overflow-hidden">
              <DataTable
                columns={columns}
                data={criteria}
                loading={loading}
                minWidth="0"
                emptyText={
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="p-8 rounded-[32px] bg-gray-50 ring-8 ring-gray-50/50">
                      <MoreOutlined className="text-4xl text-muted/20 rotate-90" />
                    </div>
                    <span className="text-sm font-black text-muted/30 uppercase tracking-widest">
                      {LABELS.NO_CRITERIA}
                    </span>
                  </div>
                }
              />
            </div>
          </div>
        )}
      </div>
    </CompoundModal>
  );
}
