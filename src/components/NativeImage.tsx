import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width?: number;
  radius?: string | number;
};

function NativeImage({ src, alt, radius, width }: Props) {
  return (
    <Image
      priority
      width={0}
      height={0}
      src={src}
      alt={alt}
      sizes="100vw"
      style={{
        borderRadius: radius ?? 0,
        height: "auto",
        width: width ?? "100%",
      }}
    />
  );
}

export default NativeImage;
