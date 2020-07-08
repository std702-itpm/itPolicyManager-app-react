import React from "react";
import Axios from 'configs/AxiosConfig';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Api from "services/Api"

// reactstrap components
import {
  Row,
  Col,
  Input,
  InputGroup,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Jumbotron
} from "reactstrap";

let checkedAnswer;
let isAnswerCorrect = [];
let score = 0;

class Assessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderLoginPage = this.renderLoginPage.bind(this);
    this.subscribedPolicyId = "";
    this.state = {
      isLoggedIn: false,
      assessmentList: [],
      checkedAnswer: "",
      policies: [],
      currentPolicy: [],
      loginEmail: ""
    };
    this.api = new Api();
  }

  componentDidMount() {
    this.subscribedPolicyId = this.props.match.params.subscribedPolicyId;
    this.api.fetchSubscribedPolicy(this.subscribedPolicyId)
      .then(response => {
        this.setState({
          currentPolicy: response.data,
          assessmentList: response.data.assessments
        });
      }).catch(function (error) {
        console.log(error);
      });

  }
  onSubmit() {
    // TODO: Fix this logic
    let totalScore = 0;
    let maxScore = this.state.assessmentList.length;
    this.state.assessmentList.forEach(assessment => {
      if (!assessment.selectedOption) {
        alert("Please answer every questions in the assessment.")
        throw "Please complete every questions";
      }
      if (assessment.correct_answer === assessment.selectedOption) {
        totalScore++
      }
    })
    if (totalScore < maxScore) {
      toast("You've scored " + totalScore + " out of " + maxScore + 
      ". Please review the policy and try again.", {
        type: "error",
        position: toast.POSITION.TOP_CENTER
      })
    } else {
      toast("Congratulation! You've scored : " + totalScore + " out of " + maxScore + 
      ". The certificate will be sent to your email soon.", {
        type: "success",
        position: toast.POSITION.TOP_CENTER
      })
    }
    var data = {
      reviewerId: this.props.match.params.userId,
      score: score
    }
    // TODO Fix the save function in back-end
    // Axios.post("/assessmentResult", data)
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  }

  renderAssessment(assessment, assessmentIndex) {
    const optionChange = function (event, optionIndex) {
      assessment.selectedOption = optionIndex + 1;
    }
    return (
      <Row style={{ justifyContent: "center" }} key={assessmentIndex.toString()}>
        <Col xs="10">
          <h4>{assessment.assessment_content}</h4>
          <ul style={{ listStyleType: "none" }}>
            {assessment.options.map((option, optionIndex) => (
              <li key={assessmentIndex.toString() + optionIndex.toString()}>
                <Label style={{ cursor: "pointer" }}>
                  <Input type="radio" name={assessmentIndex} value={option.isSelected}
                    onChange={e => optionChange(e, optionIndex)} />
                  {option.name}
                </Label>
              </li>
            ))}
          </ul>
        </Col>
        <div style={{ borderBottom: " 1px solid #969696", width: "90%" }}></div>
      </Row>
    );
  }

  renderLoginPage() {
    const login = () => {
      const assessmentTakerList = this.state.currentPolicy.assessment_takers;
      const isEmailExists = assessmentTakerList.some(taker => taker.user.email === this.state.loginEmail);
      if (isEmailExists) {
        this.setState({
          isLoggedIn: true
        })
      } else {
        alert("Your email is not valid");
        this.setState({
          loginEmail: ""
        })
      }
    }

    const handleEmailInput = (event) => {
      this.setState({
        loginEmail: event.target.value
      })
    }
    return <>
      <Row style={{ paddingTop: "2rem" }}>
        <Col xs="0" md="3"></Col>
        <Col xs="12" md="6">
          <Jumbotron>
            <h1>Please Login with your email to start the assessment</h1>
            <p className="lead">
              <InputGroup>
                <Input placeholder="someone@example.com"
                  value={this.state.loginEmail}
                  onChange={handleEmailInput} />
              </InputGroup>
            </p>
            <hr className="my-2" />
            <p className="lead">
              <Button color="primary" onClick={login}>Login</Button>
            </p>
          </Jumbotron>
        </Col>
        <Col xs="0" md="3"></Col>
      </Row>
    </>
  }

  render() {
    // if not logged in, show login screen
    if (!this.state.isLoggedIn) {
      return this.renderLoginPage();
    } else {
      // If loggedIn show the assessment
      return <>
        <Row>
          <Col className="ml-auto mr-auto" xs="10">
            <Card className="card-upgrade" style={{ transform: 'none' }}>
              <CardHeader className="text-center">
                <CardTitle tag="h4">Assessment Questions</CardTitle>
                <p className="card-category">
                  Assessment Questions for <b>{this.state.currentPolicy.policy_name}</b>
                </p>
                <Link to="/dashboard/policies" className="btn btn-danger">
                  &#8592; Go Back to Policies
                  </Link>
              </CardHeader>
              <CardBody>
                {this.state.assessmentList.map((assessment, assessmentIndex) => (
                  <React.Fragment>
                    {this.renderAssessment(assessment, assessmentIndex)}
                  </React.Fragment>
                ))}
                <Row style={{ paddingTop: "10px", justifyContent: "center" }}>
                  <Col xs="10">
                    <Button className="btn-round" color="success" onClick={this.onSubmit}>Submit</Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    }
  }
  // END-Render method
}

export default Assessment;
