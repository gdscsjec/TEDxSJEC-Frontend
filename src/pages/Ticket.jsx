import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper, QRCodeContainer, TicketTitle, TicketSection, TicketHeading, TicketText, OrderIdContainer, OrderId, ErrorText } from "../styles/layout.style";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Lottie from 'react-lottie';
import notFoundAnimation from '../lotties/not-found.json';
import LoadingOverlay from "react-loading-overlay";
import loadingContext from "../context/loadingContext";

const defaultAnimationOptions = {
  loop: true,
  autoplay: true,
  animationData: notFoundAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice"
  }
};

const Ticket = () => {
  const [ticket, setTicket] = useState();
  let params = useParams();
  document.title = `Ticket - ${params.id}  | TEDxSJEC 2022`;

  const { loading, setLoading } = useContext(loadingContext);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, [setLoading])

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  
  useEffect(() => {
    startLoading();
    const request = async () => {
      const response = await axios.post(
        `https://ted.vigneshcodes.in/api/ticket?id=${params.id}`
      );
      setTicket(response.data);
      console.log(response.data);
    };
    request();
    setTimeout(() => {
      stopLoading();
    }, 2000)
  }, [params.id, startLoading, stopLoading]);

  const download = () => {
    const input = document.getElementById("tedxsjec-ticket");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      // window.open(imgData)
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`TEDxSJEC-2022-Ticket-${params.id}.pdf`);
    });
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading.....">
      <ParentWrapper>
        <Logo />
        {ticket ? (
          <>
            <ChildWrapper id="tedxsjec-ticket">
              <TicketTitle>TEDx Ticket</TicketTitle>
              <div style={{ display: 'flex' }}>
                <TicketSection>
                  <TicketHeading>NAME</TicketHeading>
                  <TicketText>
                    {ticket ? ticket.name : "Loading..."}
                  </TicketText>
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
              <div style={{ display: 'flex' }}>
                <TicketSection>
                  <TicketHeading>DATE</TicketHeading>
                  <TicketText>
                    June 11, 2022
                  </TicketText>
                </TicketSection>
                <TicketSection>
                  <TicketHeading>VENUE</TicketHeading>
                  <TicketText>
                    SJEC, Mangalore
                  </TicketText>
                </TicketSection>
              </div>
              <QRCodeContainer>
                <QRCode value={params.id} size={200} />
              </QRCodeContainer>
              <OrderIdContainer>
                <OrderId>
                  {params.id ? params.id.toUpperCase() : "Loading..."}
                </OrderId>
              </OrderIdContainer>
            </ChildWrapper>
            <div>
              <button style={{ marginTop: '400px' }}
                  onClick={() => {
                    download();
                  }}
                  className="btn btn-tedx mt-3"
                >
                Download Ticket
              </button>
            </div>
        </>)
       : (
        <>
          <Lottie 
            options={defaultAnimationOptions}
            height={300}
            width={300}
          />
          <ErrorText>Unfortunately, we could not find your ticket!</ErrorText>
          {/* TODO: Make button go back to home page / registration page */}
          <div>
            <button className="btn btn-tedx mt-3">Go back</button>
          </div>
        </>
        )        
      }
      </ParentWrapper>
    </LoadingOverlay>  
  );
};

export default Ticket;
