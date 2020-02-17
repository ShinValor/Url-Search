import React, { useState } from "react";
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup
} from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import { Auth } from "aws-amplify";
import "./Form.css";


export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    given_name: "",
    family_name: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.given_name.length > 0 &&
      fields.family_name.length > 0 &&
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log(fields);
    setIsLoading(true);

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          given_name: fields.given_name,
          family_name: fields.family_name
        }
      });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      props.userHasAuthenticated(true);
      props.history.push("/url");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <HelpBlock>Please check your email for the code.</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="given_name" bsSize="large">
          <InputGroup>
              <InputGroup.Addon>
                <i className="far fa-user fa-lg"></i>
              </InputGroup.Addon>
              <FormControl
                autoFocus
                type="text"
                value={fields.given_name}
                onChange={handleFieldChange}
                placeholder="First Name"
              />                
          </InputGroup>
        </FormGroup>
        <FormGroup controlId="family_name" bsSize="large">
          <InputGroup>
            <InputGroup.Addon>
              <i className="far fa-user fa-lg"></i>
            </InputGroup.Addon>
              <FormControl
                autoFocus
                type="text"
                value={fields.family_name}
                onChange={handleFieldChange}
                placeholder="Last Name"
              />
            </InputGroup>
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
          <InputGroup>
            <InputGroup.Addon>
              <i className="far fa-envelope fa-lg"></i>
            </InputGroup.Addon>
              <FormControl
                type="email"
                value={fields.email}
                onChange={handleFieldChange}
                placeholder="Email"          
              />
          </InputGroup>
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <InputGroup>
            <InputGroup.Addon>
              <i className="fas fa-lock fa-lg"></i>
            </InputGroup.Addon>
            <FormControl
              type="password"
              value={fields.password}
              onChange={handleFieldChange}
              placeholder="Password"
            />
          </InputGroup>
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
        <InputGroup>
            <InputGroup.Addon>
              <i className="fas fa-lock fa-lg"></i>
            </InputGroup.Addon>
            <FormControl
              type="password"
              value={fields.confirmPassword}
              onChange={handleFieldChange}
              placeholder="Confirm Password"
            />
          </InputGroup>          
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Sign up
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
