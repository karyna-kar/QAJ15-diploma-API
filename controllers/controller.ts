import { APIRequestContext } from '@playwright/test';
import { RequestObject } from '../types/types';

export class RestfulController {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl + '/v3/b';
  }

  async getBin(id: string, headers?: Record<string, string>) {
    return this.request.get(`${this.baseUrl}/${id}`, { headers: { ...headers } });
  }

  async deleteBin(id: string, headers?: Record<string, string>) {
    return this.request.delete(`${this.baseUrl}/${id}`, { headers: { ...headers } });
  }

  async createBin(binPayload: RequestObject | {}, headers?: Record<string, string>) {
    return this.request.post(this.baseUrl, {
      data: binPayload,
      headers: { 'Content-Type': 'application/json', ...headers }
    });
  }

  async createBinWithoutHeader(binPayload: RequestObject | {}) {
    return this.request.post(this.baseUrl, {
      data: JSON.stringify(binPayload),
      headers: {}
    });
  }

  async updateBin(id: string, binPayload: RequestObject | {}, headers?: Record<string, string>) {
    return this.request.put(`${this.baseUrl}/${id}`, {
      data: binPayload,
      headers: { 'Content-Type': 'application/json', ...headers }
    });
  }

  async updateBinWithoutHeader(id: string, binPayload: RequestObject | {}) {
    return this.request.put(`${this.baseUrl}/${id}`, {
      data: JSON.stringify(binPayload),
      headers: {}
    });
  }
}
