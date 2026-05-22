import { APIRequestContext } from '@playwright/test';
import { RequestObject } from '../types/types';

export class RestfulController {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl + '/v3/b';
  }

  async getBin(id: string) {
    return this.request.get(`${this.baseUrl}/${id}`);
  }

  async deleteBin(id: string) {
    return this.request.delete(`${this.baseUrl}/${id}`);
  }

  async createBin(binPayload: RequestObject | {}) {
    return this.request.post(this.baseUrl, {
      data: binPayload,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async createBinWithoutHeader(binPayload: RequestObject | {}) {
    return this.request.post(this.baseUrl, {
      data: JSON.stringify(binPayload),
      headers: {}
    });
  }

  async updateBin(id: string, binPayload: RequestObject | {}) {
    return this.request.put(`${this.baseUrl}/${id}`, {
      data: binPayload,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async updateBinWithoutHeader(id: string, binPayload: RequestObject | {}) {
    return this.request.put(`${this.baseUrl}/${id}`, {
      data: JSON.stringify(binPayload),
      headers: {}
    });
  }
}
