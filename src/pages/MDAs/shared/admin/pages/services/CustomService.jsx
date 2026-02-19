import { useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { addSingleService } from '../../../../api/admin/logic';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';

const CustomService = ({ selectView, mda, handleCheck }) => {
  const [data, setData] = useState({ author: mda.name });
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleContent = (text) => {
    setData({ ...data, content: text });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const check = handleCheck(data);

    if (check) {
      notify.error('This service name already exists, use a different name');
      return;
    }

    addSingleService(data, mda.fullname).then((res) => {
      notify.success(res.message || 'Service added successfully');
      setData({});
      selectView('services');
    });
  };

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Add new service</h1>
      <p className="text-[14px] text-gray-500 mb-10">Kindly input all valid informations below</p>

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

export default CustomService;
