import React from 'react';
import '../styles/button.css';

const Button = ({ customClass, children, action }) => {
  return (
    <div className={`buttons ${customClass}`} onClick={action}>
      {children}
    </div>
  );
};

export default Button;
