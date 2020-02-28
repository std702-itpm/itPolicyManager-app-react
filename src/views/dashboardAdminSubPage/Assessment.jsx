import React from "react";
import Axios from "axios";
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

class Assessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.state = {
      assessment: [],
      policies: [],
    };

    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    document.body.classList.add("register-page");
    Axios.get("http://localhost:5000/assessment")
      .then(response => {
        console.log("response", response);
        this.setState({
          assessment: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });

    Axios.get('http://localhost:5000/policies')
    .then(response => {
        //console.log('response', response)
        this.setState({
            //policies: response.data
        });
    })
    .catch(function (error) {
        console.log(error);
    })
  }
  
  onSaveClick(e) {
    e.preventDefault();
    // this.toggleModal();
    console.log("onSaveClick clicked! ");
    const assessmentDetails = {
      assessmentInputs: this.state.assessment
    };
    
    Axios.post('http://localhost:5000/assessment', assessmentDetails)
    .then(res => {console.log(res.data);
      console.log(assessmentDetails);
     //notification
     if (res.data.result === "success") {
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
      const assessment = this.state.assessment
      assessment[assessmentIndex].assessment_content = e.target.value
      this.setState({ assessment: assessment })
    };

    const addOption = () => {
      const newOption = { name: '', policy: null }
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
        <ul style={{listStyleType: "none"}}>
          {assessment.options.map((option, optionIndex) => (
            <Row>
                <Col md="2">
                    <Button className="btn-round" color="danger" outline onClick={() => deleteOption(optionIndex)}>
                      <i className="nc-icon nc-basket" style={{fontSize: "18px", color: "red"}}/>
                    </Button>
                </Col>
                <Col md="10">
                    <li style={{listStyleType: "none"}}>{this.renderOption(option, optionIndex, assessmentIndex)}</li>
                </Col>
            </Row>
          ))}
        </ul>
        <Button className="btn-round" color="success"  onClick={addOption}>add new option</Button>
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
    const handlePolicyChange = e => {
      const assessment = this.state.assessment
      console.log(e.target.value + assessment[assessmentIndex].options[optionIndex].policy)
      assessment[assessmentIndex].options[optionIndex].policy = e.target.value
      this.setState({ assessment: assessment })
    };

   
    return (
      <div>
        <Row style={{marginTop:'12px'}}>
            <Col md="4">
            <Input value={option.name} onChange={handleNameChange} />
            </Col>
            <Col md="2">
            <label></label>
            </Col>
            <Col md="4">
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
            </Col>
        </Row>
      </div>
    );
  }

  render() {
    const addAssessment = () => {
      const assessment = this.state.assessment
      const newAssessment = {
          assessment_content: '',
          options: [
              {
                  name: '',
                  policy: null,
              }
          ],
      }
      assessment.push(newAssessment)
      this.setState({ assessment: assessment })
    }
    const deleteAssessment = (assessmentIndex) => {
        this.state.assessment.splice(assessmentIndex, 1)
        this.setState({ assessment: this.state.assessment })
    }
    return (
    <>
      <div className="content">
        <Row>
            <Col className="ml-auto mr-auto" md="12">
              <Card className="card-upgrade" style={{transform: 'none'}}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Assessment Questions</CardTitle>
                  <p className="card-category">
                    Assessment Questions
                  </p>
                </CardHeader>
                <CardBody>
                    <ul style={{listStyleType: "none"}}>
                        {this.state.assessment.map((assessment, assessmentIndex) => (
                            <>
                            <br></br>
                            <Button className="btn-round" color="danger"  onClick={() => deleteAssessment(assessmentIndex)}>delete assessment</Button>
                            <li style={{listStyleType: "none"}}>{this.renderAssessment(assessment, assessmentIndex)}</li>
                            </>
                        ))}
                    </ul>
                    <Button className="btn-round" color="success" onClick={addAssessment}>add assessment</Button>
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

export default Assessment;
