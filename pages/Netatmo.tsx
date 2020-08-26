import React from 'react';
import { View, Container, Text, Button } from 'native-base';
import { Image, StyleSheet, AsyncStorage, Linking } from 'react-native';
import { NetatmoProvider, useNetatmo } from '../NetatmoProvider';
import HomeList from '../components/HomeList';
import material from '../../../native-base-theme/variables/material';
import randomString from 'random-string';
import Hashes from 'jshashes';
import netatmo from 'netatmo';

function sha256base64urlencode(str) {
  // https://tools.ietf.org/html/rfc7636#appendix-A
  // https://tools.ietf.org/html/rfc4648#section-5
  return new Hashes.SHA256().b64(str)
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '');
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logo: {
    width: 172,
    height: 50,
  },
});

export const Netatmo = () => {
  const logo = require ('../assets/NetatmoLogo.png');

  const login = () => {

    // PKCE - https://tools.ietf.org/html/rfc7636
    //  - Protect against other apps who register our application url scheme
    const code_verifier = randomString({length: 40});
    const code_challenge = sha256base64urlencode(code_verifier);

    // Protect against rogue web pages that try redirect the user to authorize (XSRF)
    const state = randomString();

    const params = new URLSearchParams();
    params.append('client_id', '5f2c03c42ef92334d86cd32c');
    // params.append('redirect_uri', 'https://app.getpostman.com/oauth2/callback');
    params.append('redirect_uri', 'energiapp://callback/netatmo');
    params.append('scope', 'read_station');
    params.append('state', state);
    params.append('code_challenge', code_challenge);

    let authorization_endpoint = 'https://api.netatmo.net/oauth2/authorize';
    const authorizationUrl = authorization_endpoint + '?' + params;
    console.log('Calling:', authorizationUrl);

    Promise.all([
      AsyncStorage.setItem('code_verifier', code_verifier || ''),
      AsyncStorage.setItem('state', state),
    ]).then(() => {
      console.log(authorizationUrl);
      Linking.openURL(authorizationUrl);
    }).catch(err => {
      console.warn(err);
    });
  };

  return (
    <NetatmoProvider>
      <Container>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo}/>
          <View style={{ borderBottomColor: material.kraftCyan, borderBottomWidth: 1, paddingTop: 10}} />
          <HomeList />
          <Button color={material.kraftBla} onPress={login}>
             <Text>Logg inn med Netatmo</Text>
          </Button>
        </View>
      </Container>
    </NetatmoProvider>
  );
};

export default Netatmo;
