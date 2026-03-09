import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, PlusSquareSolid, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { getAllCategory } from '../../../../../../api/read/category.req';
import { notify } from '../../../../../../utils/toast';
import { addExistingService } from '../../../../api/admin/logic';
import Loader from '../../../loader/loader';
import SearchInput from '../../components/searchInput/SearchInput';
import CategoryServiceEngine from './CategoryServiceEngine';

const CategoryEngine = ({ selectView, mdaData, services }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [categoryFullname, setCategoryFullname] = useState('');
  const [checkedServices, setCheckedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['category'],
    queryFn: getAllCategory,
  });

  useEffect(() => {
    setCheckedServices([]);

    const servicePoint = document.getElementById('service-point');
    if (servicePoint) {
      if (selectCategory === '') {
        servicePoint.style.overflowY = 'auto';
        document.body.style.overflow = 'auto';
      } else {
        servicePoint.style.overflowY = 'hidden';
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectCategory]);

  if (isLoading || !data) return <Loader />;

  // Filter agencies based on search term
  const filteredCategories =
    data?.data?.filter((category) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return category.name.toLowerCase().includes(searchLower);
    }) || [];

  const handleCardClick = (item) => {
    setSelectCategory(item.formattedName);
    setCategoryFullname(item.name);
  };

  const handleCheckedServices = (e, serviceItem) => {
    const checked = e.target.checked;

    if (checked) {
      setCheckedServices([...checkedServices, serviceItem]);
    } else {
      setCheckedServices(checkedServices.filter((item) => item.name !== serviceItem.name));
    }
  };

  const handleServiceProceed = async () => {
    if (checkedServices.length === 0) {
      notify.warning('No services selected');
      return;
    }

    // check if service already exists by service name
    const existingServices = services?.filter((service) =>
      checkedServices?.some((item) => item.name === service.name)
    );
    if (existingServices?.length > 0) {
      notify.error('One or more services already exist. Please check and try again.');
      return;
    }

    try {
      setLoading(true);
      // Process each service sequentially to avoid overwhelming the server
      for (const service of checkedServices) {
        await addExistingService(service, mdaData?.fullname);
      }

      // Clear selection and show success message
      notify.success(
        checkedServices.length > 1 ? 'Services added successfully' : 'Service added successfully'
      );
      setCheckedServices([]);
      setSelectCategory('');
      selectView('services');
    } catch (error) {
      console.error('Error saving services:', error);
      if (error.message.includes('E11000')) {
        notify.error('One or more services already exist. Please check and try again.');
      } else {
        notify.error('Failed to save some services. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <Loader />}

      {selectCategory !== '' && (
        <CategoryServiceEngine
          categoryName={selectCategory}
          categoryFullname={categoryFullname}
          handleCheckedServices={handleCheckedServices}
          setSelectCategory={setSelectCategory}
          services={services}
        />
      )}
      <div className="titleAdmin flex items-center justify-between">
        {selectCategory === '' ? (
          <div onClick={() => selectView('new-service')} className="">
            <ArrowLeft />
          </div>
        ) : (
          <div
            onClick={() => setSelectCategory('')}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Xmark /> <p className="text-[14px] font-semibold">Close</p>
          </div>
        )}

        {selectCategory === '' && (
          <div className="flex gap-[10px]">
            <div className="searchField h-[100%] w-[550px]">
              <SearchInput
                placeholder="Browse through lagos state categories..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
          </div>
        )}

        {/* create new one */}
        {selectCategory === '' ? (
          <div
            className="w-[max-content] py-3 px-6 text-[14px] font-semibold flex gap-1 items-center justify-center pl-4.5 cursor-pointer rounded-[6px] bg-gray-800 text-white text-center"
            onClick={() => selectView('new-service')}
          >
            <PlusSquareSolid /> Add Custom Services
          </div>
        ) : (
          <div
            className="w-[max-content] py-3 px-6 text-[14px] font-semibold flex gap-1 items-center justify-center pl-4.5 cursor-pointer rounded-[6px] bg-green-700 text-white text-center"
            onClick={() => handleServiceProceed()}
          >
            <PlusSquareSolid /> Proceed
          </div>
        )}
      </div>
      <div
        className="services-admin grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-20 p-1"
        id="service-point"
      >
        {filteredCategories?.length > 0 ? (
          filteredCategories
            ?.filter((c) => !c.isOffline)
            ?.map((item) => (
              <div
                key={item.id}
                className="w-full h-full bg-white flex flex-col gap-5 p-8 shadow-[1px_3px_20px_rgba(0,0,0,0.02)] rounded-[10px] cursor-pointer hover:ring-green-600 ring-1 ring-transparent"
                onClick={() => handleCardClick(item)}
              >
                <div className="icon-card w-9 h-9 flex-shrink-0">
                  <img src={item?.icon} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <h1 className="text-[16px] font-semibold">{item.name}</h1>
                <p className="text-[14px] text-gray-600 leading-[165%]">{item.short}</p>
                <div className="select-box"></div>
              </div>
            ))
        ) : (
          <div className="w-full text-[16px] text-gray-600">
            {searchTerm ? 'No matching categories found.' : 'No categories available.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryEngine;
