"use strict";(self.webpackChunkeslint_plugin_hub=self.webpackChunkeslint_plugin_hub||[]).push([[5423],{1594:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>l});var i=t(4848),r=t(8453);const a={},o="React",s={id:"react",title:"React",description:"ESLint Plugin Configuration for React",source:"@site/docs/react.md",sourceDirName:".",slug:"/react",permalink:"/eslint-plugin-hub/docs/react",draft:!1,unlisted:!1,editUrl:"https://github.com/mindfiredigital/eslint-plugin-hub/edit/main/docs/react.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"General",permalink:"/eslint-plugin-hub/docs/general"},next:{title:"Angular",permalink:"/eslint-plugin-hub/docs/angular"}},c={},l=[{value:"ESLint Plugin Configuration for React",id:"eslint-plugin-configuration-for-react",level:2},{value:"React Rules Overview",id:"react-rules-overview",level:3},{value:"How to Configure",id:"how-to-configure",level:3},{value:"JavaScript Configuration Example (<code>eslintrc.config.mjs</code>)",id:"javascript-configuration-example-eslintrcconfigmjs",level:4},{value:"JSON Configuration Example (<code>.eslintrc.json</code>)",id:"json-configuration-example-eslintrcjson",level:4},{value:"React Rule Explanations",id:"react-rule-explanations",level:3},{value:"1. <code>react-component-name-match-filename</code>",id:"1-react-component-name-match-filename",level:4},{value:"Example of Incorrect Implementation:",id:"example-of-incorrect-implementation",level:5},{value:"Example of Correct Implementation:",id:"example-of-correct-implementation",level:5},{value:"2. <code>react-filename-pascalcase</code>",id:"2-react-filename-pascalcase",level:4},{value:"Example of Incorrect Implementation:",id:"example-of-incorrect-implementation-1",level:5},{value:"Example of Correct Implementation:",id:"example-of-correct-implementation-1",level:5},{value:"Best Practices for React Project Structure",id:"best-practices-for-react-project-structure",level:3},{value:"Additional Notes",id:"additional-notes",level:3}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",h5:"h5",header:"header",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"react",children:"React"})}),"\n",(0,i.jsx)(n.h2,{id:"eslint-plugin-configuration-for-react",children:"ESLint Plugin Configuration for React"}),"\n",(0,i.jsx)(n.p,{children:"To maintain consistent naming conventions and best practices across your React project, we leverage React-specific rules from the ESLint Plugin Hub. These rules ensure that React component names are clear, consistent, and follow widely-accepted best practices."}),"\n",(0,i.jsx)(n.h3,{id:"react-rules-overview",children:"React Rules Overview"}),"\n",(0,i.jsx)(n.p,{children:"The following React rules are configured:"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"Rule Name"}),(0,i.jsx)(n.th,{children:"Description"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"react-component-name-match-filename"})}),(0,i.jsx)(n.td,{children:"Ensures that React component names match their filenames."})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.td,{children:(0,i.jsx)(n.code,{children:"react-filename-pascalcase"})}),(0,i.jsx)(n.td,{children:"Enforces PascalCase naming convention for React component filenames."})]})]})]}),"\n",(0,i.jsx)(n.h3,{id:"how-to-configure",children:"How to Configure"}),"\n",(0,i.jsxs)(n.p,{children:["To enable these React rules, add them to your ESLint configuration file. This can be done through ",(0,i.jsx)(n.code,{children:"eslintrc.config.mjs"}),", ",(0,i.jsx)(n.code,{children:".eslintrc.json"}),", ",(0,i.jsx)(n.code,{children:".eslintrc.js"}),", or ",(0,i.jsx)(n.code,{children:".eslintrc.yaml"}),". The steps below outline the necessary changes to apply these rules effectively."]}),"\n",(0,i.jsxs)(n.h4,{id:"javascript-configuration-example-eslintrcconfigmjs",children:["JavaScript Configuration Example (",(0,i.jsx)(n.code,{children:"eslintrc.config.mjs"}),")"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"import hub from '@mindfiredigital/eslint-plugin-hub';\nimport globals from 'globals';\n\nexport default [\n  // Extends the react config preset from the plugin\n  hub.configs['flat/react'],\n  {\n    languageOptions: {\n      globals: globals.browser,\n      parserOptions: {\n        ecmaVersion: 2022,\n        sourceType: 'module',\n        ecmaFeatures: {\n          jsx: true,\n        },\n      },\n    },\n    // Add any additional rules or overrides here\n  },\n];\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"json-configuration-example-eslintrcjson",children:["JSON Configuration Example (",(0,i.jsx)(n.code,{children:".eslintrc.json"}),")"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-json",children:'{\n  "env": {\n    "es2024": true\n  },\n  "parserOptions": {\n    "ecmaVersion": "latest",\n    "sourceType": "module",\n    "ecmaFeatures": {\n      "jsx": true\n    }\n  },\n  "extends": ["plugin:@mindfiredigital/hub/react"]\n  // Add any additional rules or overrides here\n}\n'})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"react-rule-explanations",children:"React Rule Explanations"}),"\n",(0,i.jsxs)(n.h4,{id:"1-react-component-name-match-filename",children:["1. ",(0,i.jsx)(n.code,{children:"react-component-name-match-filename"})]}),"\n",(0,i.jsxs)(n.p,{children:["This rule enforces that each React component name matches the name of its file. For instance, if you create a ",(0,i.jsx)(n.code,{children:"MyComponent"}),", the filename should also be ",(0,i.jsx)(n.code,{children:"MyComponent.js"}),". This practice ensures uniformity and reduces the risk of confusion when managing large-scale codebases."]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Level"}),": ",(0,i.jsx)(n.code,{children:"error"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Rationale"}),": Matching filenames with component names provides clarity and consistency, making the codebase easier to navigate and maintain."]}),"\n"]}),"\n",(0,i.jsx)(n.h5,{id:"example-of-incorrect-implementation",children:"Example of Incorrect Implementation:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"// Filename: myComponent.js\nfunction MyComponent() {\n  return <div>Hello World</div>;\n}\n\nexport default MyComponent;\n"})}),"\n",(0,i.jsx)(n.h5,{id:"example-of-correct-implementation",children:"Example of Correct Implementation:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"// Filename: MyComponent.js\nfunction MyComponent() {\n  return <div>Hello World</div>;\n}\n\nexport default MyComponent;\n"})}),"\n",(0,i.jsxs)(n.h4,{id:"2-react-filename-pascalcase",children:["2. ",(0,i.jsx)(n.code,{children:"react-filename-pascalcase"})]}),"\n",(0,i.jsx)(n.p,{children:"This rule enforces the PascalCase naming convention for React component filenames. PascalCase is widely adopted in the React ecosystem as it makes component files distinguishable from utility files or other resources."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Level"}),": ",(0,i.jsx)(n.code,{children:"error"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Rationale"}),": PascalCase promotes consistency and readability, and adhering to it helps ensure that component filenames are immediately recognizable as such."]}),"\n"]}),"\n",(0,i.jsx)(n.h5,{id:"example-of-incorrect-implementation-1",children:"Example of Incorrect Implementation:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Incorrect filename\nmycomponent.js\n"})}),"\n",(0,i.jsx)(n.h5,{id:"example-of-correct-implementation-1",children:"Example of Correct Implementation:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"# Correct filename\nMyComponent.js\n"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"best-practices-for-react-project-structure",children:"Best Practices for React Project Structure"}),"\n",(0,i.jsx)(n.p,{children:"By following these rules, you can ensure a more organized and maintainable codebase. React projects benefit from consistency, particularly when adhering to these naming conventions:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Component names must match filenames"}),": This avoids confusion and misalignment in the codebase."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"PascalCase for component filenames"}),": This makes component files easily recognizable and prevents mix-ups with other files like utilities."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"additional-notes",children:"Additional Notes"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Customization"}),": If necessary, you can override these rules to fit the specific needs of your project. However, adhering to these practices is highly recommended for long-term maintainability and clarity."]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>s});var i=t(6540);const r={},a=i.createContext(r);function o(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);