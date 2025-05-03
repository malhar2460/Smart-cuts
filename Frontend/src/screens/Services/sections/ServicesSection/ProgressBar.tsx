// If you want it in the same file, paste this _above_ your BookingModal definition:
import React  from "react";


export const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
    const steps = ["Select Time", "Choose Staff", "Payment"];
    return (
      <div className="w-full mb-6">
        <div className="flex items-center">
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            const isActive = stepNum <= currentStep;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      isActive ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span
                    className={`mt-1 text-sm ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      stepNum < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };
  