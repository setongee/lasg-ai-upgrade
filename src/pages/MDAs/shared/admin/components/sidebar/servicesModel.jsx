import { AppNotificationSolid } from 'iconoir-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ServiceModel({ baseurl }) {
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
      <a href={`${baseurl}/services`} className="link services-admin">
        <div className="icon">
          <AppNotificationSolid />
        </div>
        <div className="text"> Added Services </div>
      </a>
    </div>
  );
}
