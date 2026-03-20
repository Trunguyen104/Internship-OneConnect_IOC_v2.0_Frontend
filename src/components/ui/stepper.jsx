import { BankFilled, CheckOutlined } from '@ant-design/icons';
import React from 'react';

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
    Registration: 0,
    Interviewing: 1,
    Offered: 2,
    PLACED: 3,
    Completed: 4,
    // Add alternatives
    UNPLACED: -1, // Error state
  };
  return statusMap[status] !== undefined ? statusMap[status] : -1;
};

const Stepper = ({ currentStatus, isTerminalStatus = false }) => {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="relative mt-6 mb-8 flex w-full items-center">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex || (isTerminalStatus && index === currentIndex);
        const isCurrent = index === currentIndex && !isTerminalStatus;
        const isUpcoming = index > currentIndex;

        // Custom icon handling based on step and status
        let IconElement = null;
        if (isCompleted) {
          IconElement = <CheckOutlined className="text-sm text-white" />;
        } else if (isCurrent && step.id === 'PLACED') {
          IconElement = <BankFilled className="text-sm text-white" />;
        } else if (isCurrent) {
          IconElement = <div className="h-2.5 w-2.5 rounded-full bg-white"></div>;
        }

        return (
          <React.Fragment key={step.id}>
            {/* Step Node */}
            <div className="relative z-10 flex flex-col items-center">
              <div
                className={`flex items-center justify-center transition-all duration-300 ${isCompleted ? 'h-8 w-8 rounded-full bg-[var(--green-500)] shadow-sm' : ''} ${isCurrent && step.id === 'PLACED' ? 'h-10 w-10 rounded-lg bg-[var(--green-500)] shadow-md ring-4 ring-[var(--green-100)]' : '' /* Square active box */} ${isCurrent && step.id !== 'PLACED' ? 'h-8 w-8 rounded-full bg-[var(--green-500)] shadow-sm ring-4 ring-[var(--green-100)]' : ''} ${isUpcoming ? 'h-8 w-8 rounded-full border-2 border-gray-200 bg-gray-100' : ''} `}
              >
                {IconElement}
              </div>
              <span
                className={`absolute top-full mt-3 text-xs font-semibold whitespace-nowrap transition-colors ${isCompleted ? 'text-gray-600' : ''} ${isCurrent ? 'text-[var(--green-600)]' : ''} ${isUpcoming ? 'text-gray-300' : ''} `}
              >
                {step.id === 'PLACED' && isCurrent ? 'PLACED' : step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < STEPS.length - 1 && (
              <div className="relative top-[-10px] mx-2 flex-1">
                <div
                  className={`h-0.5 w-full transition-all duration-300 ${index < currentIndex ? 'bg-[var(--green-500)]' : ''} ${index === currentIndex && !isTerminalStatus ? 'bg-[var(--green-500)] opacity-50' : ''} ${index >= currentIndex ? 'border-t-2 border-dashed border-gray-200' : ''} `}
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
