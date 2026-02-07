import type { APIRoute } from "astro";

import { generateOGImage } from "@/pages/og/_og";

export const prerender = true;

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    variant: "home",
  });

  return new Response(Uint8Array.from(png), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "image/png",
    },
  });
};
