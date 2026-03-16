import ContentGeneratorExample from '../components/chatbot/ContentGeneratorExample';

const GenerateContent = ({ prevStep, selectedTheme, data }) => {
  return (
    <ContentGeneratorExample
      prevStep={prevStep}
      selectedTheme={selectedTheme ? selectedTheme : data?.theme}
    />
  );
};

export default GenerateContent;
