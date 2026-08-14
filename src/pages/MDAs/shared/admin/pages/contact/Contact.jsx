import { ArrowUpRightSquareSolid, EditPencil } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import Loader from '../../../../shared/loader/loader';
import genericLogo from '../../../assets/lasg__logo.png';

const FIELD_LABEL_CLASS = 'text-gray-700 text-[14px]';
const FIELD_DESCRIPTION_CLASS = 'text-gray-400 text-[14px]';
const FIELD_GROUP_CLASS = 'flex flex-col gap-3 border-b border-gray-100 pb-6';
const INPUT_CLASS =
  'p-5 w-full text-[15px] leading-[23px] border-none outline-none bg-gray-50 rounded-lg';

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
    <div className="flex flex-col relative mt-[0px] bg-white w-[700px] mx-auto rounded-lg p-8 gap-8">
      {isLoading ? <Loader customClass="" /> : null}

      {/* title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 w-[350px] mb-5">
          Manage your MDA’s contact details and social media links.
        </h2>
      </div>

      {/* logo */}
      <div className="flex flex-col gap-3">
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">MDA Logo</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Upload the logo displayed in your site’s header.
          </span>
        </div>

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
          {/* <button
            type="button"
            onClick={() => document.querySelector('input[name="logo"]').click()}
            disabled={isUploadingLogo}
            className="flex-1 text-left px-4 py-3 text-[15px] bg-gray-50 rounded-lg"
          >
            {logoFile ? logoFile.name : 'Choose File'}
          </button> */}
        </div>
        {isUploadingLogo && <p className="text-sm text-gray-500">Uploading logo...</p>}
        {logo && !isUploadingLogo && (
          <div className="flex items-center gap-3 cursor-pointer">
            <div
              className="relative"
              onClick={() => document.querySelector('input[name="logo"]').click()}
            >
              <img
                src={logo}
                alt="MDA Logo Preview"
                className="w-24 h-24 object-contain border border-gray-300 rounded p-2 bg-white"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white/80 rounded-full flex items-center justify-center">
                <EditPencil className="w-4 h-4" strokeWidth={2} />
              </div>
            </div>

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
            {logoFile && (
              <button
                type="button"
                onClick={handleLogoUploadSubmit}
                disabled={isUploadingLogo || !logoFile}
                className="bg-gray-800 text-white cursor-pointer font-semibold rounded-[5px] px-4 ml-auto py-2 text-sm w-max text-[12px]"
              >
                {isUploadingLogo ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* phone */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">Phone Number</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            The primary phone number the public can use to reach your MDA.
          </span>
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={contact?.phone || ''}
          onChange={(e) => onChange(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* email */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">Email Address</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            The official email address for enquiries and correspondence.
          </span>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          value={contact?.email || ''}
          onChange={(e) => onChange(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* address */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">Office Address</p>
          <span className={FIELD_DESCRIPTION_CLASS}>The physical office address of your MDA.</span>
        </div>

        <input
          type="text"
          name="address"
          placeholder="Enter office address"
          value={contact?.address || ''}
          onChange={(e) => onChange(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* x / twitter */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">X (Formerly Twitter)</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Link to your MDA’s official X (Twitter) profile.
          </span>
        </div>

        <input
          type="text"
          name="x"
          placeholder="Enter X URL"
          value={contact?.socials?.x || ''}
          onChange={(e) => onChangeSocials(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* facebook */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">Facebook</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Link to your MDA’s official Facebook page.
          </span>
        </div>

        <input
          type="text"
          name="facebook"
          placeholder="Enter Facebook URL"
          value={contact?.socials?.facebook || ''}
          onChange={(e) => onChangeSocials(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* linkedin */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">LinkedIn</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Link to your MDA’s official LinkedIn page.
          </span>
        </div>

        <input
          type="text"
          name="linkedin"
          placeholder="Enter LinkedIn URL"
          value={contact?.socials?.linkedin || ''}
          onChange={(e) => onChangeSocials(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* instagram */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">Instagram</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Link to your MDA’s official Instagram profile.
          </span>
        </div>

        <input
          type="text"
          name="instagram"
          placeholder="Enter Instagram URL"
          value={contact?.socials?.instagram || ''}
          onChange={(e) => onChangeSocials(e)}
          className={INPUT_CLASS}
        />
      </div>

      {/* youtube */}
      <div className={FIELD_GROUP_CLASS}>
        <div className={FIELD_LABEL_CLASS}>
          <p className="font-bold">YouTube</p>
          <span className={FIELD_DESCRIPTION_CLASS}>
            Link to your MDA’s official YouTube channel.
          </span>
        </div>

        <input
          type="text"
          name="youtube"
          placeholder="Enter YouTube URL"
          value={contact?.socials?.youtube || ''}
          onChange={(e) => onChangeSocials(e)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex text-black">
        <div className="flex gap-[10px]">
          <button
            className="py-[12px] pl-[15px] pr-5 text-white text-[13px] font-bold rounded-[5px] cursor-pointer bg-green-700 ml-auto flex items-center gap-1"
            onClick={updateData}
          >
            <ArrowUpRightSquareSolid fontSize={12} strokeWidth={2} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
