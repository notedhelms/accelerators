// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */

module.exports = {
  title: 'Corticon Accelerate',
  tagline: 'Templates and Tutorials to Jumpstart Rule Projects',
  favicon: 'img/favicon.ico',
  url: 'https://corticon.github.io/',
  baseUrl: '/accelerators/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'corticon', // Usually your GitHub org/user name.
  projectName: 'accelerators', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  deploymentBranch: 'gh-pages',


  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/corticon/accelerators',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog: false
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/favicon.ico',
      navbar: {
        title: 'Corticon Accelerate',
        logo: {
          alt: 'Corticon Accelerate Logo',
          src: 'img/favicon.ico',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Accelerators',
          },
          {
            href: 'https://github.com/corticon/accelerators',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      footer: {
        style: 'dark',
        links: [

          {
            title: 'Resources',
            items: [
              {
                label: 'Corticon Documentation Library',
                href: 'https://docs.progress.com/category/corticon-information-hub',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@ProgressCorticon',
              },
              {
                label: 'User Community',
                href: 'https://community.progress.com/s/topic/0TO4Q00000026HaWAI/corticon-general-discussions',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://www.progress.com/blogs/cognitive-services',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/corticon/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Progress Software, Built with Docusaurus.`,
      },
      themeConfig: {
           metadata: [{ name: 'keywords', content: 'corticon, rules engine, brms, bre, dynamic forms, business rules' }],
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        }
      },
      plugins: [
      ],
    }
  )
  }