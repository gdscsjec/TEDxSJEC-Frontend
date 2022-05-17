import styled from "styled-components";

const ParentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  background-color: black;
  overflow-x: hidden;
  padding-top: 40px;
`;

const ChildWrapper = styled.div`
  padding: 40px 40px;
  height: max-content;
  width: max-content;
  background-color: black;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #444;
  @media (max-width: 600px) {
    width: 90vw;
    height: max-content;
  }
`;

const ImageWrapper = styled.img`
  height: 80px;
  width: 300px;
  margin: 10px;
`;

const TicketHeading = styled.div`
  font-weight: bold;
`;

const TicketSection = styled.div`
  padding: 10px 25px;
`;

const TicketText = styled.div`
  color: #ddd;
  font-size: 0.9rem;
  font-weight: 100;
`;

const QRCodeContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
`;

const OrderIdContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderId = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1.5rem;
  text-align: center;
`;

const ErrorText = styled.div`
  font-size: 2rem;
`;

export {
  ParentWrapper,
  ChildWrapper,
  ImageWrapper,
  TicketSection,
  TicketHeading,
  TicketText,
  QRCodeContainer,
  OrderIdContainer,
  OrderId,
  ErrorText,
};
