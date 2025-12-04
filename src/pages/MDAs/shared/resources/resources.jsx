import { ArrowSeparateVertical, DownloadCircle } from 'iconoir-react';
import React from 'react';
import { useThemeStore } from '../../stores/theme.store';
import pdf from '../assets/sectionsIcons/pdf.png';
import Wrapper from '../Wrapper/Wrapper';
import './resources.scss';

export default function Resources() {
  const data = useThemeStore((state) => state.mdaData);
  
  return (
    <div className="resources">
      <Wrapper>
        <div className="about-heading flex">
          <h1>Knowledge Vault : Explore Resources & Archives</h1>

          <span>Discover a treasure trove of resources for learning, growth, and innovation.</span>
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

          {
            data?.resources?.length > 0 && data?.resources?.map((resource, index) => {
              return (
                <a key = {index} href={resource?.url} target='_blank' className="doc doc__body">
                  <div className="doc__title flex gap__10">
                    <div className="doc__icon">
                      <img src={pdf} alt="" />
                    </div>
                    {resource?.name}
                  </div>
                  <div className="doc__category">{resource?.category || 'N/A'}</div>
                  <div className="doc__date"> {resource?.date || 'N/A'} </div>
                  <div className="doc__action">
                    {' '}
                    <div className="form__button flex">
                      {' '}
                      <DownloadCircle /> Download{' '}
                    </div>{' '}
                  </div>
                </a>
              );
            })
          }
        </div>
      </Wrapper>
    </div>
  );
}
