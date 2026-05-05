import { ArrowUpRight, BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData } from '../../../../api/admin/content';
import { uploadDocument } from '../../../../api/uploader/uploadFIles';
import { useThemeStore } from '../../../../stores/theme.store';
import Loader from '../../../loader/loader';
import '../../styles/pages.scss';
import pdff from './pdff.png';

const ResourcesCategoryStyle = ({ mda_data }) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({ name: '', url: '', category: '' });
  const [file, setFile] = useState(null);
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateInfo, setUpdateInfo] = useState('');
  const [uploadingItems, setUploadingItems] = useState({}); // Track upload progress

  const landingPageData = useThemeStore((s) => s.mdaData)?.landingPage;
  const categories =
    landingPageData?.resourceCategories?.cards?.length > 0
      ? landingPageData?.resourceCategories?.cards?.map((card) => card.title)
      : [];

  useEffect(() => {
    setData(mda_data);
  }, [mda_data]);

  // open add official modal
  const openModal = () => {
    setNewResource({ name: '', url: '', category: '' });
    setFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewResource({ name: '', url: '', category: '' });
    setFile(null);
    setIsModalOpen(false);
  };

  const openEditModal = (e) => {
    setIndex(e);
    setNewResource(data.resources[e]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setNewResource({ name: '', url: '', category: '' });
    setIsEditModalOpen(false);
  };

  // handle file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
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

    if (!file && !isEditModalOpen) {
      notify.error('Please select a file to upload.');
      return;
    }

    if (isEditModalOpen) {
      // For edit mode, keep original behavior
      setIsLoading(true);
      try {
        if (file) {
          await uploadDocument(file, `${mda_data.fullname}/resources`)
            .then((res) => {
              const url = res.data.url;
              console.log(url);
              newResource.url = url;
              data.resources[index] = {
                name: newResource.name,
                url: url,
                category: newResource.category,
                date: new Date().toISOString(), // Update date on edit
              };
              setUpdateInfo(`updated resource - ${newResource.name}`);
            })
            .catch((error) => {
              console.error('Error uploading file:', error);
              notify.error(error.message || 'Error processing resource. Please try again.');
            });
        } else {
          // For edit without file change
          data.resources[index] = {
            name: newResource.name,
            url: newResource.url,
            category: newResource.category,
            date: new Date().toISOString(), // Update date on edit
          };
          setUpdateInfo(`updated resource - ${newResource.name}`);
        }
        closeEditModal();
      } catch (error) {
        console.error('Error updating resource:', error);
        notify.error(error.message || 'Error processing resource. Please try again.');
      }
      return;
    }

    // For new resource - add locally first with upload progress
    const tempId = Date.now().toString();
    const tempResource = {
      ...newResource,
      id: tempId,
      url: null, // Will be set after upload
      isUploading: true,
      uploadProgress: 0,
      date: new Date().toISOString(), // Add creation date
    };

    // Add to local state immediately
    const updatedResources = [...(data.resources || []), tempResource];
    setData((prev) => ({
      ...prev,
      resources: updatedResources,
    }));

    // Set upload progress tracking
    setUploadingItems((prev) => ({
      ...prev,
      [tempId]: { progress: 0, status: 'uploading' },
    }));

    closeModal();

    // Start upload process
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadingItems((prev) => {
          const currentProgress = prev[tempId]?.progress || 0;
          if (currentProgress < 90) {
            return {
              ...prev,
              [tempId]: { progress: currentProgress + 10, status: 'uploading' },
            };
          }
          return prev;
        });
      }, 200);

      await uploadDocument(file, `${mda_data.fullname}/resources`)
        .then((res) => {
          clearInterval(progressInterval);
          const url = res.data.url;

          // Update the resource with the actual URL
          setData((prev) => ({
            ...prev,
            resources: prev.resources.map((resource) =>
              resource.id === tempId
                ? { ...resource, url: url, isUploading: false, uploadProgress: 100 }
                : resource
            ),
          }));

          setUploadingItems((prev) => ({
            ...prev,
            [tempId]: { progress: 100, status: 'completed' },
          }));

          // Update backend data
          const finalData = { ...data };
          finalData.resources = finalData.resources.map((resource) =>
            resource.id === tempId
              ? {
                  name: resource.name,
                  url: res,
                  category: resource.category,
                  date: resource.date, // Include the creation date
                }
              : resource
          );

          setUpdateInfo(`added new resource - ${newResource.name}`);

          // Clean up upload tracking after completion
          setTimeout(() => {
            setUploadingItems((prev) => {
              const newItems = { ...prev };
              delete newItems[tempId];
              return newItems;
            });
          }, 2000);
        })
        .catch((error) => {
          clearInterval(progressInterval);
          console.error('Error uploading file:', error);
          notify.error(error.message || 'Error processing resource. Please try again.');

          // Remove the failed item from local state
          setData((prev) => ({
            ...prev,
            resources: prev.resources.filter((resource) => resource.id !== tempId),
          }));

          setUploadingItems((prev) => ({
            ...prev,
            [tempId]: { progress: 0, status: 'failed' },
          }));

          // Clean up upload tracking after failure
          setTimeout(() => {
            setUploadingItems((prev) => {
              const newItems = { ...prev };
              delete newItems[tempId];
              return newItems;
            });
          }, 2000);
        });
    } catch (error) {
      console.error('Error uploading file:', error);
      notify.error(error.message || 'Error processing resource. Please try again.');

      // Remove the failed item from local state
      setData((prev) => ({
        ...prev,
        resources: prev.resources.filter((resource) => resource.id !== tempId),
      }));
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

              <div className="form__child">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={newResource.category}
                  onChange={(e) => onChange(e)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select a category</option>
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
          filteredResources.map((res, index) => {
            const uploadInfo = uploadingItems[res.id];
            const isUploading = res.isUploading || uploadInfo?.status === 'uploading';
            const uploadProgress = res.uploadProgress || uploadInfo?.progress || 0;
            // console.log(res);
            return (
              <div className="table__item flex" key={res.id || index}>
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
                        title={res.category || 'No category'}
                      >
                        {res.category || 'No category'}
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Uploading...</span>
                        <span className="text-xs text-gray-500">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-600 h-1.5 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="tr__item flex act--item mt-5 overflow-x-auto no-scrollbar">
                    <div
                      className={`action !bg-gray-800 !text-white ${!res.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => res.url && window.open(res.url, '_blank')}
                    >
                      <div className="flex items-center justify-center">
                        <ArrowUpRight fontSize={9} strokeWidth={1.8} />
                      </div>
                      View
                    </div>
                    <div
                      className={`action ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isUploading && openEditModal(index)}
                    >
                      <div className="flex items-center justify-center">
                        <Edit fontSize={11} strokeWidth={1.8} />
                      </div>
                      Edit
                    </div>
                    <div
                      className={`action ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => !isUploading && deleteItem(index)}
                    >
                      <div className="flex items-center justify-center ">
                        <BinFull fontSize={11} strokeWidth={1.8} />
                      </div>
                      Delete
                    </div>
                  </div>
                </div>
              </div>
            );
          })
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

export default ResourcesCategoryStyle;
