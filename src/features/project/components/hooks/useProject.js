'use client';

import { useState, useEffect, useCallback } from 'react';
import { message, Form } from 'antd';
import {
  getProjectResources,
  createProjectResource,
  deleteProjectResource,
  updateProjectResource,
} from '@/features/project/services/projectResources';
import { ProjectService } from '@/features/project/services/projectService';
import { PROJECT_MESSAGES } from '@/constants/project/messages';

export function useProject() {
  const [projectId, setProjectId] = useState(null);
  const [resources, setResources] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm] = Form.useForm();

  const loadResources = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getProjectResources(id);
      setResources(data?.data?.items || []);
    } catch (err) {
      console.error('Load resources error:', err);
      message.error(PROJECT_MESSAGES.ERROR.LOAD_RESOURCES);
    } finally {
      setLoading(false);
    }
  }, []);

  const initProject = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ProjectService.getAll();
      if (res && res.data && res.data.items && res.data.items.length > 0) {
        const id = res.data.items[0].projectId;
        setProjectId(id);
        await loadResources(id);
      }
    } catch (error) {
      console.error('Failed to init project', error);
      message.error(PROJECT_MESSAGES.ERROR.LOAD_PROJECT_FAILED);
    } finally {
      setLoading(false);
    }
  }, [loadResources]);

  useEffect(() => {
    initProject();
  }, [initProject]);

  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.warning(PROJECT_MESSAGES.WARNING.FILE_REQUIRED);
      return;
    }

    setUploading(true);
    const file = fileList[0];

    const formData = new FormData();
    formData.append('ProjectId', projectId);
    formData.append('ResourceName', values.resourceName || file.name);
    formData.append('ResourceType', values.resourceType || 1);
    formData.append('File', file.originFileObj || file);

    try {
      await createProjectResource(formData);
      await loadResources(projectId);
      setFileList([]);
      form.resetFields();
      message.success(PROJECT_MESSAGES.SUCCESS.UPLOAD);
    } catch (err) {
      console.error('Upload error:', err);
      message.error(PROJECT_MESSAGES.ERROR.UPLOAD_FAILED);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProjectResource(id);
      message.success(PROJECT_MESSAGES.SUCCESS.DELETE);
      await loadResources(projectId);
    } catch (err) {
      console.error('Delete error:', err);
      message.error(PROJECT_MESSAGES.ERROR.DELETE_FAILED);
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
      await updateProjectResource(editingResource.projectResourceId, {
        projectId: projectId,
        resourceName: values.resourceName,
        resourceType: values.resourceType || editingResource.resourceType || 1,
      });
      message.success(PROJECT_MESSAGES.SUCCESS.UPDATE);
      setIsEditModalVisible(false);
      await loadResources(projectId);
    } catch (err) {
      console.error('Update error:', err);
      message.error(PROJECT_MESSAGES.ERROR.UPDATE_FAILED);
    }
  };

  return {
    projectId,
    resources,
    fileList,
    setFileList,
    loading,
    uploading,
    form,
    isEditModalVisible,
    setIsEditModalVisible,
    editingResource,
    editForm,
    handleUpload,
    handleDelete,
    openEditModal,
    handleUpdate,
    loadResources,
  };
}

