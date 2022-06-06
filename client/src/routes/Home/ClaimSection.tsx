import { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import useApi from "../../hooks/useApi";
import { ClaimContext } from "../../providers/ClaimProvider";
import { SettingContext } from "../../providers/SettingProvider";
import { UserContext } from "../../SecureLayout";
import { BiImport, BiExport } from 'react-icons/bi';
import { ImExit, ImEnter } from 'react-icons/im';
import { getFlagEmoji } from "../../Helper";
import { ConfigurationContext } from "../../providers/ConfigurationProvider";
import { TemplateContext } from "../../providers/TemplateProvider";

const ClaimSection = () => {

  const { exportCustomization } = useApi();

  const { claim, closeClaimHandler, addClaimHandler } = useContext(ClaimContext);
  const { loggedInUser } = useContext(UserContext);
  const { setting, updateSetting } = useContext(SettingContext);

  const onLangChange = useCallback((lang: string) => {
    if (updateSetting) {
      updateSetting(lang)
    }
  }, [updateSetting]);

  const exportCustomizationHandler = useCallback(() => {
    exportCustomization().then(data => {
      console.log(data);
    })
  }, [exportCustomization]);

  if (claim && claim.ended_at === null) {
    return (
      <>
        {
          claim.user === loggedInUser?.email ? <Row className="mb-3">
            <Col>
              <Button className="btn-with-icon" variant="danger" onClick={() => { if (closeClaimHandler) { closeClaimHandler(claim.id) } }} >
                <ImExit />
                <span>Release the demo</span>
              </Button>
            </Col>
            <Col className="text-end">
              <DropdownButton id="dropdown-country" title={getFlagEmoji(setting?.selectedSetting.lang.slice(-2) || '') + ' ' + setting?.selectedSetting.friendly_name}>
                {
                  setting?.settings.filter(item => item.lang !== setting.selectedSetting.lang).map((item, key) => <Dropdown.Item onClick={() => onLangChange(item.lang)} key={key} as="button" >{getFlagEmoji(item.lang.slice(-2))} {item.friendly_name}</Dropdown.Item>)
                }
              </DropdownButton>
            </Col>
          </Row> : <Row className="mb-3">
            <Col>
              <Alert variant="warning" className="m-0">
                <p className="mb-0">This demo is currently being used by <b>{claim.user}</b>.</p>
              </Alert>
            </Col>
          </Row>
        }
        <Row className="mb-3">
          <Col className="d-flex" style={{ 'gap': '1rem' }}>
            <a target="_blank" href="/customization/export" className="btn btn-secondary btn-with-icon" >
              <BiExport />
              <span>Export Customization</span>
            </a>
            <Button className="btn-with-icon" variant="secondary" onClick={() => { exportCustomizationHandler() }} >
              <BiImport />
              <span>Import Customization</span>
            </Button>
          </Col>
        </Row>
      </>
    )
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