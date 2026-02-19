import { Editor } from 'primereact/editor';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import { useEffect, useState } from 'react';
import './editor.scss';

export default function LASGEditor({ dataText, value, height, padding }) {
  const [text, setText] = useState('');

  const renderedHtml = (e) => {
    setText(e);
    dataText(e);
  };

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <div className="card">
      <Editor
        value={text}
        onTextChange={(e) => renderedHtml(e.htmlValue)}
        style={{
          height: `${height ? height : '550px'}`,
          //   border: 'thin solid #eee',
          border: 'none',
          backgroundColor: '#fff',
          padding: `${padding ? padding : '20px'}`,
          fontSize: '15px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '1px 3px 20px rgba(0, 0, 0, 0.02)',
        }}
        placeholder="... Type your text here"
      />
    </div>
  );
}
