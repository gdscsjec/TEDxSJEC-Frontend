import styled from 'styled-components';

export const FooterContainer = styled.div`
    position: relative;
    top: 20px;
    margin-top: 20px;
    padding-top: 20px;
    width: 100vw;
    text-align: center;
    background-color: #111;
`

export const PageLink = styled.span`
    color: #fff;
    padding: 0 10px;
    text-decoration: underline;

    &:hover {
        color: #FF2B06;
        cursor: pointer;
    }
`

export const ContactText = styled.div`
    padding-top: 20px;
`

export const SiteLink = styled.a`
    color: #FF2B06;
    
    &:hover {
        color: #fff;
    }
`

export const CopyrightText = styled.div`
    margin-top: 20px;;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #181818;
`

export const TedxRed = styled.span`
    color: #FF2B06;
`