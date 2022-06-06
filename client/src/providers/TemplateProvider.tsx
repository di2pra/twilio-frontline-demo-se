import { createContext, FC, useCallback, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { ITemplate } from "../Types";

export const TemplateContext = createContext<{
  template: ITemplate[];
  updateTemplate?: (template: ITemplate[]) => void;
}>({
  template: []
});

const TemplateProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

  const { getTemplate, postTemplate } = useApi();

  const [template, setTemplate] = useState<ITemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getTemplate().then((data) => {
      if (isMounted) {
        setTemplate(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    }

  }, [getTemplate]);

  const updateTemplate = useCallback((template: ITemplate[]) => {
    setIsLoading(true);
    postTemplate(template).then((data) => {
      setTemplate(data);
      setIsLoading(false);
    });
  }, [postTemplate]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading Templates...</h3>
      </div>
    )
  }

  return (
    <TemplateContext.Provider value={{
      template: template,
      updateTemplate: updateTemplate
    }}>
      {children}
    </TemplateContext.Provider>
  );

}

export default TemplateProvider;