// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
title: 'Corticon Accelerate',
  tagline: 'Templates and Tutorials to Jumpstart Rule Projects',
  url: 'https://corticon.github.io/',
  baseUrl: "/accelerators/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'corticon',
  projectName: 'accelerators', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Corticon Accelerate",
        logo: {
          alt: 'Corticon Accelerate Logo',
          src: "/img/favicon.ico",
        },
        items: [
          {
            href: 'https://github.com/corticon/accelerators',
            label: 'GitHub',
            position: 'right',
          },
        ],
        style: "primary",
      },
      docs: {
        sidebar: {
            // Customisation for the left sidebar:
            autoCollapseCategories: false,
            hideable: true,
        },
    },
      footer: {
        copyright: `Copyright © ${new Date().getFullYear()} Progress Software, Built with Docusaurus.`,
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
                label: 'Corticon Blog on Progress.com',
                to: 'https://www.progress.com/blogs/cognitive-services',
              },
              {
                label: 'Corticon on Github',
                href: 'https://github.com/corticon/',
              },
            ],
          },
        ],
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;