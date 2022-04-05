import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Logo from "../components/Logo";
import { ParentWrapper, ChildWrapper } from "../styles/layout.style";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const download = () => {
    const input = document.getElementById("tedxsjec-ticket");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      pdf.save(`TEDxSJEC-2022-Ticket-${params.id}.pdf`);
    });
  };

  return (
    <ParentWrapper>
      <Logo />
      <ChildWrapper id="tedxsjec-ticket">
        <h1>Ticket</h1>
        <p>
          <b>Ticket ID:</b> {params.id}
        </p>
        <p>
          <b>Name:</b> {ticket && ticket.name}
        </p>
        <p>
          <b>Email:</b> {ticket && ticket.email}
        </p>
        <p>
          <b>Phone:</b> {ticket && ticket.phone}
        </p>
        <p>
          <QRCode value={params.id} size={200} />
        </p>
      </ChildWrapper>
      <button
        onClick={() => {
          download();
        }}
        className="btn btn-danger mt-3"
      >
        Download Ticket
      </button>
    </ParentWrapper>
  );
};

export default Ticket;
