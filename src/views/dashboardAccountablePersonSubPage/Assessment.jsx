import React from "react";
import { toast } from "react-toastify";
import Api from "services/Api"

// reactstrap components
import {
  Row, Col, Input, InputGroup, Button, Card, CardHeader,
  CardBody, CardTitle, Label, Jumbotron, Modal, ModalBody, ModalFooter
} from "reactstrap";

class Assessment extends React.Component {
  constructor(props) {
    super(props);
    this.renderAssessment = this.renderAssessment.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.renderLoginPage = this.renderLoginPage.bind(this);
    this.openPolicyModal = this.openPolicyModal.bind(this);
    this.togglePolicyModal = this.togglePolicyModal.bind(this);
    this.confirmPolicyModal = this.confirmPolicyModal.bind(this);
    this.complianceCheckboxChange = this.complianceCheckboxChange.bind(this);
    this.subscribedPolicyId = "";
    this.user = {};
    this.score = 0;
    this.maxScore = 0;
    this.state = {
      isLoggedIn: false, //TODO Change it back to false
      assessmentList: [],
      currentPolicy: {},
      contents: [],
      loginEmail: "",
      modal: false,
      isComplianceChecked: false,
      showComplianceCheckbox: false,
    };
    this.modalOption = {
      keyboard: false,
      backdrop: "static"
    }
    this.api = new Api();
  }

  componentDidMount() {
    this.subscribedPolicyId = this.props.match.params.subscribedPolicyId;
    this.api.fetchSubscribedPolicy(this.subscribedPolicyId)
      .then(response => {
        this.setState({
          currentPolicy: response.data,
          assessmentList: response.data.assessments,
          contents: response.data.content
        });
      }).catch(function (error) {
        console.log(error);
      });

  }
  onSubmit() {
    this.score = 0;
    this.maxScore = this.state.assessmentList.length;
    this.state.assessmentList.forEach(assessment => {
      if (!assessment.selectedOption) {
        alert("Please answer every questions in the assessment.")
        //Break the loops
        throw new Error("Please complete every questions");
      }
      if (assessment.correct_answer === assessment.selectedOption) {
        this.score++
      }
    })
    if (this.score < this.maxScore) {
      //Failed the quiz
      toast("You've scored " + this.score + " out of " + this.maxScore +
        ". Please review the policy and accept the compliance.", {
        type: "error",
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      })
      this.setState({
        showComplianceCheckbox: true,
        modal: true,
      })
    } else {
      toast("Congratulation! You've scored : " + this.score + " out of " + this.maxScore +
        ". The certificate will be sent to your email soon.", {
        type: "success",
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER
      })
      this.saveAssessmentResult();
    }
  }

  saveAssessmentResult() {
    this.api.saveAssessmentResult({
      score: this.score,
      maxScore: this.maxScore,
      isComplianceChecked: this.state.isComplianceChecked,
      user: this.user
    }).then(response => {
      toast(response.data.message, {
        type: "success",
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
        onClose: () => {
          window.location.href = '/landing-page'
        }
      })

    }).catch(error => console.error(error))
  }

  openPolicyModal() {
    this.setState({
      modal: true
    })
  }
  togglePolicyModal() {
    this.setState({
      modal: !this.state.modal
    })
  }

  confirmPolicyModal() {
    if (this.state.isComplianceChecked && this.state.showComplianceCheckbox) {
      toast("Your submission has been record. We will send the certificate to your email", {
        type: "success",
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER
      })
      this.saveAssessmentResult()
      this.togglePolicyModal();
    } else {
      toast("Please make sure you have read the policy and accept the compliance.", {
        type: "error",
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER
      })
    }

  }

  complianceCheckboxChange(e) {
    this.setState({
      isComplianceChecked: e.target.checked
    })

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
      this.user = assessmentTakerList.find(taker => taker.user.email === this.state.loginEmail);
      if (this.user) {
        this.setState({
          isLoggedIn: true
        })
      } else {
        toast("Your email is not valid. Please try again.", {
          type: "error",
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER
        })
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
                <Button onClick={this.openPolicyModal} className="btn btn-danger">
                  &#8592; Read the policy
                </Button>
              </CardHeader>
              <CardBody>
                {this.state.assessmentList.map((assessment, assessmentIndex) => (
                  <React.Fragment key={assessmentIndex}>
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
        <Modal isOpen={this.state.modal} toggle={this.togglePolicyModal}
          backdrop={this.modalOption.backdrop} keyboard={this.modalOption.keyboard} size="xl">
          <ModalBody style={{ paddingTop: "3rem", paddingRight: "3rem", paddingLeft: "3rem" }} >
            <Row>
              <Col>
                <h2>Content of {this.state.currentPolicy.policy_name}</h2>
              </Col>
            </Row>
            {this.state.contents.map((con, index) =>
              <Row key={index} style={{ paddingBottom: "1rem" }}>
                <Col> {con}</Col>
              </Row>
            )}
          </ModalBody>
          <ModalFooter style={{ padding: "1rem 3rem", display: "block", borderTop: "1px solid #000000" }}>
            <Row>
              <Col xs="10">
                {this.state.showComplianceCheckbox &&
                  <Label check>
                    <Input type="checkbox" checked={this.state.isComplianceChecked} onChange={this.complianceCheckboxChange} />
                  I have read and understand the policy: {this.state.currentPolicy.policy_name}.
                  I will comply with the stated guidelines.
                </Label>}
              </Col>
              <Col style={{ textAlign: "right" }}>
                <Button color="primary" onClick={this.confirmPolicyModal}>Confirm</Button>{' '}
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
      </>
    }
  }
  // END-Render method
}

export default Assessment;
