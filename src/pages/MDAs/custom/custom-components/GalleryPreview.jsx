import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getAlbumsForMda } from '../../../../api/read/gallery.req';
import { isDarkBackground } from '../../shared/utils/backgroundContrast';
import Wrapper from '../../shared/Wrapper/Wrapper';

const DEFAULT_BACKGROUND = 'var(--theme-section-bg, #ffffff)';

const GalleryPreview = ({
  backgroundColor,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  const { mda } = useParams();

  const { data } = useQuery({
    queryKey: ['gallery-preview', mda],
    queryFn: () => getAlbumsForMda(mda),
    enabled: !!mda,
  });

  const albums = (data?.data || []).slice(0, 3);

  const resolvedBackground = backgroundColor || DEFAULT_BACKGROUND;
  const onDark = backgroundColor ? isDarkBackground(resolvedBackground) : null;

  if (!isEdit && albums.length === 0) return null;

  return (
    <section
      style={{ backgroundColor: resolvedBackground }}
      className={`py-16 ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'galleryPreview' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('galleryPreview') : null}
    >
      <Wrapper>
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-[28px] sm:text-[34px] font-bold ${onDark ? 'text-white' : ''}`}>
            Gallery
          </h2>
          <a
            href={`/${mda}/gallery`}
            className="text-[13px] font-semibold text-green-700 uppercase tracking-[1.5px]"
          >
            View All
          </a>
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {albums.map((album) => (
              <a
                key={album._id}
                href={`/${mda}/gallery/${album._id}`}
                className="rounded-2xl overflow-hidden h-[220px] bg-gray-100 block"
              >
                {album.coverImage && (
                  <img src={album.coverImage} alt="" className="w-full h-full object-cover" />
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-[14px]">
            No albums yet — this section will appear once photos are added.
          </div>
        )}
      </Wrapper>
    </section>
  );
};

export default GalleryPreview;
