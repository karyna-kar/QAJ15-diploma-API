import { test as baseTest } from '@playwright/test';
import { RestfulController } from '../controllers/controller';
import 'dotenv/config';

interface ExtendedFicture {
  restfulControllerAuthorizedUser: RestfulController;
  restfulControllerNotAuthorizedUser: RestfulController;
  restfulControllerInvalidXMasterKey: RestfulController;
}

export const test = baseTest.extend<ExtendedFicture>({
  restfulControllerAuthorizedUser: async ({ playwright }, use) => {
    const baseURL = 'https://api.jsonbin.io';
    const authRequest = await playwright.request.newContext({
      extraHTTPHeaders: { 'X-Master-Key': process.env.X_MASTER_KEY as string }
    });
    const controller = new RestfulController(authRequest, baseURL);
    await use(controller);
  },

  restfulControllerNotAuthorizedUser: async ({ request }, use) => {
    const baseURL = 'https://api.jsonbin.io';
    const controller = new RestfulController(request, baseURL);
    await use(controller);
  }
});
