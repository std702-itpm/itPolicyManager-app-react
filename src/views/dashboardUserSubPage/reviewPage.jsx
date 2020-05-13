import React from 'react';
import Axios from 'axios';
import {toast} from 'react-toastify';

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    Input,
    Row,
    Col,
    Table,
  } from "reactstrap";
import { textSpanIsEmpty } from 'typescript';

  toast.configure();

  class ReviewPage extends React.Component{
    constructor(props){
      super(props);
      
      this.renderDisplayReviewers=this.renderDisplayReviewers.bind(this);
      this.keyContactsCheckboxHandler=this.keyContactsCheckboxHandler.bind(this);
      this.startReviewButtonHandler=this.startReviewButtonHandler.bind(this);

      this.state={
        isSelected:false,
        policyName:localStorage.getItem('reviewPolicy'),
        users:[],
        reviewers:[],
        singlePolicy:[],
        reviewerList:[],
        newUserList:[],
        reviewersForNotReviewedStatus:[]
      };
    }

    componentDidMount() {
      Axios.get("http://localhost:5000/company",{
        params:{_id:localStorage.getItem('session_id'),type:"user"}
      })
      .then(response=>{
        console.log("CompanyID: "+response.data.company);
        Axios.get("http://localhost:5000/user",{
          params:{companyId:response.data.company}
        })
        .then(response=>{
          this.setState({
            users:response.data
          });

          Axios.get("http://localhost:5000/getSubscribedPolicy",{
            params:{
              company_id:localStorage.getItem("session_id"),
              policy_id:localStorage.getItem("reviewPolicyId")
            }
          }) 
          .then(response=>{
            this.setState({
              singlePolicy:response.data,
              reviewers:response.data.reviewer_list
            })
            this.state.reviewers.map(reviewer=>{
              this.state.reviewerList.push(reviewer.reviewer_id)
            })
            this.setState({reviewerList:this.state.reviewerList})
            console.log("getSubscribedPolicy: "+this.state.reviewers)

          })
          
          
        //   Axios.get("http://localhost:5000/reviewPolicy",{
        //     params:{company_name:localStorage.getItem("session_name"),
        //             policy_name:localStorage.getItem("reviewPolicy")
        //   }
        //   })
        //   .then(response=>{
        //     this.setState({
        //       singlePolicy:response.data.singlePolicy,
        //       reviewerList:response.data.singlePolicy.reviewer
        //     });
        //     console.log("single Policy Reviewer==>"+this.state.reviewerList);
        //   })
          .catch(function(error){
            console.log(error);
          })          
        })
        .catch(function(error){
          console.log(error);
        })
      })
      .catch(function(error){
        console.log(error);
      })
    }
      
    renderDisplayReviewers(){  
      let newUserList=[];       
        let newUsers=[];
        let users=this.state.users;
        var reviewers=[];
        if(this.state.reviewerList!==undefined){      
          reviewers=this.state.reviewerList;
            console.log("Review:"+reviewers)
        }
        console.log("reviewers==>: "+reviewers)
        users.map(user=>{
            newUsers.push(user._id);
          })
          if(reviewers!==undefined){
            console.log("I am in if"+reviewers)
           // newUsers=newUsers.filter((newUser)=>reviewers.includes(newUser));
            newUsers = newUsers.filter(function(obj) { return reviewers.indexOf(obj) == -1; });
            newUserList=newUsers.filter((user)=>!reviewers.includes(user));
          } 
          console.log("New User List: "+newUserList+"new users"+newUsers) 
        const displayReviewers = (keyContact) => {
        return newUserList.map(newUser=>{
          console.log("keyContact.user_type ====>" + newUserList)
          if (keyContact.user_type === undefined && keyContact._id===newUser) {
              return (
                  <tr key={keyContact._id}>
                      <td><Input
                          type="checkbox"
                          value={keyContact._id}
                          defaultChecked={this.state.isSelected}
                          onClick={(e)=>this.keyContactsCheckboxHandler}
                      />
                      </td>
                      <td>{keyContact.fname + " " + keyContact.lname}</td>
                      <td>{keyContact.email}</td>
                      <td>{keyContact.position}</td>
                  </tr>
          );
        }
        })
         
      };
  
      return this.state.users.map(function(keyContact, keyContactIndex) {
          console.log("keyContact" + keyContact.fname)
        return displayReviewers(keyContact);
      });
                   
    }

    keyContactsCheckboxHandler(e){
      let reviewers =[];
      console.log(e.target.value)
      if(this.state.reviewerList!==undefined){      
        reviewers=this.state.reviewerList;
      }      
      console.log("this.state.isSelected: "+this.state.isSelected);
      if(e.target.checked){  
        this.setState({isSelected: !this.state.isSelected });     
        reviewers.push(e.target.value);
        console.log("Reviewers: "+reviewers)
      }
      else{
        for(let index=0;index<reviewers.length;index++){
          if(e.target.value===reviewers[index]){
            reviewers=reviewers.splice(index,1);
          }
        }
      }
      this.setState({
        reviewerList:reviewers
      });
      //for testing
      console.log("Testing"+this.state.reviewerList);      
    }

    renderDisplayPolicyStatus(){
      let status;
      if(this.state.singlePolicy.status==="not reviewed"){
        status="confirmation";
      }else if(this.state.singlePolicy.status==="confirmation"){
        status="adoption";
      }else if(this.state.singlePolicy.status==="adoption"){
        status="awareness";
      }else if(this.state.singlePolicy.status==="awareness"){
        status="reporting";
      }else if(this.state.singlePolicy.status==="awareness"){
        status="done";
      }
      else{
        status=this.state.singlePolicy.status;
      }
      console.log("status==>"+status);
      //this.setState({status:status});
      return(<span className="text-primary">{status}</span>)
    }     

      saveSubscribedPolicy(data){
        
        Axios.post('http://localhost:5000/updateSubscribedPolicy',data)
        .then(response=>{
          if(response.data.status==="success")
          {
            // toast("Saved successfully!",{
            //   type:"success",
            //   position:toast.POSITION.TOP_CENTER,
            //   onClose:()=>{
            //     this.props.history.push("subscribed-policies");
            //  }
            // });            
         }   
       })                           
    }


      startReviewButtonHandler(e){
        let newReviewerList=[];
        let reviewer_list=[];
        var isPolicyBlocked=false;
        if(!(window.confirm("Do you still need to add more reviewers in future?")))
            {
              isPolicyBlocked=true;       
            toast("The Policy will be sent to the reviewer/s to start the review workflow.",{
              type:"success",
              position:toast.POSITION.TOP_CENTER,
              onClose:()=>{
              this.props.history.push("subscribed-policies");
              }
            }); 
          }
        
        if(this.state.reviewerList!==undefined){
          this.state.reviewerList.forEach(reviewer=>{
             newReviewerList={
              reviewer_id:reviewer,
              reviewed_date:null,
              email:"",
              review_status: false,
              review_reminder_email_sent:false,
              review_reminder_email_error:false,
              review_first_email_sent_time:new Date().toUTCString(),
             }
             reviewer_list.push(newReviewerList);
          })
        }
      
        e.preventDefault()
            const data = {
            isPolicyBlocked:isPolicyBlocked,
            policy_name:localStorage.getItem('reviewpolicy'),
            policy_id:localStorage.getItem('reviewPolicyId'),
            company_name: localStorage.getItem("session_name"),
            companyId:localStorage.getItem('session_companyId'),
            policyName: this.state.singlePolicy.name,
            status: this.state.singlePolicy.status,
            content:null,
            reviewerList: this.state.reviewerList,
            reviewer_list:reviewer_list
        };
        
        console.log("Data Reviewer List: "+data.policy_id)
          this.saveSubscribedPolicy(data);

          // Axios.post("http://localhost:5000/reviewPolicy", {data} ).then(
          //   res => {
          //     console.log(res.data);
          //     if (res.data.value === "success") {
          //       toast("You have successfully started the review for this policy", { 
          //         type: "success", 
          //         position: toast.POSITION.TOP_CENTER,
          //         onClose: ()=> {
          //           window.location.href = 'subscribed-policies'
          //         }
          //       });
          //     } else {
          //       toast("Unsuccessful payment. Something went wrong, Try again", { 
          //         type: "error",
          //         position: toast.POSITION.TOP_CENTER,
          //       });
          //     }
          //   }
          // );
          }   

    
    render(){
      return(
        <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{transform:"none"}}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">
                    <span> Choose <strong> Key Contacts </strong> to start </span>
                    <span className="text-primary">{this.state.policyName}</span><br></br>
                    <span><strong>{this.renderDisplayPolicyStatus()} review.</strong></span>
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr> 
                        <th></th>                       
                        <th>Name</th>
                        <th>Email</th>
                        <th>Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderDisplayReviewers()}
                    </tbody>
                  </Table>
                  <Button
                      className="btn-round"
                      color="success"
                      style={{float:"right"}}
                      onClick={this.startReviewButtonHandler}
                  >
                    Start Review
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>  
        </>                         
      );
    }
  }
  export default ReviewPage;




