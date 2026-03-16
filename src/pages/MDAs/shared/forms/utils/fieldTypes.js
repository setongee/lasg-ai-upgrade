export const FIELD_TYPES = [
  { type: 'short_answer', label: 'Short Answer', icon: 'Aa' },
  { type: 'long_answer', label: 'Long Answer', icon: '¶' },
  { type: 'dropdown', label: 'Dropdown', icon: '▾' },
  { type: 'multi_select', label: 'Multi Select', icon: '☑' },
  { type: 'radio', label: 'Radio Buttons', icon: '◉' },
  { type: 'checkbox', label: 'Checkboxes', icon: '☐' },
  { type: 'file', label: 'File Upload', icon: '📎' },
];

export const hasOptions = (type) =>
  ['dropdown', 'multi_select', 'radio', 'checkbox'].includes(type);
