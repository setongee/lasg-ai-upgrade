import { formatDate3 } from '../../../../../../../middleware/middleware';

export const templates = [
  {
    name: 'Medix',
    description: 'Clean, modern design for medical practices and healthcare providers',
    category: ['healthcare'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668069/templates/medix_qfb4kl.jpg',
    preview_link: 'health',
    theme: 'health',
  },
  {
    name: 'Bytetec',
    description: 'Modern, responsive theme for tech startups and IT service providers',
    category: ['technology', 'general'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668070/templates/bytetec_rxdq5w.jpg',
    preview_link: 'mist',
    theme: 'mist',
  },
  {
    name: 'Eko Budget',
    description: 'Intuitive financial dashboard for budget tracking and expense management',
    category: ['finance', 'budget'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668069/templates/eko-budget_mez2vl.jpg',
    preview_link: 'mepb',
    theme: 'mepb',
  },
  {
    name: 'Fintrac',
    description: 'Professional banking and financial services website template',
    category: ['finance'],
    createdAt: formatDate3(new Date().toISOString()),
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668069/templates/fintrac_hfmxam.jpg',
    preview_link: 'finance',
    theme: 'mof',
  },
  {
    name: 'Transit',
    description: 'Bold, service-forward theme for transport and mobility agencies',
    category: ['transport', 'general'],
    createdAt: formatDate3(new Date().toISOString()),
    // TODO: swap for a real screenshot of the mot theme once available
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668069/templates/nexus_dkkfrw.jpg',
    preview_link: 'mot',
    theme: 'mot',
  },
  {
    name: 'Treasury',
    description: 'Structured, document-forward theme for treasury and revenue offices',
    category: ['finance'],
    createdAt: formatDate3(new Date().toISOString()),
    // TODO: swap for a real screenshot of the sto theme once available
    thumbnail:
      'https://res.cloudinary.com/dirmxkznt/image/upload/v1773668069/templates/ledger_gq9ze2.jpg',
    preview_link: 'sto',
    theme: 'sto',
  },
];
