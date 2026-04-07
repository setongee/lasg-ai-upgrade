import './container.scss';

const Container = ({ children, customStyle }) => {
  return <div className={`guidePack ${customStyle}`}> {children} </div>;
};

export default Container;
