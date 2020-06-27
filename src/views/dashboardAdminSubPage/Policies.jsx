import React from "react";
import Axios from 'configs/AxiosConfig';
import EditPolicy from '../commonPage/EditPolicy.jsx';
import LoaderSpinner from "components/Commons/LoaderSpinner/LoaderSpinner";

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
import {toast} from "react-toastify";

class Policies extends React.Component {
  constructor(props) {
    super(props);
    this.displayPolicies = this.displayPolicies.bind(this);
    this.addPolicy = this.addPolicy.bind(this);
    this.editPolicy = this.editPolicy.bind(this);
    this.DeletePolicy = this.DeletePolicy.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.AssessmentBtn = this.AssessmentBtn.bind(this);

    this.state = {
      policies: [],
      policyId: "",
      btnName: "",
      modal: false,
      displayLoaderSpinner: false,
    };
  }

  componentDidMount() {
    Axios.get("/policies", {
      params: { type: "all" }
    })
      .then(response => {
        this.setState({
          policies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  AssessmentBtn(policy_id) {
    //  get the id

    // display the information for specific policy using policy id

    // Redirect to page
    // this.props.history.push('/dashboard/inactiveSubscribers');
  }

  displayPolicies(policies) {
    return policies.map((policy, index) => {
        return (
          <tr>
            <td>{policy.policy_name}</td>
            <td className="text-center">
              <Button
                className="btn-warning btn-round mx-1"
                onClick={e => this.editPolicy(policy._id)}
              >Edit</Button>
              <Button
                className="btn-danger btn-round mx-1"
                onClick={() => this.DeletePolicy(policy)}
              >Delete</Button>
              <Button
                to={`/dashboard/edit-assessment/${policy._id}`}
                className="btn-success btn-round mx-1"
                onClick={() => this.AssessmentBtn()}
              >Assessment</Button>
            </td>
          </tr>
        );
    })
  }

  addPolicy() {
    this.setState({ modal: true });
  }

  editPolicy(id) {
    this.setState({ btnName: "edit", policyId: id, modal: true });
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({
      modal: false,
      policyId: ""
    })
  }

  DeletePolicy(policy) {
    if (window.confirm("Are you sure you want to delete policy " + policy.policy_name)){
      this.setState({displayLoaderSpinner: true});
      Axios.delete('/policies/' + policy._id)
        .finally(() => {
          this.setState({displayLoaderSpinner: false});
        })
        .then(() => {
          toast('"' + policy.policy_name + '" has been successfully deleted', {
            type: "success",
            position: toast.POSITION.TOP_CENTER,
            onClose: () => {
              window.location.reload();
            }
          });
        })
        .catch((err) => {
          if(err.response) {
            toast(err.response.data.message, {
              type: "error",
              position: toast.POSITION.TOP_CENTER
            });
          } else {
            toast("The connection lost", {
              type: "error",
              position: toast.POSITION.TOP_CENTER
            });
          }
        })
    }
  }

  render() {
    return (
      <>
        {/* Loader spinner */}
        {this.state.displayLoaderSpinner ? <LoaderSpinner/> : null}
        {/* Content */}
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
                      <tr>
                        <Button
                            outline color="success"
                            className="btn-round"
                            onClick={this.addPolicy}
                        >Add Policy</Button>
                      </tr>
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
          <EditPolicy policyId={this.state.policyId} />
        </Modal>
      </>
    );
  }
}

export default Policies;
