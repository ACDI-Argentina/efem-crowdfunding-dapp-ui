import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import io from 'socket.io-client/dist/socket.io';
import auth from '@feathersjs/authentication-client';
import rest from '@feathersjs/rest-client';
import localforage from 'localforage';
import rx from 'feathers-reactive';
import config from '../configuration';

const restClient = rest(config.feathersUsersConnection);
const fetch = require('node-fetch');

export const socket = io(config.feathersUsersConnection, {
  transports: ['websocket'],
});

// socket IO error events
socket.on('connect_error', _e => console.log('Could not connect to FeatherJS'));
socket.on('connect_timeout', _e => console.log('Could not connect to FeatherJS: Timeout'));
socket.on('reconnect_attempt', _e => console.log('Trying to reconnect to FeatherJS: Timeout'));

export const feathersRest = feathers()
  .configure(restClient.fetch(fetch))
  .configure(auth({ storage: localforage }))
  .configure(
    rx({
      idField: '_id',
    }),
  );

export const feathersClient = feathers()
  .configure(socketio(socket, { timeout: 30000, pingTimeout: 30000, upgradeTimeout: 30000 }))
  .configure(auth({ storage: localforage }))
  .configure(
    rx({
      idField: '_id',
    }),
  )
  .on('authenticated', feathersRest.passport.setJWT); // set token on feathersRest whenever it is changed

