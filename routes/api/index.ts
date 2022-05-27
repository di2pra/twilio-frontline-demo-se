import { Express } from 'express';
import OktaController from './controllers/oktaController.js';
import pg from 'pg';
import TemplateController from './controllers/templateController.js';
import ConfigurationController from './controllers/configurationController.js';
import ClaimController from './controllers/claimController.js';
import ConversationController from './controllers/conversationController.js';
import SettingController from './controllers/settingController.js';

export default (router: Express) => {

  const oktaController = new OktaController();
  const templateController = new TemplateController();
  const configurationController = new ConfigurationController();
  const claimController = new ClaimController();
  const conversationController = new ConversationController();
  const settingController = new SettingController();
  

  router.use('/api', oktaController.authenticationRequired);

  router.get("/api/v1/setting", settingController.get);
  router.post("/api/v1/setting", claimController.validateClaim, settingController.setSelectedSetting);


  router.get("/api/v1/template", templateController.get);
  router.post("/api/v1/template", claimController.validateClaim, templateController.add);
  /*
  router.post("/api/v1/template", claimController.validateClaim, templateController.add);
  router.put("/api/v1/template/:id", claimController.validateClaim, templateController.update);
  router.delete("/api/v1/template/:id", claimController.validateClaim, templateController.delete);*/

  router.get("/api/v1/configuration", configurationController.get);
  router.post("/api/v1/configuration", claimController.validateClaim, configurationController.add);

  router.get("/api/v1/claim", claimController.get);
  router.post("/api/v1/claim", claimController.add);
  router.put("/api/v1/claim/:id", claimController.validateClaim, claimController.close);

  router.get("/api/v1/conversation", conversationController.get);
  router.delete("/api/v1/conversation", claimController.validateClaim, conversationController.deleteAll);

};