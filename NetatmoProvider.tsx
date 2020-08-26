import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const NetatmoContext = React.createContext({ });

interface Props {
  children?: any;
}

const auth = {
  client_id: '<secret>',
  client_secret: '<secret>',
  username: '',
  password: '',
};

export interface Token {
  access_token?: string;
  refresh_token?: string;
  scope?: string[];
  expires_in?: number;
  expire_in?: number;
}

// const api = new netatmo(auth);

export const NetatmoProvider = (props: Props) => {
  const [homeState, setHomeState] = useState([]);
  const [token, setToken] = useState({} as Token);

  const getToken = async () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', auth.client_id);
    params.append('client_secret', auth.client_secret);
    params.append('code', '');
    params.append('scope', 'read_station');
    params.append('redirect_uri', '');

    return await axios
      .post(`https://api.netatmo.net/oauth2/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((e) => {
        setToken(e.data);
        AsyncStorage.setItem('netatmo-token', JSON.stringify(e.data));
        return e.data;
      })
      .catch((err) => console.log('error', err));
  };

  const homes = () => {
    return homeState;
  };

  const setHomes = (temps) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('homeState', JSON.stringify(c));
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(temps);
    setHomeState(temps);
  };

  useEffect(() => {
    const loadHomes = async () => {
      const data = await AsyncStorage.getItem('homeState');
      if (!!data) {
        const tmps = JSON.parse(data);
        setHomes(tmps);
      }
    };
    loadHomes();
  }, []);

  const value = useMemo(() => {
    return {
      homes,
      setHomes,
      getToken,
    };
  }, [homeState]);

  return (
    <NetatmoContext.Provider value={value}>
      {props.children}
    </NetatmoContext.Provider>
  );
};

const useNetatmo: any = () => useContext(NetatmoContext);
export { NetatmoContext, useNetatmo };
export default NetatmoProvider;
