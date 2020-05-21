import React from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// reactstrap components
import {
  Row,
  Col,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle
} from "reactstrap";
import { Checkbox } from "antd";

let checkedAnswer;
let isAnswerCorrect = [];
let score = 0;

class sendAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      assessment: [],
      checkedAnswer: "",
      policies: [],
      currentPolicy: [],
    };

    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    document.body.classList.add("register-page");
    let policy_id = localStorage.getItem("reviewPolicyId");

    Axios.get("http://localhost:5000/getOnePolicy/" + policy_id)
      .then(response => {
        console.log(response)
        this.setState({
          currentPolicy: response.data,
          assessment: response.data.assessments
        });
        // console.log(this.state.contents);
      })
      .catch(function (error) {
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

    Axios.post("http://localhost:5000/assessmentResult", data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }

  renderAssessment(assessment, assessmentIndex) {
    const handleChange = e => {
      this.setState({ checkedAnswer: e.target.value });
      console.log("ASDF" + this.state.checkedAnswer)
    };

    // console.log(assessment.options)

    return (
      <div>
        <Input
          type="textarea"
          value={assessment.assessment_content}
          onChange={handleChange}
        />
        <ul style={{ listStyleType: "none" }}>
          {assessment.options.map((option, optionIndex) => (
            <Row>

              <Col md="10">
                <li style={{ listStyleType: "none" }}>{this.renderOption(option, optionIndex, assessment.correct_answer)}</li>
              </Col>
            </Row>
          ))}
        </ul>
        <br></br><br></br><hr></hr>
      </div>
    );
  }

  renderOption(option, optionIndex, correct_answer) {
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


    return (
      <div>
        <Row style={{ marginTop: '12px' }}>
          <Col md="8">
            <Checkbox onChange={handleChange} value={optionIndex + 1} />{option.name}
          </Col>

          {/* <select value={option.policy} onChange={handlePolicyChange}>
              {this.state.policies.map(policy => (
                <>
                  <option 
                    value={policy._id} checked>
                    {policy.policy_name}
                  </option>
                </>
              ))}
            </select> */}
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

export default sendAssessment;
