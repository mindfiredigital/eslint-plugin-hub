// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Define the sidebar structure manually
  docsSidebar: [
    'intro',
    'installation',
    'configuration',
    {
      type: 'category',
      label: 'Rules',
      items: ['general', 'react', 'angular'],
    },
    'contributing',
  ],
};

export default sidebars;
