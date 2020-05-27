import React from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import Api from "services/Api"

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Input,
  Row,
  Col,
  Table,
} from "reactstrap";

toast.configure();

class ReviewPage extends React.Component {
  constructor(props) {
    super(props);

    this.renderDisplayReviewers = this.renderDisplayReviewers.bind(this);
    this.keyContactsCheckboxHandler = this.keyContactsCheckboxHandler.bind(this);
    this.startReviewButtonHandler = this.startReviewButtonHandler.bind(this);

    this.state = {
      isSelected: false,
      policyName: localStorage.getItem('reviewPolicy'),
      users: [],
      reviewers: [],
      singlePolicy: [],
      reviewerList: [],
      newUserList: [],
      reviewersForNotReviewedStatus: []
    };
    this.api = new Api();
  }

  componentDidMount() {

    Axios.get("http://localhost:5000/user", {
      params: { companyId: localStorage.getItem("session_companyId") }
    }).then(response => {
      this.setState({
        users: response.data
      });
    }).catch(function (error) {
      console.log(error);
    })

    this.api.fetchSubscribedPolicies(
      localStorage.getItem("session_companyId"),
      localStorage.getItem('reviewPolicyId')
    ).then(response => {
      let reviewerIdList;
      response.data.reviewer_list.forEach(reviewer => {
        reviewerIdList.push(reviewer.reviewer_id)
      })
      this.setState({
        singlePolicy: response.data,
        reviewers: response.data.reviewer_list,
        reviewerList: reviewerIdList
      })

    }).catch(function (error) {
      console.log(error);
    })
  }

  renderDisplayReviewers() {
    let newUserList = [];
    let newUsers = [];
    let users = this.state.users;
    var reviewers = [];
    if (this.state.reviewerList !== undefined) {
      reviewers = this.state.reviewerList;
    }
    users.forEach(user => {
      newUsers.push(user._id);
    })

    const displayReviewers = (keyContact) => {
      return newUsers.map(newUser => {
        if (keyContact.user_type === undefined && keyContact._id === newUser) {
          return (
            <tr key={keyContact._id}>
              <td><Input
                type="checkbox"
                value={keyContact._id}
                defaultChecked={this.state.isSelected}
                onClick={(e) => this.keyContactsCheckboxHandler(e)}
              />
              </td>
              <td>{keyContact.fname + " " + keyContact.lname}</td>
              <td>{keyContact.email}</td>
              <td>{keyContact.position}</td>
            </tr>
          );
        } else {
          return <tr></tr>;
        }
      })

    };

    return this.state.users.map(function (keyContact) {
      return displayReviewers(keyContact);
    });

  }

  keyContactsCheckboxHandler(e) {
    let reviewers = [];
    console.log(e.target.value)
    if (this.state.reviewerList !== undefined) {
      reviewers = this.state.reviewerList;
    }
    console.log("this.state.isSelected: " + this.state.isSelected);
    if (e.target.checked) {
      //this.setState({ isSelected: !this.state.isSelected });
      reviewers.push(e.target.value);
      console.log("Reviewers: " + reviewers)
    }
    else {
      for (let index = 0; index < reviewers.length; index++) {
        if (e.target.value === reviewers[index]) {
          reviewers = reviewers.splice(index, 1);
        }
      }
    }
    this.setState({
      reviewerList: reviewers
    });
    //for testing
    console.log("Testing" + this.state.reviewerList);
  }

  renderDisplayPolicyStatus() {
    let status;
    if (this.state.singlePolicy.status === "not reviewed") {
      status = "confirmation";
    } else if (this.state.singlePolicy.status === "confirmation") {
      status = "adoption";
    } else if (this.state.singlePolicy.status === "adoption") {
      status = "awareness";
    } else if (this.state.singlePolicy.status === "awareness") {
      status = "reporting";
    } else if (this.state.singlePolicy.status === "awareness") {
      status = "done";
    } else {
      status = this.state.singlePolicy.status;
    }
    console.log("status==>" + status);
    //this.setState({status:status});
    return (<span className="text-primary">{status}</span>)
  }

  startReviewButtonHandler(e) {
    let newReviewerList = [];
    let reviewer_list = [];
    var isPolicyBlocked = false;
    if (!(window.confirm("Do you still need to add more reviewers in future?"))) {
      isPolicyBlocked = true;
      toast("The Policy will be sent to the reviewer/s to start the review workflow.", {
        type: "success",
        position: toast.POSITION.TOP_CENTER,
        onClose: () => {
          this.props.history.push("subscribed-policies");
        }
      });
    }

    if (this.state.reviewerList !== undefined) {
      this.state.reviewerList.forEach(reviewer => {
        newReviewerList = {
          reviewer_id: reviewer,
          reviewed_date: null,
          email: "",
          review_status: false,
          review_reminder_email_sent: false,
          review_reminder_email_error: false,
          review_first_email_sent_time: new Date().toUTCString(),
        }
        reviewer_list.push(newReviewerList);
      })
    }

    e.preventDefault()
    const data = {
      isPolicyBlocked: isPolicyBlocked,
      policy_name: localStorage.getItem('reviewpolicy'),
      policy_id: localStorage.getItem('reviewPolicyId'),
      company_name: localStorage.getItem("session_name"),
      companyId: localStorage.getItem('session_companyId'),
      policyName: this.state.singlePolicy.name,
      status: this.state.singlePolicy.status,
      content: null,
      reviewerList: this.state.reviewerList,
      reviewer_list: reviewer_list
    };

    console.log("Data Reviewer List: " + data.policy_id)
    this.saveSubscribedPolicy(data);
  }

  saveSubscribedPolicy(data) {

    Axios.post('http://localhost:5000/updateSubscribedPolicy', data)
      .then(response => {
        if (response.data.status === "success") {
          toast("Saved successfully!", {
            type: "success",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              this.props.history.push("subscribed-policies");
            }
          });
        } else {
          toast("Something went wrong! Please try again", {
            type: "error",
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">
                    <span> Choose <strong> Key Contacts </strong> to start </span>
                    <span className="text-primary">{this.state.policyName}</span><br></br>
                    <span><strong>{this.renderDisplayPolicyStatus()} review.</strong></span>
                  </CardTitle>
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
                    <tbody>
                      {this.renderDisplayReviewers()}
                    </tbody>
                  </Table>
                  <Button
                    className="btn-round"
                    color="success"
                    style={{ float: "right" }}
                    onClick={this.startReviewButtonHandler}
                  >
                    Start Review
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default ReviewPage;




