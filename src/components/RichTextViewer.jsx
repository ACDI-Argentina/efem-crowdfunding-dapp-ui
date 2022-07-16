import React, { Component } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';

class RichTextViewer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { value } = this.props;
        return (
            <div className="text-editor">
                <ReactQuill theme="bubble"
                    value={value}
                    readOnly={true}>
                </ReactQuill>
            </div>
        );
    }
}

export default RichTextViewer;