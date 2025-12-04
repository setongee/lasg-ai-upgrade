import { useParams } from 'react-router';
const Finance = () => {
  const { page } = useParams();
  return (
    <div>
      <iframe
        src={`https://finance.lagosstate.gov.ng/${page === 'admin' ? 'admin' : 'home'}`}
        width="100%"
        height="100vh"
        title="Example Iframe"
        style={{ height: '100vh' }}
      />
    </div>
  );
};

export default Finance;
