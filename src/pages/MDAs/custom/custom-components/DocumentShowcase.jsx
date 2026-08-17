import { ArrowUpRight } from 'iconoir-react';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';
import pdfIcon from '../../shared/assets/sectionsIcons/pdf.png';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const DocumentShowcase = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const documents = data?.documents || [];

  if (!isEdit && documents.length === 0) return null;

  const hasCustomBackground = !!data?.backgroundColor;
  const backgroundColor = data?.backgroundColor || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;
  const textClass = onDark === null ? '' : onDark ? 'text-white' : 'text-gray-900';
  const mutedTextClass =
    onDark === null ? 'opacity-70' : onDark ? 'text-white/70' : 'text-gray-500';

  return (
    <section
      style={{ backgroundColor }}
      className={`py-8 sm:py-16 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'documentShowcase' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('documentShowcase') : null}
    >
      <Wrapper>
        <div className="flex flex-col gap-0 mb-8">
          <p className={`text-[18px] sm:text-[26px] font-semibold ${textClass}`}>
            {data?.title || 'Documents'}
          </p>
          <p className={`text-[14px] ${mutedTextClass}`}>
            {data?.subtitle || 'Download our latest published documents.'}
          </p>
        </div>

        <div className="sm:flex sm:gap-5 gap-4 overflow-x-auto pb-2 sm:grid-cols-none grid grid-cols-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {documents.map((doc, index) => (
            <a
              key={index}
              href={doc.url || undefined}
              target="_blank"
              rel="noreferrer"
              download
              className="flex-none sm:w-[300px] bg-white overflow-hidden sm:group"
              onClick={(e) => (isEdit || !doc.url) && e.preventDefault()}
            >
              <div className="w-full sm:h-[400px] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={doc.thumbnail || pdfIcon}
                  alt=""
                  className={
                    doc.thumbnail
                      ? 'w-full h-full object-cover'
                      : 'w-10 h-10 object-contain opacity-60'
                  }
                />
              </div>
              <div className="flex py-3 items-center justify-between gap-2 group-hover:px-3 transition-all duration-700">
                <span className="text-[14px] leading-[1.3] sm:text-[16px] w-[85%] sm:leading-[1.4] font-semibold text-gray-800 line-clamp-2">
                  {doc.name || 'Untitled document'}
                </span>
                <ArrowUpRight className="text-gray-700 shrink-0" width={16} />
              </div>
            </a>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default DocumentShowcase;
