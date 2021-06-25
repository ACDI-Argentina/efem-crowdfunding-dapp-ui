import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Logo from 'assets/img/logos/give4forest.png';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import packageJson from '../../../package.json';

import {
  Content,
  Row,
  ImageWrapper,
  ImageContainer,
  Div,
  ResponsiveImg,
  SCommitIcon,
  CloseContainer,
} from './aboutUs/styled';

const AboutUs = ({ onClose, ...props }) => {
  const { version } = packageJson;
  const repoUrl = 'https://github.com/ACDI-Argentina/efem-crowdfunding-dapp';

  // A esto vamos a tenerlo que leerlo desde version.html o algun otro archivo que genermos por aca, o bien que sea version.txt

  /* const commitHash = "2bcd4c6ec9ad88af953209b663dca59651d857d1";
  const commitUrl = `https://github.com/ACDI-Argentina/efem-crowdfunding-dapp/commit/${commitHash}`; */

  return (
    <Dialog onClose={onClose} {...props}>
      <Content>
        <CloseContainer onClick={() => onClose()}>
          <CloseIcon />
        </CloseContainer>
        <ImageWrapper>
          <ImageContainer>
            <ResponsiveImg src={Logo} />
          </ImageContainer>
        </ImageWrapper>
        <Row>
          <Div>Version: {version}</Div>
          <Div>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              <i className="fab fa-github" />
              View on github
            </a>
          </Div>
          {/* <Div>
            <a
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
            >
              <SCommitIcon src={CommitIcon} /> {'Commit'}
            </a>
          </Div> */}
        </Row>
      </Content>
    </Dialog>
  );
};

export default AboutUs;
