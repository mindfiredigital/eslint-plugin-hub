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
    {
      type: 'category',
      label: 'Contributing',
      items: ['contributing', 'addnewrule'],
    },
  ],
};

export default sidebars;
