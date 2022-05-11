import React from "react";
import Form from "../components/Form";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";
import LoadingOverlay from "react-loading-overlay";
import { useContext } from "react";
import loadingContext from "../context/loadingContext";

// Fix for package 'react-loading-overlay' since the repo is inactive.
LoadingOverlay.propTypes = undefined;

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
      <Footer />
    </LoadingOverlay>
  );
};

export default Registration;
