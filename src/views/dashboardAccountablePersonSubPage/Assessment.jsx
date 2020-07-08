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
    this.renderOption = this.renderOption.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderLoginPage = this.renderLoginPage.bind(this);
    this.subscribedPolicyId = "";
    this.state = {
      isLoggedIn: false,
      assessment: [],
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
          assessment: response.data.assessments
        });
      }).catch(function (error) {
        console.log(error);
      });

  }
  onSubmit() {
    // TODO: Fix this logic
    isAnswerCorrect.forEach(answer => {
      if (answer) {
        score = score + 1;
      }
    })
    toast("The score is: " + score, {
      type: "success",
      position: toast.POSITION.TOP_CENTER,
      onClose: () => {
        window.location.href = '/landing-page';
      }
    })
    var data = {
      reviewerId: this.props.match.params.userId,
      score: score
    }

    Axios.post("/assessmentResult", data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderAssessment(assessment, assessmentIndex) {
    console.log(assessment);
    return (
      <Row style={{ justifyContent: "center" }}>
        <Col xs="10">
          <h4>{assessment.assessment_content}</h4>

          <ul style={{ listStyleType: "none" }}>
            {assessment.options.map((option, optionIndex) => (
              <li style={{}}>
                {this.renderOption(option,
                  optionIndex,
                  assessment.correct_answer,
                  assessment.assessment_content)}
              </li>
            ))}
          </ul>
        </Col>
        <div style={{ borderBottom: " 1px solid #969696", width: "90%" }}></div>
      </Row>
    );
  }

  renderOption(option, optionIndex, correct_answer, content) {
    const handleChange = e => {
      checkedAnswer = e.target.value;
      if (checkedAnswer == correct_answer) {
        option.isSelected = true;
      } else {
        option.isSelected = false;
      }
    };
    content = content.replace(/\s+/g, '-').toLowerCase();
    return (
      <div>
        <Row style={{ paddingTop: '10px' }}>
          <Col md="8">
            <Label check>
              <Input type="radio" name={content} value={optionIndex + 1} onChange={handleChange} />
              {option.name}
            </Label>
          </Col>
        </Row>
      </div>
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
                {this.state.assessment.map((assessment, assessmentIndex) => (
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
