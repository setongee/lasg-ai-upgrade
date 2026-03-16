import { useEffect } from 'react';
import { useParams } from 'react-router';

const Transportation = () => {
  const { page } = useParams();

  useEffect(() => {}, []);

  return (
    <div>
      <iframe
        src={`https://transportation-blush.vercel.app/${page === 'admin' ? 'admin' : 'home'}`}
        width="100%"
        height="100vh"
        title="Example Iframe"
        style={{ height: '100vh' }}
      />
    </div>
  );
};

export default Transportation;
