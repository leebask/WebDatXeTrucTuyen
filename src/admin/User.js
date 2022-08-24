import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import {
  SearchOutlined,PlusCircleOutlined
} from '@ant-design/icons';
import './User.css';

const { Option } = Select;



function User() {

  const [DataUser, setDataUser] = useState([{}]);
  const [dataChecked, setDataChecked] = useState();
  const [reload, setReload] = useState(false);
  //get user
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
  }, [reload])
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
  const CapQuyen = ()=>{
    if (dataChecked?.phanQuyen == 0) {
      updateDoc(doc(db, 'user', dataChecked.id), {
        phanQuyen:1
      })
        .then(() => {
          toast.success('Nâng cấp quyền thành công!')
          setReload(!reload)
        })
        .catch(err => toast.error(err))
      } else toast.error(' User này đã là Admin!')
  
  };
  const HaQuyen = ()=>{
    if (dataChecked?.phanQuyen == 1) {
      updateDoc(doc(db, 'user', dataChecked.id), {
        phanQuyen:0
      })
        .then(() => {
          toast.success('Hạ quyền thành công!')
          setReload(!reload)
        })
        .catch(err => toast.error(err))
      } else toast.error(' User này đã là khách hàng!')
  
  };
  return (
    <div className='admin_user' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className='admin_tour_header'>
                <Input placeholder="Tìm kiếm"  />
                <Button type="secondary" ><SearchOutlined />Tìm</Button>
                {/* <Button type="primary"><PlusCircleOutlined />Thêm</Button> */}
                {/* <Button type="primary">Xem chi tiết</Button> */}
                <Button type="primary" ghost onClick={CapQuyen}>Cấp quyền</Button>
                <Button danger onClick={HaQuyen}>Hạ quyền</Button>


            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataUser}
             pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5','10', '20', '30']}}
             />
        </div>
  )
}

export default User