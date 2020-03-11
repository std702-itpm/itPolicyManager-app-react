
import React from "react";
import { Link } from "react-router-dom"
import Axios from "axios";
import EditPolicy from '../commonPage/EditPolicy.jsx';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Modal
} from "reactstrap";

class Policies extends React.Component {
  constructor(props){
    super(props);
    this.displayPolicies = this.displayPolicies.bind(this);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    this.addPolicy=this.addPolicy.bind(this);
    this.editPolicy=this.editPolicy.bind(this);
    this.DeletePolicy=this.DeletePolicy.bind(this);
    this.toggleModal=this.toggleModal.bind(this);

=======
    this.AssessmentBtn = this.AssessmentBtn.bind(this);
>>>>>>> Stashed changes
=======
    this.AssessmentBtn = this.AssessmentBtn.bind(this);
>>>>>>> Stashed changes
    this.state = {
      policies: [],
      policyId:"",
      btnName:"",
      modal:false
    };
  }

  componentDidMount() {
    Axios.get("http://localhost:5000/policies", {
      params: {type: "all" }
    })
      .then(response => {
        this.setState({
          policies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  AssessmentBtn(policy_id){
    //  get the id

    // display the information for specific policy using policy id


    // Redirect to page
    // this.props.history.push('/dashboard/inactiveSubscribers');
  }

  displayPolicies(policies){
    return policies.map((policy, index) => {
      return (
        <tr>          
          <td>{policy.policy_name}</td>
          <td className="text-center">
              <Button
                className="btn-warning btn-round"
                href="#pablo"
                onClick={e => this.editPolicy(policy._id)}
              >
                Edit
              </Button>
              {" "}
              <Button
                className="btn-danger btn-round"
                href="#pablo"
                onClick={e => this.DeletePolicy()}
              >
                Delete
              </Button>
              {" "}
              <Link
                to={`/dashboard/edit-assessment/${policy._id}`}
                className="btn-success btn-round"
                onClick={()=>this.AssessmentBtn()}
              >
                Assessment                
              </Link>
          </td>
        </tr>
      );
    })
  }

  addPolicy(){
    this.setState({modal:true});
  }

  editPolicy(id){
    this.setState({btnName:"edit",policyId:id,modal:true});
      //this.props.history.push('editPolicy');
      //<AddOrEditPolicy/>
  }

  toggleModal(e){
    e.preventDefault();
    this.setState({
      modal:false,
      policyId:""
    })
  }

  DeletePolicy(){
    alert("HI");
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="8">
              <Card className="card-upgrade" style={{ transform: "none" }}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Policies</CardTitle>
                  <p className="card-category">
                    List of available policies in the system.
                  </p>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                    <tr><Button outline color="success" className="btn-round" onClick={e=>this.addPolicy()}>Add Policy</Button></tr>
                      <tr>
                        <th className="text-center">Policy Name</th>
                        <th className="text-center">Action</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                     {this.displayPolicies(this.state.policies)}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="xl">
           <EditPolicy policyId={this.state.policyId}/>
        </Modal>
      </>
    );
  }
}

export default Policies;
