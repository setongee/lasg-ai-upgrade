import { ArrowUpRightSquareSolid, Plus } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';
import '../../styles/pages.scss';
import SearchInput from '../../components/searchInput/SearchInput';

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
    <div>
      <div className="titleAdmin flex items-center justify-between z-90">
        <h2 className="text-[15px] font-semibold text-gray-900">
          MDA's Responsibilities -{' '}
          <span className="text-[14px] font-normal text-gray-500">
            Update the responsibilities of the MDA
          </span>
        </h2>

        {/* add mda */}
        <button
          onClick={submitData}
          disabled={isLoading}
          className="bg-green-800 text-[13px] cursor-pointer py-2 px-4 flex items-center gap-1 font-medium rounded-sm text-white"
        >
          <Plus /> {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="table__main__body mt-15!">
        {isLoading ? <Loader customClass="" /> : null}
        <LASGEditor dataText={setResponsible} value={data.responsibilities} />
      </div>
    </div>
  );
};

export default Responsibilities;
