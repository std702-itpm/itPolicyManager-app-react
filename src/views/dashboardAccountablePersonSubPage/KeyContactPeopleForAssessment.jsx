import React, { Component } from 'react';
import Axios from 'axios';
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
    Input,
    CardFooter
} from 'reactstrap';

export default class KeyContactPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewers: [],
            users: [],
            isSelected: false,
            selectedUsers: []
        }
        this.api = new Api();
    }

    componentDidMount() {
        console.log(localStorage.getItem("reviewPolicyId"))

        this.api.fetchSubscribedPolicy(
            localStorage.getItem('reviewPolicyId')
        ).then(response => {
            this.setState({
                reviewers: response.data.reviewer_list
            })
            console.log(this.state.reviewers)
            this.state.reviewers.map(reviewer => {
                Axios.get("http://localhost:5000/user", {
                    params: {
                        _id: reviewer.reviewer_id,
                        companyId: ""
                    }
                }).then(response => {
                        this.state.users.push(response.data);
                        this.setState({ users: this.state.users })
                    })
                this.state.users.map((user, index) => {
                    console.log("User:" + user)

                })
            })
        })
    }

    renderKeyContacts() {
        const displayKeyContacts = keyContact => {
            if (keyContact.user_type !== "comp_initiator") {
                return (
                    <>
                        <tr>
                            <td key={keyContact._id + 0}>
                                {keyContact.fname + " " + keyContact.lname}</td>
                            <td key={keyContact._id + 1}>{keyContact.email}</td>
                            <td key={keyContact._id + 2}>{keyContact.position}</td>
                        </tr>
                    </>
                );
            }
        };

        return this.state.users.map(function (keyContact, keyContactIndex) {
            return displayKeyContacts(keyContact);
        });
    }

    sendAssessment() {
        if (this.state.users !== undefined) {
            this.state.users.map(user => {
                var data = {
                    userId: user._id,
                    email: user.email,
                    policyId: localStorage.getItem("reviewPolicyId")
                }
                Axios.post("http://localhost:5000/sendAssessmentToReviewers", data)
                    .then(response => {
                        if (response.data.status === "success") {
                            toast("Assessment is sent successfully!", {
                                type: "success",
                                position: toast.POSITION.TOP_CENTER,
                                onClose: () => {
                                    window.location.reload();
                                }
                            })
                        }
                    })
            })
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
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Position</th>
                                        </tr>
                                    </thead>
                                    <tbody>{this.renderKeyContacts()}</tbody>
                                </Table>
                            </CardBody>
                            <CardFooter>
                                <Button className="btn-round" color="success" style={{ float: "right" }} onClick={(e) => this.sendAssessment()}>
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