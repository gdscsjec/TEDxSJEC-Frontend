import React from "react";
import Form from "../components/Form";
import Logo from "../components/Logo";
import Footer from "../components/Footer";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";
import LoadingOverlay from "react-loading-overlay";
import { useContext } from "react";
import loadingContext from "../context/loadingContext";
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
        <a
          href="https://tedxsjec.in/"
          style={{
            width: "240px",
          }}
          className=" btn btn-tedx btn btn-block mt-4"
        >
          Go To TEDxSJEC Homepage
        </a>
      </ParentWrapper>
      <Footer />
    </LoadingOverlay>
  );
};

export default Registration;
