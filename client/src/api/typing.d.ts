declare namespace API {
  // 用户信息
  interface UserInfo {
    // 用户ID
    id?: number;
    // 邮箱
    email?: string;
    // 昵称
    name?: string;
    // 头像地址
    avatarUrl?: string;
    // 性别，0：男 1：女
    sex?: number;
    // 属地
    region?: string;
    // 生日
    birthday?: string;
    // 账户创建时间
    createTime?: string;
    // 喜好是否选择？0：未选择 1：已选择
    isHobbySelected?: number;
    // 简介
    description?: string;
  }
}