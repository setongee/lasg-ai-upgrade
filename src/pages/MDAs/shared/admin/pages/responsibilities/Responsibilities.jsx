import { ArrowUpRightSquareSolid } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';
import '../../styles/pages.scss';

const Responsibilities = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [responsible, setResponsible] = useState('');

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  const submitData = () => {
    data.responsibilities = responsible;
    updateData();
  };

  const updateData = () => {
    setIsLoading(true);
    data.responsibilities = responsible;

    updateAdminData(data._id, data)
      .then((e) => {
        setIsLoading(false);
        notify.success(e.message || 'Responsibilities updated successfully!');
      })
      .catch((err) => {
        setIsLoading(false);
        notify.error(err.message || 'Failed to update responsibilities. Please try again.');
        console.error('Update error:', err);
      });
  };

  return (
    <div className="table__main__body">
      {isLoading ? <Loader customClass="" /> : null}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <button
            className="actionBtn button__primary2 flex items-center gap-1 ml-4"
            onClick={submitData}
            disabled={isLoading}
          >
            <ArrowUpRightSquareSolid fontSize={14} strokeWidth={2} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <LASGEditor dataText={setResponsible} value={data.responsibilities} />
    </div>
  );
};

export default Responsibilities;
