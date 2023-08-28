import {
  FullscreenControl,
  GeoLocateControl,
  MouseLocationControl,
  ScaleControl,
  ZoomControl,
} from '@antv/larkmap';
import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../recoil';
import { MapControlProps } from '../../types/l7editor';
import { AdministrativeSelect } from './administrative-select-control';
import { AutoControl } from './auto-control';
import { ClearControl } from './clear-control';
import DrawControl from './draw-control';
import FilterControl from './filter-form-list-control';
import LayerColorControl from './layer-color-control';
import LocationSearchControl from './location-search-control';
import { MapAdministrativeControl } from './map-administrative-control';
import MapThemeControl from './map-theme-control';
import { OfficialLayerControl } from './official-layer-control';
import useStyle from './styles';

type MapControlGroupProps = {
  mapControl?: MapControlProps;
};
const DefaultMapControl: MapControlProps = {
  drawControl: true,
  clearControl: true,
  zoomControl: true,
  scaleControl: true,
  locationSearchControl: true,
  mouseLocationControl: true,
  filterControl: true,
  officialLayerControl: true,
  mapThemeControl: true,
  geoLocateControl: true,
  layerColorControl: true,
  autoControl: true,
  fullscreenControl: true,
  administrativeSelectControl: true,
  mapAdministrativeControl: true,
};
export const MapControlGroup: React.FC<MapControlGroupProps> = ({
  mapControl,
}) => {
  const { baseMap } = useGlobal();
  const styles = useStyle();
  const [isControlGroupState, setIsControlGroup] = useState(DefaultMapControl);

  useEffect(() => {
    setIsControlGroup({ ...DefaultMapControl, ...mapControl });
  }, [mapControl]);

  return (
    <>
      {isControlGroupState.drawControl && <DrawControl />}
      {isControlGroupState.clearControl && <ClearControl />}
      {isControlGroupState.zoomControl && (
        <ZoomControl className={styles.zoom} showZoom />
      )}
      {isControlGroupState.scaleControl && (
        <ScaleControl className={styles.scalesControl} />
      )}
      {isControlGroupState.mapAdministrativeControl && (
        <MapAdministrativeControl />
      )}
      {isControlGroupState.administrativeSelectControl && (
        <AdministrativeSelect />
      )}
      {isControlGroupState.locationSearchControl && <LocationSearchControl />}
      {isControlGroupState.mouseLocationControl && (
        <MouseLocationControl className={styles.fullScreen} />
      )}
      {isControlGroupState.filterControl && <FilterControl />}
      {baseMap === 'Gaode' && isControlGroupState.officialLayerControl && (
        <OfficialLayerControl />
      )}
      {isControlGroupState.mapThemeControl && <MapThemeControl />}
      {isControlGroupState.geoLocateControl && (
        <GeoLocateControl position="topleft" className={styles.fullScreen} />
      )}
      {isControlGroupState.layerColorControl && <LayerColorControl />}
      {isControlGroupState.autoControl && <AutoControl />}
      {isControlGroupState.fullscreenControl && (
        <FullscreenControl
          position="bottomright"
          className={styles.fullScreen}
        />
      )}
    </>
  );
};
