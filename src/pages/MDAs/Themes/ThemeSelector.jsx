import React from 'react';
import Index from '../custom/health';
import MEPB from '../custom/mepb/Mepb';
import MIST from '../custom/mist/MIST';
import Finance from '../custom/mof/Finance';
import Transportation from '../custom/mot/Transportation';
import STO from '../custom/sto/STO';

const ThemeSelector = ({ theme }) => {
  switch (theme) {
    case 'health':
      return <Index />;

    case 'mepb':
      return <MEPB />;

    case 'mist':
      return <MIST />;

    case 'transport':
      return <Transportation />;

    case 'finance':
      return <Finance />;

    case 'sto':
      return <STO />;
  }
};

export default ThemeSelector;
