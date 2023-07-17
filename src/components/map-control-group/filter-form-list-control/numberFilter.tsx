import { useFeature, useFilter } from '@/recoil';
import { FilterNumberData } from '@/types';
import { Form, FormInstance, InputNumber, Select } from 'antd';
import { cloneDeep } from 'lodash';
import React from 'react';

const select = [
  { label: '>', value: '>' },
  { label: '>=', value: '>=' },
  { label: '=', value: '=' },
  { label: '<=', value: '<=' },
  { label: '<', value: '<' },
  { label: '区间', value: 'BETWEEN' },
];
interface Props {
  name: number;
  index: number;
  form: FormInstance;
}
const NumberFilter: React.FC<Props> = ({ name, index, form }) => {
  const { setFilters } = useFilter();
  const { dataSource } = useFeature();
  return (
    <div style={{ display: 'flex' }}>
      <Form.Item name={[name, 'operator']}>
        <Select
          style={{ width: '100px', marginRight: '8px' }}
          placeholder="请选择过滤逻辑"
          options={select}
          onChange={() => {
            const newFilterFromList = cloneDeep(
              form.getFieldValue('filterFromList'),
            );

            newFilterFromList.forEach((v: any, i: number) => {
              if (index === i) {
                v.value = undefined;
              }
            });
            form.setFieldValue('filterFromList', newFilterFromList);
            setFilters(
              newFilterFromList.map((item: any) => {
                const { field, type } = JSON.parse(item.field);
                return { ...item, field, type };
              }),
            );
          }}
        />
      </Form.Item>
      <Form.Item
        style={{ width: 150, marginBottom: 0 }}
        shouldUpdate={(prevValues, curValues) =>
          prevValues.operator === curValues.operator
        }
      >
        {({ getFieldsValue }) => {
          const { filterFromList } = getFieldsValue();
          const fieldValue = JSON.parse(filterFromList[index].field)?.field;
          const DataList: FilterNumberData | undefined = dataSource.find(
            (item) => item?.field === fieldValue,
          );
          if (filterFromList[index].operator === 'BETWEEN') {
            return (
              <div className="filter-between">
                <Form.Item name={[name, 'min']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder="请输入筛选值"
                    style={{ width: '100%' }}
                    min={DataList?.min ?? 0}
                    max={DataList?.max ?? 0}
                  />
                </Form.Item>
                <span> - </span>
                <Form.Item name={[name, 'max']} style={{ width: '70px' }}>
                  <InputNumber
                    placeholder="请输入筛选值"
                    style={{ width: '100%' }}
                    min={DataList?.min ?? 0}
                    max={DataList?.max ?? 0}
                  />
                </Form.Item>
              </div>
            );
          }
          return (
            <Form.Item name={[name, 'value']}>
              <InputNumber
                placeholder="请输入筛选值"
                style={{ width: '100%' }}
                min={DataList?.min ?? 0}
                max={DataList?.max ?? 0}
              />
            </Form.Item>
          );
        }}
      </Form.Item>
    </div>
  );
};

export default NumberFilter;
