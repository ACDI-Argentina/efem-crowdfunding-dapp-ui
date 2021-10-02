import React, { useState, useEffect, useRef, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { registerCurrentUser } from '../redux/reducers/currentUserSlice';

import { Box, Grid } from '@material-ui/core';
import { Form, Input } from 'formsy-react-components';

import LoaderButton from './LoaderButton';
import GridItem from './Grid/GridItem';
import { User } from 'models';
import Avatar from './Avatar/Avatar';

import { TextField } from '@material-ui/core';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Web3AppContext } from 'lib/blockchain/Web3App';
import { useTranslation } from 'react-i18next';


const sleep = ms => new Promise((resolve, reject) => setTimeout(() => resolve(ms), ms))

const ProfileForm = ({
  user, //Leerlo del ctx
  onFinishEdition,
}) => {
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState();
  const [avatarEditing, setAvatarEditing] = useState(false);

  const dispatch = useDispatch();

  const { modals } = useContext(Web3AppContext);
  const authenticateIfPossible = modals.methods.authenticateIfPossible;

  const { t } = useTranslation();

  useEffect(() => {
    avatarRef.current = avatar;
  }, [avatar]);

  useEffect(() => {
    if (user.isRegistered) {
      if (onFinishEdition && typeof onFinishEdition === 'function') {
        onFinishEdition();
      }
    }
  }, [user]);


  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      url: user.url,
      avatar: avatar
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string()
        .min(1, 'Please enter your name')
        .max(42, 'Must be 42 characters or less')
        .required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      url: Yup.string().url().required('Required'),
    }),
    onSubmit: async values => {
      //Clonar el user que nos venga x prop

      for(const [key,value] of Object.entries(values)){
        console.log(`${key} ${value}`);
        user[key] = value; //Esto es lo que se hace el nombre cuando se esta editando
      }
        
      if (!user.address) {//TODO: Agregar algun mensaje de error indicando que no tiene la wallet conectada
        
      } else {
        if (avatarRef.current) {
          user.avatar = avatarRef.current;
        }
        
        if(!user.authenticated){
          await authenticateIfPossible(user);
        }
        dispatch(registerCurrentUser(user));
      }
    },
  });

  const dirty = formik.dirty || avatar; //que pasa cuando esto cambie

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="row">
        <GridItem xs={12} md={5}>
          <div style={{ display:"flex", justifyContent:"center", marginTop: "32px"}}>
            <Avatar
              imageSrc={user.avatarCidUrl}
              onCropped={(cropped) => {
                setAvatar(cropped);
              }}
              onEditingChange={editing => setAvatarEditing(editing)}
            />

          </div>
        </GridItem>

        <GridItem xs={12} md={7}>
          <div className="form-group">
            <TextField
              name={"name"}
              value={formik.values.name}
              onChange={formik.handleChange}
              label={t('userName')}
              helperText={formik.errors.name}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={formik.errors.name?.length > 0}
              required
              inputProps={{ maxLength: 42 }}
            />
          </div>
          <div className="form-group">
            <TextField
              name={"email"}
              value={formik.values.email}
              onChange={formik.handleChange}
              label={t('userEmail')}
              helperText={formik.errors.email}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              error={formik.errors.email?.length > 0}
              required
              inputProps={{ maxLength: 42 }}
            />
          </div>

          <div className="form-group">
            <TextField
              name={"url"}
              value={formik.values.url}
              onChange={formik.handleChange}
              label={t('userUrl')}
              helperText={formik.errors.url}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.errors.url?.length > 0}
              required
              inputProps={{ maxLength: 42 }}
            />
          </div>
        </GridItem>
      </Grid>


      <div className="form-group">
        <Box my={2} display="flex" justifyContent="flex-end">
          <Box>
            <LoaderButton
              color="primary"
              className="btn btn-info"
              formNoValidate
              type="submit"
              disabled={!formik.isValid || !dirty || avatarEditing}
              isLoading={formik.isSubmitting}
              loadingText={t('saving')}>
              {t('save')}
            </LoaderButton>
          </Box>
        </Box>
      </div>

    </form>
  );
};

export default ProfileForm;
