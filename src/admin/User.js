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
import './User.css';

const { Option } = Select;



function User() {

  const [DataUser, setDataUser] = useState([{}]);

  //get cars
  const dispatch = useDispatch()
  useEffect(() => {
    const getDataUser = async () => {
      try {
        let _user = await getDocs(collection(db, 'user'))
        _user = _user.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('_user', _user)
        dispatch(setCars(_user))
        setDataUser(_user.map(
          (item) => {
            return {
              ...item,
              key: item.id
            };
          }
        ));



      } catch (err) {
        // setError(err.message);
        setDataUser([]);

      } finally {
        // setLoading(false);
      }
    }

    getDataUser()
  }, [])
    const columns = [
        {
          title: 'Uid',
          dataIndex: 'uid',
        },
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Họ',
          dataIndex: 'ho',
        },
        {
          title: 'Tên',
          dataIndex: 'ten',
        },
         {
          title: 'Số điện thoại',
          dataIndex: 'sdt',
        },
        {
          title: 'Phân quyền',
          dataIndex: 'phanQuyen',
          render: (data, record) => {
            return (
                <div
                    style={{ textAlign: 'center', color: '#79aded', border: '1px solid #79aded' }}
                >
                    {data == 1 ? <div style={{color:'red'}}>Admin</div>:"Khách hàng"} 
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
    <div className='admin_user' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className='admin_tour_header'>
                <Input placeholder="Tìm kiếm"  />
                <Button type="secondary" ><SearchOutlined />Tìm</Button>
                <Button type="primary">Thêm</Button>
                <Button type="primary">Xem chi tiết</Button>
                <Button type="primary">Cấp quyền</Button>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataUser}
             pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5','10', '20', '30']}}
             />
        </div>
  )
}

export default User