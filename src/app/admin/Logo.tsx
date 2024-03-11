import styled from "@emotion/styled";
import { SVGProps } from "react";

const TitleContainer = styled.a`
  font-size: 1.5em;
  margin: 0;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  text-decoration: none;
  color: #6A602C;
`;

const Logo = (props: SVGProps<SVGSVGElement>) => {
  return <TitleContainer href="/">SCRRAP-LAB</TitleContainer>;
};

export default Logo;
