import React, { Component } from 'react';
import Axios from 'configs/AxiosConfig';
import { toast } from 'react-toastify';
import Api from "services/Api"

import {
    Row,
    Card,
    Col,
    CardHeader,
    CardTitle,
    CardBody,
    Table,
    Button,
    CardFooter,
    Input
} from 'reactstrap';

export default class KeyContactPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selectedUsers: [],
            reviewerList: []
        }
        this.api = new Api();
    }

    componentDidMount() {

        this.api.fetchUserByCompanyId(
            localStorage.getItem("session_companyId")
        ).then(response => {
            this.setState({
                users: response.data
            });
        }).catch(function (error) {
            console.log(error);
        })
    }

    keyContactsCheckboxHandler(e, user) {
        let reviewers = this.state.reviewerList;

        if (e.target.checked) {
            reviewers.push(user);
        } else {
            const index = reviewers.map(reviewer => reviewer._id).indexOf(user._id)
            if (index > -1) {
                reviewers.splice(index, 1)
            }
        }
        console.log(reviewers);

        this.setState({
            reviewerList: reviewers
        });
    }

    renderKeyContacts() {
        var reviewerIdList = this.state.reviewerList;

        const renderReviewers = (keyContact) => {
            let wasSelectedReviewer = reviewerIdList.find(reviewerId => reviewerId === keyContact._id);
            if (keyContact.user_type === undefined) {
                return (
                    <tr key={keyContact._id + ""}>
                        <td><Input type="checkbox" value={keyContact._id}
                            defaultChecked={wasSelectedReviewer}
                            onClick={(e) => this.keyContactsCheckboxHandler(e, keyContact)} />
                        </td>
                        <td>{keyContact.fname + " " + keyContact.lname}</td>
                        <td>{keyContact.email}</td>
                        <td>{keyContact.position}</td>
                    </tr>
                );
            } else {
                return <></>;
            }
        }
        return this.state.users.map(keyContact => renderReviewers(keyContact));
    }

    sendAssessment() {
        if (this.state.reviewerList.length) {
            Axios.post("/sendAssessmentToReviewers", {
                selectedUsers: this.state.reviewerList,
                policyId: localStorage.getItem("reviewPolicyId")
            }).then(response => {
                if (response.data.status === "success") {
                    toast(response.data.message, {
                        type: "success",
                        position: toast.POSITION.TOP_CENTER,
                        onClose: () => {
                            this.props.history.push("sendassessment");
                        }
                    })
                }
            })
        } else {
            alert("Please select at least one staff to send an assessment.")
        }

    }

    render() {
        return (
            <div className="content">
                <Row>
                    <Col className="ml-auto mr-auto" md="10">
                        <Card className="card-upgrade" style={{ transform: "none" }}>
                            <CardHeader className="text-center">
                                <CardTitle tag="h4">Key Contact people</CardTitle>
                                <p className="card-category">List of key contact people will get assessment link.</p>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Position</th>
                                        </tr>
                                    </thead>
                                    <tbody>{this.renderKeyContacts()}</tbody>
                                </Table>
                            </CardBody>
                            <CardFooter>
                                <Button className="btn-round" color="success" style={{ float: "right" }}
                                    onClick={(e) => this.sendAssessment()}>
                                    Send assessment
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>

            </div>
        );
    }
}