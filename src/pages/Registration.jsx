import React from "react";
import Form from "../components/Form";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";

const Registration = () => {
  return (
    <ParentWrapper>
      <Logo />
      <ChildWrapper>
        <Form />
      </ChildWrapper>
    </ParentWrapper>
  );
};

export default Registration;
