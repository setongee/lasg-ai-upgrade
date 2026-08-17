import { useQuery } from '@tanstack/react-query';
import { getAllServicesCategory } from '../../../../api/read/services.req';
import { formattedName } from '../../api/admin/logic';
import { useThemeStore } from '../../stores/theme.store';
import Wrapper from '../Wrapper/Wrapper';
import ServicesSection from './ServicesSection';

const ServicesListPage = () => {
  const mdaData = useThemeStore((state) => state.mdaData);

  const { data: services } = useQuery({
    queryKey: ['services', mdaData?.fullname],
    queryFn: () => getAllServicesCategory(formattedName(mdaData?.fullname)),
    enabled: !!mdaData?.fullname,
  });

  return (
    <div className="bg-white mt-[170px] max-[1000px]:mt-[140px] pb-20">
      <Wrapper>
        <div className="flex flex-col items-center text-center gap-5 pb-10">
          <h1 className="font-[650] tracking-[-0.5px] leading-[1.15] text-[40px] max-[600px]:text-[26px]">
            {mdaData?.fullname} Services
          </h1>
          <span className="text-[#666] text-base leading-[1.6] max-w-[600px]">
            Browse the full list of services offered by {mdaData?.fullname}.
          </span>
        </div>
      </Wrapper>

      <ServicesSection
        style={mdaData?.landingPage?.services_style}
        data={services?.data}
        name={mdaData?.fullname}
        showAll
      />
    </div>
  );
};

export default ServicesListPage;
