import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import CheckboxUncheckedIcon from 'components/icons/CheckboxUncheckedIcon';
import Give4ForestIcon from 'components/icons/Give4ForestIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


export default function Roadmap() {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Typography variant="h5"
        color="secondary">
        {t('roadmapTitle')}
      </Typography>
      <Stepper orientation="vertical">
        <Step expanded={true} active={true}>
          <StepLabel icon={
            <Give4ForestIcon></Give4ForestIcon>
          }>
            <Typography variant="h6">{t('roadmapStep1Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2">{t('roadmapStep1Description')}</Typography>
          </StepContent>
        </Step>
        <Step expanded={true} >
          <StepLabel icon={
            <CheckboxUncheckedIcon />
          }>
            <Typography variant="h6">{t('roadmapStep2Title')}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2">{t('roadmapStep2Description')}</Typography>
          </StepContent>
        </Step>
      </Stepper>
    </React.Fragment>
  );
}