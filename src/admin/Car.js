import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './Car.css'

function Car() {
    const [DataCars, setDataCars] = useState([{}]);
 //get cars
 const dispatch = useDispatch()
 useEffect(() => {
    const getDataCars = async () => {
      try {
      let _cars=await getDocs(collection(db,'bus'))
      _cars=_cars.docs.map(t => ({
       ...t.data(),
       id: t.id
     }))
     console.log('cars',_cars)
         dispatch(setCars(_cars))
        setDataCars(_cars.map(
            (item) => {
                return {
                    ...item,
                    key: item.id
                };
            }
        ));
        


  } catch (err) {
    // setError(err.message);
    setDataCars([]);

  } finally {
    // setLoading(false);
  }
    }

    getDataCars()
  }, [])



    const columns = [
        {
          title: 'Mã xe',
          dataIndex: 'maXe',
        },
        {
          title: 'Biển số',
          dataIndex: 'bienSo',
          render: (data, record) => {
            return (
                <div
                    style={{textAlign: 'center', color: '#79aded',border: '1px solid rgb(241, 152, 61)', borderRadius: '5px' }}
                >
                    {data}
                </div>
            );
        }
        },
        {
          title: 'Số lượng ghế',
          dataIndex: 'soLuongGhe',
          width: '200px',
        },
        {
            title: 'Loại xe',
            dataIndex: 'loaiXe',
          },
          {
            title: 'Giá',
            dataIndex: 'gia',
            render: (data, record) => {
              return (
                  <div
                      style={{ textAlign: 'center',color: '#79aded',border: '1px solid #79aded' }}
                  >
                      {data} VNĐ
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
  return (
    <div className='admin_car' style={{padding: '10px',width:'1200px'}}>
      <div className='admin_tour_header'>
            <Button type="primary">Thêm</Button>
            <Button type="primary">Sửa</Button>
            <Button type="primary">Xóa</Button>

            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataCars} />
        </div>
  )
}

export default Car