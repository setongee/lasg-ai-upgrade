import QuickServices from '../../shared/quick_services/QuickServices';

const QuickServicesSection = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data || data.length === 0) return null;

  return (
    <section
      className={`bg-[#e6edef] py-10 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'quickServices' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('quickServices') : null}
    >
      <QuickServices data={data} />
    </section>
  );
};

export default QuickServicesSection;
