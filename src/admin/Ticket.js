import React, { useEffect, useState } from 'react'
import { Avatar, Button, Table, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Ticket.css'
import {
  SearchOutlined
} from '@ant-design/icons';
const { Option } = Select;

function Ticket() {
  const [DataTicket, setDataTicket] = useState([{}]);
  //get cars
  const dispatch = useDispatch()
  useEffect(() => {
    const getDataTicket = async () => {
      try {
        let _ticket = await getDocs(collection(db, 'ticket'))
        _ticket = _ticket.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('_ticket', _ticket)
        dispatch(setCars(_ticket))
        setDataTicket(_ticket.map(
          (item) => {
            return {
              ...item,
              key: item.id
            };
          }
        ));



      } catch (err) {
        // setError(err.message);
        setDataTicket([]);

      } finally {
        // setLoading(false);
      }
    }

    getDataTicket()
  }, [])



  const columns = [
    {
      title: 'Mã vé',
      dataIndex: 'maVe',
    },
    {
      title: 'Mã chuyến xe',
      dataIndex: 'maCX',
      render: (data, record) => {
        return (
          <Avatar
            size={36}
            style={{
              backgroundColor: 'rgb(241, 152, 61)'
            }}

          >
            {data}
          </Avatar>
        )
      }
    },
    {
      title: 'Mã ghế',
      dataIndex: 'maGhe',
      render: (data, record) => {
        return (
          <div
            style={{ color: 'rgb(3 105 232)', border: '1px solid green', textAlign: 'center', backgroundColor: '#e6fae6' }}
          >
            {data}
          </div>
        );
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'sdt',
      render: (data, record) => {
        return (
          <div
            style={{ color: 'rgb(3 105 232)' }}
          >
            {data}
          </div>
        );
      }
    },
    {
      title: 'Tên',
      dataIndex: 'tenKH',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      render: (data, record) => {
        return (<>
          {data == 1 ?
            <div
              style={{ color: 'rgb(3 105 232)', border: '1px solid #91ff91', textAlign: 'center', backgroundColor: '#91ff91', borderRadius: '8px' }}
            >
              Đặt vé
            </div>
            : data == -1 ?
              <div
                style={{ color: 'rgb(3 105 232)', border: '1px solid green', textAlign: 'center', backgroundColor: 'rgb(255 170 170)', borderRadius: '8px' }}
              >
                Đã hủy
              </div> : data == 0 ? <div
                style={{ color: 'rgb(3 105 232)', border: '1px solid green', textAlign: 'center', backgroundColor: 'rgb(202 196 196)', borderRadius: '8px' }}
              >
                Đã đi
              </div> : ''}
        </>
        );
      }
    },

    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
    },

  ];
  const data = [];



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
  const [findWithTicket, setFindWithTicket] = useState();

  const HandleSearch = (e) => {
    //Query
    onSnapshot(
      query(
        collection(db, 'ticket'), where('maCX', '==', findWithTicket)), (snapshot) => {
          let bus = []
          snapshot.docs.forEach(doc => {
            bus.push({ ...doc.data(), id: doc.id })
          })

          setDataTicket(bus)
        })
    console.log(findWithTicket)
  }
  return (
    <div className='admin_car' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
      <div className='admin_tour_header'>
        <Select
          style={{ width: '400px !important' }}
          placeholder="Mã chuyến xe"
          onChange={(value, key) => { setFindWithTicket(value) }}
        >
          <Option key={1} value='CX01'>CX01</Option>
          <Option key={2} value='CX02'>CX02</Option>
        </Select>
        <Button type="secondary" onClick={HandleSearch}><SearchOutlined />Tìm</Button>

        {/* <Button type="primary">Thêm</Button>
        <Button type="primary">Sửa</Button> */}
        <Button type="primary">Xem chi tiết</Button>

      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={DataTicket}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
      />
    </div>
  )
}

export default Ticket