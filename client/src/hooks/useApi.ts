import { useOktaAuth } from '@okta/okta-react';
import { useCallback } from 'react';
import { IClaim, IConfiguration, IContentListResponse, IData, ISetting, ITemplate } from '../Types';

function useApi() {

  const { authState } = useOktaAuth();

  const fetchWithAuth = useCallback((input: RequestInfo, init?: RequestInit | undefined) => {

    let newInit = {};

    if (authState && authState.accessToken) {
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

  const uploadWithAuth = useCallback(async (input: RequestInfo, body: FormData) => {

    const init = {
      method: "POST",
      headers: {
        'Accept': 'application/json'
      },
      body: body
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



  const getData: () => Promise<IData> = useCallback(async () => {

    const result = await fetchWithAuth(`/api/v1/data`);
    const data = await result.json();

    if (result.ok) {
      return data as IData;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  const postTemplate: (template: ITemplate[]) => Promise<ITemplate[]> = useCallback(async (template: ITemplate[]) => {

    const result = await postWithAuth(`/api/v1/template`, template);

    const data = await result.json();

    if (result.ok) {
      return data as ITemplate[];
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const postSetting: (lang: string) => Promise<IData> = useCallback(async (lang: string) => {

    const result = await postWithAuth(`/api/v1/setting`, {
      lang: lang
    });

    const data = await result.json();

    if (result.ok) {
      return data as IData;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const postConfiguration = useCallback(async (info: IConfiguration) => {

    const result = await postWithAuth(`/api/v1/configuration`, info);

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const addClaim: () => Promise<IClaim> = useCallback(async () => {

    const result = await postWithAuth(`/api/v1/claim`, {});

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const addTemplateContent: (body: object) => Promise<IClaim> = useCallback(async (body) => {

    const result = await postWithAuth(`/api/v1/content`, body);

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [postWithAuth]);

  const closeClaim: (id: number) => Promise<IClaim> = useCallback(async (id: number) => {

    const result = await putWithAuth(`/api/v1/claim/${id}`, {});

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [putWithAuth]);

  const importCustomization: (formData: FormData) => Promise<void> = useCallback(async (formData: FormData) => {

    const result = await uploadWithAuth(`/api/v1/customization/import`, formData);

    const data = await result.json();

    if (result.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }

  }, [uploadWithAuth]);

  const getContentList: (url?: string) => Promise<IContentListResponse> = useCallback(async (url?: string) => {

    const params = new URLSearchParams();

    if(url) {
      params.append('url', url)
    }

    const result = await fetchWithAuth(`/api/v1/content${params.toString()}`);
    const data = await result.json();

    if (result.ok) {
      return data as IContentListResponse;
    } else {
      throw new Error(data.message);
    }

  }, [fetchWithAuth]);

  return {
    getData,
    postTemplate,
    postConfiguration,
    addClaim,
    closeClaim,
    deleteAllConversation,
    postSetting,
    addTemplateContent,
    importCustomization,
    getContentList
  };
}




export default useApi;