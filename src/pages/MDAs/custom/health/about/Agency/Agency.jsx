import { Cellar } from 'iconoir-react';
import React, { useEffect, useState } from 'react';
import './agency.scss';

// icons
import Wrapper from '../../../../shared/Wrapper/Wrapper';
import dept from '../../../../shared/assets/department.svg';

export default function Agencies({ res }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const newObj = {};

    res?.agencies?.forEach((e) => {
      if (!newObj[e.category]) {
        newObj[e.category] = { name: e.category, data: [] };
      }

      newObj[e.category].data.push(e);
    });

    setData(newObj);
  }, [res]);

  return (
    <div className="flex justify-center w-full">
      <Wrapper>
        <div className="about-heading full-heading flex flex-col text-center gap-[20px] full">
          <h1 className="full">
            Agencies, Directorates, and Units: Exploring Structure, Roles, and Responsibilities
          </h1>

          <span className="full-span">
            Understanding Organizational Divisions and Their Roles in Effective Operations and
            Governance
          </span>
        </div>

        <div className="agency-zone">
          {Object?.entries(data)?.map((e, index) => (
            <section
              id={e[0] === 'department' ? 'directorates' : e[0]}
              className="multi"
              key={index}
            >
              {/* <h1> {e[0]} </h1> */}

              <div className="mda__card__ui flex">
                {e[1].data.map((res, index) => (
                  <div className="mda__card" key={index}>
                    <div className="iconHolder">
                      <div className="card__photo">
                        <img src={dept} />
                      </div>
                    </div>

                    <div className="card__content">
                      <p>{res.name}</p>
                      <span>
                        {' '}
                        <Cellar /> {e[0]}{' '}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
