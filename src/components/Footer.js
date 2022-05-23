import { useNavigate } from "react-router-dom";
import {
  FooterContainer,
  PageLink,
  ContactText,
  SiteLink,
  CopyrightText,
  TedxRed,
} from "../styles/footer.style";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <FooterContainer>
      <div>
        <PageLink onClick={() => navigate("/refund-policy")}>
          Refund Policy
        </PageLink>
        <PageLink onClick={() => navigate("/privacy-policy")}>
          Privacy Policy
        </PageLink>
        <PageLink onClick={() => navigate("/terms-and-conditions")}>
          Terms & Conditions
        </PageLink>
      </div>
      <ContactText>Contact us for any technical support</ContactText>
      <SiteLink href="mailto:tedx@sjec.ac.in">tedx@sjec.ac.in</SiteLink>
      <br />
      <SiteLink href="tel:+919986818542">
        Ms Rachana Crasta : +91-9986818542
      </SiteLink>
      <br />
      <SiteLink href="tel:+916362490109">Mr Vignesh : +91-6362490109</SiteLink>

      <CopyrightText>
        <TedxRed>
          TED<sup>x</sup>
        </TedxRed>
        SJEC &copy; 2022 | All Rights Reserved
      </CopyrightText>
    </FooterContainer>
  );
};

export default Footer;
