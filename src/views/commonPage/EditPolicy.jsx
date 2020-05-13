import React, { Component} from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { toast } from "react-toastify";

//reactstrap components
import {
      Button,
      Row,
      Col,
      Form,
      FormGroup,
      Input,
      InputGroup,
    } from "reactstrap";

export default class EditPolicy extends Component {
    constructor(props){
      super(props);
      this.renderContent = this.renderContent.bind(this);
      this.handleSaveContent = this.handleSaveContent.bind(this);
      this.addContent=this.addContent.bind(this);
      // this.handlePrint = this.handlePrint.bind(this);
      // this.renderPDF = this.renderPDF.bind(this);
      // this.getDate = this.getDate.bind(this);
      //this.getPDF = this.getPDF.bind(this);
      this.state = {
        contents: [],
        tempcontents:[],
        policy:[],
        updatedContent:[],
        policyName:"",
        policyId:""
      };
  }
    componentDidMount() {
    if(!(this.props.policyId===undefined)) {
      //if policy id is available then user can get policy from id in the database
        Axios.get("http://localhost:5000/policies", {
        params: {type:"one",_id:this.props.policyId }//localStorage.getItem('reviewPolicy')}
      })
        .then(response => {
          console.log(response)
          this.setState({
              policy: response.data,
              contents: response.data.content,
              policyName:response.data.policy_name,
              policyId:response.data._id
            });
            // console.log(this.state.contents);
        })
        .catch(function(error) {
          console.log(error);
        });
    }        
}
//handle save button
    handleSaveContent(e) {
        e.preventDefault();
        console.log("Save clicked! "+this.state.contents);
        const updatedContent = {
          content: this.state.contents,           
          _id: this.state.policyId,
        };
        console.log("Updated:"+updatedContent)
    
        Axios.put("http://localhost:5000/edit-policy", updatedContent).then(
          res => {
            console.log(res.data);
            console.log(res);
            if (res.status === 204) {
              toast("Updated successfully", { 
                type: "success", 
                position: toast.POSITION.TOP_CENTER,
                onClose: ()=> {
                  window.location.href = 'DisplayPolicyTest'
                }
              });
            } else {
              toast("Unsuccessful save. Something went wrong, Try again", { 
                type: "error",
                position: toast.POSITION.TOP_CENTER,
              });
            }
          }
        );
      }

      //Input changes handler
    onInputChange(e){
        const target=e.target;
        const name=target.name;
        const value=target.value;
        this.setState({[name]:value});
    }

    //get contents for policy
    renderContent (content,contentIndex){
      const onChangeInput = (e) => {
          // console.log( "bbbb " +e.target.value)
          let content_temp = this.state.contents;
          content_temp[contentIndex]=e.target.value;
           this.setState({contents:content_temp});
      };

      return (
          <FormGroup>
            <InputGroup className="form-group-no-border">
              <Input
                value={content}
                type="textarea"
                onChange={onChangeInput}
                rows="12"
                id= {contentIndex}
                name={contentIndex}
              />
            </InputGroup>
           </FormGroup> 
      )
  }

    addContent(){
        return(
            <InputGroup>
            <Input type="textarea" rows="12"></Input>
            </InputGroup>
        );                                         
    }
      

    content() {
      return this.state.contents.map((content,contentIndex) => {
        return (
          <>
          {this.renderContent(content,contentIndex)}
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
                      <FormGroup>
                        <InputGroup>
                        <label><h6>Policy Name: </h6></label> 
                        <Input className="form-group" value={this.state.policyName} type="text" name="policyName" onChange={this.onInputChange}></Input>
                        </InputGroup>
                      </FormGroup>
                        {this.content()}
                        <FormGroup>{this.addContent()}</FormGroup>
                        <Button outline color="primary" onClick={this.addContent()} className="btn-round">AddContent</Button>
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
                        Details
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



