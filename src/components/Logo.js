import React from "react";
import { ImageWrapper } from "../styles/layout.style";

function Logo() {
  return (
    <ImageWrapper
      draggable="false"
      src="/static/logo.png"
      alt="TEDxSJEC Logo"
    />
  );
}

export default Logo;
