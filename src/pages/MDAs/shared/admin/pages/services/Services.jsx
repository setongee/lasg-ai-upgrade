import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getAllServicesCategory } from '../../../../../../api/read/services.req';
import { formattedName } from '../../../../api/admin/logic';
import { useThemeStore } from '../../../../stores/theme.store';
import Loader from '../../../loader/loader';
import CategoryEngine from './CategoryEngine';
import NewService from './NewService';
import ServicesEngine from './ServicesEngine';

const Services = () => {
  const [view, setView] = useState('services');
  const mdaData = useThemeStore((state) => state?.mdaData);

  const selectView = (view) => {
    setView(view);
  };

  const { data: services, isLoading } = useQuery({
    queryKey: ['services', mdaData?.fullname, view],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  if (isLoading || !services) return <Loader />;

  const renderPages = () => {
    switch (view) {
      case 'services':
        return (
          <ServicesEngine
            data={services?.data}
            selectView={selectView}
            isLoading={isLoading}
            mdaData={mdaData}
          />
        );
      case 'category':
        return (
          <CategoryEngine
            selectView={selectView}
            id={mdaData?._id}
            services={services?.data}
            mdaData={mdaData}
          />
        );
      case 'new-service':
        return <NewService selectView={selectView} services={services?.data} />;
      default:
        return <Loader />;
    }
  };

  return <div>{renderPages()}</div>;
};

export default Services;
