import React from "react";
import Axios from 'configs/AxiosConfig';

// reactstrap components
import {
    Button,
    Container,
    Row,
} from "reactstrap";
// // styles
import "assets/css/bootstrap.min.css";
import ITPMLogo from "../assets/img/ITPM-02.png"
import PolicyViewer from "../components/PolicyViewer/PolicyViewer";

export default class policyView extends React.Component {
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
                console.log(response)
                this.setState({
                    policyId: response.data._id,
                    policyName: response.data.policy_name,
                    policyContent: response.data.content.join("<br>"),
                });
                // console.log(this.state.contents);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>

                <div className="section text-center">
                    <Container>
                        <Row>
                            <img src={ITPMLogo}
                                alt="ITPM Logo"
                                width="200px"
                                height="100px"
                                style={{ float: "right" }}
                            />
                            <p>
                                Policy ID:  {this.state.policyId}<br />
                                Policy Name: {this.state.policyName}<br /><br />
                                Content: <br/>
                                <PolicyViewer key={this.state.policyId} policyContent={this.state.policyContent} />
                                <br/><br/>
                            </p>

                            <Button>
                                <a href="/landing-page"
                                    className="btn-round"
                                    color="success"
                                    style={{ float: "left" }} >

                                    Home
            </a>
                            </Button>
                        </Row>
                    </Container>
                </div>
            </div>
        )
    }
}
