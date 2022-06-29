import React from 'react';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';

const Wrapper = styled.div`
  position: relative;
  display: inline;
`

const LoaderContainer = styled.div`
  position:absolute; 
  right:0px;
  top: 0px;
  bottom: 0px; 
  left: 0px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
`

const LoadingOverlay = ({ loading, children, ...props }) => {
  return (
    <Wrapper {...props}>
      {children}
      {loading && (
        <LoaderContainer>
          <CircularProgress
            color={"primary"}
            size={"20px"}
            thickness={5}
          />
        </LoaderContainer>
      )}

    </Wrapper>
  )
}

export default LoadingOverlay;