// theme.config.tsx
import { useTheme } from "next-themes";
import { Logo } from "./components/logo";

export default {
  logo: () => {
    const { resolvedTheme } = useTheme();

    return (
      <span className="flex items-center gap-2">
        {resolvedTheme === "dark" ? <Logo /> : <Logo />}
      </span>
    );
  },
  project: {
    link: "https://github.com/mrbadri/iconsync",
  },
  docsRepositoryBase:
    "https://github.com/mrbadri/iconsync/tree/main/apps/docs-nextra",
  footer: {
    text: `© ${new Date().getFullYear()} IconSync. All rights reserved.`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: "%s – IconSync",
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="IconSync" />
      <meta property="og:description" content="IconSync documentation" />

      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta name="theme-color" content="#121212" />
    </>
  ),
};
