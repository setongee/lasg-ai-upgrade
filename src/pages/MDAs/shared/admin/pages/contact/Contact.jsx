import { ArrowUpRightSquareSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import Loader from '../../../../shared/loader/loader';
import genericLogo from '../../../assets/lasg__logo.png';
import '../../styles/pages.scss';

const Contact = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState({});
  const [updateInfo, setUpdateInfo] = useState({});
  const [logo, setLogo] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

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
    setLogo(mda_data.logo || genericLogo);
  }, [mda_data]);

  const updateData = () => {
    setIsLoading(true);
    data.contact = contact;
    data.logo = logo;

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

  const updateBreandLogo = () => {
    updateAdminData(data._id, data, 'updated brand logo');
  };

  const handleLogoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      // Show preview of selected file immediately
      const previewUrl = URL.createObjectURL(file);
      setLogo(previewUrl);
    }
  };

  const handleLogoUploadSubmit = async () => {
    if (!logoFile) {
      notify.error('Please select a logo file first');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const response = await uploadDocument(logoFile, `${data?.fullname || 'mdas-logo'}`);
      const logoUrl = typeof response === 'string' ? response : response.data.url;
      setLogo(logoUrl);
      data.logo = logoUrl;
      // Clean up the object URL
      if (logo.startsWith('blob:')) {
        URL.revokeObjectURL(logo);
      }
      await updateAdminData(data._id, data, 'updated brand logo');
      console.log(logoUrl);
    } catch (error) {
      console.error('Logo upload failed:', error);
      notify.error('Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
    }
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

        <div className="form__child">
          <label htmlFor="logo"> MDA Logo </label>
          <div className="flex gap-2 items-start">
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleLogoFileSelect}
              disabled={isUploadingLogo}
              className="flex-1"
              hidden
            />
            <div className="flex-1 border-[1px] border-[#d1d1d1] h-12 rounded-[5px]">
              <button
                type="button"
                onClick={() => document.querySelector('input[name="logo"]').click()}
                disabled={isUploadingLogo}
                className="px-3 py-2 text-sm h-full w-full text-left"
              >
                {logoFile ? logoFile.name : 'Choose File'}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogoUploadSubmit}
              disabled={isUploadingLogo || !logoFile}
              className="bg-gray-800 text-white font-semibold h-full rounded-[5px] px-8 text-sm"
            >
              {isUploadingLogo ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          {isUploadingLogo && <p className="text-sm text-gray-500 mt-1">Uploading logo...</p>}
          {logo && !isUploadingLogo && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={logo}
                alt="MDA Logo Preview"
                className="w-24 h-24 object-contain border border-gray-300 rounded p-2 bg-white"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {logo.startsWith('blob:') ? 'Logo Preview' : 'Current Logo'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {logo.startsWith('blob:')
                    ? 'Click Upload to save this logo'
                    : 'This logo will be displayed in the header'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* <div className="form__child submitAction"> Submit Agency </div> */}
      </form>
    </div>
  );
};

export default Contact;
