import ServicesSection from '../../shared/services/ServicesSection';

const CoreServices = ({
  data,
  mdaName,
  style,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data) return null;

  return (
    <section
      className={`bg-[#e6edef] md:py-20 py-16 pb-10 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'services' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('services') : null}
    >
      <ServicesSection style={style} data={data} name={mdaName} />
    </section>
  );
};

export default CoreServices;
