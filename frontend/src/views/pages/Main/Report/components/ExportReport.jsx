import { FileExcelOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const styleByColumn = {
  department: {
    width: 34
  },
  date: {
    width: 16
  },
  licenePlate: {
    width: 16
  },
  turn: {
    width: 10
  },
  value: {
    width: 10
  },
  entries: {
    width: 10
  },
  exists: {
    width: 10
  },
  fee: {
    width: 10
  },
  zone: {
    width: 10
  },
  averageDuration: {
    width: 24
  }
};
function ExportReport({ data, element, params }) {
  const { t: lag } = useTranslation();

  const onExport = async () => {
    const wb = XLSX.utils.book_new();
    const workbook = new ExcelJS.Workbook();

    for (let [key, value] of Object.entries(data)) {
      //format column value for sheet
      key = lag('common:reportPage:export:' + key);
      const jsonData = value.map((record, ix) => {
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

      const worksheet = workbook.addWorksheet(key);
      const headerRow = worksheet.addRow(Object.keys(jsonData[0]));

      const styleByColumnConvertKey = Object.keys(styleByColumn).reduce((acc, key) => {
        const convertKey = lag('common:' + key);
        acc[convertKey] = styleByColumn[key];
        return acc;
      }, {});
      worksheet.columns = Object.keys(jsonData[0]).map((key, _) => {
        let rs = {
          header: key,
          key: key,
          width: 20
        };

        const styleObj = styleByColumnConvertKey[key];
        if (styleObj) {
          rs = {
            ...rs,
            ...styleObj
          };
        }
        return rs;
      });

      // Áp dụng style cho hàng tiêu đề
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: '000' } };
        cell.fill = {
          type: 'pattern',
          fgColor: { argb: '#D9D9D9' }
        };
        cell.alignment = { horizontal: 'center' };
      });
      // Thêm dữ liệu hàng
      jsonData.forEach((data) => {
        worksheet.addRow(Object.values(data));
      });
    }
    // Tạo buffer từ workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Tạo blob và lưu file
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, `Parking_Report_${params.start}_${params.end}.xlsx`);
    // XLSX.writeFile(wb, `Parking_Report_${params.start}_${params.end}.xlsx`);
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
