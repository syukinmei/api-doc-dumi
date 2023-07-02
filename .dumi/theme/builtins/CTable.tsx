// import React from 'react';
// import { Table } from 'antd';
// import type { ColumnsType } from 'antd/es/table';

// interface DataType {
//   key: React.ReactNode;
//   param: string;
//   name: number | string;
//   required?: 'Y' | 'N';
//   type?: string;
//   length?: number;
//   demo?: string;
//   describe: string;
//   children?: DataType[];
// }

// // const columns: ColumnsType<DataType> = [
// //   {
// //     title: '参数',
// //     dataIndex: 'param',
// //     width: 297,
// //     key: 'param',
// //   },
// //   {
// //     title: '名称',
// //     dataIndex: 'name',
// //     key: 'name',
// //   },
// //   {
// //     title: '是否必填',
// //     dataIndex: 'required',
// //     key: 'required',
// //   },
// //   {
// //     title: '类型',
// //     dataIndex: 'type',
// //     key: 'type',
// //   },
// //   {
// //     title: '长度',
// //     dataIndex: 'length',
// //     key: 'length',
// //   },
// //   {
// //     title: '示例',
// //     dataIndex: 'demo',
// //     key: 'demo',
// //   },
// //   {
// //     title: '描述',
// //     dataIndex: 'describe',
// //     // width: '30%',
// //     width: 375,
// //     key: 'describe',
// //   },
// // ];

// const CTable: React.FC<{
//   columns: string;
//   data: string;
// }> = ({ columns, data }) => {
//   console.log({ columns: JSON.parse(columns), data: JSON.parse(data) });

//   const columnsObj: ColumnsType<DataType> = JSON.parse(columns);
//   const dataObj: DataType[] = JSON.parse(data);
//   return (
//     <>
//       <Table
//         columns={columnsObj}
//         // expandable={{ defaultExpandAllRows: true }}
//         dataSource={dataObj}
//         pagination={false}
//       />
//     </>
//   );
// };

// export default CTable;

import React from 'react';
import { Table } from 'antd';
let linkType = 1; //1:本页面打开，2：新页面打开
linkType = 2;
const EXPLAIN_MAP = Object.freeze({
  快递公司编码: '/explain-doc/快递公司编码',
  快递产品类型编码: '/explain-doc/快递产品类型编码',
});
const Ctable: React.FC<{
  columns: any;
  data: any;
}> = ({ columns, data }) => {
  console.log(columns, data);
  /**
   * 这里修改了CTable声明，为了设置超链接
   */
  const parsedColumns = JSON.parse(columns); // 解析用户传递的 JSON 字符串为 JavaScript 对象
  return (
    <>
      <Table
        columns={parsedColumns.map((column) => {
          if (column.dataIndex === 'describe') {
            // 假设目标字段名是 describe
            return {
              ...column,
              render: (text) => {
                const pattern = /《(.*?)》/; // 匹配文本中的《》书名号
                const match = text.match(pattern); // 检查是否匹配到《》书名号

                if (match) {
                  // 如果匹配到《》书名号
                  const linkTitle = match[1]; // 获取书名号中的文本
                  const linkUrl = EXPLAIN_MAP[linkTitle]; // 根据映射数组获取链接URL

                  if (linkUrl) {
                    // 如果链接URL存在
                    const parts = text.split(match[0]); // 将原始文本按匹配到的书名号进行分割
                    if (linkType == 1) {
                      return (
                        <>
                          {parts[0]}
                          <a href={linkUrl}>{linkTitle}</a>
                          {parts[1]}
                        </>
                      );
                    } else {
                      return (
                        <>
                          {parts[0]}
                          <a target="_blank" href={linkUrl}>
                            {linkTitle}
                          </a>
                          {parts[1]}
                        </>
                      );
                    }
                  }
                }

                return text; // 不需要转换成超链接，直接返回文本
              },
            };
          }
          return column;
        })}
        // expandable={{ defaultExpandAllRows: true }}
        dataSource={JSON.parse(data)}
        pagination={false}
      />
    </>
  );
};

export default Ctable;
