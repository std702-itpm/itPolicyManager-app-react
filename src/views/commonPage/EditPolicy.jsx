import React, {Component} from "react";
import {Link} from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import {toast} from "react-toastify";

//reactstrap components
import {
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
} from "reactstrap";

export default class EditPolicy extends Component {
    constructor(props) {
        super(props);

        this.getPolicyById = this.getPolicyById.bind(this);
        this.changePolicyName = this.changePolicyName.bind(this);
        this.editPolicySection = this.editPolicySection.bind(this);
        this.addSection = this.addSection.bind(this);
        this.handleSaveContent = this.handleSaveContent.bind(this);

        this.state = {
            // This empty string makes policy's sections displaying more consistent,
            // and simplifies the addition new sections process
            contents: [""],

            policy: [],
            updatedContent: [],
            policyName: "",
            policyId: ""
        };
    }

    componentDidMount() {
        if (this.props.policyId) {
            this.getPolicyById(this.props.policyId);
        }
    }

    getPolicyById(policyId) {
        // If policy's ID has been passed in,
        // user gets the policy from the database by ID
        Axios.get("/getOnePolicy/" + policyId)
            .then(response => {
                console.log(response)
                this.setState({
                    policy: response.data,
                    contents: response.data.content.length > 0 ? response.data.content : [""],
                    policyName: response.data.policy_name,
                    policyId: response.data._id
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //handle save button
    handleSaveContent(e) {
        e.preventDefault();
        const updatedContent = {
            _id: this.state.policyId,
            policyName: this.state.policyName,
            content: this.state.contents
        };

        Axios.put("/edit-policy", updatedContent)
            .then(res => {
                toast("Updated successfully", {
                    type: "success",
                    position: toast.POSITION.TOP_CENTER,
                    onClose: () => {
                        window.location.href = 'policies'
                    }
                });
            })
            .catch(err => {
                // Right here the error handling should be
                toast("Unsuccessful save. Something went wrong, Try again", {
                    type: "error",
                    position: toast.POSITION.TOP_CENTER,
                });
            });
    }

    //Input changes handler
    changePolicyName(e) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({[name]: value});
    }

    //get contents for policy
    editPolicySection(e) {
        let contentBuffer = this.state.contents;
        contentBuffer[e.target.id] = e.target.value;
        this.setState({contents: contentBuffer});
    }

    addSection() {
        let content_temp = this.state.contents;
        content_temp.push("");
        this.setState({contents: content_temp});
    }

    render() {
        return (
            <div className="content" id="policy">
                <Row>
                    <Col className="ml-auto mr-auto" md="10">
                        <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
                        <Form className="edit-profile-form" id="content">
                            <FormGroup>
                                <InputGroup>
                                    <label><h6>Policy Name: </h6></label>
                                    <Input className="form-group"
                                           value={this.state.policyName}
                                           type="text"
                                           name="policyName"
                                           onChange={this.changePolicyName}/>
                                </InputGroup>
                            </FormGroup>
                            <PolicyContent
                                content={this.state.contents}
                                handler={this.editPolicySection}
                            />
                            <Button outline
                                    color="primary"
                                    onClick={this.addSection}
                                    className="btn-round">
                                Add Content
                            </Button>
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
                                Details
                            </Button>
                        </Form>
                        {/* <div id="renderPDF" >
                           <p style={{fontFamily: 'Verdana', fontSize: 12}}>{localStorage.getItem("session_name")}</p>
                           <p style={{fontFamily: 'Verdana', fontSize: 12}}>{this.getDate()}</p>
                           <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
                           {this.renderPDF()}
                         </div> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

/**
 * Represents whole content of a policy
 */
function PolicyContent(props) {
    const content = props.content;
    let sectionElements = [];
    let id = 0;

    sectionElements = content.map((section) =>
        <PolicySection content={section} handler={props.handler} id={id++}/>
    );

    return (
        <>
            {sectionElements}
        </>
    );
}

/**
 * Represents one section of a policy
 */
function PolicySection(props) {
    return (
        <FormGroup>
            <InputGroup className="form-group-no-border">
                <Input
                    type="textarea"
                    rows="12"
                    id={props.id}
                    value={props.content}
                    onChange={props.handler}
                />
            </InputGroup>
        </FormGroup>
    );
}
