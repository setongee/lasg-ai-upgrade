import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { getAllNews } from '../../../../api/read/news.req';
import Loader from '../../../../components/loader/loader';
import Pagination from '../pagination/pagination';
import './news.scss';
import NewsComp from './NewsComp';

export default function News_Events({ topic }) {
  let navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { mda } = useParams();
  const [size, setSize] = useState({ length: 0, pageCount: 0 });
  const [newsCounter, setNewsCounter] = useState(0);

  const newsData = useQuery({
    queryKey: ['news', page, topic],
    queryFn: () => getAllNews(Number(page - 1), topic),
  });

  useEffect(() => {
    window.scroll(0, 0);

    setSize({
      length: newsCounter,
      pageCount: parseInt(newsCounter / 20) + 1,
    });
  }, [page, topic, newsCounter]);

  useEffect(() => {
    setNewsCounter(newsData?.data?.length);
  }, [newsData?.data]);

  if (newsData.error) {
    return (
      <div className="loaderPage">
        <Loader />
      </div>
    );
  }

  if (newsData.isLoading)
    return (
      <div className="loaderPage">
        <Loader />
      </div>
    );

  return (
    <div className="news_body">
      <div className="news">
        <div className="news__show__body">
          <NewsComp data={newsData.data?.data} topic={topic} />

          {newsData.data?.length > 1 ? (
            <Pagination size={size} page={page} redirect={`/${mda}/news`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
