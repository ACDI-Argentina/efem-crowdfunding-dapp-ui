import React, { Component } from 'react';
import ReactQuill from 'react-quill';

class RichTextEditor extends Component {
    constructor(props) {
        super(props);
        this.modules = {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video']
            ],
        };
        this.formats = [
            'header',
            'bold', 'italic', 'underline',
            'list', 'bullet', 'indent',
            'link', 'image', 'video'
        ];
    }

    render() {
        const { value, placeholder, onChange } = this.props;
        return (
            <div className="text-editor">
                <ReactQuill theme="snow"
                    defaultValue={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    modules={this.modules}
                    formats={this.formats}>
                </ReactQuill>
            </div>
        );
    }
}

export default RichTextEditor;