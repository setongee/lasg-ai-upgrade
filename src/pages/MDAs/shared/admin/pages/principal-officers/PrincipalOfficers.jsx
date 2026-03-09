import { Edit, Plus, Trash, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData, uploadFile } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import '../../styles/pages.scss';

const People = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newOfficial, setNewOfficial] = useState({});
  const [index, setIndex] = useState(0);
  const [file, setFile] = useState([]);
  const [photo, setPhoto] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');

  // open edit modal
  const openEditModal = (e) => {
    setIndex(e);
    setNewOfficial(data.people[e]);
    setIsEditModalOpen(true);

    setPhoto(data.people[e].photo);
  };

  // close edit modal
  const closeEditModal = () => {
    setNewOfficial({});
    setPhoto('');
    setFile([]);
    setIsEditModalOpen(false);
  };

  // open add official modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // close add official modal
  const closeModal = () => {
    setNewOfficial({});
    setPhoto('');
    setFile([]);
    setIsModalOpen(false);
  };

  // handle file
  const handleFile = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files);
      const min = window.URL.createObjectURL(e.target.files[0]);
      setPhoto(min);
    }
  };

  // format the fullname
  const formatCategoryName = (name) => {
    return name.replaceAll(' ', '').replaceAll(',', '_').replaceAll('&', '_').toLowerCase();
  };

  // upload photo function
  const uploadPhoto = () => {
    if (!file.length) {
      alert('You must add a photo');
      return false;
    } else {
      const fileData = file[0];
      let uniqueName = formatCategoryName(newOfficial.name);
      setIsLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(fileData);

      reader.onloadend = () => {
        try {
          uploadFile({
            photo: {
              temp: uniqueName,
              data: reader.result,
            },
          }).then((response) => {
            newOfficial.photo = response.url;
            submitData();
          });
        } catch (error) {
          error.message;
          setIsLoading(false);
        }
      };
    }
  };

  // handle click event
  const handleClick = () => {
    document.getElementById('file').click();
  };

  // Filter officials based on search term
  const filteredOfficials =
    data?.people?.filter((official) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (official.name && official.name.toLowerCase().includes(searchLower)) ||
        (official.role && official.role.toLowerCase().includes(searchLower))
      );
    }) || [];

  // function on change on forms
  const onChange = (e) => {
    setNewOfficial((data) => {
      return {
        ...newOfficial,
        [e.target.name]: e.target.value,
      };
    });
  };

  // Effect to trigger updateData when updateInfo changes
  useEffect(() => {
    if (updateInfo !== '') {
      updateData();
    }
  }, [updateInfo]);

  // delete an item
  const deleteItem = (index) => {
    const deleteItem = data.people[index];
    const shouldDelete = confirm(`Do you want to delete ${deleteItem.name}`);

    if (shouldDelete) {
      data.people = data.people.filter((e, idx) => index !== idx);
      setUpdateInfo(`deleted principal officer - ${deleteItem.name} (${deleteItem.role})`);
    }
  };

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  const submitData = () => {
    data.people.push(newOfficial);
    setUpdateInfo(`added new principal officer - ${newOfficial.name} (${newOfficial.role})`);
  };

  const submitEditData = () => {
    if (!file.length) {
      data.people[index] = newOfficial;
      setUpdateInfo(`updated principal officer - ${newOfficial.name} / (${newOfficial.role})`);
    } else {
      const fileData = file[0];
      let uniqueName = formatCategoryName(newOfficial.name);
      setIsLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(fileData);

      reader.onloadend = () => {
        try {
          uploadFile({
            photo: {
              temp: uniqueName,
              data: reader.result,
            },
          }).then((response) => {
            newOfficial.photo = response.url;
            data.people[index] = newOfficial;
            setUpdateInfo(
              `updated photo for principal officer - ${newOfficial.name} (${newOfficial.role})`
            );
          });
        } catch (error) {
          error.message;
        }
      };
    }
  };

  const updateData = () => {
    setIsLoading(true);

    updateAdminData(data._id, data, updateInfo)
      .then((e) => {
        setIsLoading(false);
        closeModal();
        closeEditModal();
        setUpdateInfo('');
      })
      .catch((err) => {
        setIsLoading(false);
        notify.error(err.message || 'Failed to update officer. Please try again.');
        console.error('Update error:', err);
      });
  };

  return (
    <div className="table__main__body">
      {isLoading && <Loader customClass="" />}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <div className="searchField h-[100%] relative">
            <input
              type="text"
              placeholder="Search officials by name or role..."
              className="py-[15px] pl-[45px] pr-[20px] rounded-[5px] w-[450px] bg-[#f5f5f5] text-[14px] h-full focus:outline-none focus:ring-1 focus:ring-[#27ae60] focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <div className="actionBtn button__primary2 flex gap-1" onClick={() => openModal()}>
            <Plus /> Add Official
          </div>
        </div>
      </div>

      {isModalOpen ? (
        <div className="addModal">
          <div className="addModal__card">
            <div className="topic"> Add Official </div>
            <div className="closeModal" onClick={() => closeModal()}>
              {' '}
              <Xmark />{' '}
            </div>

            <div className="official__area" onClick={() => handleClick()}>
              <img src={photo} alt="" />
              <span>Edit Image</span>
            </div>

            <input
              type="file"
              id="file"
              accept="image/*"
              name="file"
              onChange={(e) => handleFile(e)}
              hidden
            />

            <form className="people__zone">
              <div className="form__child">
                <label htmlFor="name"> Fullame </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Fullname"
                  value={newOfficial.name}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child">
                <label htmlFor="name"> Role / Designation </label>
                <input
                  type="text"
                  name="role"
                  placeholder="Enter Role / Designation"
                  value={newOfficial.role}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child submitAction" onClick={uploadPhoto}>
                {' '}
                Add Official{' '}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isEditModalOpen ? (
        <div className="addModal">
          <div className="addModal__card">
            <div className="topic"> Edit Official Details </div>
            <div className="closeModal" onClick={() => closeEditModal()}>
              {' '}
              <Xmark />{' '}
            </div>

            <div className="official__area" onClick={() => handleClick()}>
              <img src={photo} alt="" />
              <span>Edit Image</span>
            </div>

            <input
              type="file"
              id="file"
              accept="image/*"
              name="file"
              onChange={(e) => handleFile(e)}
              hidden
            />

            <form className="people__zone">
              <div className="form__child">
                <label htmlFor="name"> Fullame </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Fullname"
                  value={newOfficial.name}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child">
                <label htmlFor="name"> Role / Designation </label>
                <input
                  type="text"
                  name="role"
                  placeholder="Enter Role / Designation"
                  value={newOfficial.role}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child submitAction" onClick={submitEditData}>
                {' '}
                Save Changes{' '}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="tableData">
        {filteredOfficials.length > 0 ? (
          filteredOfficials.map((official, index) => (
            <div className="table__item flex flex-col" key={index}>
              <div className="flex flex-col items-center justify-between w-full">
                <div className="flex flex-col w-full gap-4">
                  <div className="official__image overflow-hidden bg-gray-100">
                    {official.photo ? (
                      <img
                        src={official.photo}
                        alt={official.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center flex items-center flex-col mx-auto mt-3 mb-6 gap-2">
                    <div className="tr__item name--item font-medium text-[16px] leading-[140%] text-center">
                      {official.name}
                    </div>
                    <div className="tr__item text-gray-500">{official.role}</div>
                  </div>
                </div>
                <div className="tr__item flex act--item gap-2 mb-2">
                  <button
                    className="action flex items-center gap-1 text-sm text-[#e67e22] hover:bg-[#fdf2e9] px-3 py-1.5 rounded cursor-pointer"
                    onClick={() => openEditModal(index)}
                  >
                    <Edit fontSize={11} strokeWidth={1.8} />
                    Edit
                  </button>
                  <button
                    className="action flex items-center gap-1 text-sm text-[#c0392b] hover:bg-[#fde8e8] px-3 py-1.5 rounded cursor-pointer"
                    onClick={() => deleteItem(index)}
                  >
                    <Trash fontSize={11} strokeWidth={1.8} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-[16px] text-gray-600">
            {searchTerm ? 'No matching officials found.' : 'No officials available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default People;
