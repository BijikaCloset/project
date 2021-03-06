/*
 *
 * Login
 *
 */

import React from "react";
import { connect } from "react-redux";

import { Row, Col } from "reactstrap";
import { Redirect, Link } from "react-router-dom";

import actions from "../../actions";
import Input from "../../components/Input";
import Button from "../../components/Button";
import LoadingIndicator from "../../components/LoadingIndicator";
import SignupProvider from "../../components/SignupProvider";

class Login extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting,
    } = this.props;

    if (authenticated) return <Redirect to="/dashboard" />;

    const registerLink = () => {
      this.props.history.push("/register");
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      login();
    };

    return (
      <div className="login-form">
        {isLoading && <LoadingIndicator />}
        <h1>Login</h1>
        <hr />
        <form onSubmit={handleSubmit} noValidate>
          <Row>
            <Col
              xs={{ size: 12, order: 2 }}
              md={{ size: "6", order: 1 }}
              className="col-no-padding"
            >
              <Col xs="12" md="12">
                <Input
                  type={"text"}
                  error={formErrors["email"]}
                  label={"Email Address"}
                  name={"email"}
                  placeholder={"Please Enter Your Email"}
                  value={loginFormData.email}
                  onInputChange={(name, value) => {
                    loginChange(name, value);
                  }}
                />
              </Col>
              <Col xs="12" md="12">
                <Input
                  type={"password"}
                  error={formErrors["password"]}
                  label={"Password"}
                  name={"password"}
                  placeholder={"Please Enter Your Password"}
                  value={loginFormData.password}
                  onInputChange={(name, value) => {
                    loginChange(name, value);
                  }}
                />
              </Col>
            </Col>
            {/* <Col xs={{ size: 12, order: 1 }} md={{ size: '6', order: 2 }}>
              <SignupProvider />
            </Col> */}
          </Row>
          <hr />
          <div className="auth-actions">
            <Button type="submit" text="Login" disabled={isSubmitting} />
            <Button
              text="Create an account"
              className="btn-no-shape"
              onClick={registerLink}
            />
            <Link
              className="redirect-link forgot-password-link"
              // to={'/forgot-password'}
            ></Link>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting,
  };
};

export default connect(mapStateToProps, actions)(Login);
