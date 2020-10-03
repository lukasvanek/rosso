import React from 'react';
import * as R from 'ramda';
import { useSelector, useDispatch } from 'react-redux'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import JSON5 from 'json5';

const CodeEditor = () => {

  const bid = useSelector(state => state.env.boxEditing);
  const block = useSelector((state) => bid ? state.layout[bid] : {});

  const dispatch = useDispatch();

  if (!bid || !block) return (<></>);

  const { state } = block;

  const onChange = (code) => {
    let parsed = null;
    try {
      parsed = JSON5.parse(code);
    } catch (e) {
      console.log('parse error');
    }
    if (parsed && !R.equals(state, parsed)) {
      dispatch.layout.setState([bid, [], parsed]);
    }
  }

  return (
    <AceEditor
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        opacity: 0.5,
        width: 400,
        height: 200
      }}
      placeholder="Placeholder Text"
      mode="javascript"
      theme="monokai"
      name="blah2"
      onChange={onChange}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={JSON5.stringify(state, null, 2)}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: false,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  )
}

export default CodeEditor;
