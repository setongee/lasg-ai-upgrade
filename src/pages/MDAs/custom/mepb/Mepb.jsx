import { useParams } from 'react-router';

const MEPB = () => {
  const { page } = useParams();
  return (
    <div>
      <iframe
        src={`https://mepb.vercel.app/${page === 'admin' ? 'admin' : 'home'}`}
        width="100%"
        title="Example Iframe"
        style={{ height: '100vh' }}
      />
    </div>
  );
};

export default MEPB;
