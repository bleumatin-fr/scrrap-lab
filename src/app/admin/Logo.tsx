import styled from "@emotion/styled";
import { SVGProps } from "react";

const TitleContainer = styled.h1`
  font-size: 1.5em;
  margin: 0;
  flex: 1;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
`;

const Logo = (props: SVGProps<SVGSVGElement>) => {
  return <TitleContainer>chutocollector</TitleContainer>;
};

export default Logo;
