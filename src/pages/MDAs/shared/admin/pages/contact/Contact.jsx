import { ArrowUpRightSquareSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import '../../styles/pages.scss';

const Contact = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState({});
  const [updateInfo, setUpdateInfo] = useState({});

  const onChange = (e) => {
    setContact((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setUpdateInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value ? 'updated' : 'removed',
    }));
  };

  const onChangeSocials = (e) => {
    setContact((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [e.target.name]: e.target.value,
      },
    }));
    setUpdateInfo((prev) => ({
      ...prev,
      [`socials.${e.target.name}`]: e.target.value ? 'updated' : 'removed',
    }));
  };

  useEffect(() => {
    setData(mda_data);
    setContact(mda_data.contact || {});
  }, [mda_data]);

  const updateData = () => {
    setIsLoading(true);
    data.contact = contact;

    const changedFields = Object.entries(updateInfo)
      .filter(([_, value]) => value === 'updated' || value === 'removed')
      .map(([key]) => key);

    if (changedFields.length === 0) {
      notify.info('No changes detected, nothing to update');
      setIsLoading(false);
      return;
    }

    let activity = '';
    const fieldLabels = {
      phone: 'phone number',
      email: 'email address',
      address: 'office address',
      'socials.x': 'X (Twitter) link',
      'socials.facebook': 'Facebook link',
      'socials.linkedin': 'LinkedIn link',
      'socials.instagram': 'Instagram link',
      'socials.youtube': 'YouTube link',
    };

    const changedLabels = changedFields.map((field) => fieldLabels[field] || field);

    if (changedLabels.length === 1) {
      activity = `updated ${changedLabels[0]}`;
    } else {
      const allButLast = changedLabels.slice(0, -1).join(', ');
      const lastItem = changedLabels[changedLabels.length - 1];
      activity = `updated ${allButLast} and ${lastItem}`;
    }

    updateAdminData(data._id, data, activity)
      .then(() => {
        setIsLoading(false);
        setUpdateInfo({});
      })
      .catch((err) => {
        setIsLoading(false);
        notify.error(err.message || 'Failed to update contact information');
      });
  };

  return (
    <div className="contact__body">
      {isLoading ? <Loader customClass="" /> : null}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <button
            className="actionBtn button__primary2 flex items-center gap-1 ml-4"
            onClick={updateData}
          >
            <ArrowUpRightSquareSolid fontSize={14} strokeWidth={2} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <form>
        <div className="form__child">
          <label htmlFor="name"> Phone Number </label>
          <input
            type="text"
            name="phone"
            placeholder="Enter Phone"
            value={contact?.phone}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Email Address </label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={contact?.email}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Office Address </label>
          <input
            type="text"
            name="address"
            placeholder="Enter Address"
            value={contact?.address}
            onChange={(e) => onChange(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> X (Formerly Twitter) </label>
          <input
            type="text"
            name="x"
            placeholder="Enter X URL"
            value={contact?.socials?.x}
            onChange={(e) => onChangeSocials(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Facebook </label>
          <input
            type="text"
            name="facebook"
            placeholder="Enter Facebook URL"
            value={contact?.socials?.facebook}
            onChange={(e) => onChangeSocials(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Linkedin </label>
          <input
            type="text"
            name="linkedin"
            placeholder="Enter Linkedin URL"
            value={contact?.socials?.linkedin}
            onChange={(e) => onChangeSocials(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Instagram </label>
          <input
            type="text"
            name="instagram"
            placeholder="Enter Instagram URL"
            value={contact?.socials?.instagram}
            onChange={(e) => onChangeSocials(e)}
          />
        </div>

        <div className="form__child">
          <label htmlFor="name"> Youtube </label>
          <input
            type="text"
            name="youtube"
            placeholder="Enter Youtube URL"
            value={contact?.socials?.youtube}
            onChange={(e) => onChangeSocials(e)}
          />
        </div>

        {/* <div className="form__child submitAction"> Submit Agency </div> */}
      </form>
    </div>
  );
};

export default Contact;
