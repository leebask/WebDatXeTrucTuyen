import React, { useEffect, useState } from 'react'
import { Avatar, Button, Table, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Route.css'
import {
  SearchOutlined
} from '@ant-design/icons';
const { Option } = Select;

function Route() {
  const [DataRoute, setDataRoute] = useState([{}]);
  //get cars
  const dispatch = useDispatch()
  useEffect(() => {
    const getDataCars = async () => {
      try {
        let _route = await getDocs(collection(db, 'route'))
        _route = _route.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('_route', _route)
        //  dispatch(setCars(_route))
        setDataRoute(_route.map(
          (item) => {
            return {
              ...item,
              key: item.id
            };
          }
        ));



      } catch (err) {
        // setError(err.message);
        setDataRoute([{}]);

      } finally {
        // setLoading(false);
      }
    }

    getDataCars()
  }, [])



  const columns = [
    {
      title: 'Mã lộ trình',
      dataIndex: 'ma',
    },

    {
      title: 'Nơi đi',
      dataIndex: 'noiDi',
    },
    {
      title: 'Nơi đến',
      dataIndex: 'noiDen',
    },

    {
      title: 'Khoảng cách',
      dataIndex: 'khoangCach',
      render: (data, record) => {
        return (
          <div
            style={{ color: 'rgb(191 23 72)' }}
          >
            {data} Km
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

  const [findWithRoute, setFindWithRoute] = useState();

  const HandleSearch = (e) => {
    //Query
    onSnapshot(
      query(
        collection(db, 'route'), where('ma', '==', findWithRoute)), (snapshot) => {
          let bus = []
          snapshot.docs.forEach(doc => {
            bus.push({ ...doc.data(), id: doc.id })
          })

          setDataRoute(bus)
        })
    console.log(findWithRoute)
  }
  return (
    <div className='admin_route' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
      <div className='admin_tour_header'>
        <Select
          style={{ width: '400px !important' }}
          placeholder="Mã lộ trình"
          onChange={(value, key) => { setFindWithRoute(value) }}
        >
          <Option key={1} value='DakLak-SaiGon'>DakLak-SaiGon</Option>
          <Option key={2} value='SaiGon-DakLak'>SaiGon-DakLak</Option>
        </Select>
        <Button type="secondary" onClick={HandleSearch}><SearchOutlined />Tìm</Button>
        <Button type="primary">Thêm</Button>
        <Button type="primary">Sửa</Button>
        <Button type="primary">Xóa</Button>

      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={DataRoute}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
      />
    </div>
  )
}

export default Route