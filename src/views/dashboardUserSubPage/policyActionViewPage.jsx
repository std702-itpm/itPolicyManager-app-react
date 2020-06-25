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

/**
 * Path: /subscribed-policy-action
 */
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
            status: "",
            reviewer_list: [], // List of reviewers
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
            //Get reviewer detail from Users collection
            this.getPolicyData();
        }).catch(function (error) {
            console.log(error);
        });
    }

    getPolicyData() {
        let requests = this.state.reviewer_list.map(reviewer =>
            Axios.get("/company", {
                params: {
                    _id: reviewer.reviewer_id,
                    type: "user"
                }
            })
        );
        Promise.all(requests).then(reviewerDatas => {
            this.setState({ reviewersData: reviewerDatas.map(reviewer => reviewer.data) });
        });
    }

    renderReviewDetails() {
        return this.state.reviewersData.map(user => {
            return (
                <li key={user._id}>
                    <strong>{user.fname + " " + user.lname}</strong>
                </li>
            )
        })
    }

    displayStartWorkflowBtn() {
        if (this.state.status === "not reviewed"
            || this.state.status === "confirmation"
            || this.state.status === "adoption") {
            if (this.state.reviewer_list.length) {
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
            } else {
                return (
                    <li>
                        <Button
                            className="btn-round"
                            color="primary"
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                            to={{ pathname: "subscribed-policy-action-start-workflow" }}
                            title="to review page"
                            tag={Link}>
                            Start the review workflow
                        </Button>
                    </li>
                );
            }
        }
    }

    renderPolicyDetails() {

        if (this.state.status === "awareness") {
            return (
                <>
                    <p className="text-center">
                        This policy has finished it's review</p>
                </>
            )
        }
        if (this.state.status === "not reviewed"
            || this.state.status === "confirmation"
            || this.state.status === "adoption") {
            if (this.state.reviewer_list.length) {
                return (
                    <>
                        <p className="text-center">
                            Review is currently on-going for the list of reviewers below: 
                        </p>
                        <br></br>
                        <ul style={{listStyleType:"none"}}>
                            {this.renderReviewDetails()}
                        </ul>
                    </>
                )
            } else {//review done/not yet started
                return (
                    <p className="text-center danger" style={{ color: "red", fontStyle: "italic" }}>
                        No workflow has started yet for the current stage of this policy.
                    </p>
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
