//This component is layout for assessment
import React, {
    Component
} from "react";
import Axios from "axios";

import {
    FormGroup,
    Input,
    InputGroup,
} from "reactstrap";

class AssessmentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assessment: [],
            policies: [],
        };
    }

    componentDidMount() {
        Axios.get('http://localhost:5000/assessment')
            .then(response => {
                console.log('response', response)
                this.setState({
                    assessment: response.data
                });
                
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate() {
        document.body.classList.remove("register-page");
    }

    assessmentList() {
        const handleOnChange = (option, assessmentIndex) => {
            const policies = this.state.policies;
            policies[assessmentIndex] = option.policy;
            this.setState({ policies: policies });
            this.props.onPoliciesChange(this.state.policies);
            
        }
        return this.state.assessment.map(function (assessment, assessmentIndex) {
            return ( 
                <FormGroup>
                    <label key={assessmentIndex}>{ assessment.assessment_content }</label>  
                    <InputGroup className = "form-group-no-border" >
                        <div className = "form-check"> 
                        {
                            assessment.options.map(function (option, optionIndex) {
                                console.log("option: " + option.name);
                                return ( 
                                    <>
                                    <div>
                                        <label key={assessmentIndex}>
                                            <Input type = "radio"
                                            name = { assessmentIndex }
                                            value = { option.name }
                                            className = "form-check-input"
                                            onClick = {() => handleOnChange(option, assessmentIndex)}
                                            /> 
                                            {option.name} 
                                        </label> 
                                    </div >
                                    </>
                                )
                            })
                        } 
                        </div> 
                    </InputGroup> 
                </FormGroup>
            )
        }
    )
}

render() {
    return( 
        <>
            <h5 > Start Assessment </h5> {
            this.assessmentList()
        } 
        </>
    );
}

}

export default AssessmentForm;