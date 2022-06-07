import { useOktaAuth } from '@okta/okta-react';
import { useCallback } from 'react';
import { IClaim, IConfiguration, IConversation, ISetting, ITemplate } from '../Types';

function useApi() {

  const { authState } = useOktaAuth();

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {

    let newInit = {};

    if(authState && authState.accessToken) {
      newInit = { headers: { Authorization: 'Bearer ' + authState.accessToken.accessToken } };

      if (init) {

        newInit = {
          ...init,
          ...{
            'headers': { ...init.headers, ...{ Authorization: 'Bearer ' + authState.accessToken.accessToken } }
          }
        }

      }
    }

    return fetch(input, newInit);

  }, [authState]);

  const postWithAuth = useCallback(async (input: RequestInfo, body: object) => {

    const init = {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetchWithAuth(input, init)

  }, [fetchWithAuth]);

  const putWithAuth = useCallback(async (input: RequestInfo, body: object) => {

    const init = {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }

    return fetchWithAuth(input, init)

  }, [fetchWithAuth]);


  const deleteAllConversation = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/conversation`, {
      method: "DELETE"
    });

    if (result.ok) {
      return null;
    } else {
      throw new Error("Error");
    }

  }, [fetchWithAuth]);



  const getTemplate : () => Promise<ITemplate[]> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/template`);
    const data = await result.json();

    if (result.ok) {

      return data as ITemplate[];

    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const postTemplate : (template: ITemplate[]) => Promise<ITemplate[]> = useCallback(async (template: ITemplate[]) => {

    const result = await postWithAuth(`/api/v1/template`, template);

    const data = await result.json();

    if (result.ok) {
      return data as ITemplate[];
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const getConfiguration : () => Promise<IConfiguration> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/configuration`);
    const data = await result.json();

    if (result.ok) {
      return data as IConfiguration;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const getSetting : () => Promise<ISetting> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/setting`);
    const data = await result.json();

    if (result.ok) {
      return data as ISetting;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const postSetting : (lang: string) => Promise<ISetting | null> = useCallback(async (lang: string) => {

    const result = await postWithAuth(`/api/v1/setting`, {
      lang: lang
    });

    const data = await result.json();

    if (result.ok) {
      return data as ISetting;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const getConversation : () => Promise<IConversation[]> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/conversation`);
    const data = await result.json();

    if (result.ok) {
      return data as IConversation[];
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const postConfiguration = useCallback(async (info: IConfiguration) => {

    const result = await postWithAuth(`/api/v1/configuration`, info);

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const getClaim : () => Promise<IClaim | null> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/claim`);
    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const addClaim : () => Promise<IClaim | null> = useCallback(async () => {

    const result = await postWithAuth(`/api/v1/claim`, {});

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const closeClaim : (id: number) => Promise<IClaim | null> = useCallback(async (id: number) => {

    const result = await putWithAuth(`/api/v1/claim/${id}`, {});

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [putWithAuth]);

  return {
    getTemplate,
    postTemplate,
    getConfiguration,
    postConfiguration,
    getClaim,
    addClaim,
    closeClaim,
    getConversation,
    deleteAllConversation,
    getSetting,
    postSetting
  };
}




export default useApi;