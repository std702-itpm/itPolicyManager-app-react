import React from "react";
import Axios from "axios";
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
import { toast } from "react-toastify";
import { textSpanIsEmpty } from "typescript";

class inactiveSubscribers extends React.Component {
  constructor(props) {
    super(props);
    this.activeClient=this.activeClient.bind(this);
    this.displaySubscribers = this.displaySubscribers.bind(this);
    this.state = {
      companies: [],
      modal: false,
      index: "",
      company: [],
    };
  }

  componentDidMount() {
    Axios.get("http://localhost:5000/company", {
      params: {type: "companyAllInactive" }
    })
      .then(response => {
        this.setState({
          companies: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
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
                      title="to details Modal"
                      type="button"
                      onClick={()=>this.activeClient(company._id)}
                  >
                      Active
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
  
  activeClient(subscriberId){
      const subscriberDetails={
          companyId:subscriberId,
          status:true
      }
      Axios.post("http://localhost:5000/deleteprofile",subscriberDetails).then(
          res=>{
              if(res.data.status==="success"){
                  toast("Subsciber is re-activated!",{
                      type:"success",
                      position:toast.POSITION.TOP_CENTER,
                      onClose:()=>{window.location.reload();}
                  });
               }
               else
               {
                   toast("Something went wrong!",{
                       type:"error",
                       position:toast.POSITION.TOP_CENTER,
                       onClose:()=>{window.location.reload();}
                   });

                   
               }
            }
        );
    }
  
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
      </>
    );
  }
}
export default inactiveSubscribers;