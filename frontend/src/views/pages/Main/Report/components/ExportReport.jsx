import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

function ExportReport({ data, element, params }) {
  const { t: lag } = useTranslation();

  const onExport = () => {
    const wb = XLSX.utils.book_new();
    for (let [key, value] of Object.entries(data)) {
      //format column value for sheet
      key = lag('common:reportPage:export:' + key);
      const formatedValue = value.map((record, ix) => {
        const hideColumn = [lag('common:type')];
        const newRecord = {};
        for (let [name, label] of Object.entries(record)) {
          //convert column name, value
          if (name === 'department') {
            label = lag('department:' + label);
          }
          name = lag('common:' + name);

          //hide column
          if (!hideColumn.includes(name)) newRecord[name] = label;
        }
        return newRecord;
      });

      const aoaData = [
        Object.keys(formatedValue[0]), // Tiêu đề cột
        ...formatedValue.map(Object.values) // Dữ liệu hàng
      ];
      const ws = XLSX.utils.aoa_to_sheet(aoaData);

      // Định dạng các ô tiêu đề
      const headerCellStyle = {
        font: { name: 'Arial', sz: 14, bold: true, color: { rgb: 'FF0000' } },
        fill: { fgColor: { rgb: 'FFFF00' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: { horizontal: 'center', vertical: 'center' }
      };

      // Định dạng các ô dữ liệu
      const dataCellStyle = {
        font: { name: 'Arial', sz: 12, color: { rgb: '000000' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        },
        alignment: { horizontal: 'left', vertical: 'center' }
      };

      // Áp dụng định dạng cho hàng tiêu đề
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = headerCellStyle;
      }

      // Áp dụng định dạng cho các ô dữ liệu
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
          if (!ws[cellAddress]) continue;
          ws[cellAddress].s = dataCellStyle;
        }
      }

      //Append sheet into file
      XLSX.utils.book_append_sheet(wb, ws, key);
    }
    XLSX.writeFile(wb, `Parking_Report_${params.start}_${params.end}.xlsx`);
  };
  return (
    <div>
      <Popconfirm
        title={lag('common:popup:sure')}
        onConfirm={onExport}
        okText={lag('common:confirm')}
        cancelText={lag('common:cancel')}>
        <Button icon={<FileExcelOutlined />}>{lag('common:dashboard:exportReport')}</Button>
      </Popconfirm>
    </div>
  );
}

export default ExportReport;
