import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MediaImage, NavArrowLeft, NavArrowRight, Xmark } from 'iconoir-react';
import { useState } from 'react';
import { useParams } from 'react-router';
import { getAlbumsForMda, getSingleAlbum } from '../../../../api/read/gallery.req';
import Loader from '../../../../components/loader/loader';
import Wrapper from '../Wrapper/Wrapper';

const Lightbox = ({ photos, activeIndex, onClose, onNavigate }) => {
  const photo = photos[activeIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-6 right-6 text-white cursor-pointer"
        onClick={onClose}
        aria-label="Close"
      >
        <Xmark width={28} />
      </button>

      {photos.length > 1 && (
        <button
          type="button"
          className="absolute left-4 sm:left-8 text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(activeIndex === 0 ? photos.length - 1 : activeIndex - 1);
          }}
          aria-label="Previous photo"
        >
          <NavArrowLeft width={32} />
        </button>
      )}

      <div
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption}
          className="max-w-full max-h-[75vh] object-contain rounded-lg"
        />
        {photo.caption && <p className="text-white/80 text-[14px] text-center">{photo.caption}</p>}
      </div>

      {photos.length > 1 && (
        <button
          type="button"
          className="absolute right-4 sm:right-8 text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(activeIndex === photos.length - 1 ? 0 : activeIndex + 1);
          }}
          aria-label="Next photo"
        >
          <NavArrowRight width={32} />
        </button>
      )}
    </div>
  );
};

const AlbumDetail = ({ album, mda }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const photos = album.photos || [];

  return (
    <Wrapper>
      <div className="py-16 mt-20 min-h-[40vh]">
        <a
          href={`/${mda}/gallery`}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-[var(--theme-accent,#15803d)] mb-8"
        >
          <ArrowLeft width={16} /> Back to Gallery
        </a>

        <h1 className="text-[32px] sm:text-[40px] font-bold mb-2">{album.title}</h1>
        {album.description && (
          <p className="text-gray-500 text-[15px] mb-10 max-w-[700px]">{album.description}</p>
        )}

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo.url + index}
                onClick={() => setActiveIndex(index)}
                className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer"
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-[15px]">This album has no photos yet.</div>
        )}
      </div>

      {activeIndex !== null && (
        <Lightbox
          photos={photos}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </Wrapper>
  );
};

const AlbumGrid = ({ albums, mda }) => (
  <Wrapper>
    <div className="py-16 mt-20 min-h-[40vh]">
      <h1 className="text-[18px] sm:text-[24px] font-bold mb-0">Gallery</h1>

      {albums?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <a
              key={album._id}
              href={`/${mda}/gallery/${album._id}`}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center">
                {album.coverImage ? (
                  <img src={album.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <MediaImage className="text-gray-400" width={32} />
                )}
              </div>
              <div className="p-5 flex flex-col gap-1">
                <h3 className="text-[17px] font-semibold leading-snug line-clamp-1">
                  {album.title}
                </h3>
                <p className="text-[13px] text-gray-500">{album.photos?.length || 0} photos</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-gray-800 text-[15px] text-center bg-gray-100/90 sm:min-h-[40vh] min-h-[20vh] mt-6 flex items-center justify-center">
          No photos have been added yet.
        </div>
      )}
    </div>
  </Wrapper>
);

export default function Gallery() {
  const { mda, id } = useParams();

  const albumsQuery = useQuery({
    queryKey: ['gallery', mda],
    queryFn: () => getAlbumsForMda(mda),
    enabled: !!mda && !id,
  });

  const singleAlbumQuery = useQuery({
    queryKey: ['album', id],
    queryFn: () => getSingleAlbum(id),
    enabled: !!id,
  });

  const isLoading = id ? singleAlbumQuery.isLoading : albumsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="loaderPage">
        <Loader />
      </div>
    );
  }

  if (id) {
    return <AlbumDetail album={singleAlbumQuery.data?.data} mda={mda} />;
  }

  return <AlbumGrid albums={albumsQuery.data?.data} mda={mda} />;
}
