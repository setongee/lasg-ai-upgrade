import { AppleShortcuts, DocMagnifyingGlass, User } from 'iconoir-react';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Comms({ baseurl }) {
  let { id } = useParams();

  useEffect(() => {
    getActive();
  }, [id]);

  const getActive = async () => {
    const getElementToBeActive = document.querySelector(`.${id}-admin`);
    if (getElementToBeActive) getElementToBeActive.classList.add('current-active');
  };

  return (
    <div className="menu__links">
      <a href={`${baseurl}/resources`} className="link resources-admin">
        <div className="icon">
          <DocMagnifyingGlass />
        </div>
        <div className="text"> Resources </div>
      </a>

      <a href={`${baseurl}/people`} className="link people-admin">
        <div className="icon">
          <User />
        </div>
        <div className="text"> People </div>
      </a>

      <a href={`${baseurl}/contact_info`} className="link contact_info-admin">
        <div className="icon">
          <AppleShortcuts />
        </div>
        <div className="text"> Contact </div>
      </a>
    </div>
  );
}
