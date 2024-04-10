<template>
  <div>
    <t-card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="handleSetupContract"> 添加角色 </t-button>
          <!-- <t-button variant="base" theme="default" :disabled="!selectedRowKeys.length"> 导出合同 </t-button> -->
          <!-- <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p> -->
        </div>
        <div class="search-input">
          <t-input v-model="searchValue" placeholder="请输入你需要搜索的角色" clearable>
            <template #suffix-icon>
              <search-icon size="20px" />
            </template>
          </t-input>
        </div>
      </t-row>
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :selected-row-keys="selectedRowKeys"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
        @select-change="rehandleSelectChange"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === ROLE_STATUS.ENABLED" theme="success" variant="light"> 启用 </t-tag>
          <t-tag v-if="row.status === ROLE_STATUS.DISABLED" theme="danger" variant="light"> 禁用 </t-tag>
        </template>

        <template #op="slotProps">
          <a class="t-button-link" @click="handleClickEdit()">修改</a>
          <a class="t-button-link" @click="handleClickDelete(slotProps)">删除</a>
        </template>
      </t-table>
    </t-card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选角色？"
      :body="confirmBody"
      :on-cancel="onCancel"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RoleList',
};
</script>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MessagePlugin, PrimaryTableCol, TableRowData, PageInfo } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'tdesign-icons-vue-next';

import { ROLE_STATUS } from '@/constants';
import { getList } from '@/api/role';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    title: '角色名称',
    fixed: 'left',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  { title: '角色状态', colKey: 'status', width: 200 },
  {
    title: '角色编号',
    ellipsis: true,
    colKey: 'no',
  },
  {
    align: 'left',
    fixed: 'right',
    colKey: 'op',
    title: '操作',
  },
];

const store = useSettingStore();

const data = ref([]);
const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});

const searchValue = ref('');

const dataLoading = ref(false);
const fetchData = async () => {
  dataLoading.value = true;
  try {
    const { list } = await getList();
    data.value = list;
    pagination.value = {
      ...pagination.value,
      total: list.length,
    };
  } catch (e) {
    console.log(e);
  } finally {
    dataLoading.value = false;
  }
};

const deleteIdx = ref(-1);
const confirmBody = computed(() => {
  if (deleteIdx.value > -1) {
    const { name } = data.value[deleteIdx.value];
    return `删除后，${name}的所有合同信息将被清空，且无法恢复`;
  }
  return '';
});

onMounted(() => {
  fetchData();
});

const confirmVisible = ref(false);

const selectedRowKeys = ref([1, 2]);

const router = useRouter();

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1);
  pagination.value.total = data.value.length;
  const selectedIdx = selectedRowKeys.value.indexOf(deleteIdx.value);
  if (selectedIdx > -1) {
    selectedRowKeys.value.splice(selectedIdx, 1);
  }
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

const rowKey = 'index';

const rehandleSelectChange = (val: number[]) => {
  selectedRowKeys.value = val;
};
const rehandlePageChange = (curr, pageInfo) => {
  console.log('分页变化', curr, pageInfo);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const handleClickDetail = () => {
  // router.push('/detail/base');
};
const handleClickEdit = () => {
  // router.push('/detail/base');
};
const handleSetupContract = () => {
  // router.push('/form/base');
};
const handleClickDelete = (row: { rowIndex: any }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any),
);
</script>

<style lang="less" scoped>
.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: 8px;
    color: var(--td-text-color-secondary);
  }
}

.search-input {
  width: 360px;
}
</style>
