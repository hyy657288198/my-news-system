import React,{useEffect, useState} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TextArea from 'antd/lib/input/TextArea';

export default function NewsEditor(props) {
    useEffect(()=>{
        // html-===> draft, 
        const html = props.content
        if(html===undefined) return 
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
          const editorState = EditorState.createWithContent(contentState);
          setEditorState(editorState)
        }
    },[props.content])

    const [editorState, setEditorState] = useState("")
    return (
        <div>
            <Editor
                editorState={editorState}
                toolbarClassName="aaaaa"
                wrapperClassName="bbbbb"
                editorClassName="ccccc"
                onEditorStateChange={(editorState)=>setEditorState(editorState)}

                onBlur={()=>{
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />
        </div>
    )
}
