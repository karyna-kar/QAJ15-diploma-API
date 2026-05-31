import { expect } from '@playwright/test';
import { test } from '../fixtures/custome-fixtures';

test.describe('GET', () => {
  let createdBins: string[] = [];
  test.beforeAll(async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    const createdId = bodyResponse.metadata.id;
    createdBins.push(createdId);
  });

  test.afterAll(async ({ restfulControllerAuthorizedUser }) => {
    for (const id of createdBins) {
      await restfulControllerAuthorizedUser.deleteBin(id);
    }
  });

  test('GET /b/{id}: check by existing id', async ({ restfulControllerAuthorizedUser }) => {
    const binID = createdBins[0];
    const response = await restfulControllerAuthorizedUser.getBin(binID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(200);
    expect(bodyResponse.metadata.id).toEqual(binID);
  });

  test('GET /b/{id}: check failed Authorization - no X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const binID = createdBins[0];
    const response = await restfulControllerNotAuthorizedUser.getBin(binID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass X-Master-Key or X-Access-Key in the header to read a private bin'
    });
  });

  test('GET /b/{id}: check failed Authorization - invalid X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const binID = createdBins[0];
    const response = await restfulControllerNotAuthorizedUser.getBin(binID, {
      'X-Master-Key': 'wrong-key'
    });
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: "X-Master-Key is invalid or the bin doesn't belong to your account"
    });
  });

  test('GET /b/{id}: check by invalid id', async ({ restfulControllerAuthorizedUser }) => {
    const invalidBinID = 'TestID';
    const response = await restfulControllerAuthorizedUser.getBin(invalidBinID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid Bin Id provided'
    });
  });

  test('GET /b/{id}: check by not existing id', async ({ restfulControllerAuthorizedUser }) => {
    const notExistingBinID = '6a039589250b1311c33f0d79';
    const response = await restfulControllerAuthorizedUser.getBin(notExistingBinID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(404);
    expect(bodyResponse).toMatchObject({
      message: "Bin not found or it doesn't belong to your account"
    });
  });
});

test.describe('POST', () => {
  let createdBins: string[] = [];
  test.afterAll(async ({ restfulControllerAuthorizedUser }) => {
    for (const id of createdBins) {
      await restfulControllerAuthorizedUser.deleteBin(id);
    }
  });

  test('POST /b: check failed Authorization - no X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerNotAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass X-Master-Key or X-Access-Key in the header to create a bin'
    });
  });

  test('POST /b: check failed Authorization - invalid X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerNotAuthorizedUser.createBin(originalPayload, {
      'X-Master-Key': 'wrong-key'
    });
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid X-Master-Key provided'
    });
  });

  test('POST /b: check request without Content-Type header', async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerAuthorizedUser.createBinWithoutHeader(originalPayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass Content-Type set to application/json'
    });
  });

  test('POST /b: create a new valid bin', async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    const createdId = bodyResponse.metadata.id;
    createdBins.push(createdId);
    expect(response.status()).toBe(200);
    expect(bodyResponse.record).toMatchObject(originalPayload);
    const getResponse = await restfulControllerAuthorizedUser.getBin(createdId);
    const bodyGetResponse = await getResponse.json();
    expect(getResponse.status()).toBe(200);
    expect(bodyGetResponse.metadata.id).toEqual(createdId);
  });

  test('POST /b: create a new empty bin', async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = {};
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Bin cannot be blank'
    });
  });

  test('POST /b: invalid JSON', async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = 'Test';
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid JSON. Please try again'
    });
  });
});

test.describe('PUT', () => {
  let createdBins: string[] = [];
  test.beforeAll(async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    const createdId = bodyResponse.metadata.id;
    createdBins.push(createdId);
  });

  test.afterAll(async ({ restfulControllerAuthorizedUser }) => {
    for (const id of createdBins) {
      await restfulControllerAuthorizedUser.deleteBin(id);
    }
  });

  test('PUT /b/{id}: check failed Authorization - no X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const idForUpdating = createdBins[0];
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerNotAuthorizedUser.updateBin(idForUpdating, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass X-Master-Key or X-Access-Key in the header to update a private bin'
    });
  });

  test('PUT /b/{id}: check failed Authorization - invalid X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const idForUpdating = createdBins[0];
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerNotAuthorizedUser.updateBin(idForUpdating, updatePayload, { 'X-Master-Key': 'wrong-key' });
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid X-Master-Key provided or the bin does not belong to your account'
    });
  });

  test('PUT /b: check request without Content-Type header', async ({ restfulControllerAuthorizedUser }) => {
    const idForUpdating = createdBins[0];
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerAuthorizedUser.updateBinWithoutHeader(idForUpdating, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass Content-Type set to application/json'
    });
  });

  test('PUT /b/{id}: update existing bin', async ({ restfulControllerAuthorizedUser }) => {
    const idForUpdating = createdBins[0];
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerAuthorizedUser.updateBin(idForUpdating, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(200);
    expect(bodyResponse.record).toMatchObject(updatePayload);
    expect(bodyResponse.metadata.parentId).toEqual(idForUpdating);
    const getResponse = await restfulControllerAuthorizedUser.getBin(idForUpdating);
    const bodyGetResponse = await getResponse.json();
    expect(getResponse.status()).toBe(200);
    expect(bodyGetResponse.metadata.id).toEqual(idForUpdating);
  });

  test('PUT /b/{id}: update existing bin with empty object', async ({ restfulControllerAuthorizedUser }) => {
    const idForUpdating = createdBins[0];
    const updatePayload = {};
    const response = await restfulControllerAuthorizedUser.updateBin(idForUpdating, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Bin cannot be blank'
    });
  });

  test('PUT /b/{id}: update not existing bin', async ({ restfulControllerAuthorizedUser }) => {
    const notExistingBinId = '111111111111111111111111';
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerAuthorizedUser.updateBin(notExistingBinId, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(404);
    expect(bodyResponse).toMatchObject({
      message: 'Bin not found'
    });
  });

  test('PUT /b/{id}: check by invalid id', async ({ restfulControllerAuthorizedUser }) => {
    const invalidBinId = 'Test123';
    const updatePayload = { sample: 'Hello World : Updated' };
    const response = await restfulControllerAuthorizedUser.updateBin(invalidBinId, updatePayload);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid Bin Id provided'
    });
  });
});

test.describe('DELETE', () => {
  let createdBins: string[] = [];
  test.beforeAll(async ({ restfulControllerAuthorizedUser }) => {
    const originalPayload = { sample: 'Hello World' };
    const response = await restfulControllerAuthorizedUser.createBin(originalPayload);
    const bodyResponse = await response.json();
    createdBins.push(bodyResponse.metadata.id);
  });

  test('DELETE /b/{id}: check failed Authorization - no X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const createdBinId = createdBins[0];
    const response = await restfulControllerNotAuthorizedUser.deleteBin(createdBinId);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: 'You need to pass X-Master-Key or X-Access-Key in the header to delete a bin'
    });
  });

  test('DELETE /b/{id}: check failed Authorization - invalid X-Master-Key header', async ({ restfulControllerNotAuthorizedUser }) => {
    const createdBinId = createdBins[0];
    const response = await restfulControllerNotAuthorizedUser.deleteBin(createdBinId, {
      'X-Master-Key': 'wrong-key'
    });
    const bodyResponse = await response.json();
    expect(response.status()).toBe(401);
    expect(bodyResponse).toMatchObject({
      message: "X-Master-Key is invalid or the bin doesn't belong to your account"
    });
  });

  test('DELETE /b/{id}: delete existing bin', async ({ restfulControllerAuthorizedUser }) => {
    const createdBinId = createdBins[0];
    const response = await restfulControllerAuthorizedUser.deleteBin(createdBinId);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(200);
    expect(bodyResponse.metadata.id).toEqual(createdBinId);
    expect(bodyResponse.message).toEqual('Bin deleted successfully');
    const getResponse = await restfulControllerAuthorizedUser.getBin(createdBinId);
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /b/{id}: check by not existing id', async ({ restfulControllerAuthorizedUser }) => {
    const binID = '111111111111111111111111';
    const response = await restfulControllerAuthorizedUser.deleteBin(binID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(404);
    expect(bodyResponse).toMatchObject({
      message: "Bin not found or it doesn't belong to your account"
    });
  });

  test('DELETE /b/{id}: check by invalid id', async ({ restfulControllerAuthorizedUser }) => {
    const binID = 'Test123';
    const response = await restfulControllerAuthorizedUser.deleteBin(binID);
    const bodyResponse = await response.json();
    expect(response.status()).toBe(400);
    expect(bodyResponse).toMatchObject({
      message: 'Invalid Bin Id provided'
    });
  });
});
