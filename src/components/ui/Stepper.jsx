import React from 'react';
import { CheckOutlined, BankFilled } from '@ant-design/icons';

const STEPS = [
  { id: 'Registration', label: 'Registration' },
  { id: 'Interviewing', label: 'Interviewing' },
  { id: 'Offered', label: 'Offered' },
  { id: 'PLACED', label: 'Placement' },
  { id: 'Completed', label: 'Completed' },
];

const getStepIndex = (status) => {
  // Map API statuses/custom statuses to index
  const statusMap = {
    'Registration': 0,
    'Interviewing': 1,
    'Offered': 2,
    'PLACED': 3,
    'Completed': 4,
    // Add alternatives
    'UNPLACED': -1, // Error state
  };
  return statusMap[status] !== undefined ? statusMap[status] : -1;
};

const Stepper = ({ currentStatus, isTerminalStatus = false }) => {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="flex items-center w-full mt-6 mb-8 relative">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex || (isTerminalStatus && index === currentIndex);
        const isCurrent = index === currentIndex && !isTerminalStatus;
        const isUpcoming = index > currentIndex;

        // Custom icon handling based on step and status
        let IconElement = null;
        if (isCompleted) {
          IconElement = <CheckOutlined className="text-white text-sm" />;
        } else if (isCurrent && step.id === 'PLACED') {
           IconElement = <BankFilled className="text-white text-sm" />;
        } else if (isCurrent) {
            IconElement = <div className="w-2.5 h-2.5 rounded-full bg-white"></div>;
        }

        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'w-8 h-8 rounded-full bg-[var(--green-500)] shadow-sm' : ''}
                  ${isCurrent && step.id === 'PLACED' ? 'w-10 h-10 rounded-lg bg-[var(--green-500)] shadow-md ring-4 ring-[var(--green-100)]' : '' /* Square active box */}
                  ${isCurrent && step.id !== 'PLACED' ? 'w-8 h-8 rounded-full bg-[var(--green-500)] shadow-sm ring-4 ring-[var(--green-100)]' : ''}
                  ${isUpcoming ? 'w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200' : ''}
                `}
              >
                  {IconElement}
              </div>
              <span
                className={`absolute top-full mt-3 text-xs font-semibold whitespace-nowrap transition-colors
                  ${isCompleted ? 'text-gray-600' : ''}
                  ${isCurrent ? 'text-[var(--green-600)]' : ''}
                  ${isUpcoming ? 'text-gray-300' : ''}
                `}
              >
                {step.id === 'PLACED' && isCurrent ? 'PLACED' : step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < STEPS.length - 1 && (
              <div className="flex-1 mx-2 relative top-[-10px]">
                <div
                  className={`h-0.5 w-full transition-all duration-300
                    ${index < currentIndex ? 'bg-[var(--green-500)]' : ''}
                    ${index === currentIndex && !isTerminalStatus ? 'bg-[var(--green-500)] opacity-50' : ''}
                    ${index >= currentIndex ? 'border-t-2 border-dashed border-gray-200' : ''}
                  `}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;

