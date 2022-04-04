import styled from "styled-components";

const ParentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: black;
`;

const ChildWrapper = styled.div`
  padding: 20px;
  height: max-content;
  width: max-content;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #000000;
`;

const ImageWrapper = styled.img`
  height: 80px;
  width: 300px;
  margin: 10px;
`;

export { ParentWrapper, ChildWrapper, ImageWrapper };
