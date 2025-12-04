import { ReactLenis } from "@studio-freight/react-lenis";

const SmoothScrolling = ({ children }) => {

  // lenis options for configuration
  const lenisOptions = {
    lerp: 0.01,
    duration: 0.05,
    smoothTouch: false, //smooth scroll for touch devices
    smooth: true,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
    </ReactLenis>
  );
}

export default SmoothScrolling;
