import { PublicOwner } from "@hubspot/api-client/lib/codegen/crm/owners";
import { Request, Response } from "express";
import Configuration, { IConfiguration } from "../api/models/configuration.js";
import Template from "../api/models/template.js";
import { getCustomerById, getOwnerByEmail, IFrontlineCustomer } from "../providers/customers.js";

const templatesCallbackHandler = async (req: Request, res: Response) => {
    const location = req.body.Location;

    // Location helps to determine which information was requested.
    // CRM callback is a general purpose tool and might be used to fetch different kind of information
    switch (location) {
        case 'GetTemplatesByCustomerId': {
            await handleGetTemplatesByCustomerIdCallback(req, res);
            return;
        }

        default: {
            console.log('Unknown location: ', location);
            res.sendStatus(422);
        }
    }
};

const handleGetTemplatesByCustomerIdCallback = async (req: Request, res: Response) => {
    const body = req.body
    console.log('Getting templates: ', body.CustomerId);

    const workerIdentity = body.Worker;
    const customerId = body.CustomerId;

    const customerDetails = await getCustomerById(customerId);

    if (!customerDetails) {
        return res.status(404).send("Customer not found");
    }

    const workerDetails = await getOwnerByEmail(workerIdentity);

    if (!workerDetails) {
        return res.status(404).send("Worker not found");
    }

    const templates = await Template.get();
    const configuration = await Configuration.get();

    const compiledTemplate = templates.map(templateCategory => {
        return {
            ...templateCategory,
            ...{
                templates: templateCategory.templates.map(template => {
                    return {
                        ...template,
                        ...{
                            content: compileTemplate(template.content, customerDetails, workerDetails, configuration)
                        }
                    }
                })
            }
        }
    });

    // Respond with compiled Templates
    res.send(compiledTemplate);
};

const compileTemplate = (template: string, customer: IFrontlineCustomer, workerDetails: PublicOwner, configuration: IConfiguration): string => {

    let compiledTemplate = template.replace(/{{customerFirstname}}/, customer.firstname);
    compiledTemplate = compiledTemplate.replace(/{{customerLastname}}/, customer.lastname);
    compiledTemplate = compiledTemplate.replace(/{{agentFirstname}}/, workerDetails.firstName || '');
    compiledTemplate = compiledTemplate.replace(/{{agentLastname}}/, workerDetails.lastName || '');
    compiledTemplate = compiledTemplate.replace(/{{companyNameLong}}/, configuration.companyNameLong);
    compiledTemplate = compiledTemplate.replace(/{{companyNameShort}}/, configuration.companyNameShort);
    compiledTemplate = compiledTemplate.replace(/{{companyUrl}}/, configuration.companyUrl);

    return compiledTemplate;
};

export default templatesCallbackHandler;