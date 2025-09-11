export default {
  logo: <span>Iconsync Docs</span>,
  project: {
    link: 'https://github.com/mrbadri/iconsync',
  },
  docsRepositoryBase: 'https://github.com/mrbadri/iconsync/tree/main/apps/docs-nextra',
  footer: {
    text: `© ${new Date().getFullYear()} IconSync. All rights reserved.`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – IconSync'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="IconSync" />
      <meta property="og:description" content="IconSync documentation" />
    </>
  ),
}
