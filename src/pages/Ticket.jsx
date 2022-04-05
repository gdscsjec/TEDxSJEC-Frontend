import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";

const Ticket = () => {
  const [ticket, setTicket] = useState();
  let params = useParams();
  document.title = `Ticket - ${params.id}  | TEDxSJEC 2022`;

  useEffect(() => {
    const request = async () => {
      const response = await axios.post(
        `https://ted.vigneshcodes.in/api/ticket?id=${params.id}`
      );
      setTicket(response.data);
      console.log(response.data);
    };
    request();
  }, [params.id]);

  return (
    <ParentWrapper>
      <Logo />
      <ChildWrapper id="image">
        <img src={`https://ted.vigneshcodes.in${ticket.qrcode}`} alt="" />
      </ChildWrapper>
    </ParentWrapper>
  );
};

export default Ticket;
