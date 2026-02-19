import { useQuery } from '@tanstack/react-query';
import { getAllServicesCategory } from '../../../../../../api/read/services.req';
import { notify } from '../../../../../../utils/toast';

const CategoryServiceEngine = ({
  categoryName,
  categoryFullname,
  handleCheckedServices,
  setSelectCategory,
  services,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['category', categoryName],
    queryFn: () => getAllServicesCategory(categoryName),
  });

  if (isLoading) return null;

  if (!data?.data?.length) return <div>No services found for this category</div>;

  //   check if the about to be checked service already exists in services
  const handleCheck = (e, item) => {
    const existingService = services?.find((service) => service.name === item.name);
    if (existingService) {
      notify.error('Service already exists');
      e.target.checked = false;
      return;
    }
    handleCheckedServices(e, item);
  };

  return (
    <div className="fixed right-0 w-[calc(100%-280px)] h-[calc(100vh-80px)] bg-black/20 overflow-y-auto top-[80px]">
      <div
        className="fixed right-0 w-[calc(100%-280px)] h-[100vh] bg-transparent overflow-y-auto top-[0px]"
        onClick={() => setSelectCategory('')}
      ></div>
      <div className="bg-white w-[60%] my-30 mx-auto p-12 rounded-lg relative">
        <h1 className="text-[18px] font-semibold mb-5">{categoryFullname} Services</h1>

        <div className="flex flex-col gap-4">
          {data?.data?.map((item, index) => {
            const isExistingService = services?.some((service) => service.name === item.name);
            return (
              <div
                key={item.id}
                className={`py-3 px-4 rounded-sm relative ${isExistingService ? 'bg-gray-400' : 'bg-gray-100 hover:bg-gray-50'}`}
              >
                <h1
                  className={`text-[14px] font-semibold ${isExistingService ? 'text-gray-100' : 'text-gray-900'}`}
                >
                  {index + 1}. {item.name}
                  {isExistingService && (
                    <span className="ml-2 text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full">
                      Already added
                    </span>
                  )}
                </h1>
                <p
                  className={`text-[14px] ${isExistingService ? 'text-gray-100' : 'text-gray-500'}`}
                >
                  {item.short}
                </p>
                {/* check box */}
                <div className="absolute right-6 top-[50%] translate-y-[-50%]">
                  <input
                    type="checkbox"
                    onChange={(e) => handleCheck(e, item)}
                    disabled={isExistingService}
                    className={`h-4 w-4 rounded border-gray-300 ${isExistingService ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryServiceEngine;
