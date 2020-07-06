import React from "react";
import { Link } from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import Api from "services/Api";

// reactstrap components
import {
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class MatchedPolicies extends React.Component {
  constructor(props) {
    super(props);

    this.api = new Api();

    this.policy = this.policy.bind(this);
    this.subscribeBtn = this.subscribeBtn.bind(this);
    this.subscribeBtnForMatchedPolicy = this.subscribeBtnForMatchedPolicy.bind(this);
    this.checkboxHandler = this.checkboxHandler.bind(this);
    this.getSubscribedPolicies = this.getSubscribedPolicies.bind(this);
    this.renderSubscriptionStatus = this.renderSubscriptionStatus.bind(this);

    this.state = {
      availablePolicies: [],  // Policies existing in the system
      subscribedPolicies: [], // Policies the company has already subscribed to
      matchedPolicies: [],
      suggestedPolicies: [],
    };
  }

  componentDidMount() {
    localStorage.removeItem('subscribedPolicies');

    this.getAvailablePolicies();
    this.getSubscribedPolicies();

    Axios.get("/company", {
      params: { _id: localStorage.getItem("session_name"), type: "company" }
    })
      .then(response => {
        if (response.data.match_policy !== 0) {
          this.setState({
            matchedPolicies: response.data.match_policy,
          });
          this.getMatchedPolicy();
        }
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  getAvailablePolicies() {
    this.api.fetchAvailablePolicies()
        .then(res => {
          this.setState({availablePolicies: res.data});
        })
        .catch(err => {
          console.log("Error");
          console.log(err);
        });
  }

  getSubscribedPolicies() {
    this.api.fetchSubscribedPoliciesByCompanyId(localStorage.session_companyId)
        .then(res => {
          this.setState({subscribedPolicies: res.data});
        })
        .catch(err => {
          console.log("Error");
          console.log(err);
        });
  }

  /*To display the list of policies*/
  displayPolicies() {
      return this.state.availablePolicies.map((policy, index) => {
          return (
            <tr key={index}>
              <td>
                <label>
                  {this.renderSubscriptionStatus(policy)}
                  <a href={"PolicyDashboardView/" + policy._id}
                     style={{ color: "blue" }}
                     target="_blank" rel="noopener noreferrer" >
                    {policy.policy_name}
                  </a>
                </label>
              </td>
            </tr>
          )
      });
  }

  renderSubscriptionStatus(policy) {
    const isSubscribed = this.state.subscribedPolicies.some(e => e.policy_id === policy._id);
    let checkbox;
    if (isSubscribed) {

      checkbox = (
          <Input
              key={policy._id + 2}
              type="checkbox"
              checked="true"
              disabled
              value={policy._id}
          />
      );

    } else {

      checkbox = (
          <Input
              key={policy._id + 2}
              type="checkbox"
              value={policy._id}
              onClick={this.checkboxHandler}
          />
      );

    }
    return checkbox;
  }

  /*To get the matched policies from the survey taken*/
  getMatchedPolicy() {
    let requests = this.state.matchedPolicies.map(matchedPolicy =>
      Axios.get("/getOnePolicy/" + matchedPolicy)
    );
    Promise.all(requests).then(policyData => {
      this.setState({ suggestedPolicies/*policies*/: policyData.map(x => x.data) });
    });
  }

  /*Checkbox for suggested policies*/
  checkboxHandler(e) {
    let policyPurchase = this.state.subscribedPolicies;
    // console.log("his.state.isSelected: " + this.state.isSelected);
    if (e.target.checked) {
      policyPurchase.push(e.target.value);
    } else {
      // console.log("policyPurchase: " + policyPurchase);
      for (let index = 0; index < policyPurchase.length; index++) {
        if (e.target.value === policyPurchase[index]) {
          policyPurchase = policyPurchase.splice(index, 1);
        }
      }
    }
    this.setState = {
      subscribedPolicies: policyPurchase
    };
    localStorage.setItem('subscribedPolicies', this.state.subscribedPolicies)
  }


  /**
   * Policy method:
   * if there are no suggested policies. user should take a survey, 
   * upon completion the suggested policies should show.
   */

  policy() {

    // show take a survey link if there is no suggested policy
    //if not it wont direct to purchase 

    if (this.state.suggestedPolicies.length === 0) {
      //Show message to user for debugging
      //alert("Hi");
      return (
        <>
          {/* <p className="text-center">
        You don't have any match Policies available</p> */}
          <p className="text-center">
            You can <a href="take-survey" style={{ color: "blue" }}>
              TAKE A SURVEY</a> to get suggested policies or
            choose from the list of available policies above.
        </p>
          {/* work on the link and data */}
        </>
      )
    }
    else if (this.state.suggestedPolicies.length > 0) {
      //Return map of suggested policies with policy, index
      return this.state.suggestedPolicies/*policies*/.map((policy, index) => {
        return (
          <>
            <tbody>
              <tr>
                <td key={index}>
                  <label>
                    <Input
                      key={policy._id + 2}
                      type="checkbox"
                      value={policy._id}
                      defaultChecked={this.state.isSelected}
                      onClick={this.checkboxHandler}
                    />
                    {policy.policy_name}
                  </label>
                </td>
              </tr>
            </tbody>
          </>
        );
      });
    }
  }

  /*Subscribe button for suggested policies*/
  subscribeBtnForMatchedPolicy() {
    if (this.state.suggestedPolicies.length !== 0) {
      return (
        <Button
          className="btn-round"
          color="success"
          style={{ float: "right" }}
          to={{
            pathname: "/subscription-payment",
            state: {
              test: 'testing',
            }
          }}
          title="to Payment Page"
          tag={Link}
        >

          <tfooter>  Subscribe </tfooter>
        </Button>


      )
    }
  }

  /*Subscribe button for list of policies*/
  subscribeBtn() {

    if (this.state.availablePolicies.length !== 0) {

      return (
        <Button
          className="btn-round"
          color="success"
          style={{ float: "right" }}
          to={{
            pathname: "/subscription-payment",
            state: {
              test: 'testing',
            }
          }}
          title="to Payment Page"
          tag={Link}
        >
          Subscribe
        </Button>
      )
    }
  }


  /*To display list policies and suggested policies*/
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">List of Available Policies</CardTitle>

                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Policy Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.displayPolicies()}
                    </tbody>
                    {this.subscribeBtn()}
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Survey Result</CardTitle>
                  <p className="card-category">
                    List of suggested policies based on your survey result.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Policy Name</th>
                      </tr>
                    </thead>
                    {/* <tbody>{this.displaySuggestedPolicies()}</tbody> */}
                    {this.policy()}
                    {this.subscribeBtnForMatchedPolicy()}
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </div>
      </>
    );
  }
}

export default MatchedPolicies;
