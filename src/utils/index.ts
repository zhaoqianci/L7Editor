import { FeatureCollectionVT } from '@/constants';
import togeojson from '@mapbox/togeojson';
import {
  center,
  coordAll,
  distance,
  Feature,
  featureCollection,
} from '@turf/turf';
import { message } from 'antd';
import Color from 'color';
import dayjs from 'dayjs';
import { isUndefined } from 'lodash';
import wkt from 'wkt';

export const getOpacityColor = (color: string, alpha: number) => {
  const colorInstance = Color(color).fade(alpha);
  return `rgba(${colorInstance.array().join(', ')})`;
};

/**
 * 下载内容
 * @param text
 * @param ext
 */
export const downloadText = (text: string, ext: string | 'json' | 'txt') => {
  let aTag = document.createElement('a');
  aTag.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
  );
  aTag.setAttribute(
    'download',
    `${dayjs().format('YYYY-HH-MM HH:mm:ss')}.${ext}`,
  );
  aTag.style.display = 'none';
  document.body.appendChild(aTag);
  aTag.click();
};

export const getParamsNew = (key: string) => {
  const temData = new URLSearchParams(window.location.search);
  return temData.get(key);
};

export const getUrlFeatureCollection = async (
  e: string,
  urlType: string = 'JSON',
) => {
  const json = await fetch(e);
  if (urlType === 'JSON') {
    try {
      const geoData = await json.json();
      return geoData;
    } catch (e) {
      throw new Error('请检查url是否与数据格式匹配');
    }
  } else if (urlType === 'WKT') {
    const WKT = await json.text();
    const wktArr = WKT.split('\n');
    const geojson: Feature<any, {}>[] = wktArr.map((item: string) => {
      const data: Feature<any, {}> = {
        type: 'Feature',
        geometry: {},
        properties: {},
      };
      return { ...data, geometry: wkt.parse(item) };
    });
    if (FeatureCollectionVT.check(featureCollection(geojson))) {
      return featureCollection(geojson);
    } else {
      message.error('请检查url是否与数据格式匹配');
    }
  } else if (urlType === 'KML') {
    const KML = await json.text();
    const xml = new DOMParser().parseFromString(KML, 'text/xml');
    if (xml.getElementsByTagName('parsererror').length > 0) {
      message.error('请检查url是否与数据格式匹配');
    } else {
      const geojson = await togeojson.kml(xml, {
        style: true,
      });
      return geojson;
    }
  }
};

/**
 * 判断是否是Promise
 */

export const isPromise = (obj: any) => {
  return !isUndefined(obj) && obj instanceof Promise;
};

/**
 * 判断是否为圆
 */

export const isCircle = (feature: Feature) => {
  const centerPosition = center(feature).geometry.coordinates;
  const distanceList = coordAll(feature).map((position) => {
    return Math.round(
      distance(position, centerPosition, {
        units: 'meters',
      }),
    );
  });
  return Array.from(new Set(distanceList)).length === 1;
};

export const isRect = (feature: Feature) => {
  const arrPoint = feature.geometry.coordinates[0];
  const result = Array.from(new Set(arrPoint.flat(Infinity)));
  if (
    result.length === 4 &&
    arrPoint[0][0] === arrPoint[1][0] &&
    arrPoint[1][1] === arrPoint[2][1] &&
    arrPoint[2][0] === arrPoint[3][0] &&
    arrPoint[3][1] === arrPoint[4][1]
  ) {
    return true;
  }
  return false;
};

export * from './transform';
