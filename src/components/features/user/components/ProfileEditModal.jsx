'use client';

import { UploadOutlined } from '@ant-design/icons';
import { DatePicker, Drawer, Form, message, Select, Upload } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import AvatarUploader from '@/components/ui/avataruploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { USER_ROLE } from '@/constants/common/enums';
import { PROFILE_UI } from '@/constants/user/uiText';

export default function ProfileEditModal({
  open,
  onCancel,
  userInfo,
  onSave,
  loading,
  avatarUrl,
  onDownloadCV,
}) {
  const [form] = Form.useForm();
  const [tempAvatar, setTempAvatar] = useState(null);
  const [cvFile, setCvFile] = useState(null);

  // Deriving initial avatar from props
  const persistedAvatar = userInfo?.avatarUrl || userInfo?.AvatarUrl;
  const initialAvatar = avatarUrl instanceof File ? avatarUrl : persistedAvatar;

  // Sync tempAvatar when modal opens or user changes, avoiding useEffect for synchronous state sync
  // This is the recommended pattern: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (open && tempAvatar !== initialAvatar && !(tempAvatar instanceof File)) {
    setTempAvatar(initialAvatar);
  }

  useEffect(() => {
    if (open && userInfo) {
      form.setFieldsValue({
        fullName: userInfo.fullName || userInfo.FullName,
        phoneNumber: userInfo.phoneNumber || userInfo.PhoneNumber,
        address: userInfo.address || userInfo.Address,
        gender: userInfo.gender || userInfo.Gender,
        portfolioUrl: userInfo.portfolioUrl || userInfo.PortfolioUrl,
        position: userInfo.position || userInfo.Position,
        expertise: userInfo.expertise || userInfo.Expertise,
        bio: userInfo.bio || userInfo.Bio,
        department: userInfo.department || userInfo.Department,
        major: userInfo.major || userInfo.Major,
        className: userInfo.className || userInfo.ClassName,
        dateOfBirth:
          userInfo.dateOfBirth || userInfo.DateOfBirth
            ? dayjs(userInfo.dateOfBirth || userInfo.DateOfBirth)
            : null,
      });
    }
  }, [open, userInfo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        avatarFile: tempAvatar instanceof File ? tempAvatar : undefined,
        cvFile: cvFile,
      };
      const success = await onSave(formattedValues);
      if (success) onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAvatarChange = (file) => {
    setTempAvatar(file);
  };

  const cvUploadProps = {
    beforeUpload: (file) => {
      const isPdf = file.type === 'application/pdf';
      const isDoc =
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isPdf && !isDoc) {
        message.error(PROFILE_UI.CV_HELPER.UPLOAD_ERROR);
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(PROFILE_UI.CV_HELPER.SIZE_ERROR);
        return Upload.LIST_IGNORE;
      }
      setCvFile(file);
      return false;
    },
    maxCount: 1,
    onRemove: () => setCvFile(null),
  };

  const renderRoleSpecificFields = () => {
    if (!userInfo) return null;

    const rawRole = String(userInfo?.role || userInfo?.Role || '').toLowerCase();

    if (rawRole === 'student' || rawRole === String(USER_ROLE.STUDENT)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            label={PROFILE_UI.LABELS.MAJOR}
            name="major"
            rules={[{ required: true, message: PROFILE_UI.VALIDATION.REQUIRED_MAJOR }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input className="h-11" />
          </Form.Item>
          <Form.Item
            label={PROFILE_UI.LABELS.CLASS}
            name="className"
            rules={[{ required: true, message: PROFILE_UI.VALIDATION.REQUIRED_CLASS }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input className="h-11" />
          </Form.Item>
          <Form.Item
            label={PROFILE_UI.LABELS.PORTFOLIO}
            name="portfolioUrl"
            rules={[{ type: 'url', message: PROFILE_UI.VALIDATION.INVALID_URL }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input placeholder="https://github.com/..." className="h-11" />
          </Form.Item>
          <Form.Item label={PROFILE_UI.LABELS.CV}>
            <Upload {...cvUploadProps} showUploadList={true}>
              <Button variant="outline" className="rounded-xl w-full flex justify-start gap-2 h-11">
                <UploadOutlined /> {PROFILE_UI.BUTTONS.UPLOAD_CV}
              </Button>
            </Upload>
            {(userInfo?.cvUrl || userInfo?.CvUrl) && !cvFile && (
              <p className="mt-1 text-xs text-muted">
                {PROFILE_UI.CV_HELPER.CURRENT}{' '}
                <button
                  type="button"
                  onClick={onDownloadCV}
                  className="underline hover:text-primary"
                >
                  {PROFILE_UI.CV_HELPER.DOWNLOAD_CURRENT}
                </button>
              </p>
            )}
            {cvFile && (
              <p className="mt-1 text-xs text-blue-600 font-medium italic">
                {PROFILE_UI.CV_HELPER.READY_TO_UPLOAD} {cvFile.name}
              </p>
            )}
          </Form.Item>
        </div>
      );
    }

    if (
      [
        'mentor',
        'hr',
        'enterpriseadmin',
        String(USER_ROLE.MENTOR),
        String(USER_ROLE.HR),
        String(USER_ROLE.ENTERPRISE_ADMIN),
      ].includes(rawRole)
    ) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item label={PROFILE_UI.LABELS.POSITION} name="position">
              <Input className="h-11" />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.EXPERTISE} name="expertise">
              <Input placeholder="e.g. Software Engineering" className="h-11" />
            </Form.Item>
          </div>
          <Form.Item label={PROFILE_UI.LABELS.BIO} name="bio">
            <Textarea rows={4} maxLength={1000} className="rounded-xl" />
          </Form.Item>
        </>
      );
    }

    if (rawRole === 'schooladmin' || rawRole === String(USER_ROLE.SCHOOL_ADMIN)) {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Form.Item label={PROFILE_UI.LABELS.POSITION} name="position">
              <Input className="h-11" />
            </Form.Item>
            <Form.Item label={PROFILE_UI.LABELS.DEPARTMENT} name="department">
              <Input className="h-11" />
            </Form.Item>
          </div>
          <Form.Item label={PROFILE_UI.LABELS.BIO} name="bio">
            <Textarea rows={4} maxLength={1000} className="rounded-xl" />
          </Form.Item>
        </>
      );
    }

    return null;
  };

  return (
    <Drawer
      open={open}
      title={
        <div className="flex flex-col gap-1">
          <span className="text-xl font-black tracking-tight text-slate-800">
            {PROFILE_UI.BUTTONS.EDIT}
          </span>
        </div>
      }
      onClose={onCancel}
      footer={
        <div key="footer" className="flex justify-end gap-3 px-6 py-4 border-t border-slate-50">
          <Button
            key="cancel"
            variant="ghost"
            onClick={onCancel}
            className="rounded-xl px-8 h-10 font-semibold text-slate-600 hover:text-slate-900 border-none bg-slate-100"
          >
            {PROFILE_UI.BUTTONS.CANCEL}
          </Button>
          <Button
            key="save"
            variant="default"
            onClick={handleSubmit}
            className="rounded-xl px-10 h-10 font-bold bg-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {PROFILE_UI.BUTTONS.SAVING}
              </div>
            ) : (
              PROFILE_UI.BUTTONS.SAVE_CHANGES
            )}
          </Button>
        </div>
      }
      size={600}
      styles={{
        header: { borderBottom: '1px solid #f8fafc', padding: '24px 32px' },
        body: { padding: '32px' },
        footer: { padding: 0 },
      }}
      destroyOnClose
    >
      <div className="flex gap-3 items-center mb-10 pb-10 border-b border-slate-50">
        <AvatarUploader
          value={tempAvatar}
          onChange={handleAvatarChange}
          fullName={userInfo?.fullName || userInfo?.FullName}
          size={120}
        />
        <div className="mt-4 text-center flex flex-col gap-2">
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarChange(file);
            }}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('avatar-upload')?.click()}
            className="rounded-xl font-bold border-2 border-[var(--primary-600)] text-[var(--primary-600)] hover:bg-[var(--primary-50)]"
          >
            {PROFILE_UI.AVATAR.UPLOAD_NEW}
          </Button>
          <p className="mt-2 text-xs text-muted">{PROFILE_UI.AVATAR.HINT}</p>
        </div>
      </div>

      <Form form={form} layout="vertical" validateTrigger={['onChange', 'onBlur']}>
        <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
          <Form.Item
            label={PROFILE_UI.LABELS.FULL_NAME}
            name="fullName"
            rules={[{ required: true, message: PROFILE_UI.VALIDATION.REQUIRED_FULL_NAME }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input maxLength={150} className="h-11" />
          </Form.Item>

          <Form.Item
            label={PROFILE_UI.LABELS.PHONE}
            name="phoneNumber"
            rules={[{ pattern: /^0[0-9]{9,10}$/, message: PROFILE_UI.VALIDATION.PHONE_INVALID }]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input placeholder={PROFILE_UI.PLACEHOLDERS.PHONE} className="h-11" />
          </Form.Item>

          <Form.Item
            label={PROFILE_UI.LABELS.DATE_OF_BIRTH}
            name="dateOfBirth"
            rules={[
              {
                validator: (_, value) => {
                  if (value && value.isAfter(dayjs())) {
                    return Promise.reject(new Error(PROFILE_UI.VALIDATION.DOB_FUTURE_ERROR));
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <DatePicker
              className="w-full rounded-xl h-11"
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>

          <Form.Item label={PROFILE_UI.LABELS.GENDER} name="gender">
            <Select
              className="w-full h-11"
              options={[
                { value: 1, label: PROFILE_UI.GENDER_LABELS[1] },
                { value: 2, label: PROFILE_UI.GENDER_LABELS[2] },
                { value: 3, label: PROFILE_UI.GENDER_LABELS[3] },
              ]}
              classNames={{ popup: { root: 'rounded-xl' } }}
            />
          </Form.Item>

          <Form.Item label={PROFILE_UI.LABELS.ADDRESS} name="address" className="md:col-span-2">
            <Input placeholder={PROFILE_UI.PLACEHOLDERS.ADDRESS} className="h-11" />
          </Form.Item>
        </div>

        {renderRoleSpecificFields()}
      </Form>
    </Drawer>
  );
}
