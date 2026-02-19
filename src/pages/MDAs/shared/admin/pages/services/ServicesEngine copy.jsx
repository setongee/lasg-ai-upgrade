import { ArrowUpRight, BinFull, Edit, Plus, Xmark } from 'iconoir-react';
import { useState } from 'react';

const ServicesEngine = ({ data, selectView, mda }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredServices = data?.filter((service) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return service.name.toLowerCase().includes(searchLower);
  });

  const handleEdit = (service) => {
    // Handle edit functionality
    console.log('Edit service:', service);
  };

  const handleDelete = (service) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      // Handle delete functionality
      console.log('Delete service:', service);
    }
  };

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] gap-5">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 40 40"
            id="Widget-14--Streamline-Solar"
            height="80"
            width="80"
          >
            <desc>Widget 14 Streamline Icon: https://streamlinehq.com</desc>
            <g id="Bold Duotone/Settings Fine Tuning/Widget 14">
              <path
                id="Vector"
                fill="#77e183"
                d="M3.3333333333333335 29.166666666666668C3.3333333333333335 25.0245 6.691199999999999 21.666666666666668 10.833333333333334 21.666666666666668h4.500000000000001c1.0501 0 1.5751666666666668 0 1.9761666666666666 0.20433333333333334 0.35283333333333333 0.17983333333333335 0.6396666666666666 0.46666666666666673 0.8195000000000001 0.8195000000000001C18.333333333333336 23.091500000000003 18.333333333333336 23.616500000000002 18.333333333333336 24.666666666666668v4.500000000000001c0 4.142166666666667 -3.3578666666666668 7.5 -7.5 7.5S3.3333333333333335 33.30883333333333 3.3333333333333335 29.166666666666668Z"
                stroke-width="1.6667"
              ></path>
              <path
                id="Vector_2"
                fill="#77e183"
                d="M21.666666666666668 10.833333333333334C21.666666666666668 6.691199999999999 25.0245 3.3333333333333335 29.166666666666668 3.3333333333333335S36.66666666666667 6.691199999999999 36.66666666666667 10.833333333333334 33.30883333333333 18.333333333333336 29.166666666666668 18.333333333333336h-5.357166666666667c-0.24866666666666667 0 -0.37316666666666665 0 -0.4778333333333334 -0.011833333333333335 -0.8691666666666666 -0.09783333333333334 -1.5553333333333335 -0.784 -1.6531666666666667 -1.6531666666666667C21.666666666666668 16.563633333333332 21.666666666666668 16.43925 21.666666666666668 16.190483333333333V10.833333333333334Z"
                stroke-width="1.6667"
              ></path>
              <g id="Group">
                <path
                  id="Vector_3"
                  fill="#1a565f"
                  d="M3.3333333333333335 10.833333333333334C3.3333333333333335 6.691199999999999 6.691199999999999 3.3333333333333335 10.833333333333334 3.3333333333333335S18.333333333333336 6.691199999999999 18.333333333333336 10.833333333333334v5c0 0.5812333333333334 0 0.8718333333333333 -0.06383333333333334 1.1103333333333334 -0.17350000000000002 0.647 -0.6788333333333334 1.1523333333333334 -1.3258333333333334 1.3258333333333334C16.705166666666667 18.333333333333336 16.414566666666666 18.333333333333336 15.833333333333334 18.333333333333336h-5C6.691199999999999 18.333333333333336 3.3333333333333335 14.975466666666666 3.3333333333333335 10.833333333333334Z"
                  stroke-width="1.6667"
                ></path>
                <path
                  id="Vector_4"
                  fill="#1a565f"
                  d="M21.666666666666668 24.166666666666668c0 -0.5811666666666667 0 -0.8718333333333333 0.06383333333333334 -1.1103333333333334 0.17350000000000002 -0.647 0.6788333333333334 -1.1523333333333334 1.3258333333333334 -1.3258333333333334C23.294833333333337 21.666666666666668 23.585500000000003 21.666666666666668 24.166666666666668 21.666666666666668h5c4.142166666666667 0 7.5 3.3578333333333332 7.5 7.5S33.30883333333333 36.66666666666667 29.166666666666668 36.66666666666667 21.666666666666668 33.30883333333333 21.666666666666668 29.166666666666668v-5Z"
                  stroke-width="1.6667"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-[20px] font-semibold">No Services Yet</h1>
          <p className="text-[14px] text-gray-500 w-[400px] text-center">
            You haven't added any services yet. Click the button below to add a new service.
          </p>
          <button
            className="w-[max-content] py-3 px-6 text-[14px] font-semibold flex gap-1 items-center justify-center pl-4.5 cursor-pointer rounded-[6px] bg-gray-800 text-white text-center"
            onClick={() => selectView('new-service')}
          >
            <Plus /> Add New Service
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="table__main__body">
      <div className="titleAdmin flex items-center justify-between">
        <div className="flex gap-[10px]">
          <div className="searchField h-[100%] relative">
            <input
              type="text"
              placeholder="Search services..."
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
                <Xmark width={16} height={16} />
              </button>
            )}
          </div>
        </div>

        <button
          className="w-[max-content] py-3 px-6 text-[14px] font-semibold flex gap-1 items-center justify-center pl-4.5 cursor-pointer rounded-[6px] bg-gray-800 text-white text-center"
          onClick={() => selectView('new-service')}
        >
          <Plus /> Add New Service
        </button>
      </div>

      <div className="tableData mt-6">
        {filteredServices.length ? (
          filteredServices.map((service, index) => (
            <div className="table__item flex" key={service.id || index}>
              <div className="flex flex-col justify-between w-full min-w-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 40 40"
                      className="w-full h-full text-green-500"
                    >
                      <g id="Bold Duotone/Settings Fine Tuning/Widget 14">
                        <path
                          fill="currentColor"
                          d="M3.333 29.167a10.83 10.83 0 0 0 10.834 10.833h5c5.975 0 10.833-4.858 10.833-10.834v-5a10.83 10.83 0 0 0-10.833-10.833h-5A10.83 10.83 0 0 0 3.333 24.167v5Z"
                          opacity=".2"
                        />
                        <path
                          fill="currentColor"
                          d="M21.667 10.833a10.83 10.83 0 0 0-10.834-10.833h-5A10.83 10.83 0 0 0-5 10.833v5a10.83 10.83 0 0 0 10.833 10.834h5A10.83 10.83 0 0 0 21.667 15.834v-5Z"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900 truncate" title={service.name}>
                      {service.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate" title={service.short}>
                      {service.short || 'Service'}
                    </div>
                  </div>
                </div>
                <div className="tr__item flex act--item mt-5 overflow-x-auto">
                  <button
                    className="action !bg-gray-800 !text-white"
                    onClick={() => console.log('View service:', service)}
                  >
                    <div className="flex items-center justify-center">
                      <ArrowUpRight fontSize={9} strokeWidth={1.8} />
                    </div>
                    View
                  </button>
                  <button className="action" onClick={() => handleEdit(service)}>
                    <div className="flex items-center justify-center">
                      <Edit fontSize={11} strokeWidth={1.8} />
                    </div>
                    Edit
                  </button>
                  <button className="action" onClick={() => handleDelete(service)}>
                    <div className="flex items-center justify-center">
                      <BinFull fontSize={11} strokeWidth={1.8} />
                    </div>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-[16px] text-gray-600 py-8 text-center">
            {searchTerm
              ? 'No matching services found.'
              : 'No services available. Click "Add New Service" to create one.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesEngine;
