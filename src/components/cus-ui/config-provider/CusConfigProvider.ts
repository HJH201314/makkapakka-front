import type { Ref } from 'vue';
import { defineComponent, inject, provide, toRef } from 'vue';
import cusVariables from '../assets/variables.module.scss';
import type { RecursivePartial } from '../utils/type.util';

export type CusConfig = {
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
};

export type ConfigProviderProps = RecursivePartial<CusConfig>;

export const configProviderKey = Symbol('configProvider');

export const useConfigProvider = () => ({
  config: inject<Ref<CusConfig>>(configProviderKey)?.value ?? ({} as CusConfig),
  theme: inject<Ref<CusConfig>>(configProviderKey)?.value.theme ?? ({} as CusConfig['theme']),
});

export default defineComponent<ConfigProviderProps>(
  (props, ctx) => {
    console.log(props);
    provide<Ref<CusConfig>>(
      configProviderKey,
      toRef(() => props as CusConfig)
    );
    return () => ctx.slots.default?.();
  },
  {
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
  }
);
