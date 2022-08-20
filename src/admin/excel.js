import { File } from 'better-xlsx';
import { saveAs } from 'file-saver';

function exportExcel(column, dataSource, fileName = 'example') {
  //  new working spectrum 
  const file = new File();
  //  the new table 
  let sheet = file.addSheet('sheet-test');
  //  gets the number of header rows 
  let depth = getDepth(column);
  //  gets the number of columns in the header 
  let columnNum = getColumns(column);
  //  new number of header rows 
  let rowArr = [];
  for (let k = 0; k < depth; k++) {
    rowArr.push(sheet.addRow());
  }
  //  populate the cells according to the number of columns 
  rowArr.map(ele => {
    for (let j = 0; j < columnNum; j++) {
      let cell = ele.addCell();
      cell.value = j;
    }
  });
  //  initializes the header 
  init(column, 0, 0);
  //  unfold the columns in order 
  let columnLineArr = [];
  columnLine(column);
  //  according to the column, the dataSource the data inside is sorted and converted into a two-dimensional array 
  let dataSourceArr = [];
  dataSource.map(ele => {
    let dataTemp = [];
    columnLineArr.map(item => {
      dataTemp.push({
        [item.dataIndex]: ele[item.dataIndex],
        value: ele[item.dataIndex],
      });
    });
    dataSourceArr.push(dataTemp);
  });
  // debugger;
  //  drawing table data 
  dataSourceArr.forEach((item, index) => {
    // according to the data, create the corresponding number of rows 
    let row = sheet.addRow();
    row.setHeightCM(0.8);
    // creates a cell for that number 
    item.map(ele => {
      let cell = row.addCell();
      if (ele.hasOwnProperty('num')) {
        cell.value = index + 1;
      } else {
        cell.value = ele.value;
      }
      cell.style.align.v = 'center';
      cell.style.align.h = 'center';
    });
  });
  // set the width of each column 
  for (var i = 0; i < 4; i++) {
    sheet.col(i).width = 20;
  }
  file.saveAs('blob').then(function(content) {
    saveAs(content, fileName + '.xlsx');
  });

  //  unfold the columns in order 
  function columnLine(column) {
    column.map(ele => {
      if (ele.children === undefined || ele.children.length === 0) {
        columnLineArr.push(ele);
      } else {
        columnLine(ele.children);
      }
    });
  }
  //  initializes the header 
  function init(column, rowIndex, columnIndex) {
    column.map((item, index) => {
      let hCell = sheet.cell(rowIndex, columnIndex);
      //  if there are no child elements,   all the columns 
      if (item.title === ' operation ') {
        hCell.value = '';
        return;
      } else if (item.children === undefined || item.children.length === 0) {
        //  add a cell to the first row 
        hCell.value = item.title;
        hCell.vMerge = depth - rowIndex - 1;
        hCell.style.align.h = 'center';
        hCell.style.align.v = 'center';
        columnIndex++;
        // rowIndex++
      } else {
        let childrenNum = 0;
        function getColumns(arr) {
          arr.map(ele => {
            if (ele.children) {
              getColumns(ele.children);
            } else {
              childrenNum++;
            }
          });
        }
        getColumns(item.children);
        hCell.hMerge = childrenNum - 1;
        hCell.value = item.title;
        hCell.style.align.h = 'center';
        hCell.style.align.v = 'center';
        let rowCopy = rowIndex;
        rowCopy++;
        init(item.children, rowCopy, columnIndex);
        //  next cell start 
        columnIndex = columnIndex + childrenNum;
      }
    });
  }
  //  gets table head rows 
  function getDepth(arr) {
    const eleDepths = [];
    arr.forEach(ele => {
      let depth = 0;
      if (Array.isArray(ele.children)) {
        depth = getDepth(ele.children);
      }
      eleDepths.push(depth);
    });
    return 1 + max(eleDepths);
  }

  function max(arr) {
    return arr.reduce((accu, curr) => {
      if (curr > accu) return curr;
      return accu;
    });
  }
  //  calculates the number of header columns 
  function getColumns(arr) {
    let columnNum = 0;
    arr.map(ele => {
      if (ele.children) {
        getColumns(ele.children);
      } else {
        columnNum++;
      }
    });
    return columnNum;
  }
}

export default exportExcel;