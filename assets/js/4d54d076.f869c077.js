"use strict";(self.webpackChunkeslint_plugin_hub=self.webpackChunkeslint_plugin_hub||[]).push([[1459],{913:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>a});var s=r(4848),t=r(8453);const i={},l="Contributing",o={id:"contributing",title:"Contributing",description:"We welcome contributions to the ESLint Plugin Hub! Here's how you can contribute:",source:"@site/docs/contributing.md",sourceDirName:".",slug:"/contributing",permalink:"/docs/contributing",draft:!1,unlisted:!1,editUrl:"https://github.com/mindfiredigital/eslint-plugin-hub/edit/main/docs/contributing.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Angular",permalink:"/docs/angular"}},c={},a=[];function u(e){const n={code:"code",h1:"h1",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"contributing",children:"Contributing"})}),"\n",(0,s.jsx)(n.p,{children:"We welcome contributions to the ESLint Plugin Hub! Here's how you can contribute:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Fork the repository"}),": Start by forking the ESLint Plugin Hub repository to your GitHub account."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Clone your fork"}),": Clone your forked repository to your local machine."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/your-username/eslint-plugin-hub.git\ncd eslint-plugin-hub\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Install dependencies"}),": Install the project dependencies."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm install\n"})}),"\n",(0,s.jsx)(n.p,{children:"or if you use yarn:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn install\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Create a new branch"}),": Create a new branch for your feature or bugfix."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git checkout -b feature/your-feature-name\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Use the Rule Generator"}),": If you're adding a new rule, use our Rule Generator script to scaffold the necessary files:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm run generate-rule your-rule-name [rule-type]\n"})}),"\n",(0,s.jsx)(n.p,{children:"or if you use yarn:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn generate-rule your-rule-name [rule-type]\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Replace ",(0,s.jsx)(n.code,{children:"your-rule-name"})," with the name of your new rule (in kebab-case), and ",(0,s.jsx)(n.code,{children:"[rule-type]"})," with either 'general', 'react', or 'angular'. If you don't specify a rule type, the script will prompt you to choose one."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Implement your changes"}),":"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"If you've generated a new rule, implement the rule logic in the generated rule file and add tests in the generated test file."}),"\n",(0,s.jsx)(n.li,{children:"For other changes, make your code changes and add or update tests as necessary."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Update documentation"}),": Update the README.md file to include documentation for your new rule or changes."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Run tests"}),": Ensure all tests pass."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"npm test\n"})}),"\n",(0,s.jsx)(n.p,{children:"or:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"yarn test\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Commit your changes"}),": Commit your changes with a clear and descriptive commit message."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:'git commit -m "Add new rule: your-rule-name"\n'})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Push to your fork"}),": Push your changes to your GitHub fork."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git push origin feature/your-feature-name\n"})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Create a Pull Request"}),": Go to the original ESLint Plugin Hub repository on GitHub and create a new Pull Request from your fork. Provide a clear description of your changes in the Pull Request."]}),"\n"]}),"\n"]})]})}function d(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>l,x:()=>o});var s=r(6540);const t={},i=s.createContext(t);function l(e){const n=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),s.createElement(i.Provider,{value:n},e.children)}}}]);