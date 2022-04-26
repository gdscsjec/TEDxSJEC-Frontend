import React from "react";
import Form from "../components/Form";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";
import LoadingOverlay from "react-loading-overlay";
import { useContext } from "react";
import loadingContext from "../context/loadingContext";

const Registration = () => {
  const a = useContext(loadingContext);

  return (
    <LoadingOverlay active={a.loading} spinner text="Loading.....">
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
