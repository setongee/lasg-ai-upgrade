import lasg_logo from '../assets/lasg__logo.png';
import construction from './construction.svg';

const Offline = () => {
  return (
    <div className="flex items-center flex-col p-20 gap-20 justify-center h-[90vh]">
      <div className="">
        <img src={lasg_logo} alt="LASG Logo" className="w-[70px] h-[70px]" />
      </div>
      <div className="">
        <img src={construction} alt="" className="w-[500px]" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold w-[400px] mb-10">We would be back online soon!</h1>
        <a href="/" className="px-6 py-3 bg-gray-800 text-white rounded-md">
          Back to homepage
        </a>
      </div>
    </div>
  );
};

export default Offline;
