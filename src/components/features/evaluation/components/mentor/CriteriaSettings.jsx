import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Form, Input, InputNumber } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import CompoundModal from '@/components/ui/CompoundModal';
import DataTable from '@/components/ui/datatable';
import { EVALUATION_UI } from '@/constants/evaluation/evaluation';
import { useToast } from '@/providers/ToastProvider';
import { getErrorDetail } from '@/utils/errorUtils';

import { EvaluationService } from '../../services/evaluation.service';

export default function CriteriaSettings({ cycle, open, onClose }) {
  const { LABELS, BUTTONS, MESSAGES, TABLE_COLUMNS } = EVALUATION_UI;
  const toast = useToast();
  const [form] = Form.useForm();
  const isCompleted = cycle?.status === 2; // 2 is COMPLETED
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // 'new' | record

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

  // Sync form values when editingItem changes
  useEffect(() => {
    if (editingItem) {
      if (editingItem === 'new') {
        form.resetFields();
      } else {
        form.setFieldsValue({
          name: editingItem.name,
          description: editingItem.description,
          maxScore: editingItem.maxScore,
          weight: editingItem.weight,
        });
      }
    }
  }, [editingItem, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingItem === 'new') {
        await EvaluationService.createCriteria(cycle.cycleId, values);
        toast.success(MESSAGES.CREATE_SUCCESS);
      } else {
        await EvaluationService.updateCriteria(editingItem.criteriaId, values);
        toast.success(MESSAGES.UPDATE_SUCCESS);
      }
      setEditingItem(null);
      fetchCriteria();
    } catch (error) {
      if (error.errorFields) return; // AntD internal validation error
      toast.error(getErrorDetail(error, MESSAGES.VALIDATION_ERROR));
    }
  };

  const handleDelete = async (criteriaId) => {
    try {
      await EvaluationService.deleteCriteria(criteriaId);
      toast.success(MESSAGES.DELETE_SUCCESS);
      fetchCriteria();
    } catch (error) {
      toast.error(getErrorDetail(error, MESSAGES.FETCH_ERROR));
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
  ].filter((col) => !isCompleted || col.key !== 'actions');

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
              {editingItem ? 'Criteria Configuration' : 'Evaluation Criteria'}
            </h3>
          </div>
          {!editingItem && !isCompleted && (
            <Button
              variant="primary"
              className="rounded-full px-5 h-9 font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-[10px] flex items-center gap-1.5"
              onClick={() => {
                setEditingItem('new');
              }}
            >
              <PlusOutlined className="text-[12px]" /> {LABELS.ADD_NEW}
            </Button>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={540}
      className="premium-modal"
    >
      <div className="py-2 min-h-[350px]">
        {editingItem ? (
          /* FORM VIEW - Replaces Table */
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            requiredMark={false}
            initialValues={{ maxScore: 10, weight: 1 }}
            className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl border border-gray-100 bg-gray-50/20 p-6 shadow-sm">
              <Form.Item
                label={
                  <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <EditOutlined className="text-[12px]" />
                    {LABELS.CRITERIA_NAME}
                  </span>
                }
                name="name"
                rules={[{ required: true, message: MESSAGES.NAME_REQUIRED }]}
                className="col-span-2 mb-0"
              >
                <Input
                  placeholder={LABELS.CRITERIA_NAME}
                  className="h-11 rounded-xl border-gray-100 bg-white font-bold text-sm transition-all focus:border-primary/30"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MoreOutlined className="text-[12px]" />
                    {LABELS.MAX_SCORE}
                  </span>
                }
                name="maxScore"
                rules={[
                  { required: true, message: MESSAGES.VALIDATION_ERROR },
                  {
                    type: 'number',
                    min: 0.1,
                    max: 100,
                    message: 'Max score must be between 0.1 and 100',
                  },
                ]}
                className="mb-0"
              >
                <InputNumber
                  className="h-11 w-full rounded-xl border-gray-100 bg-white font-black text-base focus:border-primary/30"
                  min={1}
                  controls={false}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MoreOutlined className="text-[12px]" />
                    {LABELS.WEIGHT}
                  </span>
                }
                name="weight"
                rules={[
                  { required: true, message: MESSAGES.VALIDATION_ERROR },
                  { type: 'number', min: 0, max: 100, message: 'Weight must be between 0 and 100' },
                ]}
                className="mb-0"
              >
                <InputNumber
                  className="h-11 w-full rounded-xl border-gray-100 bg-white font-black text-base focus:border-primary/30"
                  min={0}
                  step={0.1}
                  controls={false}
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="text-[10px] font-black text-muted/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <MoreOutlined className="text-[12px]" />
                    {LABELS.DESCRIPTION}
                  </span>
                }
                name="description"
                className="col-span-2 mb-0"
              >
                <Input.TextArea
                  placeholder={LABELS.DESCRIPTION}
                  className="rounded-xl border-gray-100 bg-white p-3 text-sm font-medium transition-all focus:border-primary/30"
                  rows={3}
                />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 px-1">
              <Button
                variant="outline"
                type="button"
                className="rounded-full h-10 px-6 font-black uppercase tracking-widest text-[10px] border-gray-200"
                onClick={() => setEditingItem(null)}
              >
                {BUTTONS.CANCEL}
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="rounded-full h-10 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
              >
                {BUTTONS.SAVE}
              </Button>
            </div>
          </Form>
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
