// 请按名称排序放置
import ApiClient from './ApiClient';
import QiniuClient from './QiniuClient';

const sharedApiClient = new ApiClient();
const sharedQiniuClient = new QiniuClient();

export {
  ApiClient,
  sharedApiClient,
  QiniuClient,
  sharedQiniuClient,
};
