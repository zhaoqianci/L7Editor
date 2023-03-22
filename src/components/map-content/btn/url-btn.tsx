import { ApiOutlined } from '@ant-design/icons';
import { useMount } from 'ahooks';
import {
  Button,
  Form,
  message,
  Modal,
  Radio,
  Tabs,
  TabsProps,
  Tooltip,
} from 'antd';
import { useModel } from 'umi';
import { getParamsNew, isPromise, transformFeatures } from '@/utils';
import React, { useRef, useState } from 'react';
import { Feature, FeatureCollection } from '@turf/turf';
import { FeatureCollectionVT } from '../../../constants/variable-type';
import UrlUpload from '../url-tab-group/url-upload';
import FileUpload from '../url-tab-group/file-upload';
import { AppEditor } from '@/components/app-editor';

/**
 * Tab类型
 */
type TabType = 'url' | 'file' | 'script';
/**
 * 数据类型
 */
type DataType = 'cover' | 'merge';

export const UrlBtn = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scriptContent, setScriptContent] = useState('');
  const { resetFeatures, features } = useModel('feature');
  const [form] = Form.useForm();

  const [activeTab, setActiveTab] = useState<TabType>('url');
  const [selectRadio, setSelectRadio] = useState<DataType>('cover');

  const formRef = useRef<Record<string, any>>(null);
  const items: TabsProps['items'] = [
    {
      key: 'url',
      label: <div>url上传</div>,
      children: <UrlUpload ref={formRef} />,
    },
    {
      key: 'file',
      label: <div>文件上传</div>,
      children: <FileUpload ref={formRef} />,
    },
    {
      key: 'script',
      label: <div>javascript脚本</div>,
      children: (
        <div style={{ width: '100%', height: 400 }}>
          <AppEditor
            language="javascript"
            onChange={(content) => setScriptContent(content)}
          />
        </div>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectRadio('cover');
  };

  const getFeaturesData: Record<
    string,
    (e: string) => FeatureCollection | Promise<FeatureCollection>
  > = {
    url: async (e: string) => {
      const json = await fetch(e);
      const geoData = await json.json();
      return geoData;
    },
    file: () => {
      if (!formRef.current) return [];
      const isErrorList = form
        .getFieldValue('file')
        .fileList.filter((item: any) => item.status === 'error');
      if (!!isErrorList.length) return;
      return formRef.current.data;
    },
    script: async () => {
      let geoData;
      const funcResult = new Function(scriptContent);
      if (funcResult()) {
        geoData = funcResult();
      } else {
        const evalResult = eval(scriptContent);
        geoData = evalResult instanceof Promise ? await evalResult : evalResult;
      }
      return geoData;
    },
  };

  const checkWithRestData = async (url: string) => {
    try {
      const newData = await getFeaturesData[activeTab](url);
      if (FeatureCollectionVT.check(newData)) {
        const featureData =
          selectRadio === 'cover'
            ? newData.features
            : [...features, ...newData.features];
        console.log('featureData', featureData);

        return resetFeatures(featureData as Feature[]);
      }
    } catch (error) {
      message.error(`url格式错误，仅支持 GeoJSON 格式,${error}`);
    }
  };

  useMount(async () => {
    const url = getParamsNew('url');
    if (url) {
      checkWithRestData(url);
    }
  });

  const handleOk = async () => {
    const url = form.getFieldValue('url');
    checkWithRestData(url);
    handleCancel();
  };

  return (
    <>
      <Tooltip overlay="导入 GeoJSON" placement="left">
        <Button icon={<ApiOutlined />} onClick={() => setIsModalOpen(true)} />
      </Tooltip>

      {isModalOpen && (
        <Modal
          title="上传"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={activeTab === 'script' ? 1000 : 600}
        >
          <Form form={form}>
            <Form.Item label="数据操作">
              <Radio.Group
                value={selectRadio}
                onChange={(e) => {
                  setSelectRadio(e.target.value);
                }}
              >
                <Radio.Button value="cover">覆盖</Radio.Button>
                <Radio.Button value="merge">合并</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Tabs
              activeKey={activeTab}
              className="map-content__right"
              items={items}
              onChange={(e) => {
                setActiveTab(e as TabType);
              }}
            />
          </Form>
        </Modal>
      )}
    </>
  );
};
