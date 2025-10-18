import Image from "next/image";

interface LoaderProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Loader = ({ className, width = 50, height = 50 }: LoaderProps) => {
  return (
    <div className={`loader-container ${className || ''}`}>
      <div className="loader-beam"></div>
      <Image className="loader-image" src="/miniapp-logo.jpg" alt="wallet" width={width} height={height} />
    </div>
  );
};

export default Loader;