import React from 'react';
import theatre from '../../assets/LASG Illustrations/buildings.svg';
import eko from '../../assets/LASG Illustrations/eko.svg';
import road from '../../assets/LASG Illustrations/road.svg';
import water from '../../assets/LASG Illustrations/water.svg';

// Motion Animation
import brt from '../../assets/LASG Illustrations/brt.svg';
import danfo from '../../assets/LASG Illustrations/danfo.svg';
import eyo from '../../assets/LASG Illustrations/eyo.svg';
import lagride from '../../assets/LASG Illustrations/lagosride.svg';
import train from '../../assets/LASG Illustrations/lasg__blueline__rail.svg';
import lasumbus from '../../assets/LASG Illustrations/lasumbus.svg';
import trainStation from '../../assets/LASG Illustrations/train__station.svg';

export default function LasgIllustrations() {
  return (
    <div className="lasg__illustration">
      {/* Road Component */}
      <div className="lasg__illustration__road">
        <img src={road} alt="" />
      </div>

      {/* National Theatre Component */}
      <div className="lasg__illustration__theatre">
        <img src={theatre} alt="" />
      </div>

      {/* Water Component */}
      <div className="lasg__illustration__water">
        <img src={water} alt="" />
      </div>

      {/* Eko Bridge Component */}
      <div className="lasg__illustration__eko">
        <img src={eko} alt="" />
      </div>

      {/* Station Component */}
      <div className="lasg__illustration__station">
        <img src={trainStation} alt="" />
      </div>

      {/* train Component */}
      <div className="lasg__illustration__train">
        <img src={train} alt="" />
      </div>

      {/* Eyo Component */}
      <div className="lasg__illustration__eyo">
        <img src={eyo} alt="" />
      </div>

      {/* Motion Moves */}

      <div className="motion__illustration brt">
        <img src={brt} alt="Lagos State Assets" />
      </div>

      <div className="motion__illustration lasumbus">
        <img src={lasumbus} alt="Lagos State Assets" />
      </div>

      <div className="motion__illustration lagride">
        <img src={lagride} alt="Lagos State Assets" />
      </div>

      <div className="motion__illustration__2 danfo">
        <img src={danfo} alt="Lagos State Assets" />
      </div>
    </div>
  );
}
