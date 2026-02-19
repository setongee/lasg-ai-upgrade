import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useVisitTracker } from '../../hooks/useVisitTracker';
import { getMda } from './api/data';
import Admin from './shared/admin/Admin';
import Loader from './shared/loader/loader';
import { useThemeStore } from './stores/theme.store';
import ThemeSelector from './Themes/ThemeSelector';

const Page = () => {
  let params = useParams();
  const { mda, page } = params;
  const setIsMobile = useThemeStore((state) => state.setIsMobile);
  const setMdaData = useThemeStore((state) => state.setMdaData);
  const setMda = useThemeStore((state) => state.setMda);

  let htmlContent = '';

  useEffect(() => {
    document.querySelector('.footer').style.display = 'none';
    document.querySelector('#header').style.display = 'none';

    const width = window.innerWidth;
    if (width < 800) setIsMobile(true);
  }, []);

  const { data, isError, isPending, isLoading } = useQuery({
    queryKey: ['mda', mda],
    queryFn: () => getMda(mda),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (data?.length > 0) {
      const newData = data[0];
      setMdaData(newData);
      setMda(mda);
    }
  }, [data, mda, setMda, setMdaData]);

  useVisitTracker(mda, page === undefined ? 'home' : page);

  if (isLoading) return <Loader />;

  switch (page) {
    case 'admin':
      return <Admin />;
    default:
      return <ThemeSelector theme={data[0]?.theme} data={data[0]} />;
  }
};

export default Page;
