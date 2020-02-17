import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { FormGroup, FormControl, InputGroup } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../libs/hooksLib";
import "./Form.css";

export default function Login(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      props.userHasAuthenticated(true);
      props.history.push("/url");
    } catch (e) {
      alert(e.message);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <InputGroup>
            <InputGroup.Addon>
              <i className="far fa-user fa-lg"></i>
            </InputGroup.Addon>
            <FormControl
              autoFocus
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
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Log in
        </LoaderButton>
      </form>
    </div>
  );
}
