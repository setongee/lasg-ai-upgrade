import { NavArrowDown } from 'iconoir-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Arrow from '../arrowEvents/arrow';
import NestedView from './nestedView';

export default function NavElements(navigationRoutes) {
  const navData = navigationRoutes.navigationRoutes;
  let navigate = useNavigate();

  const [showNest, setShowNest] = useState(false);

  const addClass = (e) => {
    const parent = e.target;
    parent.classList.add('remain')(parent);
  };

  const removeClass = (e) => {
    const parent = e.target;
    parent.classList.remove('remain');
  };

  return (
    <div className="navigationRoutes">
      {/* Type is nested */}
      <div className="nested_link">
        {/* Main Main 1 */}
        <div className="main_nav">
          {/* Parent Nested Link Name */}
          <div
            className="parentLink"
            onMouseOver={(e) => addClass(e)}
            onMouseOut={(e) => removeClass(e)}
          >
            <div className="ParentName thick uppercase">
              {navData.parentName}
              {navData.isNest ? (
                <NavArrowDown color="#131414" className="navi" />
              ) : (
                <Arrow color="#131414" />
              )}
            </div>

            {/* ---------------------------------- Conditional Rendered Dropdown Component ---------------------------------- */}

            {/* Nested Links */}
            {navData.isNest ? (
              <NestedView navData={navData} isOpen={showNest} setOpen={setShowNest} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
