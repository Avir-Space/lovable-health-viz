import React from 'react';
import ReactECharts from 'echarts-for-react';

type Props = { option: any; style?: React.CSSProperties };
export default function EChart({ option, style }: Props) {
  return <ReactECharts option={option} style={style || { height: 280, width: '100%' }} notMerge />;
}
