import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
const { SIconButton } = require("./styled")

export const IconButton = ({ icon, style, ...props }) => (
  <SIconButton
    style={style?.container}
    {...props}>
    <FontAwesomeIcon
      style={style?.icon}
      fixedWidth={true}
      icon={icon}
    />
  </SIconButton>
);
