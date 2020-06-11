import React from "react";
import { Link } from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import Api from "services/Api"

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    Row,
    Col,
} from "reactstrap";


class ReviewPage extends React.Component {
    constructor(props) {
        super(props);
        this.renderPolicyDetails = this.renderPolicyDetails.bind(this);
        this.renderReviewDetails = this.renderReviewDetails.bind(this);
        this.displayStartWorkflowBtn = this.displayStartWorkflowBtn.bind(this);
        this.getPolicyData = this.getPolicyData.bind(this);
        this.state = ({
            policyName: localStorage.getItem('reviewPolicy'),
            companyDetails: [],
            reviewers: [],
            status: "",
            reviewer_list: [],
            reviewersData: []
        });
        this.api = new Api();
    }

    componentDidMount() {
        Axios.get("/company", {
            params: {
                _id: localStorage.getItem("session_name"),
                type: "company"
            }
        }).then(response => {
            this.setState({
                companyDetails: response.data
            });

        }).catch(function (error) {
            console.log(error);
        });

        this.api.fetchSubscribedPolicies(
            localStorage.getItem("session_companyId"),
            localStorage.getItem('reviewPolicyId')
        ).then(response => {
            this.setState({
                reviewer_list: response.data.reviewer_list,
                status: response.data.status
            })
            this.state.reviewer_list.forEach(reviewer => {
                this.state.reviewers.push(reviewer.reviewer_id)
                console.log("Reviewer_list: " + this.state.reviewers)
                this.getPolicyData();
            })
        }).catch(function (error) {
            console.log(error);
        });
    }

    getPolicyData() {

        let requests = this.state.reviewers.map(reviewer =>
            Axios.get("/company", {
                params: {
                    _id: reviewer,
                    type: "user"
                }
            })
        );
        Promise.all(requests).then(reviewerData => {
            this.setState({ reviewersData: reviewerData.map(x => x.data) });
        });
        console.log("reviewersData:" + this.state.reviewersData)
    }

    renderReviewDetails() {
        return this.state.reviewersData.map(user => {
            console.log("this.state.reviewers ===>" + user)
            return (
                <span key={user._id}><strong> - {
                    user.fname + " " + user.lname}</strong>
                </span>
            )
        })
    }

    displayStartWorkflowBtn() {
        if (this.state.reviewers.length === 0 &&
            (this.state.status === "done" || this.state.status === "awareness" || this.state.status === "reporting")) {
            return (
                <><br></br>
                    <span style={{ color: "red" }}>
                        <strong>cannot start workflow for this policy</strong>
                    </span></>
            );
        } else if (this.state.reviewers.length === 0 &&
            (this.state.status !== "done" || this.state.status !== "awareness" ||
                this.state.status !== "reporting")) {
            return (
                <li>
                    <Button
                        className="btn-round"
                        color="primary"
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                        to={{ pathname: "subscribed-policy-action-start-workflow" }}
                        title="to review page"
                        tag={Link}>
                        Start Review Workflow
                    </Button>
                </li>
            );
        } else if (this.state.status === "not reviewed" || this.state.status === "confirmation") {
            return (
                <li>
                    <Button
                        className="btn-round"
                        color="primary"
                        style={{ fontSize: "16px", fontWeight: "bold" }}
                        to={{ pathname: "subscribed-policy-action-start-workflow" }}
                        title="to review page"
                        tag={Link}>
                        Add more reviewers
                    </Button>
                </li>
            );
        }
    }

    renderPolicyDetails() {
        if (this.state.reviewers.length !== 0) {
            return (
                <>
                    <p className="text-center">
                        Review is currently on-going for the list of reviewers below:</p>
                    <br></br>
                    <ul>
                        {this.renderReviewDetails()}
                    </ul>
                </>
            )
        } else {//review done/not yet started
            if (this.state.status === "done" || this.state.status === "awareness"
                || this.state.status === "reporting") {
                return (
                    <>
                        <p className="text-center">
                            This policy has finished it's review</p>
                    </>
                )
            } else {
                return (
                    <p className="text-center danger" style={{ color: "red", fontStyle: "italic" }}>
                        No workflow has started yet for the current stage of this policy. </p>
                )
            }
        }
    }

    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col className="ml-auto mr-auto" md="10">
                            <Card className="card-upgrade" style={{ transform: "none" }}>
                                <CardHeader className="text-center">
                                    <CardTitle tag="h4">{this.state.policyName}</CardTitle>
                                    <p>See details and choose an action below how to proceed.</p>
                                </CardHeader>
                                <CardBody>
                                    <blockquote className="blockquote">
                                        {this.renderPolicyDetails()}
                                    </blockquote>
                                    <ul>
                                        <li>
                                            <Button
                                                className="btn-round"
                                                color="info"
                                                style={{ fontSize: "16px", fontWeight: "bold" }}
                                                to={{
                                                    pathname: "DisplayPolicy"
                                                }}
                                                title="to Policy display page"
                                                tag={Link}>
                                                View {this.state.policyName}
                                            </Button>
                                        </li>
                                        {this.displayStartWorkflowBtn()}
                                    </ul>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }

}
export default ReviewPage;
