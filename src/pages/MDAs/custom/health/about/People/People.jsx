import React, { useEffect, useState } from 'react';
import { convertToTitleCase } from '../../../../../../middleware/middleware';
import Wrapper from '../../../../shared/Wrapper/Wrapper';
import './people.css';

export default function People({ res }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(res?.people);
  }, [res]);

  return (
    <div className="about__sections">
      <Wrapper>
        <div className="about-heading full-heading flex flex-col text-center gap-[20px] full">
          <h1 className="full">
            Meet the Team: Passionate People Driving Success and Innovation Forward
          </h1>

          <span className="full-span">
            Bringing Innovation, Dedication, and Excellence Together for Lasting Impact and Success
          </span>
        </div>

        <div className="gallery__mda gallx">
          <section>
            {data?.length
              ? data.map((res, index) => (
                  <a className="pic" key={index}>
                    <div className="pic__holder">
                      <img src={res.photo} alt={`${res.name}_${res.role}`} />
                    </div>

                    <div className="name__card">
                      <span> {res.role} </span>
                      <p> {convertToTitleCase(res.name)} </p>
                    </div>
                  </a>
                ))
              : null}
          </section>
        </div>
      </Wrapper>
    </div>
  );
}
