
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import {StripeProvider} from 'react-stripe-elements';
// styles
import "assets/css/bootstrap.min.css";
import "assets/scss/paper-kit.scss";

import "./assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// pages
import LandingPage from "views/LandingPage.js";
// import ProfilePage from "views/landingSubPage/ProfilePage.js";
import ContactUsPage from "views/landingSubPage/ContactUsPage.js";
import SurveyPage from "views/landingSubPage/SurveyPage.js";
import SignIn from "views/landingSubPage/SignIn.js";
import RegisterModal from "views/landingSubPage/RegisterModal.js";
import Dashboard from "views/Dashboard.jsx";
import PaySubscription from 'views/commonPage/PaySubscription.js';
import DisplayReviewPolicy from "views/commonPage/DisplayReviewPolicy.jsx";
import editSubscriber from "views/commonPage/addNewSubscriber.jsx";
import PolicyView from "views/PolicyView";
import PolicyDashboardView from "views/dashboardUserSubPage/PolicyDashboardView.jsx";
import SendAssessment from "views/dashboardAccountablePersonSubPage/SendAssessment.jsx";


// others

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route 
        path="/landing-page" 
        render={props => <LandingPage  {...props} />} />
      <Route 
        exact path="/policy-view/:id" 
        render={props => <PolicyView  {...props} />} />
      <Route 
        exact path="/PolicyDashboardView/:id" 
        render={props => <PolicyDashboardView  {...props} />} />  
      {/* <Route
        path="/profile-page"
        render={props => <ProfilePage {...props} />}
      /> */}
      <Route
        path="/signin-page"
        render={props => <SignIn {...props} />}
      />
      <Route
        path="/register-modal"
        render={props => <RegisterModal {...props} />}
      />
      <Route
        path="/contactus-page"
        render={props => <ContactUsPage {...props} />}
      />
      <Route
        path="/survey-page"
        render={props => <SurveyPage {...props} />}
      />
      <Route
        path="/dashboard"
        render={props => <Dashboard {...props} />}
      />
      <Route
        path="/subscription-payment"
        render={props => (
        <StripeProvider apiKey="pk_test_8Y0fO0o3fsqMsbciyZKt1YTI" >
          <PaySubscription {...props} />
        </StripeProvider>
        )}
      />
      
      <Route
        path="/review-policy/:companyId/:policyName/:userId"
        render={props => <DisplayReviewPolicy key = {props.match.params.userId} {...props} />}
      />

      <Route
        path="/send-assessment/:policyId/:userId"
        render={props => <SendAssessment key = {props.match.params.userId} {...props} />} 
      /> 
      <Redirect to="/landing-page" /> */}
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
