import { downloadText } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import { CloudDownloadOutlined } from '@ant-design/icons';
import { coordAll, featureCollection } from '@turf/turf';
import { useModel } from '@umijs/max';
import { Button, Dropdown, MenuProps } from 'antd';
import React from 'react';
// @ts-ignore
import tokml from 'tokml';
// @ts-ignore
import wkt from 'wkt';

const DownloadMenuItems: MenuProps['items'] = [
  {
    key: 'GeoJson',
    label: '下载 GeoJSON 格式数据',
  },
  // {
  //   key: 'FormatGeoJson',
  //   label: '下载格式化的 GeoJson 格式数据',
  // },
  {
    key: 'LngLat',
    label: '下载 LngLat 格式数据',
  },
  // {
  //   key: 'Text',
  //   label: '下载当前编辑器输入数据',
  // },
  {
    key: 'KML',
    label: '下载 KML 格式数据',
  },
  {
    key: 'WKT',
    label: '下载 WKT 格式数据',
  },
];

const DownloadBtn: React.FC = () => {
  const { features, editorText } = useModel('feature');

  const onDownload = (key: string) => {
    const fc = featureCollection(features);
    if (key === 'GeoJson') {
      downloadText(JSON.stringify(fc), 'json');
    } else if (key === 'FormatGeoJson') {
      const newText = prettierText({ content: fc });
      downloadText(newText, 'json');
    } else if (key === 'LngLat') {
      downloadText(
        coordAll(fc)
          .map((lngLat) => lngLat.join(','))
          .join(';'),
        'txt',
      );
    } else if (key === 'KML') {
      const kml = tokml(fc);
      downloadText(kml, 'kml');
    } else if (key === 'WKT') {
      const wktArr = features.map((item) => {
        const geometry = item.geometry;
        const WKT = wkt.stringify(geometry);
        return WKT;
      });
      downloadText(wktArr.join('\n'), 'wkt');
    } else {
      downloadText(editorText as string, 'json');
    }
  };

  return (
    <Dropdown
      menu={{
        items: DownloadMenuItems,
        onClick: ({ key }) => {
          onDownload(key);
        },
      }}
    >
      <Button icon={<CloudDownloadOutlined />}></Button>
    </Dropdown>
  );
};

export default DownloadBtn;
