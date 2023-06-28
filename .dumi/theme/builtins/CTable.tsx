import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: React.ReactNode;
  param: string;
  name: number | string;
  required?: 'Y' | 'N';
  type?: string;
  length?: number;
  demo?: string;
  describe: string;
  children?: DataType[];
}

// const columns: ColumnsType<DataType> = [
//   {
//     title: '参数',
//     dataIndex: 'param',
//     width: 297,
//     key: 'param',
//   },
//   {
//     title: '名称',
//     dataIndex: 'name',
//     key: 'name',
//   },
//   {
//     title: '是否必填',
//     dataIndex: 'required',
//     key: 'required',
//   },
//   {
//     title: '类型',
//     dataIndex: 'type',
//     key: 'type',
//   },
//   {
//     title: '长度',
//     dataIndex: 'length',
//     key: 'length',
//   },
//   {
//     title: '示例',
//     dataIndex: 'demo',
//     key: 'demo',
//   },
//   {
//     title: '描述',
//     dataIndex: 'describe',
//     // width: '30%',
//     width: 375,
//     key: 'describe',
//   },
// ];

const CTable: React.FC<{
  columns: string;
  data: string;
}> = ({ columns, data }) => {
  console.log({ columns: JSON.parse(columns), data: JSON.parse(data) });

  const columnsObj: ColumnsType<DataType> = JSON.parse(columns);
  const dataObj: DataType[] = JSON.parse(data);
  return (
    <>
      <Table
        columns={columnsObj}
        // expandable={{ defaultExpandAllRows: true }}
        dataSource={dataObj}
        pagination={false}
      />
    </>
  );
};

export default CTable;
