// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { LogBookService } from '@/components/features/logbook/services/logBook.service';
// import { DAILY_REPORT_MESSAGES } from '@/constants/dailyReport/messages';
// import { message } from 'antd';
// import { httpGet } from '@/services/httpClient';
// export function useLogbook(internshipId) {
//   // export function useLogbook() {
//   const [messageApi, contextHolder] = message.useMessage();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [total, setTotal] = useState(0);

//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [statusFilter, setStatusFilter] = useState();
//   const [sortOrder, setSortOrder] = useState('desc');

//   // Decode JWT → lấy StudentId
//   //   const fetchInternship = async (studentId) => {
//   //   try {
//   //     const res = await fetch(`/api/proxy/internship-groups/my`);

//   //     const json = await res.json();

//   //     if (json?.data?.internshipId) {
//   //       setInternshipId(json.data.internshipId);
//   //     }
//   //   } catch (err) {
//   //     console.error("Fetch internship failed", err);
//   //   }
//   // };
//   // useEffect(() => {
//   //   const tokenRaw = sessionStorage.getItem('accessToken');
//   //   if (!tokenRaw) return;

//   //   try {
//   //     let token = tokenRaw;

//   //     if (!token.startsWith('ey')) {
//   //       const parsed = JSON.parse(tokenRaw);
//   //       token = parsed?.accessToken || parsed?.data?.accessToken;
//   //     }

//   //     const payloadBase64 = token.split('.')[1];
//   //     const payloadStr = atob(payloadBase64);
//   //     const payload = JSON.parse(payloadStr);

//   //     const id =
//   //       payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
//   //       payload.sub;

//   //     setStudentId(id);
//   //   } catch (e) {
//   //     console.error('JWT decode failed', e);
//   //   }
//   // }, []);
//   useEffect(() => {
//     console.log('internshipId:', internshipId);
//   }, [internshipId]);

//   const fetchLogbooks = useCallback(async () => {
//     if (!internshipId) return;

//     setLoading(true);

//     //   try {
//     //     const params = {
//     //       PageNumber: pageNumber,
//     //       PageSize: pageSize,
//     //       SortColumn: 'dateReport',
//     //       SortOrder: sortOrder,
//     //     };

//     //     if (statusFilter !== undefined) {
//     //       params.Status = statusFilter;
//     //     }

//     //     const res = await LogBookService.getAll(internshipId, params);

//     //     console.log('logbook response:', res);

//     //     // const items = res?.data?.items || [];
//     //     // const totalCount = res?.data?.totalCount || items.length;
//     //     const items = res?.data?.items || [];
//     //     const totalCount = res?.data?.totalCount || items.length;

//     //     setData(items);
//     //     setTotal(totalCount);
//     //   } catch (error) {
//     //     console.error('Fetch logbooks failed', error);
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // }, [internshipId, pageNumber, pageSize, sortOrder, statusFilter]);
//     try {
//       const res = await LogBookService.getAll(internshipId, {
//         PageNumber: pageNumber,
//         PageSize: pageSize,
//         SortColumn: 'dateReport',
//         SortOrder: sortOrder,
//         Status: statusFilter,
//       });

//       const items = res?.data?.items || [];
//       const totalCount = res?.data?.totalCount || 0;

//       setData(items);
//       setTotal(totalCount);
//     } catch (err) {
//       console.error('Fetch logbooks error', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [internshipId, pageNumber, pageSize, statusFilter, sortOrder]);
//   useEffect(() => {
//     fetchLogbooks();
//   }, [fetchLogbooks]);

//   const handleDelete = async (id) => {
//     try {
//       const res = await LogBookService.delete(id);

//       if (res && res.isSuccess !== false) {
//         messageApi.success(DAILY_REPORT_MESSAGES.SUCCESS.DELETE);

//         if (data.length === 1 && pageNumber > 1) {
//           setPageNumber(pageNumber - 1);
//         } else {
//           fetchLogbooks();
//         }

//         return true;
//       } else {
//         messageApi.error(res?.message || DAILY_REPORT_MESSAGES.ERROR.DELETE_ERROR);
//         return false;
//       }
//     } catch {
//       messageApi.error(DAILY_REPORT_MESSAGES.ERROR.DELETE_ERROR);
//       return false;
//     }
//   };

//   return {
//     data,
//     loading,
//     total,
//     pageNumber,
//     setPageNumber,
//     pageSize,
//     setPageSize,
//     statusFilter,
//     setStatusFilter,
//     sortOrder,
//     setSortOrder,
//     fetchLogbooks,
//   };
// }
'use client';

import { useState, useEffect, useCallback } from 'react';
import { LogBookService } from '@/components/features/logbook/services/logBook.service';
import { InternshipGroupService } from '@/components/features/internship/services/internshipGroup.service';
import { message } from 'antd';

export function useLogbook() {
  const [messageApi, contextHolder] = message.useMessage();

  const [internshipId, setInternshipId] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState();
  const [sortOrder, setSortOrder] = useState('desc');

  // 1️⃣ Lấy internshipId từ internshipgroups
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await InternshipGroupService.getAll();
        const items = res?.data?.items || res?.data || [];

        if (items.length > 0) {
          // tùy response BE: internshipId hoặc id
          setInternshipId(items[0].internshipId || items[0].id);
        }
      } catch (err) {
        console.error('Fetch internshipgroups failed', err);
      }
    };

    fetchInternship();
  }, []);

  // const fetchLogbooks = useCallback(async () => {
  //   if (!internshipId) return;

  //   setLoading(true);

  //   try {
  //     const res = await LogBookService.getAll(internshipId, {
  //       PageNumber: pageNumber,
  //       PageSize: pageSize,
  //       SortColumn: 'dateReport',
  //       SortOrder: sortOrder,
  //       Status: statusFilter,
  //     });

  //     const items = res?.data?.items || [];
  //     const totalCount = res?.data?.totalCount || 0;

  //     setData(items);
  //     setTotal(totalCount);
  //   } catch (err) {
  //     console.error('Fetch logbooks failed', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [internshipId, pageNumber, pageSize, sortOrder, statusFilter]);

  const fetchLogbooks = useCallback(async () => {
    if (!internshipId) {
      setLoading(false); // 👈 thêm dòng này
      return;
    }

    setLoading(true);

    try {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortColumn: 'dateReport',
        SortOrder: sortOrder,
      };

      // ✅ chỉ thêm Status nếu có
      if (statusFilter !== undefined && statusFilter !== null) {
        params.Status = statusFilter;
      }

      const res = await LogBookService.getAll(internshipId, params);

      // The API response returned by httpClient.js is already the JSON body.
      // Based on the provided sample, the structure is { data: { items: [], ... } }
      // So we should access res.data.items directly.
      const items = res?.data?.items || [];
      const totalCount = res?.data?.totalCount || 0;

      console.log('items:', items);

      setData(items);
      setTotal(totalCount);
    } catch (err) {
      console.error('Fetch logbooks failed', err);
    } finally {
      setLoading(false);
    }
  }, [internshipId, pageNumber, pageSize, sortOrder, statusFilter]);
  useEffect(() => {
    fetchLogbooks();
  }, [fetchLogbooks]);

  const handleDelete = async (id) => {
    try {
      const res = await LogBookService.delete(id);
      if (res && (res.isSuccess !== false || res.success !== false)) {
        messageApi.success('Logbook deleted successfully!');

        if (data.length === 1 && pageNumber > 1) {
          setPageNumber((prev) => prev - 1);
        } else {
          fetchLogbooks();
        }
        return true;
      } else {
        messageApi.error(res?.message || 'Failed to delete logbook');
        return false;
      }
    } catch (error) {
      console.error('Delete logbook error', error);
      messageApi.error('An unexpected error occurred during deletion');
      return false;
    }
  };

  return {
    data,
    loading,
    total,
    pageNumber,
    setPageNumber,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    fetchLogbooks,
    handleDelete,
    contextHolder,
    messageApi,
    internshipId,
  };
}

