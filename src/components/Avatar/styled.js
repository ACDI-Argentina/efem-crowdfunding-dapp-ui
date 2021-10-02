import styled from 'styled-components';

export const Absolute = styled.div`
  position: absolute;
  ${props => props.top? `top:${props.top};`:""}
  ${props => props.bottom? `bottom:${props.bottom};`:""}
  ${props => props.right? `right:${props.right};`:""}
  ${props => props.left? `left:${props.left};`:""}
  z-index:10;
`

export const SIconButton = styled.div`
  z-index: 10;
  background-color: white;
  padding: 0.25em 0.375em;
  border-radius: 50%;
  cursor: pointer;
`;


export const SEditButton = styled(SIconButton)`
  position: absolute;
  top:10px;
  right:10px;
`

