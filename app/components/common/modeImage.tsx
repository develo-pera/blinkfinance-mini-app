import { useTheme } from "next-themes";
import Image, { ImageProps } from "next/image";

const ModeImage = ({ srcLight, srcDark, ...props }: Omit<ImageProps, 'src'> & { srcLight: string, srcDark: string }) => {
  const { theme } = useTheme();
  return <Image src={theme === "dark" ? srcDark : srcLight} {...props} />;
};

export default ModeImage;