import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import {
  SearchOutlined
} from '@ant-design/icons';
import './YeuCauDieuPhoi.css';

const { Option } = Select;



function YeuCauDieuPhoi() {

  const [DataYeuCauDieuPhoi, setDataYeuCauDieuPhoi] = useState([{}]);

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
  }, [])
    const columns = [
        
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Mã xe điều phối',
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
      
      for (let i = 0; i < 46; i++) {
        data.push({
          key: i,
          name: `Edward King ${i}`,
          age: 32,
          address: `London, Park Lane no. ${i}`,
        });
      }

      const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  return (
    <div className='admin_dieuphoi' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className='admin_tour_header'>
                <Input placeholder="Tìm kiếm"  />
                <Button type="secondary" ><SearchOutlined />Tìm</Button>
                <Button type="primary">Xác nhận điều phối</Button>

            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataYeuCauDieuPhoi}
             pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5','10', '20', '30']}}
             />
        </div>
  )
}

export default YeuCauDieuPhoi