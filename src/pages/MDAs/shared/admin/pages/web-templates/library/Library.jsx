import { ArrowUpRight, CartPlus, Check, Eye } from 'iconoir-react';
import { useEffect, useState } from 'react';
import { frontend_url } from '../../../../../../../api/read/environment';
import { updateAdminData } from '../../../../../api/admin/content';
import { createRequestTemplate } from '../../../../../api/admin/template';
import { useThemeStore } from '../../../../../stores/theme.store';
import Modal from '../../../../modal/Modal';
import SearchInput from '../../../components/searchInput/SearchInput';
import TemplateContainer from '../templates-container/TemplateContainer';
import './library.scss';
import { templates as templateData } from './template-library';

const Library = () => {
  const mdaData = useThemeStore((state) => state.mdaData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingTemplate, setLoadingTemplate] = useState(null);
  const [activeTheme, setActiveTheme] = useState(null);
  const [requestData, setRequestData] = useState({
    templateName: '',
    description: '',
    mda: '',
    requestedBy: '',
    additionalNotes: '',
  });

  useEffect(() => {
    // Initialize requestedBy with current user or default
    const currentUser = localStorage.getItem('MDA__TOKEN')
      ? JSON.parse(localStorage.getItem('MDA__TOKEN'))
      : null;
    const fullName = currentUser ? `${currentUser.firstname} ${currentUser.lastname}` : '';
    setRequestData((prev) => ({ ...prev, requestedBy: fullName, mda: mdaData.name }));
  }, [mdaData]);

  useEffect(() => {
    // Initialize active theme from mdaData on mount and when mdaData changes
    if (mdaData?.theme) {
      setActiveTheme(mdaData.theme);
    }
  }, [mdaData]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const filteredTemplates = templateData.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWbTemplateRequest = async (e) => {
    e.preventDefault();
    await createRequestTemplate(requestData);
    closeModal();

    setRequestData({
      templateName: '',
      description: '',
      mda: mdaData.name,
      requestedBy: requestData.requestedBy,
      additionalNotes: '',
    });
  };

  const updateTheme = async (theme, name) => {
    setLoadingTemplate(theme);
    await updateAdminData(mdaData?._id, { theme: theme }, `updated web template to - ${name}`);
    setActiveTheme(theme); // Update active theme immediately
    setLoadingTemplate(null);
  };

  return (
    <TemplateContainer>
      <div className="titleAdmin flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-gray-900">
          Available Templates -{' '}
          <span className="text-[14px] font-normal text-gray-500">
            Click on a template to use it
          </span>
        </h2>
        <div className=" h-10 w-[450px]">
          <SearchInput
            placeholder="Search templates..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {/* request custom templates */}
        <div className="flex items-center gap-5">
          <p className="text-[13px] font-normal! text-gray-600">
            Don't find what you're looking for?{' '}
          </p>
          <button
            className=" text-white bg-green-900 text-[13px] font-medium px-4 py-2 rounded-md flex items-center gap-2"
            onClick={openModal}
          >
            Request Custom Template <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 mx-auto w-full max-w-[1300px] gap-5 justify-center mt-10">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            // templates ui card
            <div
              key={template.name}
              className=" bg-white rounded-md overflow-hidden shadow-md shadow-gray-50"
            >
              <div className="h-[202.4px] overflow-hidden bg-gray-300">
                <img src={template.thumbnail} alt={template.name} />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <h3 className="font-semibold text-[16px] flex items-center gap-2">
                  {template.name}{' '}
                  <p className="text-[12px] bg-green-500 px-1.5 py-[2px] rounded text-white">New</p>
                </h3>
                <p className="text-[15px] text-gray-500 leading-6">{template.description}</p>
                {/* <div className="flex items-center gap-1">
                  {template.category.map((category) => (
                    <span
                      key={category}
                      className="text-[12px] text-gray-500 font-medium capitalize px-3 py-1 rounded-full bg-gray-100 w-fit"
                    >
                      {category}
                    </span>
                  ))}
                </div> */}

                <div className="flex items-center gap-2 mt-1">
                  {template.theme === 'coming' ? (
                    <div className="text-gray-500 text-[13px] px-4 py-2 rounded border border-gray-300 bg-gray-50 font-medium">
                      Coming Soon
                    </div>
                  ) : (
                    <>
                      <button
                        className={`text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border ${
                          activeTheme === template.theme
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-gray-800 text-white border-transparent'
                        }`}
                        onClick={() => updateTheme(template.theme, template.name)}
                        disabled={loadingTemplate === template.theme}
                      >
                        {activeTheme === template.theme ? (
                          <Check fontSize={12} />
                        ) : (
                          <CartPlus fontSize={12} />
                        )}
                        {loadingTemplate === template.theme
                          ? 'Loading...'
                          : activeTheme === template.theme
                            ? 'Template in Use'
                            : 'Use Template'}
                      </button>
                      {activeTheme !== template.theme && (
                        <a
                          href={`${frontend_url}/${template.preview_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500! text-[13px] cursor-pointer pr-5 px-4 py-2 rounded h-[100%] flex items-center gap-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <Eye /> Preview
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-[16px] text-gray-600">
            {searchTerm ? 'No templates found matching your search.' : 'No templates available.'}
          </div>
        )}
      </div>

      {/* request template modal */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <div className="">
          <h2 className="text-lg font-semibold mb-2">Request Custom Template</h2>
          <p>Fill out the form to request a custom template.</p>
          <form className="mt-10 space-y-4" onSubmit={handleWbTemplateRequest}>
            <div>
              <label className="block text-[11px] tracking-[2px] font-semibold text-gray-500 uppercase">
                Template Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-[4px] border border-gray-300 outline-none focus:border-gray-500 focus:ring-gray-500 px-4 py-[10px] focus:ring-0.5 text-[14px]"
                placeholder="Enter template name"
                value={requestData.templateName}
                onChange={(e) => setRequestData({ ...requestData, templateName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] tracking-[2px] font-semibold text-gray-500 uppercase">
                Description
              </label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-300 text-[14px] p-4 focus:ring-0.5 focus:ring-gray-500 outline-none focus:border-gray-500 resize-none field-sizing-content"
                rows="3"
                placeholder="Describe the template you'd like to request..."
                style={{ minHeight: '170px' }}
                value={requestData.description}
                onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3 mt-[30px]">
              <button
                type="button"
                className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer transition-colors duration-200"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-green-700 rounded-md hover:bg-green-800 transition-colors duration-200 cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </TemplateContainer>
  );
};

export default Library;
