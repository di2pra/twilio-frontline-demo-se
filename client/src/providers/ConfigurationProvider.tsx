import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { IConfiguration } from "../Types";

export const ConfigurationContext = createContext<{
  configuration: IConfiguration | null;
  updateConfiguration?: (info: IConfiguration) => void;
}>({
  configuration: null
});

const ConfigurationProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const { getConfiguration, postConfiguration } = useApi();

  const [configuration, setConfiguration] = useState<IConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getConfiguration().then((data) => {
      if (isMounted) {
        setConfiguration(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getConfiguration]);

  const updateConfiguration = useCallback((info: IConfiguration) => {
    setIsLoading(true);
    postConfiguration(info).then((data) => {
      setConfiguration(data);
      setIsLoading(false);
    });
  }, [postConfiguration]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Configuration...</h3>
      </div>
    )
  }

  return (
    <ConfigurationContext.Provider value={{
      configuration: configuration,
      updateConfiguration: updateConfiguration
    }}>
      {children}
    </ConfigurationContext.Provider>
  );

}

export default ConfigurationProvider;