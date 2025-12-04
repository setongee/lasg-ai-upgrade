import React, {useState} from 'react'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';

export default function CMS_Editor() {

const [editorState, setEditorState] = useState(EditorState.createEmpty());


const onEditorStateChange = (editorState) => {

    setEditorState( editorState )

}

  return (

    <div>
        <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="toolbar-class"
        toolbar={{
            link: { inDropdown: false },
          }}
          
        />
        {/* <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
    </div>

  )

}
