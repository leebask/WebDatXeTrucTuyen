import React, { useEffect, useState } from 'react'
import { Table } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Divider } from '@mui/material';

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

                gia: element.gia,
                id: element.id,
                maCX: element.maCX,
                maLT: element.maLT,
                maXe: element.maXe,
                ngayDi:element.ngayDi,
                noiDi:DataRoute.filter(k => k.ma == element.maLT).map(k => k.noiDi),
                noiDen:DataRoute.filter(k => k.ma == element.maLT).map(k => k.noiDen)
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
            title: 'Ngày đi',
            dataIndex: 'maCX',
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
                        style={{ color: '#79aded' }}
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
        <div style={{ padding: '10px' }}>
            <div onClick={() => {console.log("sss",DataRoute.filter(k => k.ma == 'DakLak-Saigon'))}}>click</div>
            <Table rowSelection={rowSelection} columns={columns} dataSource={DataTour} />
        </div>
    )
}

export default Tour