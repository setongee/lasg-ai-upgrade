import { ArrowUpRightSquareSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import { useThemeStore } from '../../../../stores/theme.store';
import '../../styles/pages.scss';

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
    <div className="vision__body">
      {isLoading ? <Loader customClass="" /> : null}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <button
            className="actionBtn button__primary2 flex items-center gap-1 ml-4"
            onClick={updateData}
            disabled={isLoading}
          >
            <ArrowUpRightSquareSolid fontSize={14} strokeWidth={2} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="cards">
        <div className="card sub__card vision__card">
          <div className="tag">Our Vision</div>

          <div className="previewArea"> {data.vision} </div>

          <div className="form__action">
            <textarea
              name="vision"
              placeholder="Enter vision"
              value={data.vision}
              onChange={(e) => {
                setData({ ...data, vision: e.target.value });
                setUpdateInfo({ ...updateInfo, vision: e.target.value });
              }}
            ></textarea>
          </div>
        </div>

        <div className="card sub__card vision__card">
          <div className="tag">Our Mission</div>

          <div className="previewArea"> {data.mission} </div>

          <div className="form__action">
            <textarea
              name="mission"
              placeholder="Enter mission"
              value={data.mission}
              onChange={(e) => {
                setData({ ...data, mission: e.target.value });
                setUpdateInfo({ ...updateInfo, mission: e.target.value });
              }}
            ></textarea>
          </div>
        </div>

        <div className="card sub__card vision__card">
          <div className="tag">Our Goal</div>

          <div className="previewArea"> {data.goal} </div>

          <div className="form__action">
            <textarea
              name="goal"
              placeholder="Enter goal"
              value={data.goal}
              onChange={(e) => {
                setData({ ...data, goal: e.target.value });
                setUpdateInfo({ ...updateInfo, goal: e.target.value });
              }}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vision;
