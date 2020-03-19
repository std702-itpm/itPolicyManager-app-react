import React from "react";
import Axios from "axios";
import { toast } from "react-toastify";

// reactstrap components
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
} from "reactstrap";

//import compnents
import QuestionForm from "components/Forms/QuestionForm.js";

class takeSurvey extends React.Component {
  constructor(props) {
    super(props);

    this.updateMatchPolicyList = this.updateMatchPolicyList.bind(this);
    this.filterMatchPolicy = this.filterMatchPolicy.bind(this);
    this.submitToDB = this.submitToDB.bind(this);
    this.state = {
      policies: [],
      matchedPolicies:[]
    };
  }

  componentDidMount(){
    var company={
      type:"company",
      _id:localStorage.getItem('session_name')
    }
    Axios.get("http://localhost:5000/company",{params:company})
    .then(response=>{
      this.state.matchedPolicies.push(response.data.match_policy);
      //this.setState({matchedPolicies:response.data.match_policy});
    })
  }

  /*! remove "No match Policy ID" and update the list */
  async updateMatchPolicyList(newMatchPolicy){
    var len = newMatchPolicy.length;
    var newPolicyList =[];
   
    //check for "No Match Policy and remove from the list"
    newMatchPolicy.forEach(policy => {
      if(policy !== "5df2a662c550f92dd4c02274" && policy !==""){
        newPolicyList.push(policy);
      }
    });
  // console.log("newpolicylist"+newPolicyList);

  const company = {
    name: localStorage.getItem("session_name"),
    policies: newPolicyList ,

  };
  Axios.post("http://localhost:5000/company", company)
    .then(response => {
      // console.log("response", response);
      if (response.data.result === "success") {
          toast("Survey Submitted. We'll provide suggestion shortly.", {
            type: "success",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.href = "survey-result";
            }
          });
        } else {
          toast("Survey not submitted! Something went wrong.", {
            type: "error",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.reload();
            }
          });
        }
    })
    .catch(function(error) {
      // console.log(error);
    });
}

 /*! Filter the list by removing duplicated suggested Policy as a survey result */
 filterMatchPolicy(matchedPolicies, sdgtedPolicies){
  var newMatchPolicy = [];
  var len2 = matchedPolicies.length;
  var len = sdgtedPolicies.length;
// console.log("MatchedPolicies"+matchedPolicies);
// console.log("sdgtedPolicies"+sdgtedPolicies);
    //loop matchPolicies list from Db and Suggested Policies from survey
    //Filter/remove matching policy for duplication
    if(!(len2===0)){
      newMatchPolicy = sdgtedPolicies.filter(function(policy){
        return !matchedPolicies.includes(policy);
      })
      // console.log("newMatchPolicy ==> " + newMatchPolicy);
    }else{
      newMatchPolicy=sdgtedPolicies;
    }
    
    // console.log("newMatchPolicy2 ==> " + newMatchPolicy);

    //Get Updated List
    this.updateMatchPolicyList(newMatchPolicy);
  }



  /**
   * SubmitToDB method:
   * after clicking on submit button it should direct to survey result page
   * with the suggested policies.
   */

  /*! Submit Button handler function to call API to procexs Survey answers */

  submitToDB() 
  {
    // console.log("submitToDB");
    const matchPolicies = [];
    //const surveyTakenDate = [];
    
    var matchedPolicies=this.state.matchedPolicies.toString().split(",");
    var sdgtedPolicies=this.state.policies;
    // console.log("sdgtedPolicies ==>" + sdgtedPolicies);
    // console.log("matchedPolicies ==> " +  matchedPolicies);

    //Filter the result suggested policy to not duplicate call server API
    this.filterMatchPolicy(matchedPolicies, sdgtedPolicies);
    
   
  }


  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Survey Form</CardTitle>
                </CardHeader>
                <CardBody>
                  <QuestionForm
                    onPoliciesChange={policies =>
                      this.setState({ policies: policies })
                    }
                  />
                <Button className="btn-round" color="success" style={{float: "right"}}
                    onClick={this.submitToDB}>
                    Submit
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

export default takeSurvey;
