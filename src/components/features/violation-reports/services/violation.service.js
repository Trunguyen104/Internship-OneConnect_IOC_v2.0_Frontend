import { violationReportService } from './violation-report.service';

export const ViolationService = {
  getAll: (params) => violationReportService.getReports(params),
  getById: (id) => violationReportService.getReportById(id),
  create: (payload) => violationReportService.createReport(payload),
  update: (id, payload) => violationReportService.updateReport(id, payload),
  delete: (id) => violationReportService.deleteReport(id),
  getStudents: (params) => violationReportService.getStudentsForMentor(params),
  getGroups: (params) => violationReportService.getGroupsForMentor(params),
  getGroupDetail: (id) => violationReportService.getGroupDetail(id),
};
