import React, {Component} from "react";
import {Link} from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import {toast} from "react-toastify";
import PolicyEditor from "components/PolicyEditor/PolicyEditor";

import {
    Button,
    Row,
    Col,
    Form,
} from "reactstrap";

export default class DisplayPolicyTest extends Component {
    constructor(props) {
        super(props);
        this.handleSaveContent = this.handleSaveContent.bind(this);
        this.saveSubscribedPolicy = this.saveSubscribedPolicy.bind(this);
        this.updatePolicySection = this.updatePolicySection.bind(this);

        this.state = {
            contents: [],
            policy: [],
        };
    }

    componentDidMount() {
        Axios.get("/reviewPolicy", {
            params: {
                company_name: localStorage.getItem("session_name"),
                policy_name: localStorage.getItem('reviewPolicy')
            }
        })
            .then(response => {
                console.log("response:")
                console.log(response)
                this.setState({
                    policy: response.data.singlePolicy,
                    contents: response.data.singlePolicy.content,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //Add data to Subscribed Policy Table
    saveSubscribedPolicy(updatedContent) {
        Axios.post('/updateSubscribedPolicy', updatedContent)
            .then(response => {
                if (response.data.status === "success") {
                    toast("Saved successfully!", {
                        type: "success",
                        position: toast.position.TOP_CENTER,
                        onClose: () => {
                            window.location.href = 'DisplayPolicyTest';
                        }
                    });
                }
            })
    }

    //handle save button
    handleSaveContent(e) {
        e.preventDefault();
        const updatedContent = {
            updatedcontent: this.state.contents,
            companyId: localStorage.getItem("session_companyId"),
            company_name: localStorage.getItem("session_name"),
            policy_name: localStorage.getItem('reviewPolicy'),
            policy_id: localStorage.getItem('reviewPolicyId')
        };
        this.saveSubscribedPolicy(updatedContent);
    }

    /**
     * Update policy's content
     * @param editorId - represents section's index
     * @param sectionContent - new content of a section
     */
    updatePolicySection(editorId, sectionContent) {
        let contentBuffer = this.state.contents;
        contentBuffer[editorId] = sectionContent;
        this.setState({contents: contentBuffer});
    }

    content() {
        return this.state.contents.map((content, index) => {
            console.log("Index: " + index);
            return (
                <PolicyEditor content={content} id={index} handler={this.updatePolicySection} />
            );
        });
    }

    render() {
        return (
            <>
                <div className="content" id="policy">
                    <Row>
                        <Col className="ml-auto mr-auto" md="10">
                            <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
                            <Form className="edit-profile-form" id="content">
                                {this.content()}
                                <Button className="btn-round"
                                        color="success"
                                        style={{float: "right"}}
                                        type="submit"
                                        onClick={this.handleSaveContent}>
                                    Save
                                </Button>
                                <Button className="btn-round"
                                        color="info"
                                        style={{float: "center"}}
                                        to={{
                                            pathname: "printPreview"
                                        }}
                                        title="to print preview page"
                                        tag={Link}>
                                    Preview
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}
