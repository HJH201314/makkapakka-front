<template>
  <div class="table-tree-container">
    <div class="list-tree-wrapper">
      <div class="list-tree-operator">
        <t-input v-model="filterText" placeholder="请输入分类" @change="onChange">
          <template #suffix-icon>
            <search-icon size="20px" />
          </template>
        </t-input>
        <t-tree @click="onTreeClick" :data="featureCategories" hover expand-on-click-node :filter="filterByText" />
      </div>
      <div class="list-tree-content">
        <feature-table :feature-category="selectedCategory" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ListTree',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';

import { DEFAULT_TREE_DATA } from './constants';
import FeatureTable from './components/FeatureTable.vue';
import useFeatureStore from '@/hooks/biz/useFeatureStore';

const { featureCategories } = useFeatureStore();

const filterByText = ref();
const filterText = ref();
const selectedCategory = ref('');

const onChange = () => {
  filterByText.value = (node) => {
    return node.label.indexOf(filterText.value) != -1;
  };
};

const onTreeClick = ({ node }) => {
  selectedCategory.value = node.label;
}
</script>

<style lang="less" scoped>
.table-tree-container {
  background-color: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);

  .t-tree {
    margin-top: 24px;
  }
}

.list-tree-wrapper {
  overflow-y: hidden;
}

.list-tree-operator {
  width: 200px;
  float: left;
  padding: 30px 32px;
}

.list-tree-content {
  border-left: 1px solid var(--td-border-level-1-color);
  overflow: auto;
}
</style>
