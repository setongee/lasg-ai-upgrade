import { ArrowUpRightSquareSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import { useThemeStore } from '../../../../stores/theme.store';

const Vision = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({});
  const refetchData = useThemeStore((state) => state.refetchData);

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  const updateData = () => {
    setIsLoading(true);

    const changedFields = Object.entries(updateInfo)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key]) => key);

    if (changedFields.length === 0) {
      notify.info('No changes detected, nothing to update');
      setIsLoading(false);
      return;
    }

    let activity = '';
    if (changedFields.length === 1) {
      activity = changedFields[0];
    } else {
      const allButLast = changedFields.slice(0, -1).join(', ');
      const lastItem = changedFields[changedFields.length - 1];
      activity = `${allButLast} & ${lastItem}`;
    }

    const fullActivity = `updated ${activity} content`;

    updateAdminData(data._id, data, fullActivity)
      .then(() => {
        setIsLoading(false);
        setUpdateInfo({});
        if (refetchData) refetchData();
      })
      .catch((err) => {
        setIsLoading(false);
        notify.error(err.message);
      });
  };

  return (
    <div className="flex flex-col relative mt-[0px] bg-white w-[700px] mx-auto rounded-lg p-8 gap-8">
      {isLoading ? <Loader customClass="" /> : null}

      {/* title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 w-[350px] mb-5">
          Manage your MDA’s vision, mission, and strategic goals.
        </h2>
      </div>

      {/* vision */}
      <div className=" flex flex-col gap-3 border-b border-gray-100 pb-6">
        <div className=" text-gray-700 text-[14px]">
          <p className="font-bold">Our Vision</p>
          <span className="text-gray-400 text-[14px]">
            Describe your MDA’s long-term vision and future aspirations.
          </span>
        </div>

        <textarea
          name="vision"
          placeholder="Enter vision"
          value={data.vision}
          onChange={(e) => {
            setData({ ...data, vision: e.target.value });
            setUpdateInfo({ ...updateInfo, vision: e.target.value });
          }}
          className="p-5 w-full resize-none text-[15px] leading-[23px] min-h-[120px] border-none outline-none bg-gray-50 rounded-lg [field-sizing:content]"
        ></textarea>
      </div>

      {/* mission */}
      <div className=" flex flex-col gap-3 border-b border-gray-100 pb-6">
        <div className=" text-gray-700 text-[14px]">
          <p className="font-bold">Our Mission</p>
          <span className="text-gray-400 text-[14px]">
            State your MDA’s purpose, mandate, and commitment to public service.
          </span>
        </div>

        <textarea
          name="mission"
          placeholder="Enter mission"
          value={data.mission}
          onChange={(e) => {
            setData({ ...data, mission: e.target.value });
            setUpdateInfo({ ...updateInfo, mission: e.target.value });
          }}
          className="p-5 w-full resize-none text-[15px] leading-[23px] min-h-[120px] border-none outline-none bg-gray-50 rounded-lg [field-sizing:content]"
        ></textarea>
      </div>

      {/* goals */}
      <div className=" flex flex-col gap-3">
        <div className=" text-gray-700 text-[14px]">
          <p className="font-bold">Our Goals</p>
          <span className="text-gray-400 text-[14px]">
            Outline the key goals and strategic objectives of your MDA.
          </span>
        </div>

        <textarea
          name="goal"
          placeholder="Enter goal"
          value={data.goal}
          onChange={(e) => {
            setData({ ...data, goal: e.target.value });
            setUpdateInfo({ ...updateInfo, goal: e.target.value });
          }}
          className="p-5 w-full resize-none text-[15px] leading-[23px] min-h-[120px] border-none outline-none bg-gray-50 rounded-lg [field-sizing:content]"
        ></textarea>
      </div>

      <div className="flex text-black">
        <div className="flex gap-[10px]">
          <button
            className="py-[12px] pl-[15px] pr-5 text-white text-[13px] font-bold rounded-[5px] cursor-pointer bg-green-700 ml-auto flex items-center gap-1"
            onClick={updateData}
            disabled={isLoading}
          >
            <ArrowUpRightSquareSolid fontSize={12} strokeWidth={2} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vision;
