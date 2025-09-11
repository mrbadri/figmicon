export default {
  logo: <span>Figmicon Docs</span>,
  project: {
    link: 'https://github.com/mrbadri/figmicon',
  },
  docsRepositoryBase: 'https://github.com/mrbadri/figmicon/tree/main/apps/docs-nextra',
  footer: {
    text: `© ${new Date().getFullYear()} Figmicon. All rights reserved.`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Figmicon'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Figmicon" />
      <meta property="og:description" content="Figmicon documentation" />
    </>
  ),
}
