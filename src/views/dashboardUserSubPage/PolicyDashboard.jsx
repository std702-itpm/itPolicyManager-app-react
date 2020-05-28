
import React from "react";
import { Link } from "react-router-dom";
import Axios from 'configs/AxiosConfig';

// reactstrap components
import {
  Button,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";

// core components
import ExamplesNavbar from "components/Navbars/ExamplesNavbar.js";
import LandingPageHeader from "components/Headers/LandingPageHeader.js";
import DemoFooter from "components/Footers/DemoFooter.js";

//import printPreview from './commonPage/printPreview.jsx';

// styles
import "assets/css/bootstrap.min.css";
import styles from "assets/scss/paper-kit.scss";

class PolicyDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {landingPolicies: []};
    this.onPolicyClick = this.onPolicyClick.bind(this);
  }

  onPolicyClick() {
    alert("Hi I am policy!");
  
    
  }

  componentDidMount(){
    Axios.get("/getAllPolicies/")
      .then(response => {
        this.setState({ landingPolicies: response.data });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  PolicyDashboard() {
    return this.state.landingPolicies.map(function(policy, index){
      if(!(policy.policy_name==="No match policy")){
        return <li><a className="btn btn-primary" href={"PolicyDashboardView/" + policy._id}> {policy.policy_name}</a></li>;
      }
    })
  }


  render() {
    return (
      <>
         {/* TODO: INSERT CODE HERE */}
          <div className="section policy-section">
            <div className="policies-list text-center">
              <h1> <center>List of Available Policies</center></h1>
              <ul>
                { this.PolicyDashboard() }
              </ul>
            </div>
          </div>
         {/* END TODO: -INSERT CODE */}

          
        <DemoFooter />
      </>
    );
  }
}
// function LandingPage() {
//   document.documentElement.classList.remove("nav-open");
//   React.useEffect(() => {
//     document.body.classList.add("profile-page");
//     return function cleanup() {
//       document.body.classList.remove("profile-page");
//     };
//   });


// }

export default PolicyDashboard;
