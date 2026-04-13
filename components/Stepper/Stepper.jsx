import React from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { BuildingOffice2Icon, UserIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

// Data arrays
const steps = [
  '2006', '2008', '2010', '2013', '2016', '2021', '2022'
];

const stepDescriptions = [
  ["A Year of Beginnings:", "The firm is founded by Martin Geissler and Mark Olds.", "Scott Lowe is welcomed as a Principal Shareholder"],
  ["The Firm Relocates to Fairfax County, Virginia", "Welcomes Joe (Ken) Muncy as Principal Shareholder"],
  ["John Ciccozzi Joins", "As Principal Shareholder"],
  ["Daniel Podhajny Joins the Leadership Team", "As Principal Shareholder"],
  ["Celebrating 10 Years of Excellence and Proudly", "Expanding Our Trademark Department"],
  ["Scott M. Tulino & Aaron J. Sanders Join", "As Principal Shareholders"],
  ["The firm relocates to  Alexandria, VA", "Conveniently Located Near the USPTO Office"],
];

export default function StepperWithContent() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  React.useEffect(() => {
    setIsFirstStep(activeStep === 0);
    setIsLastStep(activeStep === steps.length - 1);
  }, [activeStep]);

  return (
    <div className="w-full pt-14 pb-14 px-4 sm:px-8 md:px-16 lg:px-40 xl:px-80 py-4">
      {/* Stepper Container */}
      <div className="relative flex items-center justify-center w-full">
        {/* Base gray progress bar */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 -translate-y-1/2 z-0" />
        {/* Blue progress bar */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-blue-600 transition-all duration-300 -translate-y-1/2 z-0"
          style={{
            width: `${(activeStep / (steps.length - 1)) * 100}%`, // Ensure the progress bar stops at the last node
          }}
        />
        {/* Stepper */}
        <Stepper activeStep={activeStep}>
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            // Determine the position and alignment classes
            let positionClass = '';
            let alignmentClass = '';

            if (isFirst) {
              positionClass = '-bottom-28';
              alignmentClass = 'text-left left-0';
            } else if (isLast) {
              positionClass = isEven ? '-bottom-24' : '-top-24';
              alignmentClass = 'text-right right-0';
            } else {
              positionClass = isEven ? '-bottom-24' : '-top-24';
              alignmentClass = 'text-center';
            }

            return (
              <Step
                key={index}
                onClick={() => setActiveStep(index)}
                className={`flex items-center justify-center rounded-full ${
                  activeStep === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                style={{
                  // Set different sizes for different screen sizes
                  width: window.innerWidth < 640 ? '40px' : '60px', // Smaller size on mobile screens
                  height: window.innerWidth < 640 ? '40px' : '60px', // Smaller size on mobile screens
                }}
              >
                {/* Icons based on step index */}
                {index % 3 === 0 ? (
                  <BuildingOffice2Icon className="h-8 w-8 text-white" />
                ) : index % 3 === 1 ? (
                  <UserIcon className="h-8 w-8 text-white" />
                ) : (
                  <BuildingLibraryIcon className="h-8 w-8 text-white" />
                )}

                {/* Show description only when the step is active */}
                {activeStep === index && (
                  <div
                    className={`absolute w-max hidden sm:block ${positionClass} ${alignmentClass}`}
                  >
                    <Typography
                      variant="h6"
                      color={activeStep === index ? "blue-gray" : "gray"}
                    >
                      {step}
                    </Typography>
                    {stepDescriptions[index].map((desc, descIndex) => (
                      <Typography
                        key={descIndex}
                        color={activeStep === index ? "blue-gray" : "gray"}
                        className="font-normal mb-0"
                      >
                        {desc}
                      </Typography>
                    ))}
                  </div>
                )}
              </Step>
            );
          })}
        </Stepper>

      </div>

      {/* Description Section for Small Screens */}
      <div className="block sm:hidden mt-8 text-center">
        <Typography variant="h6" color="blue-gray">
          {steps[activeStep]}
        </Typography>
        {stepDescriptions[activeStep].map((desc, descIndex) => (
          <Typography key={descIndex} color="blue-gray" className="font-normal mb-0">
            {desc}
          </Typography>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 sm:mt-28 md:mt-32 lg:mt-32 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep}>
          Next
        </Button>
      </div>
    </div>
  );
}
