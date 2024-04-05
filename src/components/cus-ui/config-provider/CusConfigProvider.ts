import { defineComponent, inject, provide, toRef } from 'vue';
import type { Ref } from 'vue';
import cusVariables from '../assets/variables.module.scss';

export type ConfigProviderProps = {
  theme: {
    primaryColor: string;
    secondaryColor: string;
  }
}

export const configProviderKey = Symbol('configProvider');

export const useConfigProvider = () => {
  return {
    config: inject<Ref<ConfigProviderProps>>(configProviderKey)?.value ?? {} as ConfigProviderProps,
    theme: inject<Ref<ConfigProviderProps>>(configProviderKey)?.value.theme ?? {} as ConfigProviderProps['theme'],
  };
};

export default defineComponent<ConfigProviderProps>((props, ctx) => {
  console.log(props);
  provide<Ref<ConfigProviderProps>>(configProviderKey, toRef(() => props));
  return () => {
    return ctx.slots.default?.();
  };
}, {
  name: 'CusConfigProvider',
  props: {
    theme: {
      type: Object,
      default: () => ({
        primaryColor: cusVariables.cusColorPrimary,
        secondaryColor: cusVariables.cusColorSecondary,
      }),
    },
  },
});