<template>
  <div class="list-common-table">
    <t-form
      ref="form"
      :data="formData"
      :label-width="80"
      colon
      :style="{ marginBottom: '8px' }"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[16, 24]">
            <t-col :span="4">
              <t-form-item label="功能名称" name="name">
                <t-input
                  v-model="formData.name"
                  class="form-item-content"
                  type="search"
                  placeholder="请输入功能名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="功能状态" name="status">
                <t-select
                  v-model="formData.status"
                  class="form-item-content"
                  :options="FEATURE_STATUS_OPTIONS"
                  placeholder="请选择功能状态"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="功能编号" name="no">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  placeholder="请输入功能编号"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>

        <t-col :span="2" class="operation-container">
          <t-button theme="primary" type="submit" :style="{ marginLeft: '8px' }"> 查询 </t-button>
          <t-button type="reset" variant="base" theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        :vertical-align="verticalAlign"
        :hover="hover"
        :pagination="pagination"
        :loading="dataLoading"
        :header-affixed-top="headerAffixedTop"
        @page-change="rehandlePageChange"
        @change="rehandleChange"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === FEATURE_STATUS.ENABLED" theme="success" variant="light"> 启用 </t-tag>
          <t-tag v-if="row.status === FEATURE_STATUS.DISABLED" theme="danger" variant="light"> 停用 </t-tag>
        </template>
        <template #op="{ row }">
          <!-- <a class="t-button-link" @click="rehandleClickOp(slotProps)">管理</a> -->
          <a v-if="row.status == FEATURE_STATUS.ENABLED" class="t-button-link" @click="handleClickDisable(row)">停用</a>
          <a v-if="row.status == FEATURE_STATUS.DISABLED" class="t-button-link" @click="handleClickEnable(row)">启用</a>
        </template>
      </t-table>
      <t-dialog
        v-model:visible="confirmVisible"
        header="确认删除当前所选功能？"
        :body="confirmBody"
        :on-cancel="onCancel"
        @confirm="onConfirmDelete"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { MessagePlugin, PrimaryTableCol, TableRowData, PageInfo } from 'tdesign-vue-next';
import Trend from '@/components/trend/index.vue';
import { getList } from '@/api/feature';
import { useSettingStore } from '@/store';
import { prefix } from '@/config/global';

import {
  FEATURE_STATUS,
  FEATURE_STATUS_OPTIONS,
} from '@/constants';

const store = useSettingStore();

const COLUMNS: PrimaryTableCol<TableRowData>[] = [
  {
    title: '功能名称',
    fixed: 'left',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  { title: '功能状态', colKey: 'status', width: 200 },
  {
    title: '功能编号',
    ellipsis: true,
    colKey: 'no',
  },
  {
    title: '功能类型',
    ellipsis: true,
    colKey: 'type',
  },
  {
    align: 'left',
    fixed: 'right',
    colKey: 'op',
    title: '操作',
  },
];

const searchForm = {
  name: '',
  no: undefined,
  status: undefined,
  type: '',
};

const formData = ref({ ...searchForm });
const rowKey = 'index';
const verticalAlign = 'top' as const;
const hover = true;

const pagination = ref({
  defaultPageSize: 20,
  total: 100,
  defaultCurrent: 1,
});
const confirmVisible = ref(false);

const data = ref([]);

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

const resetIdx = () => {
  deleteIdx.value = -1;
};

const onConfirmDelete = () => {
  // 真实业务请发起请求
  data.value.splice(deleteIdx.value, 1);
  pagination.value.total = data.value.length;
  confirmVisible.value = false;
  MessagePlugin.success('删除成功');
  resetIdx();
};

const onCancel = () => {
  resetIdx();
};

onMounted(() => {
  fetchData();
});

const handleClickDelete = ({ row }) => {
  deleteIdx.value = row.rowIndex;
  confirmVisible.value = true;
};
const onReset = (val) => {
  console.log(val);
};
const onSubmit = (val) => {
  console.log(val);
};
const rehandlePageChange = (pageInfo: PageInfo, newDataSource: TableRowData[]) => {
  console.log('分页变化', pageInfo, newDataSource);
};
const rehandleChange = (changeParams, triggerAndData) => {
  console.log('统一Change', changeParams, triggerAndData);
};
const rehandleClickOp = ({ text, row }) => {
  console.log(text, row);
};

function handleClickEnable(row) {

}

function handleClickDisable(row) {
  
}

const headerAffixedTop = computed(
  () =>
    ({
      offsetTop: store.isUseTabsRouter ? 48 : 0,
      container: `.${prefix}-layout`,
    } as any), // TO BE FIXED
);
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: 30px 32px;
  border-radius: var(--td-radius-default);

  .table-container {
    margin-top: 30px;
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}
</style>
