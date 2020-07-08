import React from "react";
import Axios from 'configs/AxiosConfig';
import PolicyViewer from "components/PolicyViewer/PolicyViewer";

// reactstrap components
import {
    Button,
} from "reactstrap";

// // styles
import "assets/css/bootstrap.min.css";

export default class PolicyDashboardView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            policyId: null,
            policyName: null,
            policyContent: null
        };
    }

    componentDidMount() {
        let policy_id = this.props.match.params.id
        Axios.get("/getOnePolicy/" + policy_id)
            .then(response => {
                this.setState({
                    policyId: response.data._id,
                    policyName: response.data.policy_name,
                    policyContent: response.data.content.join("<br>"),
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /*To show the content of the policy*/
    render() {
        return (
            <div>
                <div className="section text-center">
                    <p>
                        <br/>
                        Policy ID: {this.state.policyId}<br/>
                        Policy Name: {this.state.policyName}<br/><br/>
                        Content:
                        <br/><br/>
                        <PolicyViewer key={this.state.policyId} policyContent={this.state.policyContent}/>
                        <br/><br/>
                    </p>
                    <Button>
                        <a href="/dashboard/survey-result"
                           className="btn-round"
                           color="success"
                           style={{float: "right"}}>
                            Home
                        </a>
                    </Button>
                </div>
            </div>
        )
    }
}
