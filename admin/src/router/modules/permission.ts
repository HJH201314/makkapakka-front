import Layout from '@/layouts/index.vue';
import ListIcon from '@/assets/assets-slide-list.svg';

export default [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    name: 'permission',
    meta: { title: '权限管理', icon: ListIcon },
    children: [
      {
        path: 'feature',
        name: 'FeatureList',
        component: () => import('@/pages/permission/feature/index.vue'),
        meta: { title: '功能管理' },
      },
      {
        path: 'role',
        name: 'RoleList',
        component: () => import('@/pages/permission/role/index.vue'),
        meta: { title: '角色管理' },
      },
    ],
  },
];
