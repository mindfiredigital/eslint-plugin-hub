// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Define the sidebar structure manually
  docsSidebar: [
    'intro',
    'installation',
    'configuration',
    'eslint-report',
    {
      type: 'category',
      label: 'Rules',
      items: ['general', 'react', 'angular', 'advanced', 'node-express'],
    },
    {
      type: 'category',
      label: 'Recomended Rules',
      items: ['mern'],
    },
    {
      type: 'category',
      label: 'How To Contribute',
      items: ['contributing', 'addnewrule'],
    },
    'our-contributors',
  ],
};

export default sidebars;
