import { Timer } from 'iconoir-react';
import React, { useEffect, useState } from 'react';
// import none from '../../assets/icons/random/no-file.png'

import { useParams } from 'react-router';
import {
  convertToTitleCase,
  formatDate2,
  readingTime,
  truncateText,
} from '../../../../middleware/middleware';
import Wrapper from '../Wrapper/Wrapper';
import News_view from './news_view';

export default function NewsComp({ data, topic }) {
  const { id } = useParams();
  const pathname = window.location.pathname;

  const [news, setNews] = useState(data);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    const exportedData = data?.filter((item, idx) => idx > 0);
    setFilteredResults(exportedData);
  }, [data]);

  const convertNew = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.innerText;

    const truncate = truncateText(text, 100);

    return truncate;
  };

  const convertCardTitle = (str) => {
    const text = convertToTitleCase(str);
    const truncate = truncateText(text, 60);
    return truncate;
  };

  const shreadTag = (str) => {
    const newStr = str.split(' ')[0];
    const returnStr = newStr.replace(',', '');
    return returnStr;
  };

  if (id) return <News_view id={id} topic={topic} />;

  return (
    <div className="fetchedNews">
      {data?.length ? (
        <div>
          <a className="landingNews" href={`${pathname}/${data[0]._id}`}>
            <div className="mainHighlight">
              <div className="overlay"></div>

              <div className="highlight_image">
                <img src={data[0].photo} alt="" />
              </div>

              <Wrapper>
                <div className="contentArea__news">
                  <div className="highlight_content">
                    <div className="date"> {formatDate2(data[0]?.date)} </div>

                    <div className="highlight_title">{convertToTitleCase(data[0].title)}</div>

                    <div className="highlight__short">{convertNew(data[0].content)}</div>

                    <div className="info">
                      <div className="timeToRead">
                        {' '}
                        <Timer /> {readingTime(data[0].content)} Mins Read -{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </div>
          </a>

          <div className="holderNewsBar">
            <Wrapper>
              <div className="news_card_body main">
                <div className="news_results_section">
                  {filteredResults?.length ? (
                    filteredResults.map((res, index) => (
                      <a className="news_card" key={index} href={`${pathname}/${res._id}`}>
                        <div className="news_image">
                          <img src={res.photo} />
                        </div>

                        <div className="news_body_content">
                          <div className="date"> {formatDate2(res.date)} </div>

                          <div className="news_topic"> {convertCardTitle(res.title)} </div>

                          <div className="news_details">
                            <div className="details_readTime">
                              {' '}
                              <Timer /> {readingTime(res.content)} Mins Read -{' '}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="uppercase" style={{ letterSpacing: '2px', fontSize: '11px' }}>
                      {' '}
                      No other additional news found!{' '}
                    </div>
                  )}
                </div>
              </div>
            </Wrapper>
          </div>
        </div>
      ) : (
        <div className="loaderPage uppercase-t"> Oops! No news found! </div>
      )}
    </div>
  );
}
