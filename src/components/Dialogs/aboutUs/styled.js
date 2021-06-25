import styled from 'styled-components';
import CommitIcon from 'assets/img/icons/git-commit.svg';
import CloseIcon from '@material-ui/icons/Close';

export const Content = styled.div`
  margin: 10px;
  height: max(33vh, 350px);
  display: flex;
  flex-direction: column;
  position:relative;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 20px 0px;
`;

export const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const ImageContainer = styled.div`
  width: 75%;
`;

export const Div = styled.div``;

export const ResponsiveImg = styled.img`
  width: 100%;
  height: auto;
`;
export const SCommitIcon = styled.img`
  max-width:20px;
  rotate: 90deg;
`;

export const CloseContainer = styled.div`
  cursor:pointer;
  position:absolute;
  top:0;
  right:0;


`
