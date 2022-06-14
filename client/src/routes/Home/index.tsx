import { useCallback, useEffect, useState } from "react";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import { IConfiguration, IData, ITemplate } from "../../Types";
import ClaimSection from "./ClaimSection";
import ConfigurationSection from "./ConfigurationSection";
import ConversationSection from "./ConversationSection";
import HowToSection from "./HowToSection";
import InstructionSection from "./InstructionSection";
import TemplateSection from "./TemplateSection";

export default function Home() {

  const { getData, deleteAllConversation, addClaim, closeClaim, postConfiguration, postSetting, postTemplate, importCustomization } = useApi();

  const [data, setData] = useState<IData>({});
  const [error, setError] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {

    let isMounted = true;

    getData().then(data => {

      if (isMounted) {
        setData(data);
        setIsLoading(false);
      }

    }).catch((error) => {

      if (isMounted) {
        setError(error.message);
        setIsLoading(false);
      }

    });

    return () => {
      isMounted = false;
    }

  }, [getData]);

  const addClaimHandler = useCallback(() => {
    setIsLoading(true);
    addClaim().then((data) => {
      setData(prevState => {
        return { ...prevState, claim: data }
      });
      setIsLoading(false);
    }).catch((err) => {
      getData().then((data) => {
        setData(data);
        setIsLoading(false);
      });
    })
  }, [addClaim, getData]);

  const closeClaimHandler = useCallback((id: number) => {
    setIsLoading(true);
    closeClaim(id).then((data) => {
      setData(prevState => {
        return { ...prevState, claim: data }
      });
      setIsLoading(false);
    }).catch((err) => {
      getData().then((data) => {
        setData(data);
        setIsLoading(false);
      });
    });
  }, [closeClaim, getData]);

  const updateConfigurationHandler = useCallback((info: IConfiguration) => {
    setIsLoading(true);
    postConfiguration(info).then((data) => {
      setData(prevState => {
        return { ...prevState, configuration: data }
      });
      setIsLoading(false);
    });
  }, [postConfiguration]);

  const updateSettingHandler = useCallback((lang: string) => {
    setIsLoading(true);
    postSetting(lang).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [postSetting]);

  const updateTemplateHandler = useCallback((template: ITemplate[]) => {
    setIsLoading(true);
    postTemplate(template).then((data) => {
      setData(prevState => {
        return { ...prevState, template: data }
      });
      setIsLoading(false);
    });
  }, [postTemplate]);

  const deleteAllHandler = useCallback(() => {

    setIsLoading(true);

    deleteAllConversation().then(() => {
      setData(prevState => {
        return { ...prevState, conversationList: [] }
      });
      setIsLoading(false);
    })

  }, [deleteAllConversation]);

  const importCustomizationHandler = useCallback((formData: FormData) => {

    setIsLoading(true);

    importCustomization(formData).then(() => {
      getData().then((data) => {
        setData(data);
        setIsLoading(false);
      });
    }).catch((err) => {
      setError(err.message);
    });;

  }, [importCustomization])

  if (error != '') {
    return (
      <>
        <Row className="justify-content-md-center">
          <Col lg={10}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      </>
    )
  }

  if (isLoading) {
    return (
      <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center">
        <Spinner className="mb-3" animation="border" variant="danger" />
        <h3>Loading...</h3>
      </div>
    )
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col lg={10}>
          <ClaimSection importCustomizationHandler={importCustomizationHandler} claim={data.claim} setting={data.setting} updateSettingHandler={updateSettingHandler} closeClaimHandler={closeClaimHandler} addClaimHandler={addClaimHandler} />
          <HowToSection />
          <InstructionSection setting={data.setting} />
          <ConfigurationSection claim={data.claim} configuration={data.configuration} setting={data.setting} updateConfigurationHandler={updateConfigurationHandler} />
          <TemplateSection claim={data.claim} template={data.template || []} updateTemplateHandler={updateTemplateHandler} />
          <ConversationSection claim={data.claim} conversationList={data.conversationList || []} deleteAllHandler={deleteAllHandler} />
        </Col>
      </Row>
    </>
  )

}