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
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label
} from "reactstrap";
import { Checkbox } from "antd";

let checkedAnswer;
let isAnswerCorrect = [];
let score = 0;

class Assessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.subscribedPolicyId = "";
    this.state = {
      assessment: [],
      checkedAnswer: "",
      policies: [],
      currentPolicy: [],
    };
    this.api = new Api();
    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    this.subscribedPolicyId = this.props.match.params.subscribedPolicyId;
    this.api.fetchSubscribedPolicy(this.subscribedPolicyId)
      .then(response => {
        console.log(response)
        this.setState({
          currentPolicy: response.data,
          assessment: response.data.assessments
        });
      }).catch(function (error) {
        console.log(error);
      });
  }
  componentDidUpdate() {
    document.body.classList.remove("register-page");
  }

  onSubmit() {
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
      <div>
        <h4>{assessment.assessment_content}</h4>
          
        <ul style={{ listStyleType: "none" }}>
          {assessment.options.map((option, optionIndex) => (
            <Row>
              <Col md="10">
                <li style={{ listStyleType: "none" }}>
                  {this.renderOption(option, optionIndex, assessment.correct_answer, assessment.assessment_content)}
                </li>
              </Col>
            </Row>
          ))}
        </ul>
        <br></br>
        <br></br>
        <hr></hr>
      </div>
    );
  }

  renderOption(option, optionIndex, correct_answer, content) {
    const handleChange = e => {
      checkedAnswer = e.target.value;
      if (checkedAnswer === correct_answer) {
        isAnswerCorrect.push(true);
      }
      else {
        isAnswerCorrect.push(false);
      }
      console.log("ASDF" + isAnswerCorrect)
    };
    content = content.replace(/\s+/g, '-').toLowerCase();
    return (
      <div>
        <Row style={{ marginTop: '12px' }}>
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

  render() {

    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="12">
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
                  <ul style={{ listStyleType: "none" }}>
                    {this.state.assessment.map((assessment, assessmentIndex) => (
                      <React.Fragment>
                        <br></br>
                        <li style={{ listStyleType: "none" }} key={assessmentIndex}>{this.renderAssessment(assessment, assessmentIndex)}</li>
                      </React.Fragment>
                    ))}
                  </ul>
                  <Button className="btn-round" color="success" onClick={this.onSubmit}>Submit</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

      </>
    )
  }
}

export default Assessment;
