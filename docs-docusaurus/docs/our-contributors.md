# Our Contributors

We want to extend our heartfelt gratitude to the contributors who have made `@mindfiredigital/eslint-plugin-hub` possible.

<!-- truncate -->

## Contributors List

import React from 'react';

export default function Contributors() {
const contributorsData = {
'anand-kumar': {
name: 'Anand Kumar',
title: 'Software Engineer @ Mindfire Solutions',
url: 'https://github.com/anandmindfire',
image_url: 'https://github.com/anandmindfire.png',
},
'lakin-mohapatra': {
name: 'Lakin Mohapatra',
title: 'Tech Lead @ Mindfire Solutions',
url: 'https://github.com/lakinmindfire',
image_url: 'https://github.com/lakinmindfire.png',
},
};

return (
<div>
<h1>Our Contributors</h1>
<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
{Object.entries(contributorsData).map(([key, contributor]) => (
<div key={key} style={{ display: 'flex', alignItems: 'center' }}>
<img
src={contributor.image_url}
alt={contributor.name}
style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '20px' }}
/>
<div>
<h3>{contributor.name}</h3>
<p>{contributor.title}</p>
<a href={contributor.url} target="_blank" rel="noopener noreferrer">
GitHub Profile
</a>
</div>
</div>
))}
</div>
</div>
);
}
