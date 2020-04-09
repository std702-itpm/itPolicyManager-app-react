import {
  Button,
  Row,
  Col,
} from "reactstrap";
import React, { Component } from "react";
import Axios from "axios";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "assets/css/pdf.css";

export default class printPreview extends Component {
  constructor(props) {
    super(props);
    this.handlePrint = this.handlePrint.bind(this);
    this.renderPDF = this.renderPDF.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getDateReviewed = this.getDateReviewed.bind(this);
    this.state = {
      contents: [],
      tempcontents: [],
      policy: [],
      updatedContent: [],
      company: {},
      review_date:"",
      approval_date:""
    };
  }
  componentDidMount() {
    console.log(localStorage.getItem("session_name"));

    Axios.get("http://localhost:5000/getSubscribedPolicy",
       {
          params:{policy_id: localStorage.getItem('reviewPolicyId'),company_id: localStorage.getItem('session_id')}
        }).then(response=>{
         this.setState({review_date:response.data.reviewed_date,approval_date:response.data.approval_date});
          console.log("Response: "+response.data.reviewed_date)
          this.setState({
            //company: localStorage.getItem("session_name"),
            policy: response.data,
            contents: response.data.content,
          });
        })
    
    // Axios.get("http://localhost:5000/reviewPolicy", {
    //   params: { company_name: localStorage.getItem("session_name"), policy_name: localStorage.getItem('reviewPolicy') }
    // })
    //   .then(response => {       
    //     console.log(response)
        
        
        // console.log(this.state.contents);
      //)
      .catch(function (error) {
        console.log(error);
      });
      
  }

  //handle print button
  handlePrint = (e) => {
    e.preventDefault();
    let input = document.getElementById("renderPDF");
    html2canvas(input)
      .then((canvas) => {
        let imgData = canvas.toDataURL('image/png');
        // imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, "")
        let pdf = new jsPDF('p', 'mm', [950, 2000]);
        pdf.addImage(imgData, 'PNG', 10, 12);
        pdf.save(localStorage.getItem('reviewPolicy'));
      });
  }

  getDate() {
    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate();
    return date;
    
  }
  
  getDateReviewed() {
    let reviewDate = new Date();
    let review = reviewDate.getFullYear() + '-' + (reviewDate.getMonth() + 1) + '-' + reviewDate.getDate();

    //Print date
    console.log("Retrieved review date:\n- " + review.getDate());
    return review;

  }

  
  renderPDF() {
    return this.state.contents.map((content) => {
      return (
        <>
          <p className="pdfForm-control">{'\t'}{content}</p>
          <br></br>
        </>
      );
    });
  }


  render() {
    return (
      <>
        <div className="content" id="policy">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <div style={{ border: "1px solid" }}>
                <div id="renderPDF" style={{ margin: "20px" }}>
                  <Row style={{ marginTop: "70px" }}>
                    <Col className="ml-auto mr-auto" md="6">
                      <div className="pdfForm-header" >
                        <p>{localStorage.getItem("session_name")}</p>
                        <p>Subscribed Date:{this.state.policy.date_subscribed}</p>
                        <p>Version: {this.state.policy.version}</p>
                        <p>Review Date:{this.state.review_date}
                          {
//JSON.stringify(this.state.policy)
                          }
                        </p>
                        <p>Approval Date: {this.state.approval_date}</p>
                        <p>Accountable Person: Kristof C </p>
                      </div>
                    </Col>
                    <Col className="ml-auto mr-auto" md="5">
                      <img className="img-fluid"
                        src={this.state.company.logo === undefined ?
                          "/busLogos/ITPM-02.png" : this.state.company.logo}
                        alt="company logo"
                        width="200px"
                        height="100px"
                        style={{ float: "right" }}
                      />
                    </Col>
                  </Row>
                  <br></br><br></br>
                  <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
                  {this.renderPDF()}
                </div>
              </div>
              <br></br>
              <Button className="btn-round"
                color="info"
                style={{ float: "center" }}
                type="submit"
                onClick={this.handlePrint}>
                Print
                </Button>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
