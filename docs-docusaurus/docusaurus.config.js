import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ESLint Plugin Hub',
  tagline: 'Linting rules for your projects',
  favicon: 'img/favicon.ico',

  // Set the production URL of your site here
  url: 'https://mindfiredigital.github.io', // Your GitHub Pages URL
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/eslint-plugin-hub/', // The root URL for the site

  // GitHub pages deployment config.
  organizationName: 'mindfiredigital', // Your GitHub org/user name.
  projectName: 'Eslint-plugin-hub', // Your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/mindfiredigital/eslint-plugin-hub/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/mindfiredigital/eslint-plugin-hub/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/eslint-plugin-hub-social.png',
      navbar: {
        title: 'ESLint Plugin Hub',
        logo: {
          alt: 'eslint-plugin-hub Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://www.npmjs.com/package/@mindfiredigital/eslint-plugin-hub',
            position: 'right',
            html: `
              <a href="https://www.npmjs.com/package/@mindfiredigital/eslint-plugin-hub" style="display: flex; align-items: center;">
                <img src="https://img.shields.io/npm/v/@mindfiredigital/eslint-plugin-hub.svg" alt="npm version" style="vertical-align: middle; margin-right: 5px;" />
                <img src="https://img.shields.io/npm/dt/@mindfiredigital/eslint-plugin-hub.svg" alt="total downloads" style="vertical-align: middle;" />
              </a>
            `,
          },
          {
            href: 'https://github.com/mindfiredigital/eslint-plugin-hub',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/mindfiredigital/eslint-plugin-hub',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} eslint-plugin-hub.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;