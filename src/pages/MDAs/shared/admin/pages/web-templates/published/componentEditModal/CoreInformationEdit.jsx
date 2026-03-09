import { useRef } from 'react';
import { notify } from '../../../../../../../../utils/toast';
import { useEditDataStore } from '../../../../../../stores/editData.store';
import SectionTitle from './util/SectionTitle';

const CoreInformationEdit = ({ saveDraft }) => {
  const setMdaEditData = useEditDataStore((state) => state.setMdaEditData);
  const mdaEditData = useEditDataStore((state) => state.mdaEditData);
  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  const handleManualSave = async () => {
    try {
      await saveDraft();
      notify.success('Changes saved successfully');
    } catch (error) {
      console.error('Manual save failed:', error);
      notify.error('Failed to save changes');
    }
  };

  console.log(mdaEditData);

  const toggleSection = () => {
    setMdaEditData({
      ...mdaEditData,
      enabledSections: {
        ...mdaEditData.enabledSections,
        coreInformation: !mdaEditData.enabledSections?.coreInformation,
      },
    });
  };

  const handleChange = (e, cardIndex, fieldIndex = null) => {
    const { name, value } = e.target;
    const updatedCoreInfo = { ...mdaEditData.coreInformation };

    if (fieldIndex !== null) {
      // Handle nested fields (keyPoints array)
      updatedCoreInfo.cards[cardIndex] = {
        ...updatedCoreInfo.cards[cardIndex],
        keyPoints: updatedCoreInfo.cards[cardIndex].keyPoints.map((point, idx) =>
          idx === fieldIndex ? value : point
        ),
      };
    } else {
      // Handle direct card fields
      updatedCoreInfo.cards[cardIndex] = {
        ...updatedCoreInfo.cards[cardIndex],
        [name]: value,
      };
    }

    setMdaEditData({
      ...mdaEditData,
      coreInformation: updatedCoreInfo,
    });
  };

  const handleTitleChange = (e) => {
    setMdaEditData({
      ...mdaEditData,
      coreInformation: {
        ...mdaEditData.coreInformation,
        title: e.target.value,
      },
    });
  };

  const addCard = () => {
    const newCard = {
      title: '',
      description: '',
      keyPoints: ['', '', '', ''],
      link: '',
    };

    setMdaEditData({
      ...mdaEditData,
      coreInformation: {
        ...mdaEditData.coreInformation,
        cards: [...(mdaEditData.coreInformation?.cards || []), newCard],
      },
    });

    setTimeout(() => {
      const lastIndex = mdaEditData.coreInformation?.cards?.length || 0;
      if (cardRefs.current[lastIndex]) {
        cardRefs.current[lastIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      } else if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 50);
  };

  const removeCard = (cardIndex) => {
    const updatedCoreInfo = { ...mdaEditData.coreInformation };
    updatedCoreInfo.cards = updatedCoreInfo.cards.filter((_, index) => index !== cardIndex);

    setMdaEditData({
      ...mdaEditData,
      coreInformation: updatedCoreInfo,
    });
  };

  const addKeyPoint = (cardIndex) => {
    const updatedCoreInfo = { ...mdaEditData.coreInformation };
    updatedCoreInfo.cards[cardIndex] = {
      ...updatedCoreInfo.cards[cardIndex],
      keyPoints: [...updatedCoreInfo.cards[cardIndex].keyPoints, ''],
    };

    setMdaEditData({
      ...mdaEditData,
      coreInformation: updatedCoreInfo,
    });
  };

  const removeKeyPoint = (cardIndex, pointIndex) => {
    const updatedCoreInfo = { ...mdaEditData.coreInformation };
    updatedCoreInfo.cards[cardIndex] = {
      ...updatedCoreInfo.cards[cardIndex],
      keyPoints: updatedCoreInfo.cards[cardIndex].keyPoints.filter(
        (_, index) => index !== pointIndex
      ),
    };

    setMdaEditData({
      ...mdaEditData,
      coreInformation: updatedCoreInfo,
    });
  };

  return (
    <div className="fixed top-[145px] left-[280px] w-[350px] h-[calc(100vh-145px)] bg-white overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-90">
      <SectionTitle />

      {/* Enable/Disable Toggle */}
      <div className="py-[20px] px-[30px] border-b border-gray-200 mt-[60px] bg-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Enable Section</span>
          <button
            onClick={toggleSection}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              mdaEditData.enabledSections?.coreInformation ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                mdaEditData.enabledSections?.coreInformation ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-[30px]" ref={containerRef}>
        <div className="flex flex-col gap-6">
          {/* Section Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={mdaEditData.coreInformation?.title || ''}
              onChange={handleTitleChange}
              className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
              placeholder="Empowering Lagos Through Strategic MIST Programmes and Innovation Initiatives"
            />
          </div>

          <div className="flex justify-between items-center pb-6 w-full">
            <button
              onClick={addCard}
              className="w-full px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Add Card
            </button>
          </div>

          <div className="space-y-6">
            {mdaEditData.coreInformation?.cards?.map((card, cardIndex) => {
              // Create a ref for each card if it doesn't exist
              if (!cardRefs.current[cardIndex]) {
                cardRefs.current[cardIndex] = null;
              }

              return (
                <div
                  key={cardIndex}
                  ref={(ref) => (cardRefs.current[cardIndex] = ref)}
                  className="flex gap-4 flex-col border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-[15px]">Card {cardIndex + 1}</h3>
                    <button
                      onClick={() => removeCard(cardIndex)}
                      className="text-red-500 text-sm hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={card.title || ''}
                        onChange={(e) => handleChange(e, cardIndex)}
                        className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                        placeholder="Card title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={card.description || ''}
                        onChange={(e) => handleChange(e, cardIndex)}
                        rows={3}
                        className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none resize-none field-sizing-content min-h-[80px]"
                        placeholder="Card description"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Points
                        </label>
                        <button
                          onClick={() => addKeyPoint(cardIndex)}
                          className="text-xs text-green-600 hover:text-green-700"
                        >
                          + Add Point
                        </button>
                      </div>
                      {card.keyPoints?.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={point || ''}
                            onChange={(e) => handleChange(e, cardIndex, pointIndex)}
                            className="focus:border-green-600 border-[1px] border-transparent flex-1 bg-gray-100 py-2 px-3 rounded-[6px] text-[14px] outline-none"
                            placeholder={`Key point ${pointIndex + 1}`}
                          />
                          {card.keyPoints.length > 1 && (
                            <button
                              onClick={() => removeKeyPoint(cardIndex, pointIndex)}
                              className="text-red-500 text-sm hover:text-red-700 px-2"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="url"
                        name="link"
                        value={card.link || ''}
                        onChange={(e) => handleChange(e, cardIndex)}
                        className="focus:border-green-600 border-[1px] border-transparent w-full bg-gray-100 py-3 px-4 rounded-[6px] text-[14px] outline-none"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={handleManualSave}
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 transition-colors"
                      >
                        Save Card Changes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreInformationEdit;
