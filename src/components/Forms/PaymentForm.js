import * as React from "react";
import StripeCheckout from "react-stripe-checkout";
import { injectStripe, Elements /*CardElement*/ } from "react-stripe-elements";
import Axios from 'configs/AxiosConfig';
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
      Axios.get("/getOnePolicy/" + this.state.policyIdList[i])
      .then(response=>{
        this.addData(response.data);
      });
    }   
    const response = await Axios.post("/create_paymentintent", { token, product });
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
    //inserted subscribed policies in subscribed policy collection in the database
    Axios.post("/addSubscribedPolicy",{
      companyId:localStorage.getItem('session_companyId'),
      policyData:data
    });
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
