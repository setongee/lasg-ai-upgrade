import Wrapper from '../../shared/Wrapper/Wrapper';

const CommissionerZone = ({
  data,
  isEdit = false,
  viewMode = 'view',
  selectedComponent = '',
  onComponentClick = () => {},
}) => {
  if (!data) return null;

  return (
    <section
      className={`bg-[#fff] flex commisioners-zone md:py-[120px] py-[50px] ${
        isEdit && viewMode === 'edit'
          ? 'border-[3px] border-transparent cursor-pointer hover:border-green-500'
          : ''
      } ${selectedComponent === 'commissionerZone' ? '!border-green-500 active_component' : ''}`}
      onClick={isEdit && viewMode === 'edit' ? () => onComponentClick('commissionerZone') : null}
    >
      <Wrapper>
        <div className="flex wrapped lg:gap-[100px] gap-[30px] items-center justify-center flex-wrap lg:flex-nowrap">
          <div className="commissioner-container md:w-[600px] md:h-[580px] w-[500px] sm:h-[480px] h-[380px] relative">
            <div className="backdrop-photo w-[100%] h-[100%] sm:h-[80%] bg-[#eee]"></div>
            <div className="commissioner-image h-[calc(100%_-_20px)] w-[calc(100%_-_20px)] sm:w-[calc(100%_-_100px)] sm:h-[500px] md:w-[calc(100%_-_150px)] overflow-hidden absolute bottom-[10px] sm:bottom-0 left-[50%] transform-[translateX(-50%)]">
              <img
                src={data?.commissionerImage}
                alt="commissioners photo"
                className="object-top w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="content flex flex-col w-full sm:w-[550px]">
            <div className="flex flex-col lg:gap-8 gap-5">
              <div className="text-[24px] sm:text-[32px] md:text-[40px] font-semibold comms-title leading-[130%]">
                {data?.welcomeTitle}
              </div>
              <p className="leading-[180%] whitespace-pre-line">{data?.welcomeMessage}</p>
            </div>

            <div className="font-semibold mt-5 block commissioner-name">
              <h1>{data?.commissionerName}</h1>
              <span className="!font-normal block">{data?.commissionerTitle}</span>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
};

export default CommissionerZone;
