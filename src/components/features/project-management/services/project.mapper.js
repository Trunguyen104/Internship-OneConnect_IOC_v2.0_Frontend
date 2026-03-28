import dayjs from 'dayjs';

/**
 * Maps a single project DTO from backend into a frontend object
 * handling all normalization logic, status mapping, and group lifecycle.
 */
export const mapProjectToFrontend = (p) => {
  // 1. Normalize operationalStatus (handle both integer and string from backend)
  let opStatus = p.operationalStatus ?? p.status ?? 0;
  if (typeof opStatus === 'string') {
    const opMap = { unstarted: 0, active: 1, completed: 2, archived: 3 };
    opStatus = opMap[opStatus.toLowerCase()] ?? 0;
  }

  // 2. Normalize visibilityStatus
  let visStatus = p.visibilityStatus ?? p.visibility;
  if (typeof visStatus === 'string') {
    const visMap = { draft: 0, published: 1 };
    visStatus = visMap[visStatus.toLowerCase()] ?? 0;
  } else if (visStatus === undefined || visStatus === null) {
    visStatus = 0;
  }

  // 3. Group Lifecycle & Orphaned detection
  const gid = p.internshipId || p.internshipGroupId || p.groupId;
  const isEmptyGuid = gid === '00000000-0000-0000-0000-000000000000';
  const isMissing = !gid || isEmptyGuid || gid === '';

  // AC-16: Orphaned Projects (Active/Completed but group deleted)
  const isOrphaned = (opStatus === 1 || opStatus === 2) && isMissing;

  // AC-15: Group Archival Status
  const groupObj = p.groupInfo || p.internshipGroup;
  const groupStatus = groupObj?.status ?? groupObj?.groupStatus;
  const isGroupArchived =
    groupStatus === 2 ||
    (typeof groupStatus === 'string' && groupStatus.toLowerCase() === 'archived');

  // AC-16 Case 2/3: Force Unstarted if Orphaned
  let finalOpStatus = opStatus;
  if (isOrphaned) {
    finalOpStatus = 0;
  } else if (opStatus === 1) {
    // AC-15 Case 4: Auto-lifecycle based on phase dates
    const phaseEnd = p.endDate || groupObj?.internPhaseEnd || groupObj?.phaseEnd;
    if (phaseEnd && dayjs().isAfter(dayjs(phaseEnd))) {
      finalOpStatus = 2; // Treat as Completed if phase ended
    }
  }

  const projectId = p.projectId || p.id;

  return {
    ...p,
    projectId, // Ensure a consistent identifier field
    operationalStatus: finalOpStatus,
    visibilityStatus: visStatus,
    // Original status for backward compatibility
    status: finalOpStatus,
    visibility: visStatus,
    isOrphaned,
    isGroupArchived,
    // Clear dates for orphaned/reset projects
    startDate: isOrphaned ? null : p.startDate || groupObj?.internPhaseStart,
    endDate: isOrphaned ? null : p.endDate || groupObj?.internPhaseEnd,
  };
};

/**
 * Maps a list of project DTOs
 */
export const mapProjectsToFrontend = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map(mapProjectToFrontend);
};
