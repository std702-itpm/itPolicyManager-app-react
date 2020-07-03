import React from "react";
import Axios from 'configs/AxiosConfig';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// reactstrap components
import {
  Row,
  Col,
  Input,
  Button,
  Label,
  Card,
  CardHeader,
  CardBody,
  CardTitle
} from "reactstrap";

class EditAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.state = {
      assessment: [],
      policies: [],
      currentPolicy: [],
    };

    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    document.body.classList.add("register-page");
    let policy_id = this.props.match.params.id;

    Axios.get("/getOnePolicy/" + policy_id)
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
    Axios.get("/assessment")
      .then(response => {
        console.log("response", response);
        this.setState({
          assessment: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });


    Axios.get('/getAllPolicies')
      .then(response => {
        console.log('response', response)
        this.setState({
          policies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      })

    Axios.get("")
  }

  onSaveClick(e) {
    e.preventDefault();
    let policy_id = this.props.match.params.id;
    // this.toggleModal();
    // console.log("onSaveClick clicked! ");
    const assessmentDetails = {
      policy_id: policy_id,
      //_id:"",
      assessmentInputs: this.state.assessment
    };

    console.log("PolicyId: " + assessmentDetails.policy_id)
    // console.log(assessmentDetails.policy_id);

    // console.log(this.state.assessment);

    Axios.put("/assessment", assessmentDetails)
      .then(res => {
        console.log(res.status);

        if (res.data.status === "success") {
          toast("Assessment questions updated!", {
            type: "success",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.reload();
            }
          });
        } else {
          toast("Unable to update the Assessment questions!", {
            type: "error",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.reload();
            }
          });
        }
      });
  }

  componentDidUpdate() {
    document.body.classList.remove("register-page");
  }

  renderAssessment(assessment, assessmentIndex) {
    const handleChange = e => {
      const assessment = this.state.assessment;
      assessment[assessmentIndex].assessment_content = e.target.value;
      this.setState({ assessment: assessment })
    };

    const handleAnswerChange = e => {
      const assessment = this.state.assessment;
      assessment[assessmentIndex].correct_answer = e.target.value;
      this.setState({ assessment: assessment })
    };

    const addOption = () => {
      const newOption = { name: '' }
      const assessment = this.state.assessment[assessmentIndex]
      assessment.options.push(newOption)
      this.setState({ assessment: this.state.assessment })
    }

    const deleteOption = optionIndex => {
      this.state.assessment[assessmentIndex].options.splice(optionIndex, 1)
      this.setState({ assessment: this.state.assessment })
    }

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
              <Col md="2">
                <Button className="btn-round" color="danger" outline onClick={() => deleteOption(optionIndex)}>
                  <i className="nc-icon nc-basket" style={{ fontSize: "18px", color: "red" }} />
                </Button>
              </Col>
              <Col md="10">
                <li style={{ listStyleType: "none" }}>{this.renderOption(option, optionIndex, assessmentIndex)}</li>
              </Col>
            </Row>
          ))}
        </ul>
        <Button className="btn-round" color="success" onClick={addOption}>add new option</Button>
        <Row>
          <b><Label>Correct Answer(Option Number): </Label></b>
          <Input
            type="textbox"
            value={assessment.correct_answer}
            onChange={handleAnswerChange}
          />
        </Row>

        <br></br><br></br><hr></hr>
      </div>
    );
  }

  renderOption(option, optionIndex, assessmentIndex) {
    const handleNameChange = e => {
      const assessment = this.state.assessment
      assessment[assessmentIndex].options[optionIndex].name = e.target.value
      this.setState({ assessment: assessment })
    };
    return (
      <div>
        <Row style={{ marginTop: '12px' }}>
          <Col md="4">
            <Input value={option.name} onChange={handleNameChange} />
          </Col>
          <Col md="2">
            <label></label>
          </Col>
          <Col md="4">
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const addAssessment = () => {
      const assessment = this.state.assessment
      const newAssessment = {
        _id: null,
        assessment_content: '',
        options: [
          {
            name: ''
          }
        ],
        correct_answer: ''
      }
      assessment.push(newAssessment)
      this.setState({ assessment: assessment })
    }

    const deleteAssessment = (assessmentId, AssessmentIndex) => {
      console.log(AssessmentIndex);
      this.state.assessment.splice(AssessmentIndex, 1)
      this.setState({ assessment: this.state.assessment })
      Axios.post("/deleteassessment", { _id: assessmentId })
        .then(response => {
          console.log("Deleted");
        })
        .catch(err => {
          console.log("Erros is: " + err);
        })
    }

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
                        <Button className="btn-round" color="danger" onClick={() => deleteAssessment(assessmentIndex)}>Delete Question</Button>
                        <li style={{ listStyleType: "none" }} key={assessmentIndex}>{this.renderAssessment(assessment, assessmentIndex)}</li>
                      </React.Fragment>
                    ))}
                  </ul>
                  <Button className="btn-round" color="success" onClick={addAssessment}>Add Question</Button>
                  <Button className="btn-round" color="success" onClick={this.onSaveClick}>Save</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default EditAssessment;
