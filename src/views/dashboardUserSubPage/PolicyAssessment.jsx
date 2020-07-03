import React from "react";
import { Link } from "react-router-dom";
import Axios from 'configs/AxiosConfig';
import Api from "services/Api"

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Button,
    Row,
    Col,
} from "reactstrap";

/**
 * Path: /subscribed-policy-assessment
 */
class PolicyAssessment extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
        });
        this.api = new Api();
    }

    componentDidMount() {
    }


    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col className="ml-auto mr-auto" md="10">
                            <Card className="card-upgrade" style={{ transform: "none" }}>
                                <CardHeader className="text-center">
                                    <CardTitle tag="h4">{this.state.policyName}</CardTitle>
                                    <p>Plese select employees below to start the awareness workflow</p>
                                </CardHeader>
                                <CardBody>
                                    <blockquote className="blockquote">
                                        {this.renderPolicyDetails()}
                                    </blockquote>
                                    <ul>
                                        <li>
                                            
                                        </li>
                                    </ul>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        )
    }

}
export default PolicyAssessment;
