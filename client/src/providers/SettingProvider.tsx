import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { ISetting } from "../Types";

export const SettingContext = createContext<{
  setting: ISetting | null;
  updateSetting?: (lang: string) => void;
}>({
  setting: null
});

const SettingProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const { getSetting, postSetting } = useApi();

  const [setting, setSetting] = useState<ISetting | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getSetting().then((data) => {
      if (isMounted) {
        setSetting(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getSetting]);

  const updateSetting = useCallback((lang: string) => {
    setIsLoading(true);
    postSetting(lang).then((data) => {
      setSetting(data);
      setIsLoading(false);
    });
  }, [postSetting]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Setting...</h3>
      </div>
    )
  }

  return (
    <SettingContext.Provider value={{
      setting: setting,
      updateSetting: updateSetting
    }}>
      {children}
    </SettingContext.Provider>
  );

}

export default SettingProvider;