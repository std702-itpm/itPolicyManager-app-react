
import React, { Component } from "react";
import Axios from "axios";
import { toast } from "react-toastify";

// reactstrap components
import {
  Button,
  FormGroup,
  Input,
  InputGroup,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "reactstrap";

toast.configure();

class addAccountablePerson extends Component {
  constructor(props) {
    super(props);

    this.onChangeInput = this.onChangeInput.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
    this.getData = this.getData.bind(this);
    // this.toggleModal = this.toggleModal.bind(this);
    // this.routeChange = this.routeChange.bind(this);

    this.state = {
      user: [],
      fNameInput: '',
      // nzbnInput: '',
      lNameInput: '',
      AEmail: '',
      AContact: '',
      AAddress: ''
      // bDescription: '',
    }

    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    Axios.get("http://localhost:5000/user",
      {
        params:
        {
          companyId: localStorage.getItem("session_id"),
          user_type: 'Accountable Person'
        }
      })
      .then(response => {
        if (response.data !== null) {
          console.log("I am in if");
          this.setState({
            user: response.data
          })
        }
        else {
          console.log("I am in else")
        }
        this.getData();
      })
  }

  getData() {
    this.setState({
      fNameInput: this.state.user.fname,
      lNameInput: this.state.user.lname,
      AEmail: this.state.user.email,
      AContact: this.state.user.contact,
      AAddress: this.state.user.address
    })
  }


  //button handler
  onRegisterClick(e) {
    e.preventDefault();
    console.log("onRegisterClick clicked! ");
    const RegisterDetails = {
      fNameInput: this.state.fNameInput,
      lNameInput: this.state.lNameInput,
      AEmail: this.state.AEmail,
      AContact: this.state.AContact,
      AAddress: this.state.AAddress,
      company: localStorage.getItem("session_id")
      // bDescription: this.state.bDescription
    };
    Axios.post("http://localhost:5000/addUser", RegisterDetails)
      .then(res => {
        console.log(res.data);
        if (res.data.value === true) {
          toast("Thank You for registering!\n Please check your email for your login credentials and update you password.", {
            type: "success",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.reload();
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  onChangeInput(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {

    return (
      <div className="content">
        <Row>
          <Col className="ml-auto mr-auto" md="10">
            <Card className="card-upgrade" style={{ transform: "none" }}>
              <CardHeader></CardHeader>
              <CardBody>
                <FormGroup>
                  <label><h6>First Name</h6></label>
                  <InputGroup className="form-group-no-border">
                    <Input placeholder="first name" type="text" name="fNameInput" value={this.state.fNameInput}
                      onChange={this.onChangeInput} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <label><h6>Last name</h6></label>
                  <Row>
                    <InputGroup className="form-group-no-border">
                      <Col className="car-register-nzbn" lg="8">
                        <Input placeholder="last name" type="text" name="lNameInput" value={this.state.lNameInput}
                          onChange={this.onChangeInput} />
                      </Col>
                    </InputGroup>
                  </Row>
                </FormGroup>
                <FormGroup>
                  <label><h6>Email ID</h6></label>
                  <InputGroup className="form-group-no-border">
                    <Input placeholder="Email@email.com" type="text"
                      name="AEmail" value={this.state.AEmail}
                      onChange={this.onChangeInput} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <label><h6>Contact Number</h6></label>
                  <InputGroup className="form-group-no-border">
                    <Input placeholder="+64" type="number"
                      name="AContact" value={this.state.AContact}
                      onChange={this.onChangeInput} />
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <label><h6>Address</h6></label>
                  <InputGroup className="form-group-no-border">
                    <Input placeholder="Address" type="text"
                      name="AAddress" value={this.state.AAddress}
                      onChange={this.onChangeInput} />
                  </InputGroup>
                </FormGroup>
              </CardBody>
              <CardFooter>

                <Button
                  className="btn-success btn-round"
                  type="button"
                  onClick={this.onRegisterClick}
                >
                  Save
                </Button>

              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>

    );
  }
}

export default addAccountablePerson;
