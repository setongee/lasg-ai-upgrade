import { motion } from 'framer-motion';
import { Xmark } from 'iconoir-react';
import { useEffect } from 'react';
import './serviceModal.scss';

export default function ViewServiceModal({ data, close, category, customClass }) {
  const { name, url, content, cta } = data;

  useEffect(() => {
    const info = document.querySelector('.modal_info');
    info.innerHTML = content;
  }, []);

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
      </motion.div>
    </div>
  );
}
