import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css"
import React, {Component} from "react";
import {FormGroup} from "reactstrap";

/**
 * React-Quill based component.
 * <p>WARNING: this component is supposed to represent a single policy's section
 * <p>props:
 * - content - HTML string (or any string) to show
 * - id - for the current section's index
 * - handler - callback which accepts **id** and changed **content**
 */
export default class PolicyEditor extends Component {
    constructor(props) {
        super(props);

        this.onEditorChange = this.onEditorChange.bind(this);

        const initialValue = (this.props.content) ? this.props.content : "";
        this.state = {
            editorValue: initialValue
        }
    }

    onEditorChange(editorState) {
        this.setState({
            editorValue: editorState
        });
        this.props.handler(this.props.id, editorState);
    };

    getModules() {
        const modules = {
            clipboard: {
                matchVisual: false,
            },
            toolbar: [
                [{'header': [1, 2, false]}],
                ['bold', 'italic'],
                [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                ['clean']
            ],
        };
        return modules;
    }

    getFormats() {
        const formats = [
            'header',
            'bold', 'italic',
            'list', 'bullet', 'indent'
        ];
        return formats;
    }

    getStyle() {
        const style = {
            height: "400px",
            paddingBottom: "42px",
        };
        return style;
    }

    render() {
        return (
            <FormGroup>
                <ReactQuill
                    style={this.getStyle()}
                    value={this.state.editorValue}
                    modules={this.getModules()}
                    formats={this.getFormats()}
                    onChange={this.onEditorChange}
                    matchVisual={false}
                />
            </FormGroup>
        );
    }
}
