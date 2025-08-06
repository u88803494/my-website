import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(() => import("./AnimatedBackgroundComponent"), {
  loading: () => null,
  ssr: false,
});

export default AnimatedBackground;
