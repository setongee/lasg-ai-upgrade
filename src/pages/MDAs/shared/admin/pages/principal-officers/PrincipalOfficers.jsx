import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, MoreVertCircle, NavArrowDown, Plus, Trash, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { notify } from '../../../../../../utils/toast';
import { updateAdminData, uploadFileDirect } from '../../../../api/admin/content';
import Loader from '../../../../shared/loader/loader';
import '../../styles/pages.scss';
import SearchInput from '../../components/searchInput/SearchInput';

// dnd-kit needs a stable, unique id per official — there's no id field on
// the data, so name+role (unique within a single MDA's list) stands in.
const getOfficialId = (official) => `${official.name}::${official.role}`;

const DragHandle = (props) => (
  <div
    className="absolute top-0 left-0 z-10 m-3 p-1.5 rounded-[4px] bg-gray-100/90 hover:bg-gray-200 cursor-grab active:cursor-grabbing touch-none"
    title="Drag to reorder"
    {...props}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
      <circle cx="8" cy="6" r="1.5" />
      <circle cx="16" cy="6" r="1.5" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
      <circle cx="8" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </svg>
  </div>
);

const OfficialCard = ({
  official,
  index,
  canDrag,
  dragHandleProps,
  isOverlay,
  isDragging,
  activeDropdownIndex,
  setActiveDropdownIndex,
  openEditModal,
  deleteItem,
}) => (
  <div
    className={`bg-white relative ${isDragging && !isOverlay ? 'opacity-40' : ''} ${
      isOverlay ? 'shadow-xl' : ''
    }`}
  >
    <div className="flex flex-col items-center justify-between w-full">
      <div className="flex flex-col w-full gap-4">
        <div className="bg-gray-100 relative h-[450px]">
          {official.photo ? (
            <img
              src={official.photo}
              alt={official.name}
              className="w-full h-full object-cover object-top"
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
        {canDrag && <DragHandle {...dragHandleProps} />}
        {!isOverlay && (
          <div className="absolute top-0 right-0 flex">
            <div className="relative more-actions-container flex justify-center pb-3">
              <button
                className="m-3 flex items-center gap-[2px] text-[10px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-2 py-1.5 rounded-[4px] cursor-pointer uppercase tracking-[1px] pl-2.5"
                onClick={() => setActiveDropdownIndex(activeDropdownIndex === index ? null : index)}
              >
                Actions
                <NavArrowDown fontSize={11} className="mt-0" />
              </button>

              {activeDropdownIndex === index && (
                <div className="absolute top-[45px] right-3 mb-2 w-36 bg-white rounded-md z-50 border border-gray-100 py-1">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      openEditModal(index);
                      setActiveDropdownIndex(null);
                    }}
                  >
                    <Edit fontSize={10} strokeWidth={1.8} />
                    Edit
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      deleteItem(index);
                      setActiveDropdownIndex(null);
                    }}
                  >
                    <Trash fontSize={10} strokeWidth={1.8} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="flex flex-col mx-auto  p-5 gap-0.5 bg-white">
            <div className="font-semibold text-[15px] leading-[140%] text-gray-800">
              {official.name}
            </div>
            <div className="text-gray-500 text-[14px]">{official.role}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SortableOfficialCard = ({ official, index, canDrag, ...rest }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getOfficialId(official),
    disabled: !canDrag,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <OfficialCard
        official={official}
        index={index}
        canDrag={canDrag}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        {...rest}
      />
    </div>
  );
};

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
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.more-actions-container')) return;
      setActiveDropdownIndex(null);
    };
    window.addEventListener('click', handleClickOutside, true);
    return () => window.removeEventListener('click', handleClickOutside, true);
  }, []);

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

      // const names = e.target.files[0]?.name;
      // const namesWithoutExtension = names.split('.')[0];
      // const namesSplit = namesWithoutExtension.split('(');
      // setNewOfficial((prev) => ({
      //   ...prev,
      //   name: namesSplit[0],
      //   role: namesSplit[1] ? namesSplit[1].replace(')', '') : '-',
      // }));

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

      uploadFileDirect(fileData, uniqueName)
        .then((response) => {
          if (response.status === 'ok') {
            newOfficial.photo = response.url;
            submitData();
          } else {
            notify.error(response.message || 'Failed to upload photo. Please try again.');
            setIsLoading(false);
          }
        })
        .catch((err) => {
          notify.error(err.message || 'Failed to upload photo. Please try again.');
          setIsLoading(false);
        });
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

  // reorder officials via drag-and-drop
  const [activeDragId, setActiveDragId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragStart = (event) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filteredOfficials.findIndex((o) => getOfficialId(o) === active.id);
    const newIndex = filteredOfficials.findIndex((o) => getOfficialId(o) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    data.people = arrayMove(filteredOfficials, oldIndex, newIndex);
    setData({ ...data });
    setUpdateInfo('reordered principal officers');
  };

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

      uploadFileDirect(fileData, uniqueName)
        .then((response) => {
          if (response.status === 'ok') {
            newOfficial.photo = response.url;
            data.people[index] = newOfficial;
            setUpdateInfo(
              `updated photo for principal officer - ${newOfficial.name} (${newOfficial.role})`
            );
          } else {
            notify.error(response.message || 'Failed to upload photo. Please try again.');
            setIsLoading(false);
          }
        })
        .catch((err) => {
          notify.error(err.message || 'Failed to upload photo. Please try again.');
          setIsLoading(false);
        });
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
    <div className="">
      {isLoading && <Loader customClass="" />}

      <div className="titleAdmin flex items-center justify-between z-99">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Manage Principal Officers -{' '}
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
          <Plus /> Add Official
        </button>
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

      {!searchTerm && filteredOfficials.length > 1 && (
        <div className="text-[13px] text-gray-500 mt-4">Drag a card to reorder officials.</div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDragId(null)}
      >
        <SortableContext
          items={filteredOfficials.map(getOfficialId)}
          strategy={rectSortingStrategy}
        >
          <div className="tableData grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
            {filteredOfficials.length > 0 ? (
              filteredOfficials.map((official, index) => (
                <SortableOfficialCard
                  key={getOfficialId(official)}
                  official={official}
                  index={index}
                  canDrag={!searchTerm}
                  activeDropdownIndex={activeDropdownIndex}
                  setActiveDropdownIndex={setActiveDropdownIndex}
                  openEditModal={openEditModal}
                  deleteItem={deleteItem}
                />
              ))
            ) : (
              <div className="w-full text-[16px] text-gray-600">
                {searchTerm ? 'No matching officials found.' : 'No officials available.'}
              </div>
            )}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeDragId
            ? (() => {
                const draggedOfficial = filteredOfficials.find(
                  (o) => getOfficialId(o) === activeDragId
                );
                return draggedOfficial ? (
                  <div className="w-[300px]">
                    <OfficialCard official={draggedOfficial} canDrag isOverlay />
                  </div>
                ) : null;
              })()
            : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default People;
