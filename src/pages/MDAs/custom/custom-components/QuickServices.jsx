import QuickServices from '../../shared/quick_services/QuickServices';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #e6edef)';

const QuickServicesSection = ({
  data,
  style,
  ctaTitle,
  backgroundColor,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data || data.length === 0) return null;

  const resolvedBackground = backgroundColor || DEFAULT_BACKGROUND;

  return (
    <section
      style={{ backgroundColor: resolvedBackground }}
      className={`py-10 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'quickServices' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('quickServices') : null}
    >
      <QuickServices data={data} style={style} ctaTitle={ctaTitle} />
    </section>
  );
};

export default QuickServicesSection;
