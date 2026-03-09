import { ArrowLeft, ArrowSeparateVertical, DownloadCircle } from 'iconoir-react';
import { useNavigate, useParams } from 'react-router';
import { formatDate3 } from '../../../../middleware/middleware';
import { useThemeStore } from '../../stores/theme.store';
import pdf from '../assets/sectionsIcons/pdf.png';
import Wrapper from '../Wrapper/Wrapper';
import ResourceCategories from './resource-categories/ResourceCategories';
import './resources.scss';

export default function ResourcesType2() {
  const data = useThemeStore((state) => state.mdaData);
  const { mda, id } = useParams();

  let navigate = useNavigate();

  if (id) {
    const filteredDocuments = data?.resources?.filter(
      (resource) => resource?.category.toLowerCase().replace(/\s+/g, '-') === id
    );

    `/${data?.slug}/resources/`;

    return (
      <div className="resources">
        <Wrapper>
          <div className="about-heading flex gap-4! mb-4 text-gray-900!">
            <div className="w-full">
              <div className="cursor-pointer" onClick={() => navigate(`/${mda}/resources/`)}>
                <ArrowLeft fontSize={20} />
              </div>
            </div>
            <h1 className="capitalize underline">{id.replaceAll('-', ' ')}</h1>
          </div>

          <div className="vault">
            <div className="doc doc__top">
              <div className="doc__title flex gap__20">
                # Resource Title <ArrowSeparateVertical />{' '}
              </div>
              <div className="doc__category flex gap__20">
                Category <ArrowSeparateVertical />
              </div>
              <div className="doc__date flex gap__20">
                Last Updated <ArrowSeparateVertical />
              </div>
              <div className="doc__action">Action</div>
            </div>

            {filteredDocuments?.length > 0 &&
              filteredDocuments?.map((resource, index) => {
                return (
                  <a key={index} href={resource?.url} target="_blank" className="doc doc__body">
                    <div className="doc__title flex gap__10">
                      <div className="doc__icon">
                        <img src={pdf} alt="" />
                      </div>
                      {resource?.name}
                    </div>
                    <div className="doc__category">{resource?.category || 'N/A'}</div>
                    <div className="doc__date">
                      {' '}
                      {resource?.date ? formatDate3(resource?.date) : 'N/A'}{' '}
                    </div>
                    <div className="doc__action">
                      {' '}
                      <div className="form__button flex">
                        {' '}
                        <DownloadCircle /> Download{' '}
                      </div>{' '}
                    </div>
                  </a>
                );
              })}
          </div>
        </Wrapper>
      </div>
    );
  }

  return (
    <div className="resources">
      <ResourceCategories
        data={data?.landingPage?.resourceCategories}
        isEdit={false}
        mda={data?.slug?.toLowerCase().replace(/\s+/g, '-')}
        type="page"
      />
    </div>
  );
}
