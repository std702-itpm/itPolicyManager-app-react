
import React, {Component} from "react";
import { NavLink, Link} from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";
import Subscribers from "../dashboardAdminSubPage/Subscribers.jsx"

// reactstrap components
import {
    Button,
    Modal,
    Form,
    FormGroup, 
    Input,
    InputGroup,
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import LandingPageHeader from "components/Headers/LandingPageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";

toast.configure();

class addAccountablePerson extends Component {
  constructor(props) {
      super(props);

      this.onChangeInput = this.onChangeInput.bind(this);
      this.onRegisterClick = this.onRegisterClick.bind(this);
     // this.toggleModal = this.toggleModal.bind(this);
     // this.routeChange = this.routeChange.bind(this);
      
      this.state = {
        modal: true,
        fNameInput: '',
        // nzbnInput: '',
        lNameInput: '',
        AEmail: '',
        AContact: '',
        AAddr: '',
        AAddr2: '',
        ACity: '',
        AState: '',
        AZip: '',
        // bDescription: '',
      }

    document.documentElement.classList.remove("nav-open"); 
  }

  componentDidMount() {
    const idInfo={id:localStorage.getItem('session_id')};
    console.log("ID:"+idInfo.id);
    if(this.props.userId===undefined){
      console.log("IF: "+idInfo.id);
      Axios.get("http://localhost:5000/companyAdmin/"+idInfo.id)
      .then(response => {
        console.log("response", response);
        this.fillData(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    else{
      console.log("Else: "+this.props.userId);
      Axios.get("http://localhost:5000/companyAdmin/"+this.props.userId)
      .then(response => {
        console.log("response", response);
        this.fillData(response);
      })
      .catch(function(error) {
        console.log(error);
      });
    }
  }
  // componentDidMount() {
  //   Axios.get("http://localhost:5000/Company_Admin", {
  //     params: { _id: localStorage.getItem("session_id") }
  //   })
  //     .then(response => {
  //       console.log("response", response);
  //       this.setState({
  //         AdminDetails: response.data.AdminDetails,
  //         fNameInput: response.data.AdminDetails.first_name,
  //         // nzbnInput: response.data.companyDetails.nzbn,
  //         lNameInput: response.data.AdminDetails.last_name,
  //         AEmail: response.data.AdminDetails.Admin_email,
  //         AContact: response.data.AdminDetails.contact,
  //         AAddr: response.data.AdminDetails.address,
  //         // bDescription: response.data.companyDetails.description,
  //         ALogo : response.data.logo
  //       });
  //       console.log("AdminDetails", this.state.AdminDetails);
  //     })
  //     .catch(function(error) {
  //       console.log(error);
  //     });
  //   document.body.classList.add("register-page");
  //   document.addEventListener('mousedown', this.handleClickOutside, true);
  // }

// componentDidUpdate() {    document.body.classList.remove("register-page");
//   }

  // routeChange() {
  //   let path = `/signin-page`;
  //   this.props.history.push(path);
  // }

//   componentWillUnmount() {
//     document.removeEventListener('mousedown', this.handleClickOutside, true);
// }

  // toggleModal(){
  //   this.setState({
  //     modal: false
  //   });
  //   window.location.reload();
  // };


  //button handler
  onRegisterClick(e) {
    e.preventDefault();
    // this.toggleModal();
    console.log("onRegisterClick clicked! ");
    const RegisterDetails = {
      fNameInput: this.state.fNameInput,
      // nzbnInput: this.state.nzbnInput,
      lNameInput: this.state.lNameInput,
      AEmail: this.state.AEmail,
      AContact: this.state.AContact,
      AAddr: this.state.AAddr,
      AAddr2: this.state.AAddr2,
      ACity: this.state.ACity,
      AState: this.state.AState,
      AZip: this.state.AZip,
      company:localStorage.getItem("session_id")
            // bDescription: this.state.bDescription
    };
   Axios.post("http://localhost:5000/addUser",RegisterDetails)
   .then(res => {console.log(res.data);
      if(res.data.value === true){
        toast("Thank You for registering!\n Please check your email for your login credentials and update you password.", { 
          type: "success", 
          position: toast.POSITION.TOP_CENTER,
          onClose: ()=> {
            window.location.reload();
          }
        });
        }      
    })
    .catch(error=>{
      console.log(error);
    })

      

    // Axios.post('http://localhost:5000/register', RegisterDetails)
    // .then(res => {console.log(res.data);
    //   if(res.data.value === true){
    //     toast("Thank You for registering!\n Please check your email for your login credentials and update you password.", { 
    //       type: "success", 
    //       position: toast.POSITION.TOP_CENTER,
    //       onClose: ()=> {
    //         window.location.reload();
    //       }
    //     });
    //   }else{
    //     toast("Registration Failed!\n Admin already exist, login instead.", { 
    //       type: "error", 
    //       position: toast.POSITION.TOP_CENTER,
    //       onClose: ()=> {
    //         window.location.reload();
    //       }
    //     });
    //   }
    // });
  }

  onChangeInput(e) {
      const target = e.target;
      const value = target.value;
      const name = target.name;
      
      this.setState({
        [name]: value
      });
  }
    
  render(){
    
    return (
      <div className="content">
        <Row>
          <Col className="ml-auto mr-auto" md="10">
            <Card className="card-upgrade" style={{transform:"none"}}>
              <CardHeader></CardHeader>
              <CardBody>
              <FormGroup>
                <label><h6>First Name</h6></label>
                <InputGroup className="form-group-no-border">
                <Col className="car-register-nzbn" lg="8">
                <Input placeholder="first name" type="text"  name="fNameInput"  value={this.state.fNameInput}
                       onChange={this.onChangeInput}/>
                 </Col>                                 
                </InputGroup>
                </FormGroup>
                <FormGroup>
                              <label><h6>Last name</h6></label>
                              <Row>
                              <InputGroup className="form-group-no-border">
                                  <Col className="car-register-nzbn" lg="8">
                                      <Input placeholder="last name" type="text"  name="lNameInput"  value={this.state.lNameInput}
                                      onChange={this.onChangeInput}/>
                                  </Col> 
                              </InputGroup>
                              </Row>
                          </FormGroup>
                           <FormGroup>
                              <label><h6>Email ID</h6></label>
                              <InputGroup className="form-group-no-border">
                                  <Input placeholder="Email@email.com" type="text" 
                                  name="AEmail"  value={this.state.AEmail}
                                  onChange={this.onChangeInput}/>
                              </InputGroup>
                          </FormGroup>
                          <FormGroup>
                              <label><h6>Contact Number</h6></label>
                              <InputGroup className="form-group-no-border">
                                  <Input placeholder="+64" type="number" 
                                  name="AContact"  value={this.state.AContact}
                                  onChange={this.onChangeInput}/>
                              </InputGroup>
                          </FormGroup>
                          <FormGroup>
                              <label><h6>Address</h6></label>
                              <InputGroup className="form-group-no-border">
                                  <Input placeholder="Address1" type="text" 
                                  name="AAddr"  value={this.state.AAddr}
                                  onChange={this.onChangeInput}/>
                              </InputGroup>
                          </FormGroup>
                          <FormGroup>
                              <label><h6>Address 2</h6></label>
                              <InputGroup className="form-group-no-border">
                                  <Input placeholder="Address2" type="text" 
                                  name="AAddr2"  value={this.state.AAddr2}
                                  onChange={this.onChangeInput}/>
                              </InputGroup>
                          </FormGroup>
                          <FormGroup>
                              <Row>
                                  <InputGroup className="form-group-no-border">
                                      <Col md="6">
                                          <label for="city">City</label>
                                          <Input type="text" id="city"
                                          name="ACity"  value={this.state.ACity}
                                          onChange={this.onChangeInput}/>
                                      </Col>
                                      <Col md="4">
                                          <label for="state">State</label>
                                          <Input type="text" id="state"
                                          name="AState"  value={this.state.AState}
                                          onChange={this.onChangeInput}/>
                                      </Col>
                                      <Col md="2">
                                          <label for="zip">Zip</label>
                                          <Input type="text" id="zip"
                                          name="AZip"  value={this.state.AZip}
                                          onChange={this.onChangeInput}/>
                                      </Col>
                                  </InputGroup>
                              </Row>
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
