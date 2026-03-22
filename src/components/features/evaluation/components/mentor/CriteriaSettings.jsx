'use client';

import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Input, InputNumber } from 'antd';
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
        await EvaluationService.updateCriteria(cycle.cycleId, editingItem.criteriaId, formData);
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
      await EvaluationService.deleteCriteria(cycle.cycleId, criteriaId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchCriteria();
    } catch (error) {
      toast.error(error.response?.data?.message || MESSAGES.FETCH_ERROR);
    }
  };

  const columns = [
    { title: LABELS.CRITERIA_NAME, key: 'name' },
    { title: LABELS.MAX_SCORE, key: 'maxScore', align: 'center' },
    { title: LABELS.WEIGHT, key: 'weight', align: 'center' },
    {
      title: TABLE_COLUMNS.ACTIONS,
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingItem(record);
              setFormData({
                name: record.name,
                description: record.description,
                maxScore: record.maxScore,
                weight: record.weight,
              });
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record.criteriaId)}
            className="text-red-500"
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <CompoundModal
      title={`${LABELS.EDIT_CRITERIA}: ${cycle?.name}`}
      open={open}
      onClose={onClose}
      className="w-full max-w-3xl"
    >
      <div className="space-y-6 py-4">
        {editingItem ? (
          <div className="space-y-4 rounded-xl border bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold">
                {editingItem === 'new' ? LABELS.ADD_NEW : BUTTONS.EDIT}
              </h4>
              <Button variant="ghost" size="sm" onClick={() => setEditingItem(null)}>
                <CloseOutlined />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold">{LABELS.CRITERIA_NAME}</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">{LABELS.MAX_SCORE}</label>
                <InputNumber
                  className="w-full"
                  min={1}
                  value={formData.maxScore}
                  onChange={(val) => setFormData({ ...formData, maxScore: val })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold">{LABELS.WEIGHT}</label>
                <InputNumber
                  className="w-full"
                  min={0}
                  step={0.1}
                  value={formData.weight}
                  onChange={(val) => setFormData({ ...formData, weight: val })}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-semibold">{LABELS.DESCRIPTION}</label>
                <Input.TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSave}>
                {BUTTONS.SAVE}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => {
                setEditingItem('new');
                setFormData({ name: '', description: '', maxScore: 10, weight: 1 });
              }}
            >
              <PlusOutlined /> {LABELS.ADD_NEW}
            </Button>
          </div>
        )}

        <DataTable
          columns={columns}
          data={criteria}
          loading={loading}
          minWidth="600px"
          emptyText={LABELS.NO_CRITERIA}
        />
      </div>
    </CompoundModal>
  );
}
