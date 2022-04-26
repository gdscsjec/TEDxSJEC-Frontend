import { useState } from "react";
import loadingContext from "./loadingContext";
const LoadingState = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <loadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {props.children}
    </loadingContext.Provider>
  );
};

export default LoadingState;
