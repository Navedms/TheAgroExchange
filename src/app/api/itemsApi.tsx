import client from './client';

export interface Item {
  id: number;
  name: string;
  fullName: string;
  brandId: number;
  brandName: string;
  qualityId?: number;
  qualityName?: string;
  sizeId?: number;
  sizeName?: string;
}

const endpoint = '/items/getData';

const get = () => client.get(endpoint);

export default {
  get,
};
