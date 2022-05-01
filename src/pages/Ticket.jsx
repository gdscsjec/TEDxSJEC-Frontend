import axios from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper, QRCodeContainer, TicketSection, TicketHeading, TicketText, OrderIdContainer, OrderId, ErrorText } from "../styles/layout.style";
import QRCode from "react-qr-code";
// Optional import
// import jsPDF from "jspdf";
import Lottie from 'react-lottie';
import notFoundAnimation from '../lotties/not-found.json';
import LoadingOverlay from "react-loading-overlay";
import loadingContext from "../context/loadingContext";
import { toPng } from 'dom-to-image';

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

  const downloadImage = () => {
    const input = document.getElementById("tedxsjec-ticket");
    toPng(input).then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
      var link = document.createElement('a');
      link.download = `TEDxSJEC-2022-Ticket-${params.id}`;
      link.href = img.src;
      link.click();
      
      // Code for PDF download
      // const pdf = new jsPDF();
      // var width = pdf.internal.pageSize.getWidth();
      // var height = pdf.internal.pageSize.getHeight();
      // pdf.addImage(img.src, "PNG", 0, 0, width, height);
      // pdf.save(`TEDxSJEC-2022-Ticket-${params.id}.pdf`);

      document.body.removeChild(img)
    })
    .catch(function (error) {
      console.error('Oops, something went wrong!', error);
    });
  };

  return (
    <LoadingOverlay active={loading} spinner text="Loading.....">
      <ParentWrapper>
        { loading ? <Logo /> : 
        (ticket ? (
          <>
            <ChildWrapper id="tedxsjec-ticket">
              <Logo />
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
                  <TicketHeading>TIME</TicketHeading>
                  <TicketText>
                    9:00 AM
                  </TicketText>
                </TicketSection>
              </div>
              <QRCodeContainer>
                <QRCode style={{ boxShadow: '0 0 10px #444' }} bgColor="#FFFFFF" fgColor="#000000" value={params.id} size={200} />
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
                    downloadImage();
                  }}
                  className="btn btn-tedx mt-3"
                >
                Download Ticket
              </button>
            </div>
        </>)
       : (
        <>
          <Logo />
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
      )}
      </ParentWrapper>
    </LoadingOverlay>  
  );
};

export default Ticket;
