import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import {
  SearchOutlined,DeleteOutlined
} from '@ant-design/icons';
import './YeuCauDieuPhoi.css';

const { Option } = Select;



function YeuCauDieuPhoi() {

  const [DataYeuCauDieuPhoi, setDataYeuCauDieuPhoi] = useState([{}]);
  const [dataChecked, setDataChecked] = useState();
  const [reload, setReload] = useState(false);

  //get cars
  const dispatch = useDispatch()
  useEffect(() => {
    const getDataYeuCauDieuPhoi = async () => {
      try {
        let _dieuphoi = await getDocs(collection(db, 'dispatcher'))
        _dieuphoi = _dieuphoi.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('_dieuphoi', _dieuphoi)
        dispatch(setCars(_dieuphoi))
        setDataYeuCauDieuPhoi(_dieuphoi.map(
          (item) => {
            return {
              ...item,
              key: item.id
            };
          }
        ));



      } catch (err) {
        // setError(err.message);
        setDataYeuCauDieuPhoi([]);

      } finally {
        // setLoading(false);
      }
    }

    getDataYeuCauDieuPhoi()
  }, [reload])
    const columns = [
        
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Chuyến xe/LT',
          dataIndex: 'maCX',
        },
        {
          title: 'Ngày đi',
          dataIndex: 'ngayDi',
        },
        
        {
          title: 'Trạng thái',
          dataIndex: 'trangThai',
          render: (data, record) => {
            return (
                <div
                    style={{ textAlign: 'center', border: '1px solid #79aded' }}
                >
                    {data == 1 ? <div style={{color:'green'}}>Chưa điều phối</div>
                    :<div style={{color:'red'}}>Đã điều phối</div>} 
                </div>
            );
        }
        },
      ];
      const data = [];
      
      

      const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {

      console.log(selectedRowKeys, selectedRows)
      if (selectedRows.length < 2) {
        setDataChecked(selectedRows[0])
        console.log(dataChecked)
      }
      else toast.warning('Vui lòng chỉ chọn 1 vé!')
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };
  const ConFirmDieuPhoi = ()=>{
    if (dataChecked?.trangThai !==0) {
      updateDoc(doc(db, 'dispatcher', dataChecked.id), {
        trangThai:0
      })
        .then(() => {
          toast.success('Xác nhận điều phối xe thành công!')
          setReload(!reload)
        })
        .catch(err => toast.error(err))
      } else toast.error('Yêu cầu đã được xử lí rồi. Vui lòng chọn lại!')
  
  };
  const DeleteDieuPhoi = ()=>{
    if (dataChecked?.trangThai == 0) {
      updateDoc(doc(db, 'dispatcher', dataChecked.id), {
        trangThai:1
      })
        .then(() => {
          toast.success('Hủy xác nhận điều phối xe thành công!')
          setReload(!reload)
        })
        .catch(err => toast.error(err))
      } else toast.error(' Vui lòng chọn lại yêu cầu chưa xác nhận điều phối!')
  
  };
  
const handleXoaDieuPhoi = ()=>{
  if(dataChecked?.trangThai == 0){
    deleteDoc(doc(db,'dispatcher',dataChecked.id))
    .then(() =>{
      setReload(!reload)
     toast.success("Xóa yêu cầu điều phối thành công!")
    })
    .catch(err => toast.error(err))
 }else toast.error("Vui lòng xử lí yêu cầu trước khi xóa!")
}

  
  return (
    <div className='admin_dieuphoi' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className='admin_tour_header'>
                <Input placeholder="Tìm kiếm"  />
                <Button type="secondary" ><SearchOutlined />Tìm</Button>
                <Button type="primary" ghost onClick={ConFirmDieuPhoi}>Xác nhận điều phối</Button>
                <Button danger onClick={DeleteDieuPhoi}>Hủy điều phối</Button>
                <Button danger onClick={handleXoaDieuPhoi}
        ><DeleteOutlined />Xóa</Button>

            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataYeuCauDieuPhoi}
             pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5','10', '20', '30']}}
             />
        </div>
  )
}

export default YeuCauDieuPhoi