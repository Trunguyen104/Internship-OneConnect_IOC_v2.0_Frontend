'use client';

import { Form } from 'antd';
import { useCallback, useEffect, useState } from 'react';

import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import {
  createProjectResource,
  deleteProjectResource,
  downloadProjectResource,
  getProjectResources,
  readProjectResource,
  updateProjectResource,
} from '@/components/features/project/services/projectResources';
import { ProjectService } from '@/components/features/project/services/projectService';
import { useProfile } from '@/components/features/user/hooks/useProfile';
import { USER_ROLE } from '@/constants/common/enums';
import { PROJECT_MESSAGES } from '@/constants/project/messages';
import { RESOURCE_TYPES } from '@/constants/project/resourceTypes';
import { useToast } from '@/providers/ToastProvider';
import { downloadBlob } from '@/utils/common/fileUtils';
import { resolveResourceUrl } from '@/utils/resolveUrl';

export function useProject(initialProjectId = null) {
  const toast = useToast();
  const { userInfo } = useProfile();

  const [projectId, setProjectId] = useState(initialProjectId);
  const [projectInfo, setProjectInfo] = useState(null);
  const [projectList, setProjectList] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [resources, setResources] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // ... (loadResources remains mostly same, just add check for id)
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
        toast.error(PROJECT_MESSAGES.ERROR.LOAD_RESOURCES);
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const initProject = useCallback(async () => {
    if (!userInfo) return;

    try {
      setLoading(true);
      const isStudent = Number(userInfo.roleId || userInfo.Role) === USER_ROLE.STUDENT;
      setIsReadOnly(isStudent);

      let targetProjectId = initialProjectId || projectId;
      let internshipId = null;

      // 1. Fetch Internship Group / Terms for the current student
      const mineRes = await InternshipGroupService.getAll({ PageSize: 1 });
      const mineData = mineRes?.data?.items?.[0] || mineRes?.data?.[0] || null;
      internshipId = mineData?.internshipId || mineData?.id;

      if (internshipId) {
        // 2. Fetch all projects linked to this internship group
        const projectRes = await ProjectService.getAll({
          InternshipId: internshipId,
          PageSize: 10,
        });
        const allProjects = projectRes?.data?.items || projectRes?.data || [];

        // 3. Filter projects for students (Only Published and Completed)
        let filteredProjects = allProjects;
        if (isStudent) {
          filteredProjects = allProjects.filter((p) => p.status === 1 || p.status === 2);
        }

        setProjectList(filteredProjects);

        // 4. Determine which project to show
        if (!targetProjectId && filteredProjects.length > 0) {
          targetProjectId = filteredProjects[0].projectId || filteredProjects[0].id;
        }
      }

      if (!targetProjectId) {
        if (isStudent) {
          toast.info('No published projects available for your group.');
        } else {
          toast.warning('No project assigned to your internship group.');
        }
        setLoading(false);
        return;
      }

      setProjectId(targetProjectId);

      // 5. Fetch specific project details
      const [detailRes] = await Promise.all([
        ProjectService.getById(targetProjectId),
        loadResources(targetProjectId),
      ]);

      if (detailRes && detailRes.data) {
        setProjectInfo(detailRes.data);
      }
    } catch (error) {
      console.error('Init project failed', error);
      toast.error(PROJECT_MESSAGES.ERROR.LOAD_PROJECT_FAILED);
    } finally {
      setLoading(false);
    }
  }, [initialProjectId, projectId, userInfo, loadResources, toast]);

  useEffect(() => {
    initProject();
  }, [initProject]);

  const handleUpload = async (values) => {
    const isLinkUpload = Number(values.resourceType || 1) === 8;

    if (!isLinkUpload && fileList.length === 0) {
      toast.warning(PROJECT_MESSAGES.WARNING.FILE_REQUIRED);
      return;
    }

    setUploading(true);
    const file = fileList[0];
    const selectedType = values.resourceType || 1;
    const currentExt = file?.name?.split('.').pop()?.toLowerCase();

    const typeExtensionMap = {
      1: ['pdf'],
      2: ['docx'],
      3: ['pptx'],
      4: ['zip'],
      5: ['rar'],
      6: ['jpg', 'jpeg'],
      7: ['png'],
    };

    if (!isLinkUpload && typeExtensionMap[selectedType]) {
      if (!typeExtensionMap[selectedType].includes(currentExt)) {
        const typeLabel =
          RESOURCE_TYPES.find((t) => t.value === selectedType)?.label || 'selected type';
        toast.error(`File extension .${currentExt} does not match ${typeLabel}`);
        setUploading(false);
        return;
      }
    }

    const proposedName = (values.resourceName || values.externalUrl || file?.name || '')
      .trim()
      .toLowerCase();
    const proposedFileName = file?.name?.toLowerCase();

    const isDuplicateName = resources.some(
      (r) => r.resourceName?.trim().toLowerCase() === proposedName
    );
    const isDuplicateFile =
      !isLinkUpload && proposedFileName
        ? resources.some((r) => {
            const urlLower = r.resourceUrl?.toLowerCase() || '';
            return (
              urlLower.endsWith('/' + proposedFileName) || urlLower.includes('_' + proposedFileName)
            );
          })
        : false;

    if (isDuplicateName) {
      toast.error(
        `A resource with name "${values.resourceName || values.externalUrl || file?.name || 'resource'}" already exists.`
      );
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
    formData.append(
      'ResourceName',
      values.resourceName || values.externalUrl || file?.name || 'Resource'
    );
    formData.append('ResourceType', values.resourceType || 1);
    if (isLinkUpload) {
      formData.append('ExternalUrl', values.externalUrl || '');
    } else {
      formData.append('File', file.originFileObj || file);
    }

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
      toast.error(err.message || PROJECT_MESSAGES.ERROR.UPLOAD_FAILED);
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
          r.resourceName?.trim().toLowerCase() === newName
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
      toast.error(err.message || PROJECT_MESSAGES.ERROR.UPDATE_FAILED);
    }
  };

  const handleDownload = async (resource) => {
    if (!resource?.projectResourceId) {
      toast.error('Resource ID not found');
      return;
    }

    if (Number(resource.resourceType) === 8) {
      toast.warning(PROJECT_MESSAGES.INFO.LINK_DOWNLOAD_NOT_SUPPORTED);
      return;
    }

    try {
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

      const actualExt = resource.resourceUrl?.split('?')[0]?.split('.').pop()?.toLowerCase();
      let defaultFileName = resource.resourceName || 'download';
      if (actualExt && !defaultFileName.toLowerCase().endsWith('.' + actualExt)) {
        defaultFileName = `${defaultFileName}.${actualExt}`;
      }

      downloadBlob(rawBlob, defaultFileName);
    } catch (err) {
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
        const fullUrl =
          Number(resource.resourceType) === 8
            ? result.data.resourceUrl
            : resolveResourceUrl(result.data.resourceUrl);
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
    setProjectId,
    projectInfo,
    projectList,
    isReadOnly,
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
