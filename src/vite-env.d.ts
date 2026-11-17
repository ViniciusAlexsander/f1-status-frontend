/// <reference types="vite/client" />

declare module "*.json" {
  const value: unknown;
  export default value;
}

declare module "*.geojson" {
  const value: {
    type: "FeatureCollection";
    name?: string;
    bbox?: number[];
    features: Array<{
      type: "Feature";
      properties?: {
        id?: string;
        Location?: string;
        Name?: string;
      };
      geometry: {
        type: string;
        coordinates: number[][];
      };
    }>;
  };
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_ADSENSE_SLOT?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  adsbygoogle: unknown[];
}
