import { Loader } from "./common/loader";

const LoadingAppScreen = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Loader className="rounded-sm" />
      <p className="text-sm text-gray-500 mt-5 text-center">Loading Blink Finance Mini App...</p>
    </div>
  );
};

export default LoadingAppScreen;