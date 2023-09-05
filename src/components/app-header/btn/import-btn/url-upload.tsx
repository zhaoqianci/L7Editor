import I18N from '../../../../locales';
import { Form, Input, Radio } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { getUrlFeatureCollection } from '../../../../utils';

const UrlUpload = forwardRef(({}, ref) => {
  const [inputValue, setInputValue] = useState<string>('');

  const [radioValue, setRadioValue] = useState<string>('GeoJSON');

  useImperativeHandle(
    ref,
    () => ({
      getData: () =>
        new Promise((resolve, reject) => {
          if (inputValue) {
            resolve(getUrlFeatureCollection(inputValue, radioValue));
            reject(I18N.t('import_btn.url_upload.shuJuGeShiCuo'));
          } else {
            reject(I18N.t('import_btn.url_upload.qingShuRuWenBen'));
          }
        }),
    }),
    [inputValue, radioValue],
  );

  return (
    <>
      <Form layout={'vertical'}>
        <Form.Item
          name="urlType"
          label={I18N.t('import_btn.url_upload.shuJuLeiXing')}
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Radio.Group
            defaultValue="GeoJSON"
            onChange={(e) => {
              setRadioValue(e.target.value);
            }}
          >
            <Radio.Button value="GeoJSON">GeoJSON</Radio.Button>
            <Radio.Button value="WKT">WKT</Radio.Button>
            <Radio.Button value="KML">KML</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="url"
          label={I18N.t('import_btn.url_upload.uRLDiZhi')}
          rules={[{ required: true }]}
          style={{ marginTop: 16, marginBottom: 4 }}
        >
          <Input
            placeholder="https://..."
            onChange={(e) => {
              setInputValue(e.target.value);
              // checkWithRestData(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
});

export default UrlUpload;
