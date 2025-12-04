import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'iconoir-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getAllNews, getSingleNews } from '../../../../api/read/news.req';
import Loader from '../../../../components/loader/loader';
import {
  convertToTitleCase,
  formatDate3,
  readingTime,
  sortArray,
  truncateText,
} from '../../../../middleware/middleware';
import Wrapper from '../Wrapper/Wrapper';
import './view_news.scss';

export default function News_view({ topic }) {
  const navigate = useNavigate();

  const [sub_data, setSub_data] = useState([]);

  const { mda, id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['view_news', { id }],
    queryFn: () => getSingleNews(id),
  });

  const newsData = useQuery({
    queryKey: ['view-news', topic, mda],
    queryFn: () => getAllNews(0, topic),
  });

  useEffect(() => {
    const pin = sortArray(newsData?.data?.data, 'date').then((sortedArr) => sortedArr);
    const rex = pin.then((response) => {
      const po = response?.filter((e) => {
        return e._id !== id;
      });

      setSub_data(po);
    });
  }, [newsData?.data]);

  useEffect(() => {
    if (data) {
      const tc = document.getElementById('text');
      tc.innerHTML = data?.data.content;
    }
  }, [data]);

  const navigateBack = () => {
    navigate(`/${mda}/news`);
  };

  if (isLoading)
    return (
      <div className="loaderPage">
        <Loader />
      </div>
    );

  console.log(sub_data);

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className="view_news">
      <Wrapper>
        <div className="overhold flex">
          <div className="news_container">
            <div className="back_to_news" onClick={() => navigateBack()}>
              {' '}
              <ArrowLeft />{' '}
            </div>

            <div className="current_news">
              <div className="dateNow">
                <div className="firstPart flex">
                  {formatDate3(data?.data.date)}

                  <p>-</p>

                  <div className="readtime"> {readingTime(data?.data.content)} Mins Read </div>
                </div>
              </div>

              <div className="current_news_title">{convertToTitleCase(data?.data.title)}</div>

              <div className="current_news_image">
                <img src={data?.data.photo} alt="" />
              </div>

              <div className="current_news_body" id="text"></div>
            </div>
          </div>

          <div className="sub_news_container">
            <div className="title__sub__news">
              <p>Other Related News </p>
            </div>

            <div className="sub__news__data">
              {sub_data?.length
                ? sub_data.slice(0, 8).map((res, index) => (
                    <a className="subs_news" href={`/${mda}/news/${res._id}`} key={index}>
                      <div className="sub__image">
                        <img src={res.photo} alt="" />
                      </div>
                      <div className="sub__title flex">
                        {truncateText(convertToTitleCase(res.title), 60)}
                        <div className="date">{formatDate3(res.date)}</div>
                      </div>
                    </a>
                  ))
                : null}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
