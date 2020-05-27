
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

import logo from "assets/img/ITPM-03.png";
//create functionality for getting the company's logo

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  getBrand() {
    let companyName = localStorage.getItem('session_name');
    return companyName ? companyName : "IT Policy Manager";
  }

  render() {
    return (
      <div className="sidebar" data-color={this.props.bgColor} data-active-color={this.props.activeColor}>
        <div className="logo">
          <a href="/dashboard/dashboardcontent" className="simple-text logo-mini">
            <div className="logo-mini">
              <img src={logo} alt="react-logo" />
            </div>
          </a>
          <a href="/dashboard/dashboardcontent" className="simple-text logo-normal">
            {this.getBrand()}
          </a>
        </div>
        <div className="sidebar-wrapper" ref={this.sidebar}>
          <Nav>
            {this.props.routes.filter(prop => prop.sidebar).map((prop, key) => {
              return (
                <li className={this.activeRoute(prop.path) + (prop.pro ? " active-pro" : "")}
                  key={key}>
                  <NavLink to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active">
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            })}
          </Nav>
        </div>
      </div>
    );
  }
}

export default Sidebar;
