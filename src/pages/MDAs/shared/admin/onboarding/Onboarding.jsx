import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeStore } from '../../../stores/theme.store';
import GenerateContent from './GenerateContent';
import OnboardingHeader from './OnboardingHeader';
import SelectTheme from './SelectTheme';
import Summary from './Summary';

const Onboarding = () => {
  const mdaData = useThemeStore((s) => s.mdaData);
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // redirect if isVerified is true
  useEffect(() => {
    if (mdaData && mdaData?.isVerified) {
      navigate(`/${mdaData?.slug}/admin/dashboard`);
    }
  }, [mdaData, navigate]);

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Summary nextStep={nextStep} data={mdaData} />;
      case 2:
        return (
          <SelectTheme
            nextStep={nextStep}
            prevStep={prevStep}
            data={mdaData}
            setSelectedTheme={setSelectedTheme}
            selectedTheme={selectedTheme}
          />
        );
      case 3:
        return <GenerateContent prevStep={prevStep} data={mdaData} selectedTheme={selectedTheme} />;
      default:
        return <Summary nextStep={nextStep} data={mdaData} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div>
        <OnboardingHeader />
      </div>
      <div className="p-[50px] flex justify-center">
        {/* render each step */}
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;
