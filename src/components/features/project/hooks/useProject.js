'use client';

import { useState, useEffect, useCallback } from 'react';
import { Form } from 'antd';
import { useToast } from '@/providers/ToastProvider';
import {
  getProjectResources,
  createProjectResource,
  deleteProjectResource,
  updateProjectResource,
  downloadProjectResource,
  readProjectResource,
} from '@/components/features/project/services/projectResources';
import { ProjectService } from '@/components/features/project/services/projectService';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { resolveResourceUrl } from '@/utils/resolveUrl';

export function useProject(initialProjectId = null) {
  const toast = useToast();
  const [projectId, setProjectId] = useState(initialProjectId);
  const [projectInfo, setProjectInfo] = useState(null);
  const [resources, setResources] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadResources = useCallback(
    async (id) => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getProjectResources(id);
        const items = (res?.data?.items || []).map((item) => {
          let type = item.resourceType;
          if (typeof type === 'string') {
            const matched = RESOURCE_TYPES.find((t) => t.key === type);
            if (matched) type = matched.value;
          }
          return { ...item, resourceType: type };
        });
        setResources(items);
      } catch (err) {
        console.error('Load resources error:', err);
        toast.error(PROJECT_MESSAGES.ERROR.LOAD_RESOURCES);
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const initProject = useCallback(async () => {
    try {
      setLoading(true);

      let targetProjectId = initialProjectId;
      let internshipId = null;

      // If no project ID provided, find the group first
      if (!targetProjectId) {
        const mineRes = await InternshipGroupService.getAll({ PageSize: 1 });
        const mineData = mineRes?.data?.items?.[0] || mineRes?.data?.[0] || null;
        internshipId = mineData?.internshipId || mineData?.id;
        targetProjectId =
          mineData?.projectId || mineData?.project?.projectId || mineData?.project?.id;

        // If still no project ID, try to find it by group ID
        if (!targetProjectId && internshipId) {
          const projectRes = await ProjectService.getAll({
            InternshipId: internshipId,
            PageSize: 1,
          });
          const projectData =
            projectRes?.data?.items?.[0] || projectRes?.data?.[0] || projectRes?.data || null;
          targetProjectId = projectData?.projectId || projectData?.id;
        }

        if (!targetProjectId) {
          toast.warning('No project assigned to your internship group.');
          setLoading(false);
          return;
        }
      }

      setProjectId(targetProjectId);

      const [detailRes, _] = await Promise.all([
        ProjectService.getById(targetProjectId),
        loadResources(targetProjectId),
      ]);

      if (detailRes && detailRes.data) {
        setProjectInfo(detailRes.data);
      }
    } catch (error) {
      console.error('Failed to init project', error);
      toast.error(PROJECT_MESSAGES.ERROR.LOAD_PROJECT_FAILED);
    } finally {
      setLoading(false);
    }
  }, [initialProjectId, loadResources, toast]);

  useEffect(() => {
    initProject();
  }, [initProject]);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      toast.warning(PROJECT_MESSAGES.WARNING.FILE_REQUIRED);
      return;
    }

    setUploading(true);
    const file = fileList[0];
    const selectedType = values.resourceType || 1;
    const currentExt = file.name.split('.').pop().toLowerCase();

    const typeExtensionMap = {
      1: ['pdf'],
      2: ['docx', 'doc'],
      3: ['pptx', 'ppt'],
      4: ['zip'],
      5: ['rar'],
      6: ['jpg', 'jpeg'],
      7: ['png'],
    };

    // If it's not "Other" (0), validate the extension
    if (selectedType !== 0 && typeExtensionMap[selectedType]) {
      if (!typeExtensionMap[selectedType].includes(currentExt)) {
        const typeLabel =
          RESOURCE_TYPES.find((t) => t.value === selectedType)?.label || 'selected type';
        toast.error(`File extension .${currentExt} does not match ${typeLabel}`);
        setUploading(false);
        return;
      }
    }

    // --- Duplicate Checks ---
    const proposedName = (values.resourceName || file.name).trim().toLowerCase();
    const proposedFileName = file.name.toLowerCase();

    const isDuplicateName = resources.some(
      (r) => r.resourceName?.trim().toLowerCase() === proposedName,
    );
    const isDuplicateFile = resources.some((r) => {
      const urlLower = r.resourceUrl?.toLowerCase() || '';
      return urlLower.endsWith('/' + proposedFileName) || urlLower.includes('_' + proposedFileName);
    });

    if (isDuplicateName) {
      toast.error(`A resource with name "${values.resourceName || file.name}" already exists.`);
      setUploading(false);
      return false;
    }

    if (isDuplicateFile) {
      toast.error(`This file (${file.name}) has already been uploaded.`);
      setUploading(false);
      return false;
    }
    // ------------------------

    const formData = new FormData();
    formData.append('ProjectId', projectId);
    formData.append('ResourceName', values.resourceName || file.name);
    formData.append('ResourceType', values.resourceType || 1);
    formData.append('File', file.originFileObj || file);

    try {
      const result = await createProjectResource(formData);

      if (result && (result.success || result.isSuccess)) {
        await loadResources(projectId);
        setFileList([]);
        toast.success(PROJECT_MESSAGES.SUCCESS.UPLOAD);
        return true;
      } else {
        throw new Error(result?.message || PROJECT_MESSAGES.ERROR.UPLOAD_FAILED);
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || PROJECT_MESSAGES.ERROR.UPLOAD_FAILED);
      return false;
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteProjectResource(id);
      if (result && (result.success || result.isSuccess)) {
        toast.success(PROJECT_MESSAGES.SUCCESS.DELETE);
        await loadResources(projectId);
      } else {
        throw new Error(result?.message || PROJECT_MESSAGES.ERROR.DELETE_FAILED);
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message || PROJECT_MESSAGES.ERROR.DELETE_FAILED);
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    editForm.setFieldsValue({
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
    });
    setIsEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      const newName = (values.resourceName || '').trim().toLowerCase();
      const isDuplicateName = resources.some(
        (r) =>
          r.projectResourceId !== editingResource.projectResourceId &&
          r.resourceName?.trim().toLowerCase() === newName,
      );

      if (isDuplicateName) {
        toast.error(`A resource with name "${values.resourceName}" already exists.`);
        return;
      }
      const result = await updateProjectResource(editingResource.projectResourceId, {
        projectId: projectId,
        resourceName: values.resourceName,
        resourceType: values.resourceType || editingResource.resourceType || 1,
      });

      if (result && (result.success || result.isSuccess)) {
        toast.success(PROJECT_MESSAGES.SUCCESS.UPDATE);
        setIsEditModalVisible(false);
        await loadResources(projectId);
      } else {
        throw new Error(result?.message || PROJECT_MESSAGES.ERROR.UPDATE_FAILED);
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message || PROJECT_MESSAGES.ERROR.UPDATE_FAILED);
    }
  };

  const getResourceMimeType = (url, type) => {
    let ext = '';
    try {
      const pathPart = url?.split('?')[0] || '';
      ext = pathPart.split('.').pop()?.toLowerCase();
    } catch (e) {
      ext = '';
    }

    const mimeMap = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      ppt: 'application/vnd.ms-powerpoint',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      txt: 'text/plain',
    };

    if (mimeMap[ext]) return mimeMap[ext];

    const typeMap = {
      1: 'application/pdf',
      2: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      3: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      4: 'application/zip',
      5: 'application/x-rar-compressed',
      6: 'image/jpeg',
      7: 'image/png',
    };

    return typeMap[type] || 'application/octet-stream';
  };

  const handleDownload = async (resource) => {
    if (!resource?.projectResourceId) {
      toast.error('Resource ID not found');
      return;
    }

    try {
      console.log('🚀 Authenticated Proxy Download:', resource.projectResourceId);

      const rawBlob = await downloadProjectResource(resource.projectResourceId);

      if (!rawBlob || rawBlob.size === 0) {
        throw new Error('Server returned an empty file');
      }

      if (rawBlob.size < 500) {
        const text = await rawBlob.text();
        if (text.startsWith('{')) {
          const err = JSON.parse(text);
          throw new Error(err.message || 'Server error');
        }
      }

      const objectUrl = window.URL.createObjectURL(rawBlob);

      const actualExt = resource.resourceUrl?.split('?')[0]?.split('.').pop()?.toLowerCase();
      let filename = resource.resourceName || 'download';
      if (actualExt && !filename.toLowerCase().endsWith('.' + actualExt)) {
        filename = `${filename}.${actualExt}`;
      }

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err.message || 'Could not download file.');
    }
  };

  const handleView = async (resource) => {
    if (!resource?.projectResourceId) {
      toast.error('Resource ID not found');
      return;
    }

    try {
      const result = await readProjectResource(resource.projectResourceId);
      if (result.success && result.data?.resourceUrl) {
        const fullUrl = resolveResourceUrl(result.data.resourceUrl);
        window.open(fullUrl, '_blank');
      } else {
        throw new Error(result.message || 'Failed to get file URL');
      }
    } catch (err) {
      toast.error(err.message || 'Could not open file.');
    }
  };

  return {
    projectId,
    projectInfo,
    resources,
    fileList,
    setFileList,
    loading,
    uploading,
    form,
    editForm,
    isEditModalVisible,
    setIsEditModalVisible,
    editingResource,
    handleUpload,
    handleDelete,
    openEditModal,
    handleUpdate,
    handleDownload,
    handleView,
    loadResources,
  };
}
