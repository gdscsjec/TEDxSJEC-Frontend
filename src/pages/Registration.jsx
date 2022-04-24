import React from "react";
import Form from "../components/Form";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";
import LoadingOverlay from "react-loading-overlay";

const Registration = () => {
  return (
    <LoadingOverlay active={true} spinner text="Loading.....">
      <ParentWrapper>
        <Logo />
        <ChildWrapper>
          <Form />
        </ChildWrapper>
      </ParentWrapper>
    </LoadingOverlay>
  );
};

export default Registration;
