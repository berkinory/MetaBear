import type { ReactNode } from "react";

import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import satori from "satori";

import { themeConfig } from "@/config";

type Theme = "light" | "dark";
type OGVariant = "home" | "blog" | "post";

const THEMES = {
  dark: {
    accent: "#3b82f6",
    accentGlow: "rgba(59, 130, 246, 0.15)",
    background: "#0a0a0a",
    backgroundGradient:
      "linear-gradient(145deg, #0a0a0a 0%, #111111 60%, #0d0d0d 90%)",
    border: "rgba(255, 255, 255, 0.06)",
    foreground: "#fafafa",
    iconFill: "#fafafa",
    muted: "#71717a",
    secondary: "rgba(255, 255, 255, 0.08)",
    subtle: "rgba(255, 255, 255, 0.03)",
  },
  light: {
    accent: "#2563eb",
    accentGlow: "rgba(37, 99, 235, 0.4)",
    background: "#fafafa",
    backgroundGradient:
      "linear-gradient(145deg, #ffffff 0%, #f5f5f5 60%, #fafafa 90%)",
    border: "rgba(0, 0, 0, 0.12)",
    foreground: "#09090b",
    iconFill: "#09090b",
    muted: "#71717a",
    secondary: "rgba(0, 0, 0, 0.12)",
    subtle: "rgba(0, 0, 0, 0.04)",
  },
};

const getTheme = (): Theme => {
  const configTheme = themeConfig.general.theme;
  if (configTheme === "auto" || configTheme === "dark") {
    return "dark";
  }
  return "light";
};

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 60;

interface OGImageOptions {
  postTitle?: string;
  variant: OGVariant;
}

const loadFonts = async () => {
  const [regularResponse, semiboldResponse] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-400-normal.ttf"
    ),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/geist-sans@latest/latin-600-normal.ttf"
    ),
  ]);
  return {
    regular: await regularResponse.arrayBuffer(),
    semibold: await semiboldResponse.arrayBuffer(),
  };
};

const loadLogo = (): string | null => {
  const ogLogoPath = themeConfig.site.ogLogo;
  if (!ogLogoPath) {
    return null;
  }

  const logoPath = join(process.cwd(), "public", ogLogoPath);
  try {
    const logoBuffer = readFileSync(logoPath);
    const base64 = logoBuffer.toString("base64");
    const ext = ogLogoPath.split(".").pop()?.toLowerCase() || "png";
    const mimeType = ext === "svg" ? "svg+xml" : ext;
    return `data:image/${mimeType};base64,${base64}`;
  } catch {
    return null;
  }
};

const cleanUrl = (url: string): string => url.replace(/^https?:\/\//, "");

const createCornerLines = (colors: (typeof THEMES)[Theme]) => [
  {
    key: "line-top",
    props: {
      style: {
        backgroundColor: colors.secondary,
        height: 1,
        left: 0,
        position: "absolute",
        right: 0,
        top: PADDING,
      },
    },
    type: "div",
  },
  {
    key: "line-bottom",
    props: {
      style: {
        backgroundColor: colors.secondary,
        bottom: PADDING,
        height: 1,
        left: 0,
        position: "absolute",
        right: 0,
      },
    },
    type: "div",
  },
  {
    key: "line-left",
    props: {
      style: {
        backgroundColor: colors.secondary,
        bottom: 0,
        left: PADDING,
        position: "absolute",
        top: 0,
        width: 1,
      },
    },
    type: "div",
  },
  {
    key: "line-right",
    props: {
      style: {
        backgroundColor: colors.secondary,
        bottom: 0,
        position: "absolute",
        right: PADDING,
        top: 0,
        width: 1,
      },
    },
    type: "div",
  },
];

const createPlusShape = (
  colors: (typeof THEMES)[Theme],
  position: { bottom?: number; left?: number; right?: number; top?: number },
  key: string
) => {
  const size = 13;
  const thickness = 1;
  const half = Math.floor(size / 2);

  return {
    key,
    props: {
      children: [
        {
          key: `${key}-h`,
          props: {
            style: {
              backgroundColor: colors.foreground,
              height: thickness,
              left: 0,
              position: "absolute",
              top: half,
              width: size,
            },
          },
          type: "div",
        },
        {
          key: `${key}-v`,
          props: {
            style: {
              backgroundColor: colors.foreground,
              height: size,
              left: half,
              position: "absolute",
              top: 0,
              width: thickness,
            },
          },
          type: "div",
        },
      ],
      style: {
        ...position,
        backgroundColor: colors.background,
        display: "flex",
        height: size,
        position: "absolute",
        width: size,
      },
    },
    type: "div",
  };
};

const createCornerMarkers = (colors: (typeof THEMES)[Theme]) => {
  const size = 13;
  const half = Math.floor(size / 2);

  return [
    createPlusShape(
      colors,
      { left: PADDING - half, top: PADDING - half },
      "marker-top-left"
    ),
    createPlusShape(
      colors,
      { right: PADDING - half, top: PADDING - half },
      "marker-top-right"
    ),
    createPlusShape(
      colors,
      { bottom: PADDING - half, left: PADDING - half },
      "marker-bottom-left"
    ),
    createPlusShape(
      colors,
      { bottom: PADDING - half, right: PADDING - half },
      "marker-bottom-right"
    ),
  ];
};

const createAmbientGlow = (colors: (typeof THEMES)[Theme]) => ({
  key: "ambient-glow",
  props: {
    style: {
      background: `radial-gradient(ellipse 60% 60% at 50% -10%, ${colors.accent}40 0%, ${colors.accent}38 5%, ${colors.accent}35 10%, ${colors.accent}30 18%, ${colors.accent}25 28%, ${colors.accent}20 38%, ${colors.accent}15 48%, ${colors.accent}10 58%, ${colors.accent}08 65%, ${colors.accent}05 72%, ${colors.accent}02 80%, transparent 90%)`,
      height: "100%",
      left: 0,
      pointerEvents: "none",
      position: "absolute",
      top: 0,
      width: "100%",
    },
  },
  type: "div",
});

const createHomeElement = (theme: Theme): ReactNode => {
  const colors = THEMES[theme];
  const logoDataUrl = loadLogo();

  return {
    key: "root",
    props: {
      children: [
        createAmbientGlow(colors),
        ...createCornerLines(colors),
        ...createCornerMarkers(colors),
        {
          key: "content",
          props: {
            children: [
              ...(logoDataUrl
                ? [
                    {
                      key: "logo",
                      props: {
                        height: 80,
                        src: logoDataUrl,
                        width: 80,
                      },
                      type: "img",
                    },
                  ]
                : []),
              {
                key: "title",
                props: {
                  children: themeConfig.site.title,
                  style: {
                    color: colors.foreground,
                    fontFamily: "Geist Sans",
                    fontSize: 64,
                    fontWeight: 600,
                  },
                },
                type: "span",
              },
            ],
            style: {
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              gap: 24,
              height: "100%",
              justifyContent: "center",
              width: "100%",
            },
          },
          type: "div",
        },
      ],
      style: {
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      },
    },
    type: "div",
  };
};

const createBlogElement = (theme: Theme): ReactNode => {
  const colors = THEMES[theme];
  const logoDataUrl = loadLogo();

  return {
    key: "root",
    props: {
      children: [
        createAmbientGlow(colors),
        ...createCornerLines(colors),
        ...createCornerMarkers(colors),
        {
          key: "content",
          props: {
            children: [
              {
                key: "header",
                props: {
                  children: [
                    ...(logoDataUrl
                      ? [
                          {
                            key: "logo",
                            props: {
                              height: 48,
                              src: logoDataUrl,
                              width: 48,
                            },
                            type: "img",
                          },
                        ]
                      : []),
                    {
                      key: "blog-label",
                      props: {
                        children: themeConfig.site.title,
                        style: {
                          color: colors.muted,
                          fontFamily: "Geist Sans",
                          fontSize: 24,
                          fontWeight: 400,
                        },
                      },
                      type: "span",
                    },
                  ],
                  style: {
                    alignItems: "flex-start",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  },
                },
                type: "div",
              },
              {
                key: "footer",
                props: {
                  children: cleanUrl(themeConfig.site.website),
                  style: {
                    color: colors.muted,
                    fontFamily: "Geist Sans",
                    fontSize: 24,
                    fontWeight: 400,
                  },
                },
                type: "span",
              },
            ],
            style: {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              padding: PADDING + 40,
              width: "100%",
            },
          },
          type: "div",
        },
      ],
      style: {
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      },
    },
    type: "div",
  };
};

const createPostElement = (theme: Theme, postTitle: string): ReactNode => {
  const colors = THEMES[theme];
  const logoDataUrl = loadLogo();

  return {
    key: "root",
    props: {
      children: [
        createAmbientGlow(colors),
        ...createCornerLines(colors),
        ...createCornerMarkers(colors),
        {
          key: "content",
          props: {
            children: [
              {
                key: "header",
                props: {
                  children: [
                    {
                      key: "blog-label",
                      props: {
                        children: themeConfig.site.title,
                        style: {
                          color: colors.muted,
                          fontFamily: "Geist Sans",
                          fontSize: 24,
                          fontWeight: 400,
                        },
                      },
                      type: "span",
                    },
                    {
                      key: "post-title",
                      props: {
                        children: postTitle,
                        style: {
                          color: colors.foreground,
                          fontFamily: "Geist Sans",
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: 1.2,
                        },
                      },
                      type: "span",
                    },
                  ],
                  style: {
                    alignItems: "flex-start",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  },
                },
                type: "div",
              },
              {
                key: "footer",
                props: {
                  children: [
                    {
                      key: "url",
                      props: {
                        children: cleanUrl(themeConfig.site.website),
                        style: {
                          color: colors.muted,
                          fontFamily: "Geist Sans",
                          fontSize: 24,
                          fontWeight: 400,
                        },
                      },
                      type: "span",
                    },
                    ...(logoDataUrl
                      ? [
                          {
                            key: "logo",
                            props: {
                              height: 48,
                              src: logoDataUrl,
                              width: 48,
                            },
                            type: "img",
                          },
                        ]
                      : []),
                  ],
                  style: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  },
                },
                type: "div",
              },
            ],
            style: {
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
              padding: PADDING + 40,
              width: "100%",
            },
          },
          type: "div",
        },
      ],
      style: {
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        display: "flex",
        height: "100%",
        position: "relative",
        width: "100%",
      },
    },
    type: "div",
  };
};

const createOGElement = (options: OGImageOptions, theme: Theme): ReactNode => {
  switch (options.variant) {
    case "home": {
      return createHomeElement(theme);
    }
    case "blog": {
      return createBlogElement(theme);
    }
    case "post":
    default: {
      return createPostElement(theme, options.postTitle ?? "");
    }
  }
};

let fontsCache: Awaited<ReturnType<typeof loadFonts>> | null = null;

export const generateOGImage = async (options: OGImageOptions) => {
  const fonts = fontsCache ?? (await loadFonts());
  fontsCache = fonts;

  const theme = getTheme();

  const svg = await satori(createOGElement(options, theme), {
    fonts: [
      {
        data: fonts.regular,
        name: "Geist Sans",
        style: "normal",
        weight: 400,
      },
      {
        data: fonts.semibold,
        name: "Geist Sans",
        style: "normal",
        weight: 600,
      },
    ],
    height: HEIGHT,
    width: WIDTH,
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
};
