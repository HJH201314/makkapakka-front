<template>
  <div>
    <t-card class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button @click="handleClickAddRole"> 添加角色 </t-button>
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
          <a class="t-button-link" @click="handleClickEditRole(slotProps.row)">修改</a>
          <a class="t-button-link" @click="handleClickDeleteRole()">删除</a>
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

    <t-dialog
      v-model:visible="modifyVisible"
      :closeOnEscKeydown="false"
      :closeOnOverlayClick="false"
      :header="`${modifyOp}角色`"
      :confirm-btn="{
        content: modifyLoading ? '保存中' : '保存',
        theme: 'primary',
        loading: modifyLoading,
      }"
      :on-confirm="handleModifyConfirm"
      style="width: 75%;"
  >
    <t-form ref="modifyForm" :data="modifyFormData" :rules="FORM_RULES">
      <t-form-item label="角色名称" name="name">
        <t-input v-model="modifyFormData.name" placeholder="请输入角色名称"></t-input>
      </t-form-item>
      <t-form-item v-if="modifyOp == '修改'" label="是否启用" name="enabled">
        <t-switch v-model="modifyFormData.enabled"></t-switch>
      </t-form-item>
      <t-form-item label="角色权限" name="features">
        <t-tree-select
          :data="featureOptions"
          v-model="modifyFormData.features"
          clearable
          filterable
          multiple
          placeholder="请选择权限"
        />
      </t-form-item>
    </t-form>
  </t-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RoleList',
};
</script>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { MessagePlugin, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { FormProps, FormInstanceFunctions, ValidateResultType, CheckboxGroupProps, InputProps } from 'tdesign-vue-next';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'tdesign-icons-vue-next';

import { ROLE_STATUS } from '@/constants';
import { useSettingStore } from '@/store';
import useRoleStore from '@/hooks/biz/useRoleStore';
import { prefix } from '@/config/global';
import useFeatureStore from '@/hooks/biz/useFeatureStore';
import { sleep } from '@/utils/delay';

const { featureOptions } = useFeatureStore();

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
const roleStore = useRoleStore();

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
    const list = roleStore.roles;
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
const modifyVisible = ref(false);
const modifyOp = ref<'添加'|'修改'>('添加');
const modifyLoading = ref(false);

const FORM_RULES: FormProps['rules'] = {
  name: [{ required: true, message: '角色名称为必填项' }],
  features: [{ validator: (v) => v.length >= 0, message: '至少选择0项权限' }],
};
const modifyFormData: FormProps['data'] = reactive<{
  no: string;
  name: string;
  features: number[];
  enabled: boolean;
}>({
  no: '',
  name: '',
  features: [],
  enabled: true,
});
const modifyForm = ref<FormInstanceFunctions>(null);

const handleModifyConfirm = async () => {
  try {
    const validateResult = await modifyForm.value.validate();
    console.log(validateResult);
    
    if (Object.values(validateResult).every(v => v.result)) {
      modifyLoading.value = true;
      // TODO: 提交
      await sleep(1000);
      if (modifyOp.value === '添加') {
        roleStore.addRole({ ...modifyFormData.value, status: modifyFormData.enabled ? 0 : 1 });
      } else {
        roleStore.updateRole({ ...modifyFormData.value, status: modifyFormData.enabled ? 0 : 1 });
      }
    }
  } catch (e) {

  } finally {
    modifyLoading.value = false;
    modifyVisible.value = false;
    MessagePlugin.success(`${modifyOp.value}成功`);
    fetchData();
  }
}

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
const handleClickAddRole = () => {
  modifyOp.value = '添加';
  modifyVisible.value = true;
}
const handleClickSaveRole = () => {

}
const handleClickEditRole = (record) => {
  modifyOp.value = '修改';
  modifyVisible.value = true;
  modifyFormData.no = record.no || '';
  modifyFormData.name = record.name || '';
  modifyFormData.features = record.features || [];
  modifyFormData.enabled = record.status === 0;
}
const handleClickDeleteRole = () => {
  confirmVisible.value = true;
}
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
