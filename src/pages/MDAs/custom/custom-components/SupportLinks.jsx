import { ArrowUpRight, Link as LinkIcon, Mail, Phone } from 'iconoir-react';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const getFormattedLink = (supportLink) => {
  if (!supportLink?.link) return '';

  switch (supportLink.linkType) {
    case 'phone':
      return `tel:${supportLink.link.replace(/[^0-9+]/g, '')}`;
    case 'email':
      return `mailto:${supportLink.link}`;
    default:
      return supportLink.link;
  }
};

const getLinkIcon = (linkType) => {
  switch (linkType) {
    case 'phone':
      return Phone;
    case 'email':
      return Mail;
    default:
      return LinkIcon;
  }
};

const SupportLinks = ({
  data,
  backgroundColor,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const links = data || [];

  if (!isEdit && links.length === 0) return null;

  const resolvedBackground = backgroundColor || DEFAULT_BACKGROUND;
  const onDark = backgroundColor ? isDarkBackground(resolvedBackground) : null;

  return (
    <section
      style={{ backgroundColor: resolvedBackground }}
      className={`py-16 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'supportLinks' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('supportLinks') : null}
    >
      <Wrapper>
        <h2 className={`text-[24px] sm:text-[28px] font-semibold text-center mb-10 ${onDark ? 'text-white' : ''}`}>
          Support & Quick Links
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((supportLink, index) => {
            const Icon = getLinkIcon(supportLink.linkType);
            return (
              <a
                key={index}
                href={getFormattedLink(supportLink)}
                target={!supportLink.linkType || supportLink.linkType === 'page' ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-white rounded-[8px] p-5 hover:shadow-md transition-shadow"
                onClick={(e) => isEdit && e.preventDefault()}
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-700">
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[14px] font-medium">
                    {supportLink.text || 'Support Link'}
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </a>
            );
          })}
        </div>
      </Wrapper>
    </section>
  );
};

export default SupportLinks;
