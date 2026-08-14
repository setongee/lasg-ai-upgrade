import { BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import SearchInput from '../../components/searchInput/SearchInput';
import '../../styles/pages.scss';

const CATEGORY_THEME = {
  agency: 'bg-green-200/30 text-green-700',
  department: 'bg-purple-200/30 text-purple-700',
  unit: 'bg-blue-200/30 text-blue-700',
};

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
      data.agencies.push({ ...newAgency, updatedAt: new Date().toISOString() });
      setUpdateInfo(`added a new ${newAgency.category} - ${newAgency.name}`);
      // updateData() call is now handled by the useEffect hook
    }
  };

  const submitEditData = () => {
    data.agencies[index] = { ...newAgency, updatedAt: new Date().toISOString() };
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
      .catch((err) => err);
  };

  return (
    <div>
      <div className="titleAdmin flex items-center justify-between z-99">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Manage Agencies / Departments / Units -{' '}
          <span className="text-[14px] font-normal text-gray-500">Click on an item to load it</span>
        </h2>
        <div className=" h-10 w-[450px]">
          <SearchInput placeholder="Search items..." value={searchTerm} onChange={setSearchTerm} />
        </div>
        {/* add mda */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-800 text-[13px] cursor-pointer py-2 px-4 flex items-center gap-1 font-medium rounded-sm text-white"
        >
          <Plus /> Add Agency / Department / Unit
        </button>
      </div>
      <div className="table__main__body mt-18!">
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

        <div className="rounded-[12px] bg-white overflow-x-auto drop-shadow-2xl drop-shadow-gray-300/10 pb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] uppercase tracking-[1.5px] text-gray-500">
                <th className="px-6 py-5 font-semibold w-[60px]">S/N</th>
                <th className="px-6 py-5 font-semibold">Name</th>
                <th className="px-6 py-5 font-semibold">Agency Type</th>
                <th className="px-6 py-5 font-semibold">Last Updated</th>
                <th className="px-6 py-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.length > 0 ? (
                filteredAgencies.map((res, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4.5 text-[13px] font-medium text-gray-500">
                      {index + 1}.
                    </td>
                    <td className="px-6 py-4.5 text-[13px] font-medium max-w-[320px]">
                      <span className="line-clamp-2">{res.name}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2 py-1 rounded-[5px] uppercase text-[10px] tracking-[2px] font-bold ${
                          CATEGORY_THEME[res.category] || CATEGORY_THEME.agency
                        }`}
                      >
                        {res.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-[14px] text-gray-500">
                      {res.updatedAt ? new Date(res.updatedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-[13px] text-gray-800 hover:text-green-700 bg-gray-100/70 px-3 py-1.5 pr-4 rounded-[5px] font-medium"
                          onClick={() => openEditModal(index)}
                        >
                          <Edit fontSize={9} strokeWidth={1.8} /> Edit
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-red-700 bg-gray-100/70 px-3 py-1.5 pr-4 rounded-[5px] font-medium"
                          onClick={() => deleteItem(index)}
                        >
                          <BinFull fontSize={10} strokeWidth={1.8} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[14px] text-gray-500">
                    {searchTerm ? 'No matching agencies found.' : 'No agencies available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Agency;
