import React from "react";
import Axios from 'configs/AxiosConfig';
import editSubscriber from "../commonPage/addNewSubscriber.jsx";
import Policies from "../commonPage/EditProfile.jsx";


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
  Modal,
} from "reactstrap";
import RegModal from "views/commonPage/addNewSubscriber.jsx";
import { toast } from "react-toastify";

class Subscribers extends React.Component {
  constructor(props) {
    super(props);

    this.openModal = this.openModal.bind(this);
    this.openModal1=this.openModal1.bind(this);
    this.openModal2=this.openModal2.bind(this);
    this.onDeleteClick=this.onDeleteClick.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.displaySubscribers = this.displaySubscribers.bind(this);
    this.displayDetails = this.displayDetails.bind(this);
    this.state = {
      companies: [],
      modal: false,
      index: "",
      company: [],
      btnName:"",
      subscriberId:""
    };
  }

  componentDidMount() {
    Axios.get("/company", {
      params: {type: "companyAll" }
    })
      .then(response => {
        this.setState({
          companies: response.data
        });
        console.log("Companies: "+this.state.companies)
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  openModal1(){
    this.setState({
      modal: true,
      btnName:""
    });
    return(
      <editSubscriber/>
    );
  }

  openModal2(index){
    this.setState({
      modal: true,
      btnName:"edit",
      subscriberId:index
    });
    return(
      <Policies/>  
    )
}

onDeleteClick(subscriberId){
  console.log(subscriberId);
  const subscriberDetails={
    companyId:subscriberId,
    status:false,
  };
  if(window.confirm("Are you sure you want to remove this subscriber permanently?")){
    Axios.post("/deleteprofile",subscriberDetails).then(
      res=>{
        if(res.data.status==="success"){
          toast("Deleted successfully!",{
            type:"success",
            position:toast.POSITION.TOP_CENTER,
            onClose:()=>{window.location.reload();}
          });          
        }
        else{
          toast("Something went wrong!!!",{
            type:"error",
            position:toast.POSITION.TOP_CENTER,
            onClose:()=>{window.location.reload();}
          });
        }
      }
    )
  }
  else{
    window.location.reload();
  }
}

  displaySubscribers() {
    return this.state.companies.map((company, index) => {
      let subscription
      // console.log(company._id)
      let name = company.company_name;
      let length = company.subscribed_policy.length
      if(length !== 0){
        subscription = <i className="nc-icon nc-check-2 text-success" />
      }else{
        subscription = <i className="nc-icon nc-simple-remove text-warning" />
      }
      if(company.company_name !== "IT_policy manager"){
        return (
            <tr key={index}>
              <td key={name} className="text-center">{name}</td>
              <td key={index + 2} className="text-center">{subscription}</td>
              <td key={index + 3} className="text-center">
                  <Button
                      className="btn-round"
                      style={{'marginRight':'7px'}}
                      color="info"
                      onClick={e=> this.openModal(index)}
                      title="to details Modal"
                      type="button"
                      id="details"
                      name="details"
                  >
                      Details
                  </Button>
                  <Button
                      className="btn-round btn-warning"
                      style={{'marginRight':'7px'}}
                      type="button"
                      onClick={()=>this.openModal2(company._id)}                      
                  >
                    <i className="pencil icon"/>
                    Edit
                  </Button>
                  <Button
                      className="btn-round btn-danger"
                      style={{'marginRight':'7px'}}
                      type="button"
                      onClick={()=>this.onDeleteClick(company._id)}
                  >
                    Delete
                  </Button>
              </td>
            </tr>
        )
      }else {
        return(
          <>
          </>
        );
      }
    });
  }
  openModal(index){
    this.setState({
      modal: !this.state.modal,
      index: index,
      company:this.state.companies[index],
      btnName:"details"
    });
    console.log(this.state.companies[index].company_name)
  }
  showModal(){
    return(
      <div>
              <div  className="modal-header">
          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={this.toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
                  <h5
                      className="modal-title text-center"
                      id="exampleModalLabel"
                  >
                  <h4>New Subscriber</h4>
                  </h5>
              </div>
              <RegModal/>
              </div>
    );
  }
  displayDetails() {
    console.log(this.state.company)
    return(
      <>
        <div className="modal-header">
          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={this.toggleModal}
          >
            <span aria-hidden={true}>×</span>
          </button>
          <h5>{this.state.company.company_name}</h5>
        </div>
        <div className="modal-body">
          <label>
            <strong>NZBN:</strong> {this.state.company.nzbn}
          </label><br></br>
          <label>
            <strong>Email:</strong> {this.state.company.company_email}
          </label><br></br>
          <label>
            <strong>Date Registered:</strong> {this.state.company.date_registered}
          </label><br></br>
          <label>
            <strong>Address:</strong> {this.state.company.address}
          </label><br></br>
          <label>
            <strong>Contact #:</strong> {this.state.company.contact}
          </label><br></br>
          <label>
            <strong>Description:</strong> {this.state.company.description}
          </label><br></br>
        </div>        
      </>
    )
      
  }
  toggleModal(e){
    e.preventDefault();
      this.setState({
        modal: false,
        index: ""
      });
  };
  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col className="ml-auto mr-auto" md="8">
              <Card className="card-upgrade" style={{transform: 'none'}}>
                <CardHeader className="text-center">
                  <CardTitle tag="h4">Subscribed Company</CardTitle>
                  <p className="card-category">
                    List of subscribed companies and subscription status
                  </p>
                </CardHeader>
                <CardBody>
                <Button
                      className="btn-round"
                      style={{'marginRight':'12px'}}
                      color="success"
                      name="createNew"
                      id="createNew"
                      onClick={()=>this.openModal1()}
                  >
                    Create New
                  </Button>   
                  <Table responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Company Name</th> 
                        <th className="text-center">Subscription Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.displaySubscribers()}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal} size="xl">
          {(()=>{
            switch(this.state.btnName){
              case "details": return this.displayDetails()
              case "":return this.showModal()
              case "edit": return <Policies subscriberId={this.state.subscriberId}/>
              default : return <RegModal/>
            }
          })()}
        </Modal>
      </>
    );
  }
}
export default Subscribers;