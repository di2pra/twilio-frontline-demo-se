import { Express } from 'express';
import OktaController from './controllers/oktaController.js';
import TemplateController from './controllers/templateController.js';
import ConfigurationController from './controllers/configurationController.js';
import ClaimController from './controllers/claimController.js';
import ConversationController from './controllers/conversationController.js';
import SettingController from './controllers/settingController.js';
import CustomizationController from './controllers/customizationController.js';
import DataController from './controllers/dataController.js';
import ContentController from './controllers/contentController.js';

export default (router: Express) => {

  const oktaController = new OktaController();
  

  router.use('/api', oktaController.authenticationRequired);

  router.get("/api/v1/data", DataController.get);

  router.post("/api/v1/content", ContentController.add);
  router.get("/api/v1/content", ContentController.get);
  router.get("/api/v1/content/:sid", ContentController.get);

  router.post("/api/v1/setting", ClaimController.validateClaim, SettingController.setSelectedSetting);

  router.post("/api/v1/template", ClaimController.validateClaim, TemplateController.add);

  router.post("/api/v1/configuration", ClaimController.validateClaim, ConfigurationController.add);

  router.post("/api/v1/claim", ClaimController.add);
  router.put("/api/v1/claim/:id", ClaimController.validateClaim, ClaimController.close);

  router.delete("/api/v1/conversation", ClaimController.validateClaim, ConversationController.deleteAll);

  router.get("/customization/export", CustomizationController.export);
  router.post("/api/v1/customization/import", CustomizationController.import);

};