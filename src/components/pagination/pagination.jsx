import { NavArrowLeft, NavArrowRight } from 'iconoir-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pagination.scss';

export default function Pagination({ size, page, topic }) {
  let navigate = useNavigate();

  const [pageIn, setPageIn] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      setPageIn(page);
    }, 500);
  }, [page]);

  const countPages = () => {
    let pages = [];
    let pageNum = Number(page);

    const active = document.querySelector(`.page${pageIn}`);
    const activeInt = document.querySelector('.page1');

    if (document.querySelector('.activePage') !== null) {
      document.querySelector('.activePage').classList.remove('activePage');
    }

    if (pageNum < 1) {
      activeInt?.classList.add('activePage');
    } else {
      active?.classList.add('activePage');
    }

    if (pageNum < 1) {
      for (var x = 1; x <= 10 && x <= size?.pageCount; x++) {
        pages.push(x);
      }
    } else if (pageNum > 10 && pageNum < 20) {
      for (var x = 11; x < 20 && x <= size?.pageCount; x++) {
        pages.push(x);
      }
    } else if (pageNum <= 10 && pageNum >= 1) {
      for (var x = 1; x <= 10 && x <= size?.pageCount; x++) {
        pages.push(x);
      }
    } else {
      for (
        var x = page.split('')[0] * 10 - 9;
        x <= page.split('')[0] * 10 && x <= size?.pageCount;
        x++
      ) {
        pages.push(x);
      }
    }

    return pages;
  };

  const countSelectPages = () => {
    let pages = [];
    let pageNum = Number(page);

    for (var x = 1; x <= size?.pageCount; x++) {
      pages.push(x);
    }

    return pages;
  };

  const nextPage = () => {
    navigate(`/news/${topic}/${Math.min(Number(page) + 1, size.pageCount)}`);
  };

  const previousPage = () => {
    navigate(`/news/${topic}/${Math.max(Number(page) - 1, 1)}`);
  };

  const handlePageSwitch = (pageNumber) => {
    navigate(`/news/${topic}/${pageNumber}`);
  };

  // const handleChangePage = e => {

  //     console.log(e.target.value)

  // }

  return (
    <div className="pagination__container">
      {/* pagination */}

      {size?.pageCount > 0 && Number(page) <= size?.pageCount ? (
        <div className="pagination flex">
          <div className="link__point" onClick={() => handlePageSwitch(1)}>
            {' '}
            First Page (1){' '}
          </div>

          <div className="pagination__controls" onClick={() => previousPage()}>
            {' '}
            <NavArrowLeft />{' '}
          </div>

          <div className="pageControl">
            {countPages().map((num) => (
              <div className={`pageIndex page${num}`} onClick={() => handlePageSwitch(num)}>
                {' '}
                {num}{' '}
              </div>
            ))}
          </div>

          {/* mobile version */}

          <select
            name="page"
            id="page"
            onChange={(e) => handlePageSwitch(e.target.value)}
            value={page}
          >
            {countSelectPages().map((num) => (
              <option value={num}> Page {num} </option>
            ))}
          </select>

          <div className="pagination__controls" onClick={() => nextPage()}>
            {' '}
            <NavArrowRight />{' '}
          </div>

          <div className="link__point" onClick={() => handlePageSwitch(size.pageCount)}>
            {' '}
            Last Page ( {size.pageCount} ){' '}
          </div>
        </div>
      ) : null}
    </div>
  );
}
