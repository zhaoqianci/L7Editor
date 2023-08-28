import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal } from 'antd';
import React, { useState } from 'react';
import { dingGroupImg } from '../../../constants';
import { HandBackMenuItems } from '../constants';

export default () => {
  const [dingModal, setDingModal] = useState(false);

  const onDownload = (key: string) => {
    if (key === 'text') {
      window.open(
        'https://www.yuque.com/antv/l7/buhith8khkc9mfsg?singleDoc#',
        '_blank',
      );
    } else if (key === 'api') {
      window.open('/docs');
    } else if (key === 'ding') {
      setDingModal(true);
    }
  };
  return (
    <>
      <Dropdown
        menu={{
          items: HandBackMenuItems,
          onClick: ({ key }) => {
            onDownload(key);
          },
        }}
      >
        <Button icon={<QuestionCircleOutlined />}>帮助</Button>
      </Dropdown>
      <Modal
        title="联系我们"
        open={dingModal}
        onCancel={() => setDingModal(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center' }}>
          <img style={{ width: 400 }} src={dingGroupImg} />
        </div>
      </Modal>
    </>
  );
};
