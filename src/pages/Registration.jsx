import React from "react";
import Form from "../components/Form";
import {
  ParentWrapper,
  ChildWrapper,
  ImageWrapper,
} from "../styles/layout.style";

const Registration = () => {
  return (
    <ParentWrapper>
      <ImageWrapper
        draggable="false"
        src="/static/logo.png"
        alt="TEDxSJEC Logo"
      />
      <ChildWrapper>
        <Form />
      </ChildWrapper>
    </ParentWrapper>
  );
};

export default Registration;
