import React from 'react';
import { Table } from 'antd';

const Ctable: React.FC<{
  columns: any;
  data: any;
}> = ({ columns, data }) => {
  console.log(columns, data);
  return (
    <>
      <Table
        columns={JSON.parse(columns)}
        // expandable={{ defaultExpandAllRows: true }}
        dataSource={JSON.parse(data)}
        pagination={false}
      />
    </>
  );
};

export default Ctable;
