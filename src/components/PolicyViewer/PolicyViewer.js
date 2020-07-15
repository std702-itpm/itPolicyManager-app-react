import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"

/**
 * React-Quill based component.
 * <p>props:
 * - policyContent - string, HTML string for format
 */
export default class PolicyViewer extends React.Component {
    constructor(props) {
        super(props);

        const initialValue = (props.policyContent) ? props.policyContent : "";
        this.state = {
            editorValue: initialValue
        }
    }

    getModules() {
        return {
            clipboard: {
                matchVisual: false,
            },
            toolbar: false,
        };
    }

    // Defines the list of formats supported by the editor
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
            margin: "0 30px",
            textAlign: "right"
        };
        return style;
    }

    render() {
        return (
            <ReactQuill
                value={this.state.editorValue}
                style={this.getStyle()}
                modules={this.getModules()}
                formats={this.getFormats()}
                readOnly={true}
                matchVisual={false}
            />
        );
    }
}
