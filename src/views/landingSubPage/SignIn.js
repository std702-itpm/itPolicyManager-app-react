/*!

=========================================================
* Paper Kit React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-kit-react

* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React,{Component}from "react";
import {NavLink, Link} from "react-router-dom";
import Axios from 'configs/AxiosConfig';

// reactstrap components
import {
  Button,
  Card,
  Form, 
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import DemoFooter from "components/Footers/DemoFooter.js";

class SignIn extends Component {
  constructor(props) {
      super(props);

      this.onChangeInput = this.onChangeInput.bind(this);
      this.onSigninClick = this.onSigninClick.bind(this);

      this.state = {
        usernameInput: '',
        passwordInput: ''
      }

    document.documentElement.classList.remove("nav-open"); 
    console.log("before: " + (localStorage.getItem('session_id')));
  }

  componentDidMount() {
    document.body.classList.add("register-page");
  }

  componentDidUpdate() {
    document.body.classList.remove("register-page");
  }

  routeChange(path) {
    this.props.history.push(path);
  }

  //button handler
  onSigninClick(e) {
    e.preventDefault();
    const signinDetails = {
      username: this.state.usernameInput,
      password: this.state.passwordInput
    };
    
    Axios.post('/signin', signinDetails)
    .then(res => {
      if(res.data.value === true){
        console.log(res);
        //set session with res.data.userId
        localStorage.setItem('session_id', res.data.userId);
        localStorage.setItem('session_type', res.data.userType);
        localStorage.setItem('session_name', res.data.company_name);
        localStorage.setItem('session_logo', res.data.logo);
        localStorage.setItem('session_companyId',res.data.companyId)
        if(res.data.userType==="Accountable Person"){
          localStorage.setItem("session_userId",res.data.companyUserId);
        }
        // console.log('session: ', localStorage.getItem('session_id') + (localStorage.getItem('session_type')));
        
        if(localStorage.getItem('session_type') === 'admin'){
          this.routeChange('/dashboard/dashboardcontent');
        }else{
          this.routeChange('dashboard/survey-result');
        }
        window.location.reload();
      }
      else{
        console.log("modal error");
      }
    })
    .catch(error => {
        console.log(error)
    });
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
    <>
        <ExamplesNavbar />
        <div
        className="page-header"
        style={{
          backgroundImage: "url(" + require("assets/img/login-image.jpg") + ")"
        }}
      >
        <div className="filter" />
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4">
              <Card className="card-register ml-auto mr-auto">
                <h3 className="title mx-auto">Welcome</h3>
                <Form className="register-form" onSubmit={this.onSigninClick}>
                  <label>User Name</label>
                  <InputGroup className="form-group-no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-circle-10" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="User Name" type="text" name="usernameInput" autoComplete="username"
                      onChange={this.onChangeInput}
                    />
                  </InputGroup>
                  <label>Password</label>
                  <InputGroup className="form-group-no-border">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Password" type="password" name="passwordInput" autoComplete="current-password"
                      onChange={this.onChangeInput}
                    />
                  </InputGroup>
                  <Button 
                    block 
                    className="btn-round" 
                    color="success" 
                    type="Submit"
                  >
                    Sign In
                  </Button><br></br>
                  <input type="checkbox" name="remember" value="rememberpassword" /> Remember Password 
                  <br></br>
                </Form>
                <div className="forgot">
                  <Button
                    className="btn-link"
                    color="danger"
                    href="#pablo"
                    target="_blank"
                    onClick={e => e.preventDefault()}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="col text-center">
                <NavLink
                  to="/register-modal" 
                  tag={Link}
                >
                  <Button
                    className="btn-round"
                    color="info"
                    title="to Register Modal"
                    outline
                    type="button"
                    name="modal"
                  >
                    Not yet a Member?
                  </Button>
                </NavLink>
              </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <DemoFooter />
    </>
  );
}
}

export default SignIn;
