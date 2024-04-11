// 功能状态枚举
export const FEATURE_STATUS = {
  // 启用
  ENABLED: 0,
  // 关闭
  DISABLED: 1,
  // 弃用
  ABANDONED: 2,
};

export const FEATURE_STATUS_OPTIONS = [
  { value: FEATURE_STATUS.ENABLED, label: '启用' },
  { value: FEATURE_STATUS.DISABLED, label: '停用' },
];

// 角色状态枚举
export const ROLE_STATUS = {
  // 启用
  ENABLED: 0,
  // 关闭
  DISABLED: 1,
  // 弃用
  ABANDONED: 2,
}

export const ROLE_STATUS_OPTIONS = [
  { value: ROLE_STATUS.ENABLED, label: '启用' },
  { value: ROLE_STATUS.DISABLED, label: '禁用' },
  { value: ROLE_STATUS.ABANDONED, label: '弃用' },
];