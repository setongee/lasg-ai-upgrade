import { ArrowUpRight } from 'iconoir-react';
import { useNavigate, useParams } from 'react-router';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const QuickDocuments = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const navigate = useNavigate();
  const { mda } = useParams();
  const documents = data?.documents || [];

  if (!isEdit && documents.length === 0) return null;

  const hasCustomBackground = !!data?.backgroundColor;
  const backgroundColor = data?.backgroundColor || DEFAULT_BACKGROUND;
  const onDark = hasCustomBackground ? isDarkBackground(backgroundColor) : null;
  const textClass = onDark === null ? '' : onDark ? 'text-white' : 'text-gray-900';
  const mutedTextClass = onDark === null ? 'opacity-70' : onDark ? 'text-white/70' : 'text-gray-500';

  return (
    <section
      id="quickdocsContainder"
      style={{ backgroundColor }}
      className={`quick-documents py-16 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'quickDocuments' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('quickDocuments') : null}
    >
      <Wrapper>
        <div className="quickLinksPoint" id="quickdocs">
          <div className="pointB">
            <div className={`topic ${textClass}`}>
              {data?.title || 'Quick Documents'}
              <div className={`sub ${mutedTextClass}`}>
                {data?.subtitle || 'Access important documents and resources.'}
              </div>
              <button
                className="bg-[#1C3F3A] text-white uppercase tracking-[2px] text-[11px] rounded-[5px] inline-flex items-center gap-2 px-[25px] py-[15px] font-semibold hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  !isEdit && navigate(`/${mda}/resources/`);
                }}
              >
                {data?.discoverMoreText || 'Discover More'} <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pointA">
              <div className="docs">
                {documents.map((doc, index) => (
                  <a key={index} href={doc.link} download className="hover:text-green-700">
                    {doc.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default QuickDocuments;
