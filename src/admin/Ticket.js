import React, { useEffect, useState } from 'react'
import { Avatar, Button, Table, Input, Select, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Ticket.css'
import {
  SearchOutlined,ExportOutlined
} from '@ant-design/icons';
import { toast } from 'react-toastify';

import { Excel } from "antd-table-saveas-excel";


const { Option } = Select;

function Ticket() {
  const [DataTicket, setDataTicket] = useState([{}]);
  const [isModalVisibleViewTK, setIsModalVisibleViewTK] = useState(false);
  const [dataDetailTicket, setDataDetailTicket] = useState();
  const [dataDetailTicketSelect, setDataDetailTicketSelect] = useState();

  const showModalViewTK = () => {
    setIsModalVisibleViewTK(true);
  };
  const handleOkViewTK = () => {
    setIsModalVisibleViewTK(false)
  }
  const handleCancelViewTK = () => {
    setIsModalVisibleViewTK(false);
  };
  //get ticket
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
        setDataDetailTicketSelect(_ticket)
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
  const columnexport = [
    {
      title: 'Mã vé',
      dataIndex: 'maVe',
    },
    {
      title: 'Mã chuyến xe',
      dataIndex: 'maCX',
    },
    {
      title: 'Mã ghế',
      dataIndex: 'maGhe',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Điện thoại',
    },
    {
      title: 'Tên',
      dataIndex: 'tenKH',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
     
    },

    {
      title: 'Ghi chú',
      dataIndex: 'ghiChu',
    },

  ];


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {

      console.log(selectedRowKeys, selectedRows)
      if (selectedRows.length < 2) {
        setDataDetailTicket(selectedRows[0])
        console.log(dataDetailTicket)
      }
      else toast.warning('Vui lòng chỉ chọn 1 vé!')
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name
    })
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

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("Vexe")
      .addColumns(columnexport)
      .addDataSource(DataTicket, {
        str2Percent: true
      })
      .saveAs("DanhSachVeXe.xlsx");
    console.log(excel, "aa")

  };
  return (
    <div className='admin_car' style={{ padding: '36px 2px 2px 2px', width: '100%' }}>
      <div className='admin_tour_header'>
        <Select
          showSearch
          style={{ width: '400px !important' }}
          placeholder="Mã chuyến xe"
          onChange={(value, key) => { setFindWithTicket(value) }}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
          {dataDetailTicketSelect?.map(k=>k.maCX)?.filter((item,index)=>dataDetailTicketSelect?.map(k=>k.maCX).indexOf(item)==index)?.map((k,key)=>
          <Option key={key} value={k}>{k}</Option>
          )}
          {/* <Option key={1} value='CX01'>CX01</Option>
          <Option key={2} value='CX02'>CX02</Option> */}
        </Select>
        <Button type="secondary" onClick={HandleSearch}><SearchOutlined />Tìm</Button>

        {/* <Button type="primary">Thêm</Button>
        <Button type="primary">Sửa</Button> */}
        <Button type="primary" onClick={
          showModalViewTK
          }>Xem chi tiết</Button>
        <Button type="primary" style={{ background: '#5ba75b', border: '1px solid greenyellow' }}
                 onClick={exportExcel}
                ><ExportOutlined />Xuất Excel</Button>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={DataTicket}
        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
      />
      <Modal title="Chi tiết vé"
        visible={isModalVisibleViewTK}
        onOk={handleOkViewTK}
        onCancel={handleCancelViewTK}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '60%' }}>
            <p>Mã vé:</p>
            <p>Mã chuyến:</p>
            <p>Mã ghế:</p>
            <p>Tên:</p>

            <p>Email:</p>
            <p>SĐT:</p>
            <p>Ngày đặt:</p>

            <p>Ghi chú:</p>


          </div>
          <div>
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.maVe}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.maCX}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.maGhe}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.tenKH}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.email}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.sdt}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.tenKH}
            />
            <Input style={{ marginBottom: '2px' }}
              value={dataDetailTicket?.ghiChu}
            />


          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Ticket