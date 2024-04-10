import { TdBaseTableProps } from 'tdesign-vue-next';

interface DashboardPanel {
  title: string;
  number: string | number;
  leftType: string;
  upTrend?: string;
  downTrend?: string;
}

interface TendItem {
  growUp?: number;
  productName: string;
  count: number;
  date: string;
}

export const PANE_LIST: Array<DashboardPanel> = [
  {
    title: '今日收入',
    number: '¥ 19,191.00',
    upTrend: '20.5%',
    leftType: 'echarts-line',
  },
  {
    title: '今日退款',
    number: '¥ 80.00',
    downTrend: '20.5%',
    leftType: 'echarts-bar',
  },
  {
    title: '活跃用户（个）',
    number: '1145',
    upTrend: '20.5%',
    leftType: 'icon-usergroup',
  },
  {
    title: '当前直播（个）',
    number: 14,
    downTrend: '20.5%',
    leftType: 'icon-file-paste',
  },
];
