import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useVisitTracker } from '../../hooks/useVisitTracker';
import { getMda } from './api/data';
import Admin from './shared/admin/Admin';
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
  });

  useEffect(() => {
    if (data?.length > 0) {
      setMdaData({ ...data[0], fullname: 'Ministry of Health' });
      setMda(mda);
    }
  }, [data]);

  useVisitTracker(mda, page === undefined ? 'home' : page);

  switch (page) {
    case 'test-admin':
      return <Admin />;
    default:
      return <ThemeSelector theme={mda} />;
  }
};

export default Page;
