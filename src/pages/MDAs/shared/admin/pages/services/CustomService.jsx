import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, Check, NavArrowDown, Search, Xmark } from 'iconoir-react';
import { useEffect, useRef, useState } from 'react';
import { getAllCategory } from '../../../../../../api/read/category.req';
import { frontend_url } from '../../../../../../api/read/environment';
import { notify } from '../../../../../../utils/toast';
import { addSingleService, formattedName } from '../../../../api/admin/logic';
import { api } from '../../../forms/api';
import LASGEditor from '../../components/text-editor/lasg_custom_editor';
import { generateKeywordsWithAI } from '../utils/ai/ai-generator';

const CustomService = ({ selectView, mda, handleCheck }) => {
  const [data, setData] = useState({ author: mda.name, categories: [], customKeywords: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFormsDropdown, setShowFormsDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const formsDropdownRef = useRef(null);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategory,
  });

  const { data: formsData, isLoading: formsLoading } = useQuery({
    queryKey: ['forms', mda.slug],
    queryFn: () => api.getFormsByMda(mda.slug),
    enabled: !!mda.slug,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close categories dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      // Close forms dropdown if clicking outside
      if (formsDropdownRef.current && !formsDropdownRef.current.contains(event.target)) {
        setShowFormsDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFormSelect = (form) => {
    const publicUrl = `${frontend_url}/${form.mda}/forms/${form._id}`;
    setData({ ...data, url: publicUrl });
    setShowFormsDropdown(false);
  };

  const handleToggleCategory = (category) => {
    const isSelected = data.categories?.some((c) => c._id === category._id);
    let updatedCategories;
    if (isSelected) {
      updatedCategories = data.categories.filter((c) => c._id !== category._id);
    } else {
      updatedCategories = [...(data.categories || []), category];
    }
    setData({ ...data, categories: updatedCategories });
  };

  const removeCategory = (categoryId) => {
    const updatedCategories = data.categories.filter((c) => c._id !== categoryId);
    setData({ ...data, categories: updatedCategories });
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault();
      const newKeyword = { key: keywordInput.trim() };
      if (!data.customKeywords.some((k) => k.key === newKeyword.key)) {
        setData({ ...data, customKeywords: [...data.customKeywords, newKeyword] });
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (key) => {
    const updatedKeywords = data.customKeywords.filter((k) => k.key !== key);
    setData({ ...data, customKeywords: updatedKeywords });
  };

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleContent = (text) => {
    setData({ ...data, content: text });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.name || !data.short || data.categories.length === 0) {
      notify.error('Please fill in all required fields and select at least one category');
      return;
    }

    const check = handleCheck(data);

    if (check) {
      notify.error('This service name already exists, use a different name');
      return;
    }

    // Prepare data for submission
    const submissionData = {
      ...data,
      categories: data.categories.map((c) => c.name),
      formattedName: data.categories.map((c) => formattedName(c.name)),
      keywordsGroup: data.categories.reduce((acc, curr) => {
        acc[formattedName(curr.name)] = curr.keywords || [];
        return acc;
      }, {}),
    };

    addSingleService(submissionData, mda?.fullname).then((res) => {
      notify.success(res.message || 'Service added successfully');
      setData({ author: mda.name, categories: [], customKeywords: [] });
      selectView('services');
    });
  };

  data.categories;

  const generateKeywords = async () => {
    if (!data.name || !data.short) {
      notify.error('Please fill in service name and description first');
      return;
    }

    try {
      const aiGenerator = notify.loading('Generating keywords with AI...');

      const aiKeywords = await generateKeywordsWithAI(data.name, data.short, mda.name);

      if (aiKeywords.length > 0) {
        setData({
          ...data,
          customKeywords: [...data.customKeywords, ...aiKeywords],
        });
        notify.dismiss(aiGenerator);
        notify.success(`Generated ${aiKeywords.length} relevant keywords`);
      } else {
        notify.error('Failed to generate keywords. Please try again.');
      }
    } catch (error) {
      console.error('Error in generateKeywords:', error);
      notify.error('An error occurred while generating keywords');
    }
  };

  return (
    <div>
      <h1 className="text-[20px] font-semibold">Add new service</h1>
      <p className="text-[14px] text-gray-500 mb-10">Kindly input all valid informations below</p>

      {/* forms */}
      <form className="flex gap-4 flex-col">
        <div className="flex flex-col w-[100%] gap-4">
          {/* service name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">Service title</label>
            <input
              type="text"
              name="name"
              value={data?.name}
              onChange={handleChange}
              className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200"
              placeholder="Enter the service title here..."
            />
          </div>

          {/* service description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">Service description</label>
            <textarea
              name="short"
              id=""
              cols="30"
              rows="2"
              value={data?.short}
              onChange={handleChange}
              className="ring-1 ring-gray-200 rounded-[4px] py-2.5 px-3 bg-white text-[14px] outline-none focus:ring-green-600 w-full resize-none"
              placeholder="Enter the service description here..."
            ></textarea>
          </div>

          {/* categories selection */}
          <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
            <label className="text-[14px] font-semibold">Service Categories</label>
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="ring-1 rounded-[4px] min-h-[42px] p-1.5 text-[14px] cursor-pointer bg-white ring-gray-200 flex flex-wrap gap-2 items-center justify-between"
            >
              <div className="flex flex-wrap gap-2 items-center flex-1">
                {data.categories?.length > 0 ? (
                  data.categories.map((cat) => (
                    <span
                      key={cat._id}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-[4px] flex items-center gap-1 text-[14px] font-medium"
                    >
                      {cat.name}
                      <Xmark
                        height={14}
                        width={14}
                        className="cursor-pointer hover:text-green-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCategory(cat._id);
                        }}
                      />
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 ml-1.5">
                    Select categories for service creation
                  </span>
                )}
              </div>
              <NavArrowDown
                height={18}
                width={18}
                className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {isOpen && (
              <div className="absolute top-[100%] left-0 right-0 z-50 mt-1 bg-white ring-1 ring-gray-200 rounded-[4px] shadow-lg max-h-[300px] flex flex-col">
                <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                  <div className="relative flex items-center">
                    <Search height={16} width={16} className="absolute left-3 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search categories..."
                      className="w-full pl-9 pr-3 py-2 text-[14px] outline-none bg-gray-50 rounded-[4px] focus:ring-1 focus:ring-green-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  {categoriesLoading ? (
                    <div className="p-4 text-center text-[14px] text-gray-500">
                      Loading categories...
                    </div>
                  ) : filteredCategories?.length > 0 ? (
                    filteredCategories.map((category) => {
                      const isSelected = data.categories?.some((c) => c._id === category._id);
                      return (
                        <div
                          key={category._id}
                          onClick={() => handleToggleCategory(category)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <span className="text-[14px]">{category.name}</span>
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-green-600 border-green-600' : 'border-gray-300'
                            }`}
                          >
                            {isSelected && <Check height={14} width={14} className="text-white" />}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-[14px] text-gray-500">
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* custom keywords selection */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[14px] font-semibold">Custom Keywords</label>
              <div className="flex items-center gap-1 text-[14px] text-gray-400">
                Generate keywords with{' '}
                <span
                  className="font-semibold text-green-600 flex items-center gap-1 text-[15px] cursor-pointer hover:text-green-700"
                  onClick={generateKeywords}
                >
                  ai assistant <ArrowUpRight fontSize={9} />
                </span>
              </div>
            </div>
            <div className="ring-1 rounded-[4px] min-h-[42px] p-1.5 text-[14px] bg-white ring-gray-200 flex flex-wrap gap-2 items-center">
              <div className="flex flex-wrap gap-2 items-center flex-1">
                {data.customKeywords?.length > 0 &&
                  data.customKeywords.map((k, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded-[4px] flex items-center gap-1 text-[14px] font-medium"
                    >
                      {k.key}
                      <Xmark
                        height={14}
                        width={14}
                        className="cursor-pointer hover:text-blue-900"
                        onClick={() => removeKeyword(k.key)}
                      />
                    </span>
                  ))}
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  className="flex-1 outline-none text-[14px] min-w-[150px] bg-transparent pl-1.5"
                  style={{ fieldSizing: 'content' }}
                  placeholder={
                    data.customKeywords?.length === 0 ? 'Enter keywords and press Enter...' : ''
                  }
                />
              </div>
            </div>
          </div>

          {/* call to action */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">CTA (Call To Action)</label>
            <input
              type="text"
              name="cta"
              value={data?.cta}
              onChange={handleChange}
              className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200"
              placeholder="Enter the call to action here..."
            />
          </div>

          {/* url */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-semibold">URL link</label>
            <div className="relative" ref={formsDropdownRef}>
              <input
                type="text"
                name="url"
                value={data?.url}
                onChange={handleChange}
                className="ring-1 rounded-[4px] py-2.5 px-3 text-[14px] outline-none focus:ring-green-600 bg-white ring-gray-200 w-full"
                placeholder="Enter the URL link here..."
              />
              <button
                type="button"
                onClick={() => setShowFormsDropdown(!showFormsDropdown)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              >
                Attach Forms
              </button>

              {/* Forms Dropdown */}
              {showFormsDropdown && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">Select a form</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {formsLoading ? (
                      <div className="p-3 text-center text-sm text-gray-500">Loading forms...</div>
                    ) : formsData?.data?.length > 0 ? (
                      formsData.data.map((form) => (
                        <button
                          key={form._id}
                          type="button"
                          onClick={() => handleFormSelect(form)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 flex">
                              {form.title} <ArrowRight className="ml-auto text-[9px]" />
                            </span>
                            <span className="text-xs text-gray-500">
                              Created on -{' '}
                              {new Date(form.createdAt).toLocaleDateString('en-NG', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-center text-sm text-gray-500">
                        No forms available
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* content editor */}
        <div className="w-[100%] flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold">Service Content</label>
          <div className="ring-[1px] ring-gray-200 rounded-[4px]">
            <LASGEditor dataText={handleContent} value={data?.content || ''} padding={'0px 20px'} />
          </div>
        </div>

        <div>
          <button
            className="py-3 px-6 rounded-[4px] bg-green-700 text-white text-[14px] font-medium cursor-pointer w-full mt-6"
            onClick={handleSubmit}
          >
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomService;
