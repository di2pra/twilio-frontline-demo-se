import { useCallback, useContext, useRef, useState } from "react";
import { Alert, Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { ClaimContext } from "../../providers/ClaimProvider";
import { SettingContext } from "../../providers/SettingProvider";
import { UserContext } from "../../SecureLayout";
import { BiImport, BiExport } from 'react-icons/bi';
import { ImExit, ImEnter } from 'react-icons/im';
import { getFlagEmoji } from "../../Helper";
import ModalBox from "../../components/ModalBox";

const ClaimSection = () => {

  const { claim, closeClaimHandler, addClaimHandler } = useContext(ClaimContext);
  const { loggedInUser } = useContext(UserContext);
  const { setting, updateSetting } = useContext(SettingContext);

  const [selectedNewLang, setSelectedNewLang] = useState<string>();

  const modalLangConfirm = useRef<{ open: () => void }>(null);
  const modalClaimConfirm = useRef<{ open: () => void }>(null);

  const onLangChange = useCallback((lang: string) => {

    if (modalLangConfirm.current) {
      setSelectedNewLang(lang);
      modalLangConfirm.current.open();
    }

  }, [modalLangConfirm]);

  const changeLangConfirm = useCallback((confirmation: boolean) => {
    if (confirmation === true && updateSetting && selectedNewLang) {
      updateSetting(selectedNewLang);
      setSelectedNewLang(undefined);
    }
  }, [selectedNewLang, updateSetting]);

  const onReleaseClaim = useCallback(() => {

    if (modalClaimConfirm.current) {
      modalClaimConfirm.current.open();
    }

  }, [modalClaimConfirm]);

  const releaseClaimConfirm = useCallback((confirmation: boolean) => {
    if (confirmation === true && closeClaimHandler && claim) {
      closeClaimHandler(claim.id);
    }
  }, [closeClaimHandler, claim])

  if (claim && claim.ended_at === null) {

    if (claim.user === loggedInUser?.email) {
      return (
        <>
          <ModalBox title="Release Demo" ref={modalClaimConfirm} callback={releaseClaimConfirm}>
            <p className="mb-0">Are you sure you want to release the demo?</p>
            <i className="text-muted">Releasing the demo will reset the customization and delete all the existing conversations.</i>
          </ModalBox>
          <ModalBox title="Change the country" ref={modalLangConfirm} callback={changeLangConfirm}>
            <p className="mb-0">Are you sure you want to change the country?</p>
            <i className="text-muted">Changing the country will reset the customization and delete all the existing conversations.</i>
          </ModalBox>
          <Row className="mb-3">
            <Col className="d-flex col-10" style={{ 'gap': '1rem' }}>
              <Button className="btn-with-icon" variant="danger" onClick={() => onReleaseClaim()} >
                <ImExit />
                <span>Release the demo</span>
              </Button>
              <a target="_blank" href="/customization/export" className="btn btn-secondary btn-with-icon" >
                <BiExport />
                <span>Export Customization</span>
              </a>
              <Button className="btn-with-icon" variant="secondary">
                <BiImport />
                <span>Import Customization</span>
              </Button>
            </Col>
            <Col className="text-end">
              <DropdownButton id="dropdown-country" title={getFlagEmoji(setting?.selectedSetting.lang.slice(-2) || '') + ' ' + setting?.selectedSetting.friendly_name}>
                {
                  setting?.settings.filter(item => item.lang !== setting.selectedSetting.lang).map((item, key) => <Dropdown.Item onClick={() => onLangChange(item.lang)} key={key} as="button" >{getFlagEmoji(item.lang.slice(-2))} {item.friendly_name}</Dropdown.Item>)
                }
              </DropdownButton>
            </Col>
          </Row>
        </>

      )
    } else {
      return (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" className="m-0">
              <p className="mb-0">This demo is currently being used by <b>{claim.user}</b>.</p>
            </Alert>
          </Col>
        </Row>
      )
    }


  } else {
    return (
      <Row className="mb-3">
        <Col>
          <Button className="btn-with-icon" onClick={addClaimHandler} variant="success">
            <ImEnter />
            <span>Claim the demo</span>
          </Button>
        </Col>
      </Row>
    )
  }

}

export default ClaimSection;