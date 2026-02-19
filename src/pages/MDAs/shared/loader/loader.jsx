import './loader.scss';

export default function Loader({ bg, customClass }) {
  return (
    <div
      className={`flex items-center justify-center bg-black/75 h-[100vh] w-[100vw] fixed top-0 left-0 z-[999999] ${customClass}`}
      style={{ backgroundColor: bg }}
    >
      <span className="loader"></span>
    </div>
  );
}
