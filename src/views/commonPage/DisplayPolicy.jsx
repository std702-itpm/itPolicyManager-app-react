import React, { Component } from "react";
import { Link } from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import { toast } from "react-toastify";

import {
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
} from "reactstrap";

export default class DisplayPolicyTest extends Component {
  constructor(props) {
    super(props);
    this.renderContent = this.renderContent.bind(this);
    this.handleSaveContent = this.handleSaveContent.bind(this);
    this.saveSubscribedPolicy = this.saveSubscribedPolicy.bind(this);
    this.state = {
      contents: [],
      tempcontents: [],
      policy: [],
      updatedContent: []
    };
  }
  componentDidMount() {
    console.log(localStorage.getItem("session_name"));
      Axios.get("/reviewPolicy", {
      params: { company_name: localStorage.getItem("session_name"), policy_name: localStorage.getItem('reviewPolicy') }
    })
      .then(response => {
        console.log(response)
        this.setState({
          policy: response.data.singlePolicy,
          contents: response.data.singlePolicy.content,
        });
        // console.log(this.state.contents);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //Add data to Subscribed Policy Table
  saveSubscribedPolicy(updatedContent) {
  Axios.post('/updateSubscribedPolicy',updatedContent)
      .then(response => {
        if (response.data.status === "success") {
          toast("Saved successfully!", {
            type: "success",
            position: toast.position.TOP_CENTER,
            onClose: () => {
              window.location.href = 'DisplayPolicyTest';
            }
          });
        }
      })
  }



  //handle save button
  handleSaveContent(e) {
    e.preventDefault();
    console.log("Save clicked! ");
    const updatedContent = {
      updatedcontent: this.state.contents,
      companyId: localStorage.getItem("session_companyId"),
      company_name: localStorage.getItem("session_name"),
      policy_name: localStorage.getItem('reviewPolicy'),
      policy_id: localStorage.getItem('reviewPolicyId')
    };
    alert(localStorage.getItem('reviewPolicyId'));
    this.saveSubscribedPolicy(updatedContent);

  }


  renderContent(content, contentIndex) {
    const onChangeInput = (e) => {
      let content_temp = this.state.contents;
      content_temp[contentIndex] = e.target.value;
      this.setState({ contents: content_temp });
    };

    return (
      <FormGroup>
        <InputGroup className="form-group-no-border">
          <Input
            value={content}
            type="textarea"
            onChange={onChangeInput}
            rows="12"
            id={contentIndex}
            name={contentIndex}
          />
        </InputGroup>
      </FormGroup>
    )
  }


  content() {
    return this.state.contents.map((content, contentIndex) => {
      return (
        <>
          {this.renderContent(content, contentIndex)}
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
              <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
              <Form className="edit-profile-form" id="content">
                {this.content()}
                <Button className="btn-round"
                  color="success"
                  style={{ float: "right" }}
                  type="submit"
                  onClick={this.handleSaveContent}>
                  Save
                        </Button>
                <Button className="btn-round"
                  color="info"
                  style={{ float: "center" }}
                  to={{
                    pathname: "printPreview"
                  }}
                  title="to print preview page"
                  tag={Link}>
                  Preview
                        </Button>
              </Form>
              {/* <div id="renderPDF" >
                           <p style={{fontFamily: 'Verdana', fontSize: 12}}>{localStorage.getItem("session_name")}</p>
                           <p style={{fontFamily: 'Verdana', fontSize: 12}}>{this.getDate()}</p>
                           <h3 className="text-center">{localStorage.getItem('reviewPolicy')}</h3>
                           {this.renderPDF()}
                         </div> */}
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
