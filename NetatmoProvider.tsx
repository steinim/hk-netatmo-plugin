import React, { useContext, useMemo, useState, useEffect } from 'react';
import { NavigationStackProp } from 'react-navigation-stack';
import { AsyncStorage } from 'react-native';

const NetatmoContext = React.createContext({ });

interface Props {
  navigation?: NavigationStackProp;
  children?: any;
}

export interface Token {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  expires?: Date;
  scope?: string[];
}

export const NetatmoProvider = (props: Props) => {
  const [homeState, setHomeState] = useState([]);
  const [token, setToken] = useState({} as Token);

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

  const handleLogin = async (data: Token) => {
    try {
      const expiredDate = new Date();
      expiredDate.setSeconds(expiredDate.getSeconds() + data.expiresIn);
      data.expires = expiredDate;

      setToken(data);
      AsyncStorage.setItem('netatmo-token', JSON.stringify(data));
      console.log('login token set', data.expires);
    } catch (error) {
      throw new Error(error);
    }
  };

  const isLoggedIn = () => {
    return !!(new Date() < new Date(token.expires));
  };

  const authToken = () => {
    // TODO refresh token logic
    return token.accessToken;
  };

  const handleLogout = async () => {
    try {
      setToken({} as Token);
      setHomes([]);
      AsyncStorage.setItem('netatmo-token', JSON.stringify('{}'));
      AsyncStorage.setItem('homeState', JSON.stringify('[]'));
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const data = await AsyncStorage.getItem('netatmo-token');
      if (!!data) {
        const t = JSON.parse(data) as Token;
        setToken(t);
      }
    };
    loadToken();

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
      handleLogin,
      handleLogout,
      isLoggedIn,
      authToken,
      homes,
      setHomes,
    };
  }, [token, homeState]);

  return (
    <NetatmoContext.Provider value={value}>
      {props.children}
    </NetatmoContext.Provider>
  );
};

const useNetatmo: any = () => useContext(NetatmoContext);
export { NetatmoContext, useNetatmo };
export default NetatmoProvider;
