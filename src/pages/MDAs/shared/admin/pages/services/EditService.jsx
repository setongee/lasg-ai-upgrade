import { useEffect, useState } from 'react';
import { updateSingleService } from '../../../../../../api/read/services.req';
import { notify } from '../../../../../../utils/toast';
import { useThemeStore } from '../../../../stores/theme.store';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';

const EditService = ({ selectView, service, setShowEditServiceItem }) => {
  const [data, setData] = useState({});
  const mda = useThemeStore((state) => state.mdaData);

  useEffect(() => {
    setData(service);
  }, [service]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleContent = (text) => {
    setData({ ...data, content: text });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSingleService(data._id, data).then((res) => {
      notify.success(res.message || 'Service updated successfully');
      setData({});
      setShowEditServiceItem(false);
      selectView('services');
      window.location.reload();
    });
  };

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Edit service</h1>
      <p className="text-[14px] text-gray-500 mb-10">
        You can update and edit details and information for this service
      </p>

      {/* forms */}
      <form className="flex gap-4 flex-col">
        <div className="flex flex-col w-[100%] gap-4">
          {/* service name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">Service title</label>
            <input
              type="text"
              name="name"
              value={data?.name}
              onChange={handleChange}
              className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200"
              placeholder="Enter the service title here..."
            />
          </div>

          {/* service description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">Service description</label>
            <textarea
              name="short"
              id=""
              cols="30"
              rows="2"
              value={data?.short}
              onChange={handleChange}
              className="ring-1 ring-gray-200 rounded-[4px] py-2.5 px-3 bg-white text-[14px] outline-none focus:ring-green-600 w-full resize-none"
              placeholder="Enter the service description here..."
            ></textarea>
          </div>

          {/* call to action */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">CTA (Call To Action)</label>
            <input
              type="text"
              name="cta"
              value={data?.cta}
              onChange={handleChange}
              className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200"
              placeholder="Enter the call to action here..."
            />
          </div>

          {/* url */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">URL link</label>
            <input
              type="text"
              name="url"
              value={data?.url}
              onChange={handleChange}
              className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200 "
              placeholder="Enter the URL link here..."
            />
          </div>
        </div>

        {/* content editor */}
        <div className="w-[100%] flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold">Service Content</label>
          <div className="ring-[1px] ring-gray-200 rounded-[4px]">
            <LASGEditor dataText={handleContent} value={data?.content || ''} padding={'0px 20px'} />
          </div>
        </div>

        <div>
          <button
            className="py-3 px-6 rounded-[4px] bg-green-700 text-white text-[14px] font-medium cursor-pointer w-full mt-6"
            onClick={handleSubmit}
          >
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditService;
