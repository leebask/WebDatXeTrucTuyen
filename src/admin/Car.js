import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Car.css'
import { toast } from 'react-toastify';
import {
  SearchOutlined
} from '@ant-design/icons';
const { Option } = Select;
function Car() {
  const [DataCars, setDataCars] = useState([{}]);
  const [DataCarsChecked, setDataCarsChecked] = useState();
  const [findWithMaXe, setFindWithMaXe] = useState();

  

  //them
  const [isModalVisibleThem, setIsModalVisibleThem] = useState(false);

  const showModalThem = () => {
    setIsModalVisibleThem(true);
  };

  const handleOkThem = () => {
    setIsModalVisibleThem(false);
    toast.success('Thêm xe thành công!')
  };

  const handleCancelThem = () => {
    setIsModalVisibleThem(false);
  };
  //sua 
  const [isModalVisibleSua, setIsModalVisibleSua] = useState(false);

  const showModalSua = () => {
    setIsModalVisibleSua(true);
  };

  const handleOkSua = () => {
    setIsModalVisibleSua(false);
    toast.success('Sửa thông tin xe thành công!')

  };

  const handleCancelSua = () => {
    setIsModalVisibleSua(false);
  };

  //get cars
  const dispatch = useDispatch()
  useEffect(() => {
    const getDataCars = async () => {
      try {
        let _cars = await getDocs(collection(db, 'bus'))
        _cars = _cars.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('cars', _cars)
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
            style={{ textAlign: 'center', color: '#79aded', border: '1px solid rgb(241, 152, 61)', borderRadius: '5px' }}
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
            style={{ textAlign: 'center', color: '#79aded', border: '1px solid #79aded' }}
          >
            {data} VNĐ
          </div>
        );
      }
    },
  ];
  const data = [];



  const [selectedRowKeys, setSelectedRowKeys] = useState([]);



  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {

      console.log(selectedRowKeys, selectedRows)
      if (selectedRows.length < 2)
        setDataCarsChecked(selectedRows[0])
      else toast.warning('Vui lòng chỉ chọn 1 xe!')
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
  };
  const HandleSearch = (e) => {
  //Query
  onSnapshot(
    query(
      collection(db, 'bus'),where('maXe','==',Number(findWithMaXe))),(snapshot)=>{
        let bus=[]
        snapshot.docs.forEach(doc=>{
          bus.push({...doc.data(),id:doc.id})
        } )

        setDataCars(bus)
      })
      
    console.log(DataCars)
  }
  return (
    <div className='admin_car' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
      <div className='admin_tour_header'>
        <Input placeholder="Tìm kiếm" onChange={(e)=>setFindWithMaXe(e.target.value)} />
        <Button type="secondary" onClick={HandleSearch}><SearchOutlined />Tìm</Button>

        <Button type="primary" onClick={showModalThem}>Thêm</Button>
        <Button type="primary" onClick={showModalSua}>Sửa</Button>
        <Button type="primary" onClick={()=>toast.success("Xóa xe thành công!")}>Xóa</Button>

      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={DataCars}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
      />
      <Modal title="Thêm mới xe"
        visible={isModalVisibleThem}
        onOk={handleOkThem}
        onCancel={handleCancelThem}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '40%' }}>
            <p>Biển số:</p>
            <p>Loại xe:</p>
            <p>Số lượng ghế:</p>
            <p>Giá:</p>
          </div>
          <div>
            <Input placeholder="Nhập biển số" />
            <Select
              // defaultValue=""
              style={{
                width: 120,
              }}
              onChange
            >
              <Option value="Giường nằm">Giường nằm</Option>
              <Option value="Ghế ngồi">Ghế ngồi</Option>

            </Select>
            <Input type="number" placeholder="Nhập số lượng ghế" />
            <Input type="number" placeholder="Nhập giá" />

          </div>
        </div>
      </Modal>
      {/* sửa */}
      <Modal title="Sửa thông tin xe"
        visible={isModalVisibleSua}
        onOk={handleOkSua}
        onCancel={handleCancelSua}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '40%' }}>
            <p>Biển số:</p>
            <p>Loại xe:</p>
            <p>Số lượng ghế:</p>
            <p>Giá:</p>
          </div>
          <div>
            <Input placeholder="Nhập biển số" value={DataCarsChecked?.bienSo} />
            <Select
              defaultValue={DataCarsChecked?.loaiXe}
              style={{
                width: 120,
              }}
              onChange
            >
              <Option value="Giường nằm">Giường nằm</Option>
              <Option value="Ghế ngồi">Ghế ngồi</Option>

            </Select>
            <Input type="number" placeholder="Nhập số lượng ghế" value={DataCarsChecked?.soLuongGhe} />
            <Input type="number" placeholder="Nhập giá" value={DataCarsChecked?.gia} />

          </div>
        </div>

      </Modal>
    </div>
  )
}

export default Car