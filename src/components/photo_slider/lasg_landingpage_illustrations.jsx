import React from 'react';
import { useApp } from '../../stores/app.store';
import { NightSky, NightStreet } from './lasg_night';
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

// Night variants: recoloured scenery with lit windows, LED-lit bridge cables and a dark harbour.
import nightTheatre from '../../assets/LASG Illustrations/night/buildings.svg';
import nightEko from '../../assets/LASG Illustrations/night/eko.svg';
import nightEyo from '../../assets/LASG Illustrations/night/eyo.svg';
import nightRoad from '../../assets/LASG Illustrations/night/road.svg';
import nightStation from '../../assets/LASG Illustrations/night/train__station.svg';
import nightWater from '../../assets/LASG Illustrations/night/water.svg';

export default function LasgIllustrations() {
  const night = useApp((state) => state.darkmode);

  return (
    <>
      {night && <NightSky />}
      <div className={`lasg__illustration ${night ? 'is-night' : ''}`}>
        {night && <NightStreet />}
      {/* Road Component */}
      <div className="lasg__illustration__road">
        <img src={night ? nightRoad : road} alt="" />
      </div>

      {/* National Theatre Component */}
      <div className="lasg__illustration__theatre">
        <img src={night ? nightTheatre : theatre} alt="" />
      </div>

      {/* Water Component */}
      <div className="lasg__illustration__water">
        <img src={night ? nightWater : water} alt="" />
      </div>

      {/* Eko Bridge Component */}
      <div className="lasg__illustration__eko">
        <img src={night ? nightEko : eko} alt="" />
      </div>

      {/* Station Component */}
      <div className="lasg__illustration__station">
        <img src={night ? nightStation : trainStation} alt="" />
      </div>

      {/* train Component */}
      <div className="lasg__illustration__train">
        <img src={train} alt="" />
      </div>

      {/* Eyo Component */}
      <div className="lasg__illustration__eyo">
        <img src={night ? nightEyo : eyo} alt="" />
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
    </>
  );
}
