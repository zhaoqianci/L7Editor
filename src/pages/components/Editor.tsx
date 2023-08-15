import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import {
  AppHeader,
  AppMap,
  LayerList,
  LayerPopup,
  MapContent,
  MapControlGroup,
  ResizePanel,
} from '../../components';
import { useGlobal } from '../../recoil';
import { L7EditorProps } from '../../types';
import useStyle from './styles';

type EditorProps = L7EditorProps;

export const Editor: React.FC<EditorProps> = (props) => {
  const { onFeatureChange } = props;
  const { theme: antdTheme, mapOptions, setMapOptions } = useGlobal();
  const styles = useStyle();

  useEffect(() => {
    if (antdTheme === 'normal') {
      setMapOptions({ ...mapOptions, style: 'normal' });
    } else {
      setMapOptions({ ...mapOptions, style: 'dark' });
    }
  }, [antdTheme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          antdTheme === 'normal' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <div
        className={classNames([styles.l7Editor, 'l7-editor'])}
        id="l7-editor"
      >
        <AppHeader toolBar={props.toolBar} />
        <ResizePanel
          onFeatureChange={(e) => {
            if (onFeatureChange) {
              onFeatureChange(e);
            }
          }}
          left={
            <AppMap>
              <MapControlGroup mapControl={props.mapControl} />
              <LayerList />
              <LayerPopup />
            </AppMap>
          }
          right={<MapContent features={props?.features} />}
        />
      </div>
    </ConfigProvider>
  );
};
