import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

type FeatureItem = {
  name: string;
  value: number;
  no?: string;
  status?: boolean;
  children?: FeatureItem[];
};

type FeatureOptionItem = {
  label: string;
  value: number;
  children?: FeatureOptionItem[];
};

const useFeatureStore = defineStore('feature', () => {
  const features = ref<FeatureItem[]>([
    {
      name: '用户管理',
      value: 1,
      children: [
        { name: '创建用户', value: 4, no: '4', status: true },
        { name: '修改用户', value: 5, no: '5', status: true },
        { name: '删除用户', value: 6, no: '6', status: true },
      ],
    },
    {
      name: '功能管理',
      value: 2,
      children: [
        { name: '启用功能', value: 7, no: '7', status: true },
        { name: '停用功能', value: 8, no: '8', status: true },
      ],
    },
    {
      name: '直播管理',
      value: 3,
      children: [
        { name: '删除直播间', value: 9, no: '9', status: false },
        { name: '修改直播间', value: 10, no: '10', status: true },
        { name: '封禁直播间', value: 11, no: '11', status: true },
      ],
    },
  ]);

  const convertFeaturesToOptions = (features) => {
    return features.map((feature) => {
      const option: FeatureOptionItem = {
        label: feature.name,
        value: feature.value,
      };

      if (feature.children) {
        option.children = convertFeaturesToOptions(feature.children);
      }

      return option;
    });
  };

  const featureOptions = computed(() => {
    return convertFeaturesToOptions(features.value);
  });

  const getFeatureCategories = (features) => {
    const categories = [];

    features.forEach((feature) => {
      if (feature.children && feature.children.length > 0) {
        categories.push({
          label: feature.name,
          value: feature.value,
        });

        const childCategories = getFeatureCategories(feature.children);
        categories.push(...childCategories);
      }
    });

    return categories;
  };

  const featureCategories = computed(() => {
    return getFeatureCategories(features.value);
  });

  return {
    features,
    featureOptions,
    featureCategories,
  };
});

export default useFeatureStore;
