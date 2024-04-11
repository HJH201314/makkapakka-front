import { defineStore } from "pinia"
import { onMounted, ref } from "vue";
import useFeatureStore from "./useFeatureStore";
import { getList } from '@/api/role';

type RoleItem = {
  name: string;
  no: string;
  status: number;
  features: number[];
}

const useRoleStore = defineStore('role', () => {
  const featureStore = useFeatureStore();
  const roles = ref<RoleItem[]>([]);
  
  // mock list
  onMounted(() => {
    // getList().then((res) => {});
    roles.value = [
      {
        name: '游客',
        no: '0',
        status: 0,
        features: [],
      },
      {
        name: '超级管理员',
        no: '1',
        status: 0,
        features: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      },
      {
        name: '普通管理员',
        no: '2',
        status: 0,
        features: [1, 2, 3, 4, 5, 6, 9, 10, 11],
      },
      {
        name: '注册用户',
        no: '3',
        status: 0,
        features: [],
      },
      {
        name: '主播',
        no: '4',
        status: 0,
        features: [],
      },
    ];
  });

  function deleteRole(roleNo: string) {
    roles.value = roles.value.filter((role) => role.no !== roleNo);
  }

  function addRole(role: RoleItem) {
    roles.value.push(role);
  }

  function updateRole(role: RoleItem) {
    const index = roles.value.findIndex((item) => item.no === role.no);
    roles.value[index] = role;
  }

  return {
    roles,
    addRole,
    updateRole,
    deleteRole,
  };
});

export default useRoleStore;
