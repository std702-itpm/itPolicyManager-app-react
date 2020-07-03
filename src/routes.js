
//common
import EditProfile from "views/commonPage/EditProfile.jsx";

//admin
import DashboardContent from "views/dashboardAdminSubPage/DashboardContent.jsx";
import Policies from "views/dashboardAdminSubPage/Policies.jsx";
import Subscribers from "views/dashboardAdminSubPage/Subscribers.jsx";
import inactiveSubscribers from "views/dashboardAdminSubPage/Inactive_Subscribers.jsx";
import EditPolicy from "views/commonPage/EditPolicy.jsx";
import Questions from "views/dashboardAdminSubPage/Questions.jsx";
import EditAssessment from "views/dashboardAdminSubPage/EditAssessment.jsx";
import addAccountablePerson from "views/dashboardUserSubPage/companyAdmin.jsx"

//client
import SurveyResult from "views/dashboardUserSubPage/SurveyResult.jsx";
import SubscribedPolicy from "views/dashboardUserSubPage/SubscribedPolicies.jsx";
import keyContactPerson from "views/dashboardUserSubPage/keyContactPerson.jsx";
import AddKeyContacts from "views/dashboardUserSubPage/AddKeyContact.jsx";
import ActionPage from "views/dashboardUserSubPage/policyActionViewPage.jsx";
import ReviewPage from "views/dashboardUserSubPage/reviewPage.jsx";
import DisplayPolicy from "views/commonPage/DisplayPolicy.jsx";
import printPreview from "views/commonPage/printPreview.jsx";
import takeSurvey from "views/dashboardUserSubPage/takeSurvey.jsx";

//Accountable person
import policyToSendAssessment from "views/dashboardAccountablePersonSubPage/PolicyToSendAssessment.jsx";
import sendAssessment from "views/dashboardAccountablePersonSubPage/Assessment.jsx";
import KeyContactPeople from "views/dashboardAccountablePersonSubPage/KeyContactPeopleForAssessment.jsx"

import PolicyDashboardView from "views/dashboardUserSubPage/PolicyDashboardView.jsx";
const userType = localStorage.getItem('session_type');
const userLogo = localStorage.getItem('session_logo');
//System Admin
var routesAdmin = [{
  path: "/dashboardcontent",
  pro: "true",
  name: "Dashboard",
  name2: "Dashboard",
  icon: "nc-icon nc-bank",
  component: DashboardContent,
  sidebar: true,
  layout: "/dashboard"
},
{
  path: "/policies",
  name: "Policies",
  name2: "Policies",
  icon: "nc-icon nc-paper",
  component: Policies,
  sidebar: true,
  layout: "/dashboard"
},
{
  path: "/editPolicy",
  name2: "Edit",
  component: EditPolicy,
  logo: userLogo,
  sidebar: false,
  layout: "/dashboard"
},
{
  path: "/subscribers",
  name: "Subscribers",
  name2: "Subscribers",
  icon: "nc-icon nc-single-02",
  component: Subscribers,
  sidebar: true,
  layout: "/dashboard"
},

{
  path: "/inactiveSubscribers",
  name: "Inactive Subscribers",
  name2: "Subscribers",
  icon: "nc-icon nc-single-02",
  component: inactiveSubscribers,
  sidebar: true,
  layout: "/dashboard"
},

{
  path: "/edit-profile/" + localStorage.getItem("session_id"),
  name: "Edit Profile",
  name2: "Edit Profile",
  icon: "nc-icon nc-badge",
  component: EditProfile,
  sidebar: true,
  layout: "/dashboard"
},
{
  path: "/edit-questions",
  name: "Questions",
  name2: "Questions",
  icon: "nc-icon nc-paper",
  component: Questions,
  sidebar: true,
  layout: "/dashboard"
},
{
  path: "/edit-assessment/:id",
  name: "Edit Assessment",
  name2: "Edit Assessment",
  icon: "nc-icon nc-paper",
  component: EditAssessment,
  sidebar: false,
  layout: "/dashboard"
},
];
//Company initiator
var routesCompanyInitiator = [
  {
    path: "/survey-result",
    name: "Policy Dashboard",
    name2: "Policy Dashboard & Survey Result",
    icon: "nc-icon nc-alert-circle-i",
    component: SurveyResult,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/Company_Admin",
    name: "Company Admin",
    name2: "Company Admin",
    icon: "nc-icon nc-single-02",
    component: addAccountablePerson,
    sidebar: true,
    layout: "/dashboard"
  },

  {
    path: "/edit-profile/" + localStorage.getItem("session_id"),
    name: "Edit Profile",
    name2: "Edit Profile",
    icon: "nc-icon nc-badge",
    component: EditProfile,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/subscribed-policies",
    name: "Subscribed Policies",
    name2: "Subscribed Policies",
    icon: "nc-icon nc-book-bookmark",
    component: SubscribedPolicy,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/keyContactPerson",
    name: "Key Contact Person",
    name2: "Key Contact Person",
    icon: "nc-icon nc-simple-add",
    component: keyContactPerson,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/PolicyDashboardView/:id",
    name: "Policy Dashboard View",
    name2: "Policy Dashboard View",
    icon: "nc-icon nc-paper",
    component: PolicyDashboardView,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/subscribed-policy-action",
    name2: "Policy Details",
    component: ActionPage,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/subscribed-policy-action-start-workflow",
    name2: "Review Details",
    component: ReviewPage,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/AddkeyContacts",
    name2: "Add Key Contacts",
    component: AddKeyContacts,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/DisplayPolicy",
    name2: "Policy Informtion",
    component: DisplayPolicy,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/printPreview",
    component: printPreview,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/take-survey",
    name2: "take survey",
    component: takeSurvey,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },{
    path: "/sendassessment",
    name: "Send Assessment",
    name2: "Send Assessment",
    icon: "nc-icon nc-simple-add",
    component: policyToSendAssessment,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/send-assessment-action",
    name2: "Assessment Details",
    component: sendAssessment,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/keyContactPeople-ForAssessment",
    name: "Key Contact People",
    name2: "Key Contact People",
    icon: "nc-icon nc-simple-add",
    component: KeyContactPeople,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  }
];
//Company Admin
var routesAccountablePerson = [
  {
    path: "/dashboardcontent",
    pro: "true",
    name: "Dashboard",
    name2: "Dashboard",
    icon: "nc-icon nc-bank",
    component: DashboardContent,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/subscribed-policies",
    name: "Subscribed Policies",
    name2: "Subscribed Policies",
    icon: "nc-icon nc-book-bookmark",
    component: SubscribedPolicy,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/keyContactPerson",
    name: "Key Contact Person",
    name2: "Key Contact Person",
    icon: "nc-icon nc-simple-add",
    component: keyContactPerson,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/sendassessment",
    name: "Send Assessment",
    name2: "Send Assessment",
    icon: "nc-icon nc-simple-add",
    component: policyToSendAssessment,
    logo: userLogo,
    sidebar: true,
    layout: "/dashboard"
  },
  {
    path: "/send-assessment-action",
    name2: "Assessment Details",
    component: sendAssessment,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
  {
    path: "/keyContactPeople-ForAssessment",
    name: "Key Contact People",
    name2: "Key Contact People",
    icon: "nc-icon nc-simple-add",
    component: KeyContactPeople,
    logo: userLogo,
    sidebar: false,
    layout: "/dashboard"
  },
]

var routes = []

if (userType === "admin") {
  routes = routesAdmin;
}
else if (userType === "Accountable Person") {
  routes = routesAccountablePerson
}
else if (userType === "comp_initiator") {
  routes = routesCompanyInitiator;
}

export default routes;
