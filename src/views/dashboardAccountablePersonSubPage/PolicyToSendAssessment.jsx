import React from "react";
import Api from "services/Api"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class policyToSendAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.tableDisplay = this.tableDisplay.bind(this);
    this.reviewButtonHandler = this.reviewButtonHandler.bind(this);
    this.tableDataDisplay = this.tableDataDisplay.bind(this);
    this.state = ({
      sub_policy: [],
      modal: false,
      reviewers: []
    });
    this.api = new Api();
  }

  componentDidMount() {
    localStorage.removeItem('reviewPolicy');
    console.log("TEST");

    this.api.fetchSubscribedPoliciesByCompanyId(
      localStorage.getItem("session_companyId")
    ).then(response => {
      // console.log("response", response);
      this.setState({
        sub_policy: response.data
      });
      console.log(this.state.sub_policy);
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal
    });
  };

  reviewButtonHandler(e, id) {
    localStorage.setItem('reviewPolicyId', id);
    localStorage.setItem('reviewPolicy', e.target.value)
    this.props.history.push("keyContactPeople-ForAssessment");
  }

  tableDataDisplay() {

    return this.state.sub_policy.map((policy, index) => {
      if (policy.status === "awareness") {
        return (
          <>
            <tr key={index}>
              <td key={policy.policy_name}>{policy.policy_name}</td>
              <td key={policy.status}>{policy.status}</td>
              <td key={policy.version}>{policy.version}</td>
              <td key={policy.policy_id + 0} className="text-center">
                <Button className="btn-round"
                  style={{ 'marginRight': '7px' }}
                  color="success"
                  value={policy.policy_name}
                  onClick={(e) => this.reviewButtonHandler(e, policy._id)}>
                  Send Assessment
                      </Button>
              </td>
            </tr>
          </>
        )
      } else {
        return (
          <p></p>
        );
      }
    })
  }

  tableDisplay() {
    return (
      <Table responsive>
        <thead>
          <tr>
            <th>Policy Name</th>
            <th>Status</th>
            <th>Version</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            this.tableDataDisplay()
          }
        </tbody>
      </Table>
    )
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Subscribed Policies</CardTitle>
                  <p className="card-category">
                    List of your subscribed policies and its status.
                  </p>
                </CardHeader>
                <CardBody>
                  {this.state.sub_policy.length !== 0 ? this.tableDisplay() : <p>
                    <span style={{ color: "red" }}>No Subscription yet!</span>
                    <br></br><br></br>
                    You can subscribed to any IT policy you need by taking the survey and purchasing suggested policy/ies.
                  </p>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default policyToSendAssessment;
