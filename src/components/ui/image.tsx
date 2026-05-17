"use client";

import { Image as ImageK, ImageKitProvider } from "@imagekit/next";

type ImageType = {
  path: string;
  w?: number;
  h?: number;
  alt: string;
  className?: string;
  tr?: boolean;
};

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

if (!urlEndpoint) {
  throw new Error("Error: Please add urlEndpoint to .env or .env.local");
}

const Image = ({ path, w, h, alt, className, tr }: ImageType) => {
  return (
    <ImageKitProvider urlEndpoint={urlEndpoint}>
      <ImageK
        src={path}
        {...(tr
          ? { transformation: [{ width: `${w}`, height: `${h}` }] }
          : { width: w, height: h })}
        alt={alt}
        className={className}
      />
    </ImageKitProvider>
  );
};

export default Image;
