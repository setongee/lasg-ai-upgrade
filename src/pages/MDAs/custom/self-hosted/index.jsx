import { useState } from 'react';
import Loader from '../../shared/loader/loader';
import Offline from '../../shared/offline/Offline';

const SelfHosted = ({ data }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (data?.isOffline) return <Offline />;

  return (
    <div>
      {isLoading && <Loader />}
      <iframe
        src={data?.externalUrl}
        width="100%"
        height="100vh"
        title="Example Iframe"
        style={{ height: '100vh' }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default SelfHosted;
