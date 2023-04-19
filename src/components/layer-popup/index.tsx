import { FeatureKey, LayerId } from '@/constants';
import { useDrawStyle } from '@/hooks/useDrawStyle';
import { isCircle, isRect } from '@/utils';
import { prettierText } from '@/utils/prettier-text';
import {
  DrawCircle,
  DrawEvent,
  DrawLine,
  DrawPoint,
  DrawPolygon,
  DrawRect,
} from '@antv/l7-draw';
import { Popup, PopupProps, useLayerList, useScene } from '@antv/larkmap';
import { Feature, featureCollection } from '@turf/turf';
import { Button, Descriptions, Empty, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import './index.less';
const { Paragraph } = Typography;

export const LayerPopup: React.FC = () => {
  const scene = useScene();
  const {
    resetFeatures,
    features,
    setFeatures,
    isDraw,
    setIsDraw,
    saveEditorText,
  } = useModel('feature');
  const { layerColor } = useModel('global');
  const { colorStyle } = useDrawStyle();
  const { popupTrigger } = useModel('global');
  const [popupProps, setPopupProps] = useState<
    PopupProps & { visible: boolean; featureIndex?: number; feature?: any }
  >({
    lngLat: {
      lng: 0,
      lat: 0,
    },
    visible: false,
    feature: null,
  });

  const targetFeature = useMemo(() => {
    return features.find(
      (feature) =>
        // @ts-ignore
        feature.properties?.[FeatureKey.Index] === popupProps.featureIndex,
    );
  }, [features, popupProps]);
  const featureFields = Object.entries(targetFeature?.properties ?? {});
  const allLayerList = useLayerList();
  const layerList = useMemo(() => {
    const layerIds: string[] = [
      LayerId.PointLayer,
      LayerId.LineLayer,
      LayerId.PolygonLayer,
    ];
    return allLayerList.filter((layer) => {
      return layerIds.includes(layer.id);
    });
  }, [allLayerList]);

  const disabledEdit = (feature: Feature) => {
    if (feature) {
      const reg = RegExp(/Multi/);
      return reg.test(feature.geometry.type);
    }
    return false;
  };

  const onLayerClick = useCallback(
    (e: any) => {
      if (!isDraw) {
        const { lngLat, feature } = e;
        const featureIndex = feature.properties[FeatureKey.Index];
        if (
          popupProps.visible &&
          popupProps.featureIndex === feature.properties[FeatureKey.Index]
        ) {
          setPopupProps((oldPopupProps) => {
            return {
              ...oldPopupProps,
              visible: false,
              featureIndex: undefined,
              feature: null,
            };
          });
        } else {
          setPopupProps({
            lngLat,
            visible: true,
            featureIndex,
            feature: e.feature,
          });
        }
      }
    },
    [setPopupProps, popupProps, isDraw],
  );

  const onLayerMouseenter = useCallback(
    (e: any) => {
      if (!isDraw) {
        const { lngLat, feature } = e;
        const featureIndex = feature.properties[FeatureKey.Index];
        setPopupProps({
          lngLat,
          visible: true,
          featureIndex,
        });
      }
    },
    [setPopupProps, popupProps, isDraw],
  );

  const onLayerMouseout = useCallback(() => {
    if (!isDraw) {
      setPopupProps((oldPopupProps) => {
        return {
          ...oldPopupProps,
          visible: false,
          featureIndex: undefined,
        };
      });
    }
  }, [setPopupProps, popupProps, isDraw]);

  const onEdit = (featureValue: any) => {
    setIsDraw(true);
    const newFeatures = features.filter((item: any) => {
      return (
        item.properties[FeatureKey.Index] !==
        featureValue.properties?.[FeatureKey.Index]
      );
    });
    const index = features.findIndex((v: any) => {
      return (
        v.properties[FeatureKey.Index] ===
        featureValue.properties?.[FeatureKey.Index]
      );
    });
    const onChange = (v: any, draw: any) => {
      if (!v) {
        const newData = {
          ...draw.getData()[0],
          properties: featureValue?.properties,
        };
        if (newData.type) {
          features.splice(index, 1, newData);
          saveEditorText(
            prettierText({ content: featureCollection(features) }),
          );
        } else {
          features.splice(index, 1);
          saveEditorText(
            prettierText({ content: featureCollection(features) }),
          );
        }
        draw.destroy();
        setIsDraw(false);
      }
    };
    const options: any = {
      initialData: [featureValue],
      maxCount: 1,
      style: colorStyle,
    };
    const type = featureValue?.geometry.type;
    let drawLayer: any;
    if (type === 'Point') {
      drawLayer = new DrawPoint(scene, {
        ...options,
        style: {
          point: {
            normal: { shape: 'drawImg', size: 20, color: layerColor },
            hover: { shape: 'drawImg', size: 20, color: layerColor },
            active: { shape: 'drawImg', size: 20, color: layerColor },
          },
        },
      });
    } else if (type === 'LineString') {
      drawLayer = new DrawLine(scene, options);
    } else if (type === 'Polygon' && isRect(featureValue)) {
      drawLayer = new DrawRect(scene, options);
    } else if (type === 'Polygon' && isCircle(featureValue)) {
      drawLayer = new DrawCircle(scene, options);
    } else {
      drawLayer = new DrawPolygon(scene, options);
    }
    drawLayer.enable();
    drawLayer.setActiveFeature(drawLayer.getData()[0]);
    setFeatures(newFeatures);
    drawLayer.on(DrawEvent.Select, (v: any) => onChange(v, drawLayer));
    setPopupProps({
      visible: false,
      featureIndex: undefined,
    });
  };

  const onLayerDblClick = (e: any) => {
    const { feature } = e;
    if (!disabledEdit(feature) && !isDraw) {
      onEdit(feature);
    }
  };

  useEffect(() => {
    layerList.forEach((layer) => layer.on('dblclick', onLayerDblClick));
    return () => {
      layerList.forEach((layer) => layer.off('dblclick', onLayerDblClick));
    };
  }, [onLayerDblClick, layerList, popupTrigger, scene]);

  useEffect(() => {
    if (popupTrigger === 'click') {
      layerList.forEach((layer) => layer.on('click', onLayerClick));
      return () => {
        layerList.forEach((layer) => layer.off('click', onLayerClick));
      };
    } else if (popupTrigger === 'hover') {
      layerList.forEach((layer) => layer.on('mouseenter', onLayerMouseenter));
      layerList.forEach((layer) => layer.on('mouseout', onLayerMouseout));
      return () => {
        layerList.forEach((layer) =>
          layer.off('mouseenter', onLayerMouseenter),
        );
        layerList.forEach((layer) => layer.off('mouseout', onLayerMouseout));
      };
    }
  }, [onLayerClick, onLayerMouseenter, layerList, popupTrigger, scene]);

  return (
    <>
      {popupProps.visible &&
        typeof popupProps.featureIndex === 'number' &&
        targetFeature && (
          <Popup
            lngLat={popupProps.lngLat}
            closeButton={false}
            offsets={[0, 10]}
            followCursor={popupTrigger === 'hover' ? true : false}
          >
            <div
              className="layer-popup"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {featureFields.length ? (
                <div
                  className="layer-popup__info"
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Descriptions size="small" bordered column={1}>
                    {featureFields.map(([key, value]) => {
                      if (!(value instanceof Object)) {
                        return (
                          <Descriptions.Item label={key} key={key}>
                            <Paragraph copyable>{String(value)}</Paragraph>
                          </Descriptions.Item>
                        );
                      }
                    })}
                  </Descriptions>
                </div>
              ) : (
                <Empty
                  description="当前元素无字段"
                  style={{ margin: '12px 0' }}
                />
              )}
              <div className="layer-popup__btn-group">
                {popupTrigger === 'click' && (
                  <Tooltip
                    title={
                      disabledEdit(popupProps.feature)
                        ? 'Multi 类型的 GeoJSON 不支持编辑'
                        : ''
                    }
                  >
                    <Button
                      size="small"
                      type="link"
                      onClick={() => onEdit(popupProps.feature)}
                      disabled={disabledEdit(popupProps.feature)}
                    >
                      编辑
                    </Button>
                  </Tooltip>
                )}
                {popupTrigger === 'click' && (
                  <Button
                    size="small"
                    type="link"
                    danger
                    onClick={() => {
                      resetFeatures(
                        features.filter((_, index) => {
                          return index !== popupProps.featureIndex;
                        }),
                      );
                      setPopupProps({
                        visible: false,
                        featureIndex: undefined,
                      });
                    }}
                  >
                    删除
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        )}
    </>
  );
};
