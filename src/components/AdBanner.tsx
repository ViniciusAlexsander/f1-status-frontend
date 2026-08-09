import { Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_SLOT } from "@/config/adsense";

type AdBannerProps = {
  adSlot?: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  fullWidthResponsive?: boolean;
};

export function AdBanner({
  adSlot = ADSENSE_SLOT,
  format = "auto",
  fullWidthResponsive = true,
}: AdBannerProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!adSlot || isLoaded.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adSlot]);

  if (!adSlot) return null;

  return (
    <Box w="full" overflow="hidden" textAlign="center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </Box>
  );
}
