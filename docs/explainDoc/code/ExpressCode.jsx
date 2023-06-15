import React from 'react';
import { Table } from 'antd';

const ExpressCode = () => {
  const data = [
    {
      key: 1,
      businessType: '快递',
      expressName: '菜鸟裹裹',
      expressCode: 'CNGG',
    },
    {
      key: 2,
      businessType: '快递',
      expressName: '菜鸟裹裹商家件',
      expressCode: 'CNGG-B',
    },
    {
      key: 3,
      businessType: '快递',
      expressName: '德邦快递',
      expressCode: 'DBKD',
    },
    {
      key: 4,
      businessType: '快递',
      expressName: '京东快递',
      expressCode: 'JDL',
    },
    {
      key: 5,
      businessType: '快递',
      expressName: '顺丰速运',
      expressCode: 'SF',
    },
    {
      key: 6,
      businessType: '快递',
      expressName: '申通快递',
      expressCode: 'STO',
    },
    {
      key: 7,
      businessType: '快递',
      expressName: '圆通速递',
      expressCode: 'YTO',
    },
    {
      key: 8,
      businessType: '快递',
      expressName: '韵达快递',
      expressCode: 'YUNDA',
    },
    {
      key: 9,
      businessType: '快递',
      expressName: '中通快递',
      expressCode: 'ZTO',
    },
    {
      key: 10,
      businessType: '物流',
      expressName: '德邦物流',
      expressCode: 'DBKD-F',
    },
    {
      key: 11,
      businessType: '物流',
      expressName: '跨越物流',
      expressCode: 'KYE',
    },
    {
      key: 12,
      businessType: '物流',
      expressName: '顺心捷达',
      expressCode: 'SX',
    },
    {
      key: 13,
      businessType: '物流',
      expressName: '中通快运',
      expressCode: 'ZTO-F',
    },
  ];
  const columns = [
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
      render: (text, record, index) => {
        const groupData = data.reduce((result, item) => {
          if (!result[item.businessType]) {
            result[item.businessType] = [];
          }
          result[item.businessType].push(item);
          return result;
        }, {});

        const currentGroupData = groupData[text];
        let rowSpan = 1;
        if (index === 0) {
          rowSpan = currentGroupData.length;
        } else {
          const prevData = data[index - 1];
          if (prevData.businessType === text) {
            rowSpan = 0;
          } else {
            rowSpan = currentGroupData.length;
          }
        }

        return {
          children: text,
          props: {
            rowSpan,
          },
        };
      },
    },
    {
      title: '快递公司',
      dataIndex: 'expressName',
      key: 'expressName',
    },
    {
      title: '编码',
      dataIndex: 'expressCode',
      key: 'expressCode',
    },
  ];
  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} bordered />
    </>
  );
};

export default ExpressCode;
