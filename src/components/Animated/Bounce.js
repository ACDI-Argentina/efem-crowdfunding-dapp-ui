import styled, {keyframes, css} from "styled-components";

const bounce = keyframes`
  0% {scale:1}
  50% {scale:1.05}
  0% {scale:1}
`;

const Bounce = styled.div`
  ${props => props.bouncing && css`
      animation: ${bounce} 1s linear infinite;
  `}
`

export default Bounce;