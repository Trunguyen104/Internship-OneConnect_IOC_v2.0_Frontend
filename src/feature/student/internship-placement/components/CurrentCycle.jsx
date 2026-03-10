import { SafetyCertificateFilled, InfoCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Badge from '@/shared/components/Badge';
import Stepper from '@/shared/components/Stepper';
import Button from '@/shared/components/Button';

export function CurrentCycle({ activeCycle, placementStatus, placementData }) {
  if (!activeCycle) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">CURRENT TERM</span>
              <Badge variant="success">CURRENT</Badge>
              <Badge variant="info">ACTIVE & PLACED</Badge>
           </div>
           <h2 className="text-2xl font-bold text-gray-900">{activeCycle.cycleName || 'Fall 2024 Semester'}</h2>
        </div>
        <div className="text-right">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">STATUS</span>
            {placementStatus === 'PLACED' ? (
                <Badge variant="success-solid" size="lg" className="rounded-md px-4">ACTIVE & PLACED</Badge>
            ) : (
                <Badge variant="warning-solid" size="lg" className="rounded-md px-4">ACTIVE & UNPLACED</Badge>
            )}
        </div>
      </div>

      <div className="px-4 py-8 relative">
         <Stepper currentStatus={placementStatus === 'PLACED' ? 'PLACED' : 'Interviewing'} />
      </div>

      {placementStatus === 'PLACED' && placementData ? (
          <div className="bg-gray-50/50 rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mr-6">
                  {/* Enterprise */}
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                         {placementData.enterprise.logo}
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Enterprise</p>
                          <p className="text-[15px] font-bold text-gray-900">{placementData.enterprise.name}</p>
                      </div>
                  </div>
                  
                  {/* Mentor */}
                  <div className="flex items-center gap-4 border-l border-gray-200 pl-8">
                      <div className="w-12 h-12 bg-[#dfb48e] rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {placementData.mentor.avatar}
                      </div>
                      <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">Mentor</p>
                          <p className="text-[15px] font-bold text-gray-900">{placementData.mentor.name}</p>
                      </div>
                  </div>

                  {/* Project */}
                  <div className="flex flex-col justify-center border-l border-gray-200 pl-8 relative pr-24">
                      <p className="text-xs text-gray-500 font-medium mb-1">Project</p>
                      <p className="text-[15px] font-bold text-gray-900">{placementData.project.name}</p>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <Badge variant="success-solid" icon={<SafetyCertificateFilled />}>
                              CONFIRMED BY UNI ADMIN
                          </Badge>
                      </div>
                  </div>
              </div>
          </div>
      ) : (
          <div className="mt-4 bg-[var(--warning-50, #fffbeb)] border border-[var(--warning-200, #fde68a)] rounded-xl p-5 flex items-start gap-4">
              <InfoCircleOutlined className="text-[var(--warning-600, #d97706)] text-xl mt-0.5" />
              <div>
                 <h4 className="text-[var(--warning-800, #92400e)] font-bold text-sm mb-1">Notice: Placement Pending</h4>
                 <p className="text-[var(--warning-700, #b45309)] text-sm m-0">
                    You are currently unplaced for this term. Please wait while the University Administration matches you with a suitable enterprise and project, or check your messages for pending interviews.
                 </p>
              </div>
          </div>
      )}

      <div className="mt-6 flex justify-end">
           <Button variant="primary" icon={<ArrowRightOutlined />} iconPosition="right">
               View Detailed Training Plan
           </Button>
      </div>
    </div>
  );
}
