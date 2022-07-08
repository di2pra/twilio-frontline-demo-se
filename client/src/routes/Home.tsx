import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Col, Row, Spinner } from "react-bootstrap";
import useApi from "../hooks/useApi";
import { UserContext } from "../SecureLayout";
import { IData } from "../Types";
import ClaimSection from "./Sections/ClaimSection";
import ConfigurationSection from "./Sections/ConfigurationSection";
import ConversationSection from "./Sections/ConversationSection";
import HowToSection from "./Sections/HowToSection";
import InstructionSection from "./Sections/InstructionSection";
import TemplateSection from "./Sections/TemplateSection";

export default function Home() {

  const { getData, addClaim, closeClaim, postSetting, importCustomization } = useApi();

  const [data, setData] = useState<IData>();
  const [error, setError] = useState<string>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    if (data && loggedInUser) {
      setIsEditable((data.claim != null && data.claim.ended_at === null && (data.claim.user === loggedInUser.email)));
    } else {
      setIsEditable(false);
    }

  }, [data, loggedInUser]);

  useEffect(() => {

    let isMounted = true;

    getData()
      .then(data => {
        if (isMounted) {
          setData(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
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
    addClaim()
      .then((data) => {
        setData(prevState => {
          if (prevState) {
            return { ...prevState, claim: data }
          }
          return undefined
        });
        setIsLoading(false);
      })
      .catch((err) => {
        getData().then((data) => {
          setData(data);
          setIsLoading(false);
        });
      })
  }, [addClaim, getData]);

  const closeClaimHandler = useCallback((id: number) => {
    setIsLoading(true);
    closeClaim(id)
      .then((data) => {
        setData(prevState => {

          if (prevState) {
            return { ...prevState, claim: data }
          }

          return undefined
        });
        setIsLoading(false);
      })
      .catch(() => {
        getData().then((data) => {
          setData(data);
          setIsLoading(false);
        });
      });
  }, [closeClaim, getData]);


  const updateSettingHandler = useCallback((lang: string) => {
    setIsLoading(true);
    postSetting(lang).then((data) => {
      setData(data);
      setIsLoading(false);
    });
  }, [postSetting]);

  const importCustomizationHandler = useCallback((formData: FormData) => {

    setIsLoading(true);

    importCustomization(formData)
      .then(() => {
        getData().then((data) => {
          setData(data);
          setIsLoading(false);
        });
      })
      .catch((err) => {
        setError(err.message);
      });;

  }, [importCustomization, getData]);

  const refreshData = useCallback(() => {

    setIsLoading(true);

    getData()
      .then(data => {

        setData(data);
        setIsLoading(false);

      })
      .catch((error) => {

        setError(error.message);
        setIsLoading(false);

      });

  }, [getData]);

  if (error) {
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

  if (!data) {
    return null
  }

  return (
    <>
      <Row className="justify-content-md-center">
        <Col lg={10}>
          <ClaimSection importCustomizationHandler={importCustomizationHandler} claim={data.claim} setting={data.setting} updateSettingHandler={updateSettingHandler} closeClaimHandler={closeClaimHandler} addClaimHandler={addClaimHandler} />
          <HowToSection />
          <InstructionSection setting={data.setting} />
          <ConfigurationSection isEditable={isEditable} configuration={data.configuration} setting={data.setting} />
          <TemplateSection refreshData={refreshData} isEditable={isEditable} templateList={data.template} />
          <ConversationSection claim={data.claim} conversationList={data.conversationList} />
        </Col>
      </Row>
    </>
  )

}