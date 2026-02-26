import { formatDate3 } from '../../../../../middleware/middleware';

export const templates = [
  {
    name: 'Medix',
    description: 'Clean, modern design for medical practices and healthcare providers',
    category: ['healthcare'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Fmedix.jpg?alt=media&token=25b29753-6089-404e-8715-32d795868301',
    preview_link: 'health',
    theme: 'health',
  },
  {
    name: 'Bytetec',
    description: 'Modern, responsive theme for tech startups and IT service providers',
    category: ['technology', 'general'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Fbytetec.jpg?alt=media&token=a2025ca6-6d9e-4c18-9626-7b84ce34463c',
    preview_link: 'theme1',
    theme: 'theme1',
  },
  {
    name: 'Eko Budget',
    description: 'Intuitive financial dashboard for budget tracking and expense management',
    category: ['finance', 'budget'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Feko-budget.jpg?alt=media&token=a0eff270-6c1d-4588-9397-6b26a517be54',
    preview_link: 'theme2',
    theme: 'theme2',
  },
  {
    name: 'Fintrac',
    description: 'Professional banking and financial services website template',
    category: ['finance'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Ffintrac.jpg?alt=media&token=f8adc42c-f984-482e-8b02-0dbf865458fd',
    preview_link: 'theme3',
    theme: 'theme3',
  },
  {
    name: 'Ledger',
    description: 'Elegant corporate finance and business consulting template',
    category: ['finance', 'business'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Fledger.jpg?alt=media&token=b3a608cb-8798-497f-ba6d-0d4cb06aa328',
    preview_link: 'theme4',
    theme: 'theme4',
  },
  {
    name: 'Nexus v1',
    description: 'Versatile multi-purpose template for various website needs',
    category: ['general'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://firebasestorage.googleapis.com/v0/b/lasg-a9f5c.appspot.com/o/template-library%2Fnexus.jpg?alt=media&token=c479b396-72f9-4ffe-8cdf-596e225aa4cd',
    preview_link: 'theme6',
    theme: 'theme6',
  },
];
