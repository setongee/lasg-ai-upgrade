import { Mail, Phone } from 'iconoir-react';
import React from 'react';
import { useThemeStore } from '../../stores/theme.store';
import Wrapper from '../Wrapper/Wrapper';
import './connect.scss';

export default function Connect() {
  const data = useThemeStore((state) => state.mdaData);

  return (
    <div className="mda-connect">
      <Wrapper>
        <div className="contact">
          <div className="side1">
            <div className="head">
              <h1>
                {' '}
                <span>Reach Out to Us</span> for Support, Inquiries, or Feedback Today!{' '}
              </h1>
              <div className="span">Send us an email today📬 or call in</div>
            </div>

            <div className="connect__info">
              <p>
                {' '}
                <Mail color="green" /> {data?.contact?.email}{' '}
              </p>
              <p>
                {' '}
                <Phone color="green" /> {data?.contact?.phone}{' '}
              </p>

              <div>
                <a target="_blank" href={data?.contact?.address}>
                  {' '}
                  {data?.contact?.address}{' '}
                </a>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
