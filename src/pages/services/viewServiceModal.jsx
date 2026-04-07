import { motion } from 'framer-motion';
import { ArrowDown, Xmark } from 'iconoir-react';
import { useEffect, useState } from 'react';
import './serviceModal.scss';

export default function ViewServiceModal({ data, close, category, customClass }) {
  const { name, url, content, cta } = data;
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const info = document.querySelector('.modal_info');
    info.innerHTML = content;
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      const modalContent = document.querySelector('.modal_item');
      if (modalContent) {
        const hasScroll = modalContent.scrollHeight > modalContent.clientHeight;
        setIsScrollable(hasScroll);
      }
    };

    const handleScroll = () => {
      const modalContent = document.querySelector('.modal_item');
      if (modalContent) {
        const scrollTop = modalContent.scrollTop;
        const scrollHeight = modalContent.scrollHeight;
        const clientHeight = modalContent.clientHeight;

        // Check if user is at or near the bottom (within 100px)
        const threshold = 100;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
        setIsAtBottom(isNearBottom);
      }
    };

    // Check after content is loaded
    setTimeout(checkScrollable, 100);

    // Add scroll listener
    const modalContent = document.querySelector('.modal_item');
    if (modalContent) {
      modalContent.addEventListener('scroll', handleScroll);
    }

    // Also check on window resize
    window.addEventListener('resize', checkScrollable);

    return () => {
      window.removeEventListener('resize', checkScrollable);
      if (modalContent) {
        modalContent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [content]);

  const handleScrollDown = () => {
    const modalContent = document.querySelector('.modal_item');
    if (modalContent) {
      modalContent.scrollBy({
        top: 300,
        behavior: 'smooth',
      });
    }
  };

  const shouldShowScrollIndicator = isScrollable && !isAtBottom;

  return (
    <div className={`view_service_modal ${customClass ? customClass : ''}`}>
      <motion.div
        className="modal_item"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', duration: 1 }}
      >
        <div className="closeModal" onClick={() => close()}>
          {' '}
          <Xmark />{' '}
        </div>
        <div className="modal_theme"> {category} </div>
        <div className="modal_title"> {name} </div>
        <div className="modal_info"></div>
        <div className="modal_CTA" onClick={() => window.open(url)}>
          {' '}
          {cta}{' '}
        </div>

        {shouldShowScrollIndicator && (
          <div className="scroll-indicator">
            <div className="scroll-fade"></div>
            <div className="scroll-text" onClick={handleScrollDown}>
              <span className="flex gap-2 items-center cursor-pointer">
                <ArrowDown fontSize={9} strokeWidth={2} className="bounce-arrow text-green-200" />
                Scroll down to view more content
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
