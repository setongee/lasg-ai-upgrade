import { BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import SearchInput from '../../components/searchInput/SearchInput';
import '../../styles/pages.scss';

const Agency = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newAgency, setNewAgency] = useState({});
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');

  const openEditModal = (e) => {
    setIndex(e);
    setNewAgency(data.agencies[e]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setNewAgency({});
    setIsEditModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewAgency({});
    setIsModalOpen(false);
  };

  const onChange = (e) => {
    setNewAgency((data) => {
      return {
        ...newAgency,
        [e.target.name]: e.target.value,
      };
    });
  };

  // delete an item
  // Effect to trigger updateData when updateInfo changes
  useEffect(() => {
    if (updateInfo !== '') {
      updateData();
    }
  }, [updateInfo]);

  const deleteItem = (index) => {
    const shouldDelete = confirm(`Do you want to delete ${data.agencies[index].name}`);

    const deleteItem = data.agencies[index];

    if (shouldDelete) {
      const filterOpt = data.agencies.filter((e, idx) => index !== idx);
      data.agencies = filterOpt;
      setUpdateInfo(`deleted ${deleteItem.category} - ${deleteItem.name}`);
      // updateData() call is now handled by the useEffect hook
    }
  };

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  const submitData = () => {
    const filterData = data.agencies.filter((res) => res.name === newAgency.name);

    if (filterData.length) notify.error(`${newAgency.name} already exists, try another!`);
    else {
      data.agencies.push(newAgency);
      setUpdateInfo(`added a new ${newAgency.category} - ${newAgency.name}`);
      // updateData() call is now handled by the useEffect hook
    }
  };

  const submitEditData = () => {
    data.agencies[index] = newAgency;
    setUpdateInfo(`updated ${newAgency.category} - ${newAgency.name}`);
    // updateData() call is now handled by the useEffect hook
  };

  // Filter agencies based on search term
  const filteredAgencies =
    data?.agencies?.filter((agency) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        agency.name.toLowerCase().includes(searchLower) ||
        agency.category.toLowerCase().includes(searchLower)
      );
    }) || [];

  const updateData = () => {
    setIsLoading(true);
    updateAdminData(data._id, data, updateInfo)
      .then((e) => {
        setTimeout(() => {
          setIsLoading(false);
          closeModal();
          closeEditModal();
          setMessage(e.message);
          setTimeout(() => {
            setMessage('');
            setUpdateInfo('');
          }, 3000);
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="table__main__body">
      {isModalOpen ? (
        <div className="addModal">
          <div className="addModal__card">
            <div className="topic"> Add Agency / Department / Unit </div>
            <div className="closeModal" onClick={() => closeModal()}>
              {' '}
              <Xmark />{' '}
            </div>

            <form>
              <div className="form__child">
                <label htmlFor="name"> Name </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={newAgency.name}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child">
                <label htmlFor="name"> Category </label>
                <select name="category" onChange={(e) => onChange(e)} value={newAgency.category}>
                  <option value=""> ----- Select Category ----- </option>
                  <option value="agency"> Agency </option>
                  <option value="department"> Department </option>
                  <option value="unit"> Unit </option>
                </select>
              </div>

              <div className="form__child submitAction" onClick={submitData}>
                {' '}
                Submit Agency{' '}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isEditModalOpen ? (
        <div className="addModal">
          <div className="addModal__card">
            <div className="topic"> Edit Agency / Department / Unit </div>
            <div className="closeModal" onClick={() => closeEditModal()}>
              {' '}
              <Xmark />{' '}
            </div>

            <form>
              <div className="form__child">
                <label htmlFor="name"> Name </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={newAgency.name}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child">
                <label htmlFor="name"> Category </label>
                <select name="category" onChange={(e) => onChange(e)} value={newAgency.category}>
                  <option value=""> ----- Select Category ----- </option>
                  <option value="agency"> Agency </option>
                  <option value="department"> Department </option>
                  <option value="unit"> Unit </option>
                </select>
              </div>

              <div className="form__child submitAction" onClick={submitEditData}>
                {' '}
                Submit Agency{' '}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isLoading ? <Loader customClass="" /> : null}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <div className="searchField h-[100%] w-[450px]">
            <SearchInput
              placeholder="Search agencies, departments and units..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <div className="actionBtn button__primary2 flex gap-1" onClick={() => openModal()}>
            {' '}
            <Plus /> Add Agency{' '}
          </div>
        </div>
      </div>

      <div className="tableData">
        {filteredAgencies.length > 0 ? (
          filteredAgencies.map((res, index) => (
            <div className="table__item flex">
              <div className="flex items-center justify-between">
                <div className="tr__item cat--item cap"> {res.category} </div>
              </div>
              <div className="tr__item name--item"> {res.name} </div>
              <div className="tr__item flex act--item overflow-x-auto">
                <div className="action" onClick={() => openEditModal(index)}>
                  <div className="flex items-center justify-center">
                    <Edit fontSize={11} strokeWidth={1.8} />
                  </div>
                  Edit
                </div>
                <div className="action" onClick={() => deleteItem(index)}>
                  <div className="flex items-center justify-center ">
                    <BinFull fontSize={11} strokeWidth={1.8} />
                  </div>
                  Delete
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-[16px] text-gray-600">
            {searchTerm ? 'No matching agencies found.' : 'No agencies available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Agency;
