'use client';

import { Alert, List, Typography } from 'antd';
import PropTypes from 'prop-types';

import { mapBackendError } from '@/lib/error-handler';

const { Text } = Typography;

/**
 * Standardized Error Reporting Component
 * UX Design: Elegant, high-contrast, informative.
 * Handles single messages or complex validation lists (ASP.NET style or generic).
 */
export default function ErrorMessages({ error, message, status }) {
  if (!error && !message) return null;

  const mapped = mapBackendError(error);
  const errorTitle = message || mapped?.title || 'Action Failed';
  const errorStatus = status || error?.status;
  const beDescription = mapped?.message;
  const errors = error?.data?.errors; // Support for common validation error formats

  // Helper to flatten various error formats from backend
  const getFlattenedErrors = () => {
    if (!errors) return null;
    if (Array.isArray(errors)) return errors;
    if (typeof errors === 'object') {
      return Object.entries(errors).flatMap(([field, msgs]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (Array.isArray(msgs)) return msgs.map((m) => `${fieldName}: ${m}`);
        return `${fieldName}: ${msgs}`;
      });
    }
    return null;
  };

  const errorList = getFlattenedErrors();

  return (
    <div className="mb-4 animate-in slide-in-from-top-1 fade-in duration-300">
      <Alert
        type="error"
        showIcon
        className="rounded-xl border-rose-100 bg-rose-50/50 shadow-sm"
        title={
          <Text strong className="text-rose-700">
            {errorTitle} {errorStatus ? `(${errorStatus})` : ''}
          </Text>
        }
        description={
          beDescription || (errorList && errorList.length > 0) ? (
            <div className="mt-1 flex flex-col gap-2">
              {beDescription && <Text className="text-rose-600 text-sm">{beDescription}</Text>}

              {errorList && errorList.length > 0 && (
                <List
                  size="small"
                  dataSource={errorList}
                  renderItem={(item) => (
                    <List.Item className="border-none py-1 px-0">
                      <span className="text-rose-600/80 text-xs flex items-start gap-2 italic leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-rose-400 shrink-0" />
                        {item}
                      </span>
                    </List.Item>
                  )}
                />
              )}
            </div>
          ) : null
        }
      />
    </div>
  );
}

ErrorMessages.propTypes = {
  error: PropTypes.object,
  message: PropTypes.node,
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
