import React from 'react';
import useWindowWidth from '../../../../../hooks/useWindowWidth';
import '../../../shared/styles/style.scss';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import HeaderLg from './header-lg';
import HeaderSm from './header-sm';
import './header.css';

const Header = ({ fullname }) => {
  const width = useWindowWidth();
  const info = 'Emergency ( 112 ) | Mental Health ( +2349090006463 )';

  const isLargeScreen = width >= 1000;

  return (
    <header className="fixed top-0 w-full z-50">
      {isLargeScreen && (
        <div className="info-banner flex justify-center bg-[#1c3f3a]">
          <Wrapper customClass="flex justify-center py-[8px] uppercase text-[10px] tracking-[2px] text-[#f0ead2]">
            <p>{info}</p>
          </Wrapper>
        </div>
      )}

      <div className="glass-card">
        <Wrapper
          style={{
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isLargeScreen ? (
            <HeaderLg customClass="h-[80px]" fullname={fullname} />
          ) : (
            <HeaderSm customClass="h-[80px]" fullname={fullname} />
          )}
        </Wrapper>
      </div>
    </header>
  );
};

export default Header;
