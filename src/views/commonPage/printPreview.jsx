import React, { Component } from "react";
import html2canvas from 'html2canvas';
import Api from "services/Api"
import jsPDF from 'jspdf';
import "assets/css/pdf.css";
import PolicyViewer from "components/PolicyViewer/PolicyViewer";

import {
  Button,
  Row,
  Col,
} from "reactstrap";

export default class printPreview extends Component {
  constructor(props) {
    super(props);
    this.handlePrint = this.handlePrint.bind(this);

    this.state = {
      contents: null,
      policy: [],
      updatedContent: [],
      company: {},
      approval_date: "",
      policyId: null
    };
    this.api = new Api();
  }
  componentDidMount() {
    //get subscribed policy from policy id and company id
    this.api.fetchSubscribedPolicy(
      localStorage.getItem('reviewPolicyId')
    ).then(response => {
      this.setState({
        review_date: response.data.reviewed_date,
        approval_date: response.data.approval_date,
        policy: response.data,
        contents: response.data.content.join("<br>"),
        policyId: response.data._id,
      });
    }).catch(function (error) {
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
        let pdf = new jsPDF('p', 'mm', [950, 2000]);
        pdf.addImage(imgData, 'PNG', 10, 12);
        pdf.save(localStorage.getItem('reviewPolicy'));
      });
  }

  //get current date
  getCurrentDate() {
    let currentDate = new Date();
    let formated = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    return formated;
  }

  render() {
    return (
      //layout for pdf file
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
                        <p>Review Date: {this.getCurrentDate()}</p>
                        <p>Approval Date: {this.state.approval_date}</p>
                        <p>Accountable Person: Kristof C</p>
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
                  <PolicyViewer key={this.state.policyId} policyContent={this.state.contents}/>
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
