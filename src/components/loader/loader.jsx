import React from 'react';
import './loader.scss';

export default function Loader({ bg, customClass }) {
  return (
    <div className={`spinnerlx ${customClass}`} style={{ backgroundColor: bg }}>
      <span className="loader"></span>
    </div>
  );
}
