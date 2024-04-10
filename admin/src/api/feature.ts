import { request } from '@/utils/request';
import type { ListResult } from '@/api/model/listModel';

const Api = {
  FeatureList: '/feature/list',
};

export function getList() {
  return request.get<ListResult>({
    url: Api.FeatureList,
  });
}
