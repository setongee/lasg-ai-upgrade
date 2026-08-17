import ScrollSpy from 'react-ui-scrollspy';
import Divider from '../../../shared/divider/Divider';
import RichTextContent from '../../../shared/richText/RichTextContent';
import Wrapper from '../../../shared/Wrapper/Wrapper';
import { useThemeStore } from '../../../stores/theme.store';
import Agencies from './Agency/Agency';
import People from './People/People';

const NAV_LINK_CLASS =
  'uppercase text-[11px] tracking-[2px] font-medium border-r border-[#bdbdbd] pr-5 !text-[#131313] last:border-none last:pr-0 max-[1000px]:min-w-max max-[1000px]:px-5 max-[1000px]:py-[10px] max-[1000px]:rounded-full max-[1000px]:bg-[#eee] max-[1000px]:border max-[1000px]:border-[#e7e7e7] [&.active-scroll-spy]:!text-[var(--theme-accent,green)]';

const About = () => {
  const data = useThemeStore((state) => state.mdaData);

  return (
    <div className="mt-[115px] max-[1000px]:mt-[190px] max-[700px]:mt-[185px]">
      <div className="w-full fixed bg-white top-[114px] py-5 border-b border-[#eee] z-40 max-[1000px]:top-[90px] max-[1000px]:py-[10px] max-[1000px]:border-none max-[1000px]:bg-transparent">
        <Wrapper>
          <div className="flex gap-5 justify-center max-[1000px]:gap-[10px] max-[1000px]:justify-start max-[1000px]:overflow-hidden max-[1000px]:overflow-x-auto max-[1000px]:[scrollbar-width:none] max-[1000px]:[-ms-overflow-style:none] max-[1000px]:[&::-webkit-scrollbar]:hidden">
            <a href="#history" data-to-scrollspy-id="history" className={NAV_LINK_CLASS}>
              {' '}
              History{' '}
            </a>
            <a href="#mission" data-to-scrollspy-id="mission" className={NAV_LINK_CLASS}>
              {' '}
              Mission & Vision{' '}
            </a>
            <a
              href="#responsibility"
              data-to-scrollspy-id="responsibility"
              className={NAV_LINK_CLASS}
            >
              {' '}
              Responsibilities{' '}
            </a>
            <a href="#agency" data-to-scrollspy-id="agency" className={NAV_LINK_CLASS}>
              {' '}
              Agencies, Departments and Units{' '}
            </a>
            <a href="#people" data-to-scrollspy-id="people" className={NAV_LINK_CLASS}>
              {' '}
              Principal officers{' '}
            </a>
          </div>
        </Wrapper>
      </div>

      <ScrollSpy>
        <section className="mt-[170px] max-[1000px]:mt-0" id="history">
          <div className="relative overflow-hidden">
            <Wrapper customClass="flex items-center justify-center">
              <div className="py-[100px] flex flex-col gap-[50px] max-[1000px]:gap-5 max-[1000px]:py-0">
                <h2 className="text-[48px] w-[900px] leading-[130%] text-center font-semibold underline tracking-[-0.5px] max-[1000px]:text-[32px] max-[1000px]:w-[600px] max-[1000px]:mb-[50px] max-[700px]:text-[28px] max-[700px]:w-full max-[700px]:mb-10">
                  That every Lagosian enjoys unfettered access to qualitative healthcare without
                  significant geographical, financial, cultural or political barriers
                </h2>
              </div>
            </Wrapper>
          </div>
        </section>

        {/* mission */}
        <section id="mission">
          <Wrapper>
            <div className="flex gap-5 justify-center max-[1000px]:gap-[10px] max-[1000px]:justify-start max-[1000px]:overflow-hidden max-[1000px]:overflow-x-auto max-[1000px]:[scrollbar-width:none] max-[1000px]:[-ms-overflow-style:none] max-[1000px]:[&::-webkit-scrollbar]:hidden max-[700px]:flex-col max-[700px]:justify-center max-[700px]:items-center">
              <div className="w-[calc(53%-50px)] overflow-hidden rounded-[10px] bg-[var(--theme-accent,#2e7d32)] relative max-[1000px]:min-w-[400px] max-[700px]:min-w-full">
                <div className="p-[30px] rounded-[5px] max-[1000px]:p-[25px]">
                  <div className="text-[16px] font-semibold leading-[125%] mb-5 border-b border-[#f1f1f149] pb-5 text-[var(--theme-accent-text,#ffffff)]">
                    Vision
                  </div>
                  <p className="text-[16px] w-4/5 text-[var(--theme-accent-text,#ffffff)] max-[1000px]:w-full">
                    {data?.vision}
                  </p>
                </div>
              </div>
              <div className="w-[calc(53%-50px)] overflow-hidden rounded-[10px] bg-[var(--theme-accent,#2e7d32)] relative max-[1000px]:min-w-[400px] max-[700px]:min-w-full">
                <div className="p-[30px] rounded-[5px] max-[1000px]:p-[25px]">
                  <div className="text-[16px] font-semibold leading-[125%] mb-5 border-b border-[#f1f1f149] pb-5 text-[var(--theme-accent-text,#ffffff)]">
                    Mission
                  </div>
                  <p className="text-[16px] w-4/5 text-[var(--theme-accent-text,#ffffff)] max-[1000px]:w-full">
                    {data?.mission}
                  </p>
                </div>
              </div>
              <div className="w-[calc(53%-50px)] overflow-hidden rounded-[10px] bg-[var(--theme-accent,#2e7d32)] relative max-[1000px]:min-w-[400px] max-[700px]:min-w-full">
                <div className="p-[30px] rounded-[5px] max-[1000px]:p-[25px]">
                  <div className="text-[16px] font-semibold leading-[125%] mb-5 border-b border-[#f1f1f149] pb-5 text-[var(--theme-accent-text,#ffffff)]">
                    Our Goal
                  </div>
                  <p className="text-[16px] w-4/5 text-[var(--theme-accent-text,#ffffff)] max-[1000px]:w-full">
                    {data?.goal}
                  </p>
                </div>
              </div>
            </div>
          </Wrapper>
        </section>

        {/* responsibilities */}
        <section
          className="!bg-[#e6edef] py-20 my-20 max-[1000px]:pt-[50px] max-[1000px]:pb-0 max-[1000px]:my-[30px]"
          id="responsibility"
        >
          <Wrapper>
            <div className="flex items-center justify-between max-[1000px]:!w-4/5 max-[1000px]:flex-col max-[1000px]:items-center max-[1000px]:justify-center max-[1000px]:mx-auto max-[700px]:!w-full">
              <h1 className="!text-[#131313] text-[40px] leading-[130%] font-semibold w-[800px] max-[1000px]:text-[32px] max-[1000px]:w-full max-[1000px]:text-center max-[1000px]:mb-5 max-[700px]:text-[26px] max-[700px]:w-full">
                Roles and Responsibilities: Understanding Core Functions, Duties, and Key Roles
              </h1>
              <span className="!text-[#555555] w-[300px] leading-[180%] max-[1000px]:w-4/5 max-[1000px]:text-center max-[700px]:w-full">
                A clear guide to the core functions, duties, and key roles that drive effective
                operations and accountability.
              </span>
            </div>

            <Divider customClass="my-20 max-[1000px]:my-[30px]" />

            <RichTextContent
              html={data?.responsibilities}
              className="flex flex-col gap-5 [&>p:first-child]:mb-[10px] [&>p]:leading-[190%] !text-[#131313]"
            />
          </Wrapper>
        </section>

        {data?.agencies?.length > 0 && (
          <section className="max-[1000px]:mt-[50px]" id="agency">
            <Agencies res={data} />
          </section>
        )}
        {data?.people?.length > 0 && (
          <section className="mt-[50px]" id="people">
            <People res={data} />
          </section>
        )}
      </ScrollSpy>
    </div>
  );
};

export default About;
