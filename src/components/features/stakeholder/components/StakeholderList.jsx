import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { STAKEHOLDER_UI } from '@/constants/stakeholder/uiText';
import { showDeleteConfirm } from '@/components/ui/DeleteConfirm';

export default function StakeholderList({ stakeholders, loading, onEdit, onDelete }) {
  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-t-2 border-r-2 border-slate-400 border-r-transparent'></div>
        </div>
      ) : stakeholders.length === 0 ? (
        <div className='flex flex-1 items-center justify-center py-12'>
          <p className='text-slate-400'>{STAKEHOLDER_UI.EMPTY_TITLE}</p>
        </div>
      ) : (
        <div className='mt-5 flex min-h-0 flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <table className='w-full min-w-[1000px] table-fixed border-collapse text-left'>
              <thead className='sticky top-0 z-10 border-b border-slate-200 bg-slate-50'>
                <tr>
                  <th className='w-[60px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.TABLE_NO}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_NAME}
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_ROLE}
                  </th>
                  <th className='px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_EMAIL}
                  </th>
                  <th className='w-[150px] px-6 py-4 text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.FIELD_PHONE}
                  </th>
                  <th className='px-6 py-4 text-right text-xs font-semibold text-slate-500'>
                    {STAKEHOLDER_UI.ACTIONS}
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {stakeholders.map((s, index) => (
                  <tr key={s.id} className='transition-colors hover:bg-slate-50/80'>
                    <td className='px-6 py-4 text-sm text-slate-600'>{index + 1}</td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg'>
                          <UserOutlined />
                        </div>
                        <div className='min-w-0'>
                          <div
                            className='truncate text-sm font-medium text-slate-800'
                            title={s.name}
                          >
                            {s.name}
                          </div>
                          {s.description && (
                            <div
                              className='max-w-[200px] truncate text-xs text-slate-400'
                              title={s.description}
                            >
                              {s.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600'>
                        {s.role || STAKEHOLDER_UI.NO_ROLE}
                      </span>
                    </td>
                    <td className='truncate px-6 py-4 text-sm text-slate-600' title={s.email}>
                      {s.email}
                    </td>
                    <td className='px-6 py-4 text-sm text-slate-600'>{s.phoneNumber || '—'}</td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <button
                          onClick={() => onEdit(s)}
                          className='px-2 text-slate-400 transition-colors hover:text-blue-600'
                          title={STAKEHOLDER_UI.EDIT_BUTTON}
                        >
                          <EditOutlined />
                        </button>
                        <button
                          onClick={() =>
                            showDeleteConfirm({
                              title: STAKEHOLDER_UI.DELETE_TITLE,
                              content: STAKEHOLDER_UI.DELETE_CONFIRM,
                              onOk: () => onDelete(s.id),
                            })
                          }
                          className='px-2 text-slate-400 transition-colors hover:text-red-600'
                          title={STAKEHOLDER_UI.DELETE_BUTTON}
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
