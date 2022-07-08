import { Express } from 'express';
import ClaimController from './controllers/claimController.js';
import ConfigurationController from './controllers/configurationController.js';
import ContentController from './controllers/contentController.js';
import ConversationController from './controllers/conversationController.js';
import CustomizationController from './controllers/customizationController.js';
import DataController from './controllers/dataController.js';
import OktaController from './controllers/oktaController.js';
import SettingController from './controllers/settingController.js';
import TemplateController from './controllers/templateController.js';

export default (router: Express) => {

  const oktaController = new OktaController();


  router.use('/api', oktaController.authenticationRequired);

  router.get("/api/v1/data", DataController.get);

  router.post("/api/v1/content", ContentController.add);
  router.get("/api/v1/content", ContentController.get);
  router.get("/api/v1/content/:sid", ContentController.get);

  router.post("/api/v1/setting", ClaimController.validateClaim, SettingController.setSelectedSetting);

  router.get("/api/v1/template", TemplateController.get);
  router.post("/api/v1/template/content", ClaimController.validateClaim, TemplateController.addContentToTemplate);
  router.delete("/api/v1/template/content", ClaimController.validateClaim, TemplateController.deleteContentFromTemplate);

  router.get("/api/v1/configuration", ConfigurationController.get);
  router.post("/api/v1/configuration", ClaimController.validateClaim, ConfigurationController.add);

  router.post("/api/v1/claim", ClaimController.add);
  router.put("/api/v1/claim/:id", ClaimController.validateClaim, ClaimController.close);

  router.get("/api/v1/conversation", ConversationController.get);
  router.delete("/api/v1/conversation", ClaimController.validateClaim, ConversationController.deleteAll);

  router.get("/customization/export", CustomizationController.export);
  router.post("/api/v1/customization/import", CustomizationController.import);

};