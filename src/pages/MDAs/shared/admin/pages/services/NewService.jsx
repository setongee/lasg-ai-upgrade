import { ArrowLeft } from 'iconoir-react';
import { useState } from 'react';
import { isExistingService } from '../../../../api/admin/logic';
import { useThemeStore } from '../../../../stores/theme.store';
import Modal from '../../../modal/Modal';
import CustomService from './CustomService';

const NewService = ({ selectView, services }) => {
  const [showCustom, setShowCustom] = useState(false);
  const mda = useThemeStore((state) => state.mdaData);

  const handleCheck = (item) => {
    const existingService = isExistingService(services, item.name);
    return existingService;
  };

  return (
    <div>
      {/* go back */}
      <div onClick={() => selectView('services')}>
        <ArrowLeft />
      </div>

      <div className="p-5 w-full h-[70vh] flex gap-10 flex-col items-center justify-center">
        {/* Choice Service Creation */}
        <div className="flex gap-10 w-[max-content]">
          <div className="w-[350px] bg-white flex flex-col items-center p-8 rounded-[20px] shadow-[1px_3px_20px_rgba(0,0,0,0.01)] gap-5 hover:ring-green-600 ring-1 ring-transparent">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                id="Clipboard-List--Streamline-Solar"
                height="40"
                width="40"
              >
                <desc>Clipboard List Streamline Icon: https://streamlinehq.com</desc>
                <g id="Bold Duotone/Notes/Clipboard List">
                  <path
                    id="Vector"
                    fill="#c5c5c5"
                    d="M35 26.663833333333336V16.663766666666668c0 -4.71405 0 -7.071066666666667 -1.4645000000000001 -8.535533333333333C32.25483333333334 6.8476 30.291666666666668 6.68685 26.666666666666668 6.666666666666667H13.333333333333334c-3.6250500000000003 0.020183333333333334 -5.588233333333333 0.18093333333333333 -6.8688666666666665 1.461566666666667C5 9.5927 5 11.949716666666667 5 16.663766666666668v10.000066666666667c0 4.7139999999999995 0 7.071000000000001 1.4644666666666668 8.5355 1.4644666666666668 1.4645000000000001 3.821483333333333 1.4645000000000001 8.535533333333333 1.4645000000000001h10c4.7139999999999995 0 7.071000000000001 0 8.5355 -1.4645000000000001C35 33.734833333333334 35 31.37783333333333 35 26.663833333333336Z"
                    stroke-width="1.6667"
                  ></path>
                  <path
                    id="Vector_2"
                    fill="#505050"
                    d="M13.333333333333334 5.833333333333334C13.333333333333334 4.452616666666667 14.452616666666666 3.3333333333333335 15.833333333333334 3.3333333333333335h8.333333333333334c1.3806666666666667 0 2.5 1.1192833333333334 2.5 2.5v1.6666666666666667c0 1.3807166666666668 -1.1193333333333333 2.5 -2.5 2.5h-8.333333333333334C14.452616666666666 10 13.333333333333334 8.880716666666666 13.333333333333334 7.5v-1.6666666666666667Z"
                    stroke-width="1.6667"
                  ></path>
                  <path
                    id="Vector_3"
                    fill="#505050"
                    fill-rule="evenodd"
                    d="M10.416666666666668 17.5c0 -0.6903333333333334 0.55965 -1.25 1.25 -1.25h0.8333333333333334c0.69035 0 1.25 0.5596666666666666 1.25 1.25s-0.55965 1.25 -1.25 1.25H11.666666666666668c-0.69035 0 -1.25 -0.5596666666666666 -1.25 -1.25Zm5.833333333333334 0c0 -0.6903333333333334 0.5596666666666666 -1.25 1.25 -1.25H28.333333333333336c0.6903333333333334 0 1.25 0.5596666666666666 1.25 1.25s-0.5596666666666666 1.25 -1.25 1.25h-10.833333333333334c-0.6903333333333334 0 -1.25 -0.5596666666666666 -1.25 -1.25ZM10.416666666666668 23.333333333333336c0 -0.6903333333333334 0.55965 -1.25 1.25 -1.25h0.8333333333333334c0.69035 0 1.25 0.5596666666666666 1.25 1.25s-0.55965 1.25 -1.25 1.25H11.666666666666668c-0.69035 0 -1.25 -0.5596666666666666 -1.25 -1.25Zm5.833333333333334 0c0 -0.6903333333333334 0.5596666666666666 -1.25 1.25 -1.25H28.333333333333336c0.6903333333333334 0 1.25 0.5596666666666666 1.25 1.25s-0.5596666666666666 1.25 -1.25 1.25h-10.833333333333334c-0.6903333333333334 0 -1.25 -0.5596666666666666 -1.25 -1.25Zm-5.833333333333334 5.833333333333334c0 -0.6903333333333334 0.55965 -1.25 1.25 -1.25h0.8333333333333334c0.69035 0 1.25 0.5596666666666666 1.25 1.25s-0.55965 1.25 -1.25 1.25H11.666666666666668c-0.69035 0 -1.25 -0.5596666666666666 -1.25 -1.25Zm5.833333333333334 0c0 -0.6903333333333334 0.5596666666666666 -1.25 1.25 -1.25H28.333333333333336c0.6903333333333334 0 1.25 0.5596666666666666 1.25 1.25s-0.5596666666666666 1.25 -1.25 1.25h-10.833333333333334c-0.6903333333333334 0 -1.25 -0.5596666666666666 -1.25 -1.25Z"
                    clip-rule="evenodd"
                    stroke-width="1.6667"
                  ></path>
                </g>
              </svg>
            </div>
            <h1 className="font-semibold text-black">From Existing Services</h1>
            <p className="text-[14px] text-gray-500 text-center leading-[170%]">
              Choose from services already created by Lagos State admin for different categories
              optimized for efficient service delivery.
            </p>
            <button
              className="py-3 px-6 rounded-[6px] bg-green-700 text-white text-[14px] font-medium cursor-pointer"
              onClick={() => selectView('category')}
            >
              Select Services
            </button>
          </div>

          <div className="w-[350px] bg-white flex flex-col items-center p-8 rounded-[20px] shadow-[1px_3px_20px_rgba(0,0,0,0.01)] gap-5 hover:ring-green-600 ring-1 ring-transparent">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 40 40"
                id="Add-Square--Streamline-Solar"
                height="40"
                width="40"
              >
                <desc>Add Square Streamline Icon: https://streamlinehq.com</desc>
                <g id="Bold Duotone/Essentional UI/Add Square">
                  <path
                    id="Vector"
                    fill="#c5c5c5"
                    d="M20 36.66666666666667c-7.856750000000001 0 -11.785116666666667 0 -14.225883333333334 -2.4408333333333334C3.3333333333333335 31.78516666666667 3.3333333333333335 27.856666666666666 3.3333333333333335 20c0 -7.856750000000001 0 -11.785116666666667 2.4407833333333335 -14.225883333333334C8.214883333333335 3.3333333333333335 12.14325 3.3333333333333335 20 3.3333333333333335c7.856666666666667 0 11.785166666666667 0 14.225833333333336 2.4407833333333335C36.66666666666667 8.214883333333335 36.66666666666667 12.14325 36.66666666666667 20c0 7.856666666666667 0 11.785166666666667 -2.4408333333333334 14.225833333333336C31.78516666666667 36.66666666666667 27.856666666666666 36.66666666666667 20 36.66666666666667Z"
                    stroke-width="1.6667"
                  ></path>
                  <path
                    id="Vector_2"
                    fill="#505050"
                    d="M20 13.75c0.6903333333333334 0 1.25 0.55965 1.25 1.25v3.75H25c0.6903333333333334 0 1.25 0.5596666666666666 1.25 1.25s-0.5596666666666666 1.25 -1.25 1.25h-3.75V25c0 0.6903333333333334 -0.5596666666666666 1.25 -1.25 1.25s-1.25 -0.5596666666666666 -1.25 -1.25v-3.75H15c-0.69035 0 -1.25 -0.5596666666666666 -1.25 -1.25s0.55965 -1.25 1.25 -1.25h3.75V15c0 -0.69035 0.5596666666666666 -1.25 1.25 -1.25Z"
                    stroke-width="1.6667"
                  ></path>
                </g>
              </svg>
            </div>
            <h1 className="font-semibold text-black"> Create Custom Service </h1>
            <p className="text-[14px] text-gray-500 text-center leading-[170%]">
              Create a completely new service with custom requirements and specifications tailored
              to your MDA's specific needs.
            </p>
            <button
              className="py-3 px-6 rounded-[6px] bg-green-700 text-white text-[14px] font-medium cursor-pointer"
              onClick={() => setShowCustom(true)}
            >
              Create New Service
            </button>
          </div>
        </div>
      </div>

      {showCustom && (
        <Modal
          onClose={() => setShowCustom(false)}
          open={showCustom}
          contentStyling="lg:!w-[800px] md:!w-[90%]"
        >
          <CustomService selectView={selectView} mda={mda} handleCheck={handleCheck} />
        </Modal>
      )}
    </div>
  );
};

export default NewService;
