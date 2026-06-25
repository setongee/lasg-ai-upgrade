import { ArrowUpRight, BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import Loader from '../../../../shared/loader/loader';
import '../../styles/pages.scss';
import pdff from './pdff.png';

const Resources = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', url: '' });
  const [file, setFile] = useState(null);
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  // open add official modal
  const openModal = () => {
    setNewResource({ name: '', url: '' });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewResource({ name: '', url: '' });
    setFile(null);
    setIsModalOpen(false);
  };

  const openEditModal = (e) => {
    setIndex(e);
    setNewResource(data.resources[e]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setNewResource({ name: '', url: '' });
    setIsEditModalOpen(false);
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB — nginx server limit

  // handle file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        notify.error(
          `File is too large (${(selectedFile.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 5MB.`
        );
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      setNewResource((prev) => ({
        ...prev,
        name: selectedFile.name,
      }));
    }
  };

  // Effect to trigger updateData when updateInfo changes
  useEffect(() => {
    if (updateInfo !== '') {
      updateData();
    }
  }, [updateInfo]);

  // delete an item
  const deleteItem = async (index) => {
    const resourceToDelete = data.resources[index];
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        setIsLoading(true);
        const updatedResources = data.resources.filter((_, idx) => idx !== index);

        // Update local state
        setData((prev) => ({
          ...prev,
          resources: updatedResources,
        }));

        // Set update info and let the effect handle the API call
        setUpdateInfo(`deleted resource - ${resourceToDelete.name}`);
      } catch (error) {
        console.error('Error deleting resource:', error);
        notify.error('Failed to delete resource. Please try again.');
        setIsLoading(false);
      }
    }
  };

  // upload file function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file && !isEditModalOpen) {
      notify.error('Please select a file to upload.');
      setIsLoading(false);
      return;
    }

    if (file && file.size > MAX_FILE_SIZE) {
      notify.error(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed size is 5MB.`
      );
      setIsLoading(false);
      return;
    }

    try {
      if (file) {
        await uploadDocument(file, `${mda_data.fullname}/resources`)
          .then((res) => {
            const url = res.data.url;
            newResource.url = url;
            // Will be handled by the updateInfo effect
            if (isEditModalOpen) {
              data.resources[index] = { ...newResource };
              setUpdateInfo(`updated resource - ${newResource.name}`);
            } else {
              data.resources = data.resources || [];
              data.resources.push({ ...newResource });
              setUpdateInfo(`added new resource - ${newResource.name}`);
            }
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
            notify.error(error.message || 'Error processing resource. Please try again.');
            setIsLoading(false);
          });
      } else {
        // For edit without file change
        data.resources[index] = { ...newResource };
        setUpdateInfo(`updated resource - ${newResource.name}`);
      }

      closeModal();
      closeEditModal();
    } catch (error) {
      console.error('Error uploading file:', error);
      notify.error(error.message || 'Error processing resource. Please try again.');
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setNewResource((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateData = async () => {
    try {
      setIsLoading(true);
      await updateAdminData(data._id, data, updateInfo);
      setUpdateInfo('');
    } catch (error) {
      console.error('Error updating data:', error);
      notify.error('Failed to update resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResources =
    data?.resources?.filter((resource) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return resource.name && resource.name.toLowerCase().includes(searchLower);
    }) || [];

  return (
    <div className="table__main__body">
      {isModalOpen || isEditModalOpen ? (
        <div className="addModal">
          <div className="addModal__card">
            <div className="topic">{isEditModalOpen ? 'Edit Resource' : 'Add Resource'}</div>
            <div
              className="closeModal"
              onClick={() => (isEditModalOpen ? closeEditModal() : closeModal())}
            >
              {' '}
              <Xmark />{' '}
            </div>

            <form className="people__zone docForm" onSubmit={handleSubmit}>
              <div className="form__child">
                <label htmlFor="name">File Document</label>
                <input
                  type="file"
                  id="file"
                  accept="application/pdf"
                  name="file"
                  onChange={(e) => handleFileChange(e)}
                />
              </div>

              <div className="form__child">
                <label htmlFor="name">Document Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Document Name"
                  value={newResource.name}
                  onChange={(e) => onChange(e)}
                />
              </div>

              <div className="form__child submitAction">
                <button
                  type="submit"
                  className="button__primary2 text-center justify-center flex items-center gap-1"
                >
                  {isEditModalOpen ? 'Update Resource' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isLoading && <Loader customClass="" />}

      <div className="titleAdmin flex">
        <div className="flex gap-[10px]">
          <div className="searchField h-[100%] relative">
            <input
              type="text"
              placeholder="Search resource documents..."
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
            {' '}
            <Plus /> Add Document{' '}
          </div>
        </div>
      </div>

      <div className="tableData">
        {filteredResources.length ? (
          filteredResources.map((res, index) => (
            <div className="table__item flex" key={index}>
              <div className="flex flex-col justify-between w-full min-w-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <img src={pdff} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate" title={res.name}>
                      {res.name}
                    </div>
                    <div
                      className="text-sm text-gray-500 truncate"
                      title={res.date || 'PDF Document'}
                    >
                      {res.date || 'PDF Document'}
                    </div>
                  </div>
                </div>
                <div className="tr__item flex act--item mt-5 overflow-x-auto">
                  <div
                    className="action !bg-gray-800 !text-white"
                    onClick={() => window.open(res.url, '_blank')}
                  >
                    <div className="flex items-center justify-center">
                      <ArrowUpRight fontSize={9} strokeWidth={1.8} />
                    </div>
                    View
                  </div>
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
            </div>
          ))
        ) : (
          <div className="w-full text-[16px] text-gray-600">
            {searchTerm
              ? 'No matching resources found.'
              : 'No resources available. Click "Add Document" to upload a new resource.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
