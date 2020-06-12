import React from "react";
import Axios from 'configs/AxiosConfig';
import { toast } from "react-toastify";
import Api from "services/Api"

// reactstrap components
import {
    Col,
    Form,
    FormGroup,
    InputGroup,
    Row,
    Input,
    Container,
    Button
} from "reactstrap";

import NavbarPlain from "components/Navbars/navbarPlain.js";
import DemoFooter from "components/Footers/DemoFooter.js";

toast.configure();

/**
 * Path: /review-policy/:companyId/:subscribedPolicyId/:userId
 */
class Policies extends React.Component {
    constructor(props) {
        super(props);
        this.commentHandler = this.commentHandler.bind(this);
        this.rejectHandler = this.rejectHandler.bind(this);
        this.acceptHandler = this.acceptHandler.bind(this);
        //this.getDateReviewed = this.getDateReviewed.bind(this);
        this.commentBtnHandler = this.commentBtnHandler.bind(this);
        this.state = ({
            policy: [],
            company: [],
            commentInput: "",
            index: ""
        });
        this.api = new Api();
    }

    componentDidMount() {
        if (this.props.match.params) {
            //TODO-Get company data
            Axios.get("/clientReviewer", {
                params: { subscribedPolicyId: this.props.match.params.subscribedPolicyId }
            }).then(response => {
                this.setState({
                    policy: response.data
                })
            }).catch(function (error) {
                console.log(error);
            });

        }
    }

    //handles comment from reviewers
    commentHandler(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    prepareRequestData(isAccepted) {
        return {
            policyId: this.props.match.params.subscribedPolicyId,
            companyId: this.props.match.params.companyId,
            userId: this.props.match.params.userId,
            isAccepted: isAccepted,
            index: this.state.index,
            feedback: this.state.commentInput
        }
    }

    //if reviewer reject the policy
    rejectHandler() {
        this.api.submitPolicyReview(this.prepareRequestData(false)).then(response => {
            console.log(response);
            toast("This policy has been rejected after review." +
                "Initiator will received a notification about it.", {
                type: "success",
                position: toast.POSITION.TOP_CENTER,
                onClose: () => {
                    window.location.href = '/landing-page'
                }
            });
        }).catch(error => {
            console.log(error);

            toast("There is an error while sending your review feedback.", {
                type: "error",
                position: toast.POSITION.TOP_CENTER,
            });
        });
    }

    //saves in the database if reviewer accept the policy
    acceptHandler() {
        this.api.submitPolicyReview(this.prepareRequestData(true)).then(response => {
            toast("This policy has been accepted after review." +
                "Initiator will received a notification about it.", {
                type: "success",
                position: toast.POSITION.TOP_CENTER,
                onClose: () => {
                    window.location.href = '/landing-page'
                }
            });
        }).catch(error => {
            console.log(error);

            toast("There is an error while sending your review feedback.", {
                type: "error",
                position: toast.POSITION.TOP_CENTER,
            });
        });
    }

    commentBtnHandler() {
        if (!this.state.commentInput) {
            toast("The comment box is empty, Please write your comment before sending a comment.", {
                type: "error",
                position: toast.POSITION.TOP_CENTER,
            });
            return;
        }
        this.api.submitPolicyComment(this.prepareRequestData(false)).then(response => {
            toast("Your review comment has been sent." +
                " Initiator will received a notification about your review comment.", {
                type: "success",
                position: toast.POSITION.TOP_CENTER,
                onClose: () => {
                    window.location.href = '/landing-page'
                }
            });
        }).catch(error => {
            console.log(error);

            toast("There is an error while sending your review feedback.", {
                type: "error",
                position: toast.POSITION.TOP_CENTER,
            });
        });
    }

    render() {
        const policyContent = this.state.policy.content || []
        return (
            <>
                <NavbarPlain />
                <div style={{
                    backgroundColor: "ghostwhite",
                    color: "dark grey"
                }}
                    className="section landing-section">
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto" md="12">
                                <h1 className="text-center">{this.state.policy.name}</h1>
                                {policyContent.map((content, index) => (
                                    <>
                                        <p key={index}>{content}</p><br></br>
                                    </>
                                ))}
                            </Col>
                        </Row>
                        <Form>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <label>
                                            <h6>Review Comment</h6>
                                        </label>
                                        <InputGroup className="form-group-no-border">
                                            <Input
                                                value={this.state.commentInput}
                                                name="commentInput"
                                                type="textarea"
                                                rows="8"
                                                onChange={this.commentHandler}
                                            />

                                        </InputGroup>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <span style={{ color: "red" }}>Note: </span>
                                    <span style={{ fontSize: "12px" }}> Click Send Comment if you have comment.
                                    Accept if Policy needs no changed and Reject if Policy can't be published.
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        className="btn-round"
                                        color="danger"
                                        style={{ float: "right" }}
                                        onClick={this.rejectHandler}>
                                        Reject
                                    </Button>
                                    <Button
                                        className="btn-round"
                                        color="success"
                                        style={{ float: "right" }}
                                        onClick={this.acceptHandler} >
                                        Accept
                                    </Button>
                                    <Button
                                        className="btn-round"
                                        color="info"
                                        style={{ float: "right" }}
                                        onClick={this.commentBtnHandler}>
                                        Send Comment
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Container>
                </div>
                <DemoFooter />
            </>
        );
    }
}
export default Policies;