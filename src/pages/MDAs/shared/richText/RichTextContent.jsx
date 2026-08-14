import 'quill/dist/quill.core.css';
import './RichTextContent.css';

// Renders HTML authored by the admin's Quill-based rich text editor (see
// shared/admin/components/text-editor/lasg_custom_editor.jsx). Quill's newer
// list markup (`<li data-list="ordered">`) only renders its numbering/bullets
// via Quill's own CSS, scoped under the `.ql-editor` class — without it,
// ordered/bullet lists silently lose their markers. Reusing Quill's real
// stylesheet here (rather than reimplementing list counters by hand)
// guarantees the public page matches what was authored in the editor.
const RichTextContent = ({ html, className = '' }) => {
  if (!html) return null;

  return (
    <div
      className={`ql-editor lasg-rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextContent;
