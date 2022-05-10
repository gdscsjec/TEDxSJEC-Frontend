import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import {
  ParentWrapper,
  ChildWrapper,
  QRCodeContainer,
  TicketSection,
  TicketHeading,
  TicketText,
  OrderIdContainer,
  OrderId,
  ErrorText,
} from "../styles/layout.style";
import QRCode from "react-qr-code";
// Optional import
// import jsPDF from "jspdf";
import Lottie from "react-lottie";
import notFoundAnimation from "../lotties/not-found.json";
import LoadingOverlay from "react-loading-overlay";
import { toPng } from "dom-to-image";
import { useQuery } from "react-query";

const defaultAnimationOptions = {
  loop: true,
  autoplay: true,
  animationData: notFoundAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const downloadImage = (id) => {
  const input = document.getElementById("tedxsjec-ticket");
  toPng(input)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
      var link = document.createElement("a");
      link.download = `TEDxSJEC-2022-Ticket-${id}`;
      link.href = img.src;
      link.click();

      // Code for PDF download
      // const pdf = new jsPDF();
      // var width = pdf.internal.pageSize.getWidth();
      // var height = pdf.internal.pageSize.getHeight();
      // pdf.addImage(img.src, "PNG", 0, 0, width, height);
      // pdf.save(`TEDxSJEC-2022-Ticket-${params.id}.pdf`);

      document.body.removeChild(img);
    })
    .catch(function (error) {
      console.error("Oops, something went wrong!", error);
    });
};

const Ticket = () => {
  const [ticket, setTicket] = useState();
  let params = useParams();
  document.title = `Ticket - ${params.id}  | TEDxSJEC 2022`;

  useEffect(() => {
    const disableContextMenu = (event) => event.preventDefault();

    document.addEventListener('contextmenu', disableContextMenu); 
    document.onkeydown = function(e) { 
      if(e.key === "F12") { 
        return false; 
      } 
      if(e.ctrlKey && e.shiftKey && e.code === "KeyI") { 
        return false; 
      } 
      if(e.ctrlKey && e.shiftKey && e.code === 'KeyJ') { 
        return false; 
      } 
      if(e.ctrlKey && e.code === "KeyU") {
        return false; 
      } 
    } 

    return () => { 
      window.removeEventListener('contextmenu', disableContextMenu);
    }
  }, []);

  const {
    data: ticketData,
    isLoading,
    isError,
  } = useQuery(params.id, () => {
    return axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/ticket?id=${params.id}`
    );
  });

  useEffect(() => {
    if (ticketData) {
      setTicket(ticketData.data);
    }
  }, [ticketData]);

  return (
    <LoadingOverlay active={isLoading} spinner text="Loading.....">
      <ParentWrapper>
        {isLoading ? (
          <Logo />
        ) : ticket && !isError ? (
          <>
            <ChildWrapper id="tedxsjec-ticket">
              <Logo />
              <div style={{ display: "flex" }}>
                <TicketSection>
                  <TicketHeading>NAME</TicketHeading>
                  <TicketText>{ticket ? ticket.name : "Loading..."}</TicketText>
                </TicketSection>
                <TicketSection>
                  <TicketHeading>PHONE</TicketHeading>
                  <TicketText>
                    {ticket ? ticket.phone : "Loading..."}
                  </TicketText>
                </TicketSection>
              </div>
              <div>
                <TicketSection>
                  <TicketHeading>EMAIL</TicketHeading>
                  <TicketText>
                    {ticket ? ticket.email : "Loading..."}
                  </TicketText>
                </TicketSection>
              </div>
              <div style={{ display: "flex" }}>
                <TicketSection>
                  <TicketHeading>DATE</TicketHeading>
                  <TicketText>June 11, 2022</TicketText>
                </TicketSection>
                <TicketSection>
                  <TicketHeading>TIME</TicketHeading>
                  <TicketText>9:00 AM</TicketText>
                </TicketSection>
              </div>
              <QRCodeContainer>
                <QRCode
                  style={{ boxShadow: "0 0 10px #444" }}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  value={params.id}
                  size={200}
                />
              </QRCodeContainer>
              <OrderIdContainer>
                <OrderId>
                  {params.id ? params.id.toUpperCase() : "Loading..."}
                </OrderId>
              </OrderIdContainer>
            </ChildWrapper>
            <div>
              <button
                style={{ marginTop: "400px" }}
                onClick={() => downloadImage(params.id)}
                className="btn btn-tedx mt-3"
              >
                Download Ticket
              </button>
            </div>
          </>
        ) : (
          <>
            <Logo />
            <Lottie
              options={defaultAnimationOptions}
              isClickToPauseDisabled={true}
              height={300}
              width={300}
            />
            <ErrorText>Unfortunately, we could not find your ticket!</ErrorText>
            <div>
              <button
                onClick={() => (window.location.href = "/")}
                className="btn btn-tedx mt-3"
              >
                Back!
              </button>
            </div>
          </>
        )}
      </ParentWrapper>
    </LoadingOverlay>
  );
};

export default Ticket;
