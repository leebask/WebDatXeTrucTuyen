import React, { useEffect, useState } from 'react'
import { Avatar, Button, Table, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Divider } from '@mui/material';
import './Tour.css'
import {

    SearchOutlined,PlusCircleOutlined,EditOutlined ,DeleteOutlined
  } from '@ant-design/icons';
function Tour() {
    const [DataTour, setDataTour] = useState([{}]);
    const [DataRoute, setDataRoute] = useState([{}]);

    //get cars
    const dispatch = useDispatch()
    useEffect(() => {
        const getDataCars = async () => {
            try {
                let _tour = await getDocs(collection(db, 'tour'))
                _tour = _tour.docs.map(t => ({
                    ...t.data(),
                    id: t.id
                }))
                console.log('_tour', _tour)
                //  dispatch(setCars(_tour))
                setDataTour(_tour.map(
                    (item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    }
                ));



            } catch (err) {
                // setError(err.message);
                setDataTour([]);

            } finally {
                // setLoading(false);
            }
        }

        getDataCars()
    }, [])

    //route
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

    useEffect(() => {
        let arrCarNew = [];
        DataTour?.forEach((element) => {
            let object = {
                key: element.id,
                gia: element.gia,
                id: element.id,
                maCX: element.maCX,
                maLT: element.maLT,
                maXe: element.maXe,
                ngayDi: element.ngayDi,
                noiDi: DataRoute.filter(k => k.ma == element.maLT).map(k => k.noiDi),
                noiDen: DataRoute.filter(k => k.ma == element.maLT).map(k => k.noiDen)
            };
            arrCarNew.push(object);
        });

        setDataTour(arrCarNew)

    }, [DataRoute])

    const columns = [
        {
            title: 'Mã lộ trình',
            dataIndex: 'maLT',
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
            title: 'Mã xe',
            dataIndex: 'maXe',
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
            title: 'Ngày đi',
            dataIndex: 'ngayDi',
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
    const [findWithCXe, setFindWithCXe] = useState();

    const HandleSearch = (e) => {
        //Query
        onSnapshot(
            query(
                collection(db, 'tour'), where('maCX', '==', findWithCXe)), (snapshot) => {
                    let bus = []
                    snapshot.docs.forEach(doc => {
                        bus.push({ ...doc.data(), id: doc.id })
                    })

                    setDataTour(bus)
                })

    }
    return (
        <div className='admin_tour' style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className='admin_tour_header'>
                <Input placeholder="Tìm kiếm" onChange={(e) => setFindWithCXe(e.target.value)} />
                <Button type="secondary" onClick={HandleSearch}><SearchOutlined />Tìm</Button>
                <Button type="primary"><PlusCircleOutlined/>Thêm</Button>
                <Button type="primary"><EditOutlined />Sửa</Button>
                <Button danger><DeleteOutlined />Xóa</Button>

            </div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataTour}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
            />
        </div>
    )
}

export default Tour