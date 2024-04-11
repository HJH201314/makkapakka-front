import { request } from '@/utils/request';
import type { ListResult } from '@/api/model/listModel';

const Api = {
  RoleList: '/role/list',
};

export function getList() {
  return request.get<ListResult>({
    url: Api.RoleList,
  });
}
