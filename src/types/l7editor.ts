import { LarkMapProps } from '@antv/larkmap';
import { Feature, FeatureCollection } from '@turf/turf';
import { TabsProps } from 'antd';

export type EditorConfigProps = {
  /**
   * 图层颜色
   * @default '#1677ff'
   */
  primaryColor?: string;
  /**
   * 地图
   * @default 'Gaode'
   */
  baseMap: 'Gaode' | 'Mapbox';
  /**
   * 侧边栏宽度 (40%)
   * @default 40
   */
  rightPanelWidth?: number;
  /**
   * 地图配置
   * @default  {}
   */
  mapOption: LarkMapProps['mapOptions'];
  /**
   * autoFitBounds
   * @default true
   */
  autoFitBounds?: boolean;
  /**
   * 图层popup触发方式
   * @default 'click'
   */
  popupTrigger?: 'click' | 'hover';
  /**
   * panel 展示tab
   * @default 'geojson'
   */
  activeTab?: 'geojson' | 'table' | 'wkt';
  /**
   * 初始化数据
   * @default {type:'FeatureCollection',features:[]}
   */
  features?: FeatureCollection;
  /**
   * 底图选择
   * @default []
   */
  officialLayers?: string[];
  /**
   * 右侧面板是否隐藏
   * @default false
   */
  hidePanel?: boolean;
  /**
   * 标签页item项
   * @default []
   */
  tabs?: TabsProps['items'];
  /**
   * 主题配色
   * @default 'normal'
   */
  theme?: 'normal' | 'dark';
  /**
   * 数据转换
   * @default 'undefined'
   */
  coordConvert?: 'undefined' | 'GCJ02' | 'WGS84';
};

export type L7EditorProps = {
  onFeatureChange?: (feature: Feature[]) => void;

  editorConfig: EditorConfigProps;
};
