import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

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

import printPreview from '../commonPage/printPreview.jsx';

// // styles
import "assets/css/bootstrap.min.css";
import ITPMLogo from "../../assets/img/ITPM-02.png"
import styles from "assets/scss/paper-kit.scss";

export default class PolicyDashboardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentPolicy: []};
    }

    componentDidMount(){
        let policy_id = this.props.match.params.id
        Axios.get("http://localhost:5000/getOnePolicy/"+ policy_id) 
        .then(response => {
            console.log(response)
            this.setState({
                currentPolicy: response.data
            });
            // console.log(this.state.contents);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

     /*To show the content of the policy*/  
    render() {
        return (
            <div>
                
            <div className="section text-center">
            {/* <Container>
            <Row>
            <img src={ITPMLogo}
            width="150px"
            height="50px"
            style={{ float: "right" }}
            />  
            </Row>
            </Container> */}
            <p>
            <br/> 
            <center> 
                Policy ID:  {this.state.currentPolicy._id}<br/>
                Policy Name: {this.state.currentPolicy.policy_name}<br/><br/>
                Content: <br/><br/> {this.state.currentPolicy.content} <br/><br/>
                
            </center>
            </p>           
            <Button> 
              <a href="/dashboard/survey-result" 
              className="btn-round" 
              color="success" 
              style={{ float: "right" }} > 
              
              Home
            </a>
            </Button>
            
            {/* <tfooter>{this.subscribeBtn()}</tfooter> */}
            </div>
        </div>
        
    )
        }
}
