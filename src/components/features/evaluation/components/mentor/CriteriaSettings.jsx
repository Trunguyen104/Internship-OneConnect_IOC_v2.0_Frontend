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
      width: '100px',
    },
    {
      title: LABELS.WEIGHT,
      key: 'weight',
      align: 'center',
      width: '100px',
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
              className="rounded-full px-5 h-9 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-[10px] flex items-center gap-1.5"
              onClick={() => {
                setEditingItem('new');
                setFormData({ name: '', description: '', maxScore: 10, weight: 1 });
              }}
            >
              <PlusOutlined className="text-[12px]" /> {LABELS.ADD_NEW}
            </Button>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={720}
      className="premium-modal"
    >
      <div className="py-2 min-h-[350px]">
        {editingItem ? (
          /* FORM VIEW - Replaces Table */
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl border border-gray-100 bg-gray-50/20 p-6 shadow-sm">
              <div className="col-span-2 space-y-2">
                <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <EditOutlined className="text-[12px]" />
                  {LABELS.CRITERIA_NAME}
                </span>
                <Input
                  placeholder={LABELS.CRITERIA_NAME}
                  className="h-11 rounded-xl border-gray-100 bg-white font-bold text-sm transition-all focus:border-primary/30"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MoreOutlined className="text-[12px]" />
                  {LABELS.MAX_SCORE}
                </span>
                <InputNumber
                  className="h-11 w-full rounded-xl border-gray-100 bg-white font-black text-base focus:border-primary/30"
                  min={1}
                  value={formData.maxScore}
                  onChange={(val) => setFormData({ ...formData, maxScore: val })}
                  controls={false}
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MoreOutlined className="text-[12px]" />
                  {LABELS.WEIGHT}
                </span>
                <InputNumber
                  className="h-11 w-full rounded-xl border-gray-100 bg-white font-black text-base focus:border-primary/30"
                  min={0}
                  step={0.1}
                  value={formData.weight}
                  onChange={(val) => setFormData({ ...formData, weight: val })}
                  controls={false}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MoreOutlined className="text-[12px]" />
                  {LABELS.DESCRIPTION}
                </span>
                <Input.TextArea
                  placeholder={LABELS.DESCRIPTION}
                  className="rounded-xl border-gray-100 bg-white p-3 text-sm font-medium transition-all focus:border-primary/30"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-1">
              <Button
                variant="outline"
                className="rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px] border-gray-200"
                onClick={() => setEditingItem(null)}
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant="primary"
                className="rounded-full h-10 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
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
