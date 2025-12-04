import { useState } from 'react';
import { convertToTitleCase, truncateText } from '../../../../../middleware/middleware';
import Button from '../../button/Button';
import Modal from '../../modal/Modal';
import './serviceCard.css';

export default function ServiceCard({ data, logo }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="serviceCardItem" onClick={() => setOpen(true)}>
        <div className="service_details flex flex-col">
          <div className="logo">
            {' '}
            <img src={logo} alt="Lagos State Ministry of Health" />{' '}
          </div>

          <div className="service_title"> {truncateText(data.name, 60)} </div>
        </div>

        <div className="topx">
          <div className="service_description">
            {' '}
            {convertToTitleCase(truncateText(data.short, 80))}{' '}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="serviceTitle">{data.name}</div>
        <div dangerouslySetInnerHTML={{ __html: data.content }} />
        <Button
          customClass="bg-[#108a00] mt-[50px] !py-[10px] !px-[20px] uppercase tracking-[2px] text-white rounded-[5px] flex gap-2 text-[11px]"
          action={() => window.open(data.url)}
        >
          {data.cta}
        </Button>
      </Modal>
    </>
  );
}
