
import React from "react";
import Axios from "axios";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class SubscribedPolicies extends React.Component {
  constructor(props){
    super(props);
    this.tableDisplay = this.tableDisplay.bind(this);
    this.reviewButtonHandler = this.reviewButtonHandler.bind(this);
    this.tableDataDisplay = this.tableDataDisplay.bind(this);
    this.state = ({
      sub_policy: [],
      modal: false,
    });
  }

  componentDidMount() {
    localStorage.removeItem('reviewPolicy');
    // console.log("ID: " + localStorage.getItem("session_id"));

    Axios.get("http://localhost:5000/getSubscribedPolicy", {
      params: { 
        company_id: localStorage.getItem("session_id"),
        policy_id:""
    }
    })
      .then(response => {
        // console.log("response", response);
        this.setState({
          sub_policy: response.data
        });
        console.log(this.state.sub_policy);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  toggleModal(){
    this.setState({
      modal: !this.state.modal
    });
  };

  reviewButtonHandler(e,id) {
    localStorage.setItem('reviewPolicyId',id);
    localStorage.setItem('reviewPolicy', e.target.value)
    // console.log(localStorage.getItem('reviewPolicy')); //Testing
    this.props.history.push("subscribed-policy-action");
  }

  tableDataDisplay(){
    
      return this.state.sub_policy.map((policy,index) =>{
        //console.log("policies: " + policy.version);
        return (
          <>
            <tr key={index}>
              <td key={policy.policy_name}>{policy.policy_name}</td>
              <td key={policy.status}>{policy.status}</td>
              <td key={policy.version}>{policy.version}</td>
              <td key={policy.policy_id + 0} className="text-center">
                <Button className="btn-round"
                  style={{'marginRight':'7px'}}
                  color="success"
                  value= {policy.policy_name}
                  onClick={(e)=>this.reviewButtonHandler(e,policy.policy_id)}>
               Details
                </Button>
              </td> 
            </tr>
          </>
        )
      })
   
  }

  tableDisplay(){
    return(
        <Table responsive>
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Status</th>
              <th>Version</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              this.tableDataDisplay()
            } 
          </tbody>
        </Table>  
    )
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="10">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Subscribed Policies</CardTitle>
                  <p className="card-category">
                    List of your subscribed policies and its status.
                  </p>
                </CardHeader>
                <CardBody>
                  {this.state.sub_policy.length !== 0 ? this.tableDisplay():<p>
                                <span style={{color: "red"}}>No Subscription yet!</span><br></br><br></br>
                                  You can subscribed to any IT policy you need by taking the survey and purchasing suggested policy/ies.
                  </p>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default SubscribedPolicies;
