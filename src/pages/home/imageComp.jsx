import { useEffect, useState } from 'react';

export default function ImageComp({ src }) {
  const [dataSrc, setDataSrc] = useState(src);

  useEffect(() => {
    dataSrc;
  }, [dataSrc]);

  return (
    <div className="newsImage">
      <img src={dataSrc} alt="" />
    </div>
  );
}
