import React from "react";
import Axios from "axios";

// reactstrap components
import {
    Button,
    Container,
    Row,
} from "reactstrap";
// // styles
import "assets/css/bootstrap.min.css";
import ITPMLogo from "../assets/img/ITPM-02.png"

export default class policyView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentPolicy: [] };
    }

    componentDidMount() {
        let policy_id = this.props.match.params.id
        Axios.get("http://localhost:5000/getOnePolicy/" + policy_id)
            .then(response => {
                console.log(response)
                this.setState({
                    currentPolicy: response.data
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
                                Policy ID:  {this.state.currentPolicy._id}<br />
                                Policy Name: {this.state.currentPolicy.policy_name}<br /><br />
                                Content: <br /> {this.state.currentPolicy.content} <br /><br />
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
