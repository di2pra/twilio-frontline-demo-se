import { useCallback, useContext } from "react";
import { Alert, Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { ClaimContext } from "../../providers/ClaimProvider";
import { SettingContext } from "../../providers/SettingProvider";
import { UserContext } from "../../SecureLayout";

const ClaimSection = () => {

  const { claim, closeClaimHandler, addClaimHandler } = useContext(ClaimContext);
  const { loggedInUser } = useContext(UserContext);
  const { setting, updateSetting } = useContext(SettingContext);

  const onLangChange= useCallback((lang: string) => {
    if(updateSetting) {
      updateSetting(lang)
    }
  }, [updateSetting]);

  if (claim && claim.ended_at === null) {
    return (
      <>
        {
          claim.user === loggedInUser?.email ? <Row>
            <Col>
              <Button className="mb-3" variant="danger" onClick={() => { if (closeClaimHandler) { closeClaimHandler(claim.id) } }} >
                Release the demo
              </Button>
            </Col>
            <Col className="text-end">
              <DropdownButton id="dropdown-country" title={setting?.selectedSetting.friendly_name}>
                {
                  setting?.settings.filter(item => item.lang !== setting.selectedSetting.lang).map((item, key) => <Dropdown.Item onClick={() => onLangChange(item.lang)} key={key} as="button" >{item.friendly_name}</Dropdown.Item>)
                }
              </DropdownButton>
            </Col>
          </Row> : null
        }
        <Alert variant="warning">
          <p className="mb-0">This demo is currently being used by <b>{claim.user}</b>.</p>
        </Alert>
      </>
    )
  } else {
    return (
      <Button onClick={addClaimHandler} className="mb-3" variant="success">
        Claim the demo
      </Button>
    )
  }

}

export default ClaimSection;