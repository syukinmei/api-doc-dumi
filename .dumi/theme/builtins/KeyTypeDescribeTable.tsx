import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: React.ReactNode;
  param: string;
  type?: string;
  describe: string;
  children?: DataType[];
}

const columns: ColumnsType<DataType> = [
  {
    title: '键',
    dataIndex: 'param',
    width: 297,
    key: 'param',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    width: 375,
    key: 'describe',
  },
];

// 订单状态通知对接文档 - 消息体
const messageBody = [
  {
    key: 1,
    param: 'cpCode',
    type: 'String',
    describe: '快递公司编码',
  },
  {
    key: 2,
    param: 'cpName',
    type: 'String',
    describe: '快递公司名称',
  },
  {
    key: 3,
    param: 'waybillCode',
    type: 'String',
    describe: '运单号',
  },
  {
    key: 4,
    param: 'volume',
    type: 'int',
    describe: '体积 单位:ml',
  },
  {
    key: 5,
    param: 'productCode',
    type: 'String',
    describe: '产品类型',
  },
  {
    key: 6,
    param: 'totalFee',
    type: 'int',
    describe: '总费用',
  },
  {
    key: 7,
    param: 'weight',
    type: 'int',
    describe: '包裹重量 单位：克',
  },
  {
    key: 8,
    param: 'feeList',
    type: 'array',
    describe: '费用列表',
    children: [
      {
        key: 81,
        param: 'code',
        type: 'Srting',
        describe: '费用编码',
      },
      {
        key: 82,
        param: 'name',
        type: 'Srting',
        describe: '费用名',
      },
      {
        key: 83,
        param: 'value',
        type: 'int',
        describe: '费用 单位：分',
      },
      {
        key: 84,
        param: 'type',
        type: 'int',
        describe: '费用类型 2 减价',
      },
    ],
  },
  {
    key: 9,
    param: 'calculateWeight',
    type: 'int',
    describe: '计费重量',
  },
  {
    key: 10,
    param: 'comments',
    type: 'String',
    describe: '详情',
  },
  {
    key: 11,
    param: 'siteCode',
    type: 'String',
    describe: '网点编码',
  },
  {
    key: 12,
    param: 'siteName',
    type: 'String',
    describe: '网点名',
  },
  {
    key: 13,
    param: 'sitePhone',
    type: 'String',
    describe: '网点联系电话',
  },
  {
    key: 14,
    param: 'id',
    type: 'String',
    describe: '快递员编号',
  },
  {
    key: 15,
    param: 'name',
    type: 'String',
    describe: '快递员姓名',
  },
  {
    key: 16,
    param: 'mobile',
    type: 'String',
    describe: '快递员手机号',
  },
  {
    key: 17,
    param: 'sendStartTime',
    type: 'int',
    describe: '预约揽件开始时间',
  },
  {
    key: 18,
    param: 'sendEndTime',
    type: 'int',
    describe: '预约揽件结束时间',
  },
  {
    key: 19,
    param: 'productType',
    type: 'String',
    describe: '风火递运输方式/产品类型',
  },
  {
    key: 20,
    param: 'productCode',
    type: 'String',
    describe: '运力侧运输方式/产品类型',
  },
];
const dataSourceSet: DataType[][] = [messageBody];

const KeyTypeDescribeTable: React.FC<{
  idx: number;
}> = ({ idx = 0 }) => {
  return (
    <>
      <Table
        columns={columns}
        // expandable={{ defaultExpandAllRows: true }}
        dataSource={dataSourceSet[idx]}
        pagination={false}
      />
    </>
  );
};

export default KeyTypeDescribeTable;
