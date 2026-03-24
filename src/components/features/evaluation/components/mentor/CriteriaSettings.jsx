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
        <div className="flex h-11 items-center justify-between pr-10">
          <div className="flex flex-col justify-center">
            <h3 className="m-0 text-xl font-bold tracking-tight leading-none text-slate-900">
              {editingItem
                ? editingItem === 'new'
                  ? LABELS.ADD_NEW
                  : BUTTONS.EDIT
                : LABELS.EDIT_CRITERIA}
            </h3>
            {editingItem && cycle?.name && (
              <span className="mt-1.5 text-[10px] font-semibold uppercase text-slate-400">
                {cycle.name}
              </span>
            )}
          </div>
          {!editingItem && (
            <Button
              variant="primary"
              size="sm"
              className="flex h-9 items-center gap-1.5 rounded-lg px-5 text-sm font-bold shadow-sm transition-all active:scale-95 -translate-y-[3px]"
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
      width={700}
      style={{ maxWidth: '95vw' }}
    >
      <div className="py-4">
        {editingItem ? (
          /* FORM VIEW - Replaces Table */
          <div className="animate-in fade-in zoom-in-95 space-y-6 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {LABELS.CRITERIA_NAME}
                </label>
                <Input
                  placeholder={LABELS.CRITERIA_NAME}
                  className="h-10 rounded-xl border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {LABELS.MAX_SCORE}
                </label>
                <InputNumber
                  className="h-10 w-full rounded-xl pt-1 border-slate-200"
                  min={1}
                  value={formData.maxScore}
                  onChange={(val) => setFormData({ ...formData, maxScore: val })}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {LABELS.WEIGHT}
                </label>
                <InputNumber
                  className="h-10 w-full rounded-xl pt-1 border-slate-200"
                  min={0}
                  step={0.1}
                  value={formData.weight}
                  onChange={(val) => setFormData({ ...formData, weight: val })}
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  {LABELS.DESCRIPTION}
                </label>
                <Input.TextArea
                  placeholder={LABELS.DESCRIPTION}
                  className="rounded-xl border-slate-200"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                className="h-11 rounded-xl px-6 font-bold text-gray-500 hover:bg-slate-100"
                onClick={() => setEditingItem(null)}
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant="primary"
                className="h-11 rounded-xl px-10 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                onClick={handleSave}
              >
                {BUTTONS.SAVE}
              </Button>
            </div>
          </div>
        ) : (
          /* TABLE VIEW */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <DataTable
                columns={columns}
                data={criteria}
                loading={loading}
                minWidth="0"
                emptyText={LABELS.NO_CRITERIA}
              />
            </div>
          </div>
        )}
      </div>
    </CompoundModal>
  );
}
