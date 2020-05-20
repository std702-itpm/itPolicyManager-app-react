import * as React from "react";
import StripeCheckout from "react-stripe-checkout";
import { injectStripe, Elements /*CardElement*/ } from "react-stripe-elements";
import Axios from "axios";
import { toast } from "react-toastify";

// reactstrap components
import {
  Row,
  Col
} from "reactstrap";
import 'react-toastify/dist/ReactToastify.css';
import "assets/css/stripe.css";

toast.configure();

class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: localStorage.getItem('session_name'),
      amount: 100.0, 
      policyIdList: [],
      policyList:[]
    };

    this.handleSubscribed = this.handleSubscribed.bind(this);

    document.documentElement.classList.remove("nav-open");
  }

  componentDidMount() {
    //assign value for subscribed policies and get from the localstorage 
    const subscribedPolicies = localStorage.getItem('subscribedPolicies') || ''
    this.setState({policyIdList: subscribedPolicies.split(',')})    
  }
  
  async handleSubscribed (token, addresses){
    console.log({ token, addresses });
    const product = {
      name: this.state.name,
      amount: this.state.amount,
      policies: this.state.policyIdList
    };    
    
    for(var i=0;i<this.state.policyIdList.length;i++){
      //get policy list from policies collection from the database by id 
      Axios.get("http://localhost:5000/policies",
      {params: {type:"one",_id:this.state.policyIdList[i] }})
      .then(response=>{ 
        alert(response.data);       
        this.addData(response.data);
      });
    }   
    const response = await Axios.post("http://localhost:5000/create_paymentintent", { token, product });
      //console.log("Response:", response.data.status);
      if (response.data.status === "success") {
        toast("Payment successful! Check your email for details", { 
          type: "success", 
          position: toast.POSITION.TOP_CENTER,
          onClose: ()=> {
            window.location.href = '/dashboard/subscribed-policies'
          }
        });
      } else {
        toast("Unsuccessful payment. Something went wrong, Try again", { 
          type: "error",
          position: toast.POSITION.TOP_CENTER,
        });
      }
  };

  addData(data){
    var policyData={
      companyId:localStorage.getItem('session_companyId'),
      policyId:data._id,
      content:data.content,
      name:data.policy_name,
      reviewed_date:"",
      approval_date:"",
      date_subscribed:Date.now(),
      status: "not reviewed",
      version:1   
      // reviewer_list:[{
      //   review_status: false,
      //   review_reminder_email_sent:false,
      //   review_reminder_email_error:false,
      //   review_first_email_sent_time:"",
      // }]
    }
    console.log("PolicyData: "+policyData)
    //inserted subscribed policies in subscribed policy collection in the database
    Axios.post("http://localhost:5000/addSubscribedPolicy",policyData);
  }

  render() {
    return (
      //layout for payment form for policy subscription
      <Elements>
        <Row>
          <Col lg="6">
            <div>
              <h1
                style={{
                  marginTop: "120px",
                  marginRight: "15px",
                  fontSize: "16px"
                }}
              >
                Subscription Summary
              </h1>
              <span className="fontStyle">Thank you for subscribing!</span>
              <br></br>
              <br></br>
              <span>
                Your card will be charge for an annual subscription to the
                service and you will be notified before your subscription ends
                for renewal to continue using the service.
              </span>
              <br></br>
              <br></br>
            </div>
          </Col>
          <Col lg="6">
            <h1
              style={{
                marginTop: "120px",
                marginRight: "15px",
                fontSize: "16px"
              }}
            >
              Payment Method
            </h1>
            <span>Total amount:</span>
            <br></br>
            <div className="flex-item width-fixed">
              <span className="TotalAmount">$100</span>
              <span class="ProductSummaryTotalAmount-BillingInterval">
                <sub>annually</sub>
              </span>
            </div>
            <br></br>
            <StripeCheckout
              stripeKey="pk_test_6KfHVFBMFj3g5bsKv6qIiXbV00zomUO8sV"
              token={this.handleSubscribed}
              amount={this.state.amount * 100}
              currency="NZD"
              name="Policy Subscription"
            >
              <button className="btn btn-primary">
                <span>Pay now</span>
              </button>
            </StripeCheckout>
          </Col>
        </Row>
      </Elements>
    );
  }
}

export default injectStripe(PaymentForm);
