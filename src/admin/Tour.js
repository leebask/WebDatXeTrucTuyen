import React, { useEffect, useState } from 'react';
import { Avatar, Button, Table, Input, Select, Modal, DatePicker } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Divider } from '@mui/material';
import './Tour.css';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { Excel } from 'antd-table-saveas-excel';

import moment from 'moment';
import { toast } from 'react-toastify';
const dateFormatList = ['DD/MM/YYYY'];
const { Option } = Select;
function Tour() {
    const [DataTour, setDataTour] = useState([{}]);
    const [DataRoute, setDataRoute] = useState([{}]);
    const [reloadData, setReloadData] = useState(false);

    //get tour
    const dispatch = useDispatch();
    useEffect(() => {
        const getDataCars = async () => {
            try {
                let _tour = await getDocs(collection(db, 'tour'));
                _tour = _tour.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('_tour', _tour);
                //  dispatch(setCars(_tour))
                setDataTour(
                    _tour.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    })
                );
            } catch (err) {
                // setError(err.message);
                setDataTour([]);
            } finally {
                // setLoading(false);
            }
        };

        getDataCars();
    }, [reloadData]);

    //route
    useEffect(() => {
        const getDataCars = async () => {
            try {
                let _route = await getDocs(collection(db, 'route'));
                _route = _route.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('_route', _route);
                //  dispatch(setCars(_route))
                setDataRoute(
                    _route.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    })
                );
            } catch (err) {
                // setError(err.message);
                setDataRoute([{}]);
            } finally {
                // setLoading(false);
            }
        };

        getDataCars();
    }, [reloadData]);

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
                noiDi: DataRoute.filter((k) => k.ma == element.maLT).map((k) => k.noiDi),
                noiDen: DataRoute.filter((k) => k.ma == element.maLT).map((k) => k.noiDen)
            };
            arrCarNew.push(object);
        });

        setDataTour(arrCarNew);
    }, [DataRoute, reloadData]);

    //get cars
    const [DataCars, setDataCars] = useState([{}]);

    useEffect(() => {
        const getDataCars = async () => {
            try {
                let _cars = await getDocs(collection(db, 'bus'));
                _cars = _cars.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('cars', _cars);
                dispatch(setCars(_cars));
                setDataCars(
                    _cars.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    })
                );
            } catch (err) {
                // setError(err.message);
                setDataCars([]);
            } finally {
                // setLoading(false);
            }
        };

        getDataCars();
    }, []);
    //get ticket
    const [DataTicket, setDataTicket] = useState([{}]);

    useEffect(() => {
        const getDataTicket = async () => {
            try {
                let _ticket = await getDocs(collection(db, 'ticket'));
                _ticket = _ticket.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('_ticket', _ticket);
                dispatch(setCars(_ticket));
                setDataTicket(
                    _ticket.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        };
                    })
                );
            } catch (err) {
                // setError(err.message);
                setDataTicket([]);
            } finally {
                // setLoading(false);
            }
        };

        getDataTicket();
    }, []);
    const columns = [
        {
            title: 'M?? l??? tr??nh',
            dataIndex: 'maLT'
        },
        {
            title: 'M?? chuy???n xe',
            dataIndex: 'maCX',
            render: (data, record) => {
                return (
                    <Avatar
                        size={36}
                        style={{
                            backgroundColor: 'rgb(241, 152, 61)'
                        }}>
                        {data}
                    </Avatar>
                );
            }
        },
        {
            title: 'M?? xe',
            dataIndex: 'maXe'
        },
        {
            title: 'N??i ??i',
            dataIndex: 'noiDi'
        },
        {
            title: 'N??i ?????n',
            dataIndex: 'noiDen'
        },
        {
            title: 'Ng??y ??i',
            dataIndex: 'ngayDi'
        },
        {
            title: 'Gi??',
            dataIndex: 'gia',
            render: (data, record) => {
                return (
                    <div style={{ textAlign: 'center', color: '#79aded', border: '1px solid #79aded' }}>{data} VN??</div>
                );
            }
        }
    ];
    const data = [];
    const columnexport = [
        {
            title: 'M?? l??? tr??nh',
            dataIndex: 'maLT'
        },
        {
            title: 'M?? chuy???n xe',
            dataIndex: 'maCX'
        },
        {
            title: 'M?? xe',
            dataIndex: 'maXe'
        },
        {
            title: 'N??i ??i',
            dataIndex: 'noiDi'
        },
        {
            title: 'N??i ?????n',
            dataIndex: 'noiDen'
        },
        {
            title: 'Ng??y ??i',
            dataIndex: 'ngayDi'
        },
        {
            title: 'Gi??',
            dataIndex: 'gia'
        }
    ];

    const [dataTourChecked, setDataTourChecked] = useState();
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows);
            if (selectedRows.length < 2) {
                setDataTourChecked(selectedRows[0]);
                setMaLTSua(selectedRows[0].maLT);
                setMaCXSua(selectedRows[0].maCX);
                setMaXeSua(selectedRows[0].maXe);
                setGiaSua(selectedRows[0].gia);
                setNgayDiSua(selectedRows[0].ngayDi);
            } else toast.warning('Vui l??ng ch??? ch???n 1 chuy???n xe!');
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    };
    const [findWithCXe, setFindWithCXe] = useState();

    const HandleSearch = (e) => {
        //Query
        onSnapshot(query(collection(db, 'tour'), where('maCX', '==', findWithCXe.toUpperCase())), (snapshot) => {
            let bus = [];
            snapshot.docs.forEach((doc) => {
                bus.push({ ...doc.data(), id: doc.id });
            });

            setDataTour(bus);
        });
    };

    //them
    const [isModalVisibleThem, setIsModalVisibleThem] = useState(false);
    const [maLTAdd, setMaLTAdd] = useState();
    const [maCXAdd, setMaCXAdd] = useState();
    const [maXeAdd, setMaXeAdd] = useState();
    const [ngayDiAdd, setNgayDiAdd] = useState();
    const [GiaAdd, setGiaAdd] = useState();

    const showModalThem = () => {
        setIsModalVisibleThem(true);
    };
    const handleOkThem = () => {
        if (maLTAdd && maCXAdd && maXeAdd && ngayDiAdd && GiaAdd) {
            addDoc(collection(db, 'tour'), {
                maLT: maLTAdd,
                maCX: maCXAdd.toUpperCase(),
                maXe: Number(maXeAdd),
                ngayDi: moment(ngayDiAdd).format('DD/MM/YYYY'),
                gia: Number(GiaAdd)
            })
                .then((data) => {
                    setMaLTAdd();
                    setMaCXAdd();
                    toast.success('Th??m chuy???n xe th??nh c??ng!');
                    setMaXeAdd();
                    setGiaAdd();
                    setNgayDiAdd();
                    setIsModalVisibleThem(false);

                    setReloadData(!reloadData);
                })
                .catch((error) => toast.error(error));
        } else toast.error('Vui l??ng nh???p ?????y ????? th??ng tin!');
    };
    const handleCancelThem = () => {
        setIsModalVisibleThem(false);
    };
    //sua
    const [isModalVisibleSua, setIsModalVisibleSua] = useState(false);
    const [maLTSua, setMaLTSua] = useState();
    const [maCXSua, setMaCXSua] = useState();
    const [maXeSua, setMaXeSua] = useState();
    const [ngayDiSua, setNgayDiSua] = useState();
    const [GiaSua, setGiaSua] = useState();

    const showModalSua = () => {
        setIsModalVisibleSua(true);
    };
    const handleOkSua = () => {
        if (maLTSua && maCXSua && maXeSua && ngayDiSua && GiaSua) {
            updateDoc(doc(db, 'tour', dataTourChecked.id), {
                maLT: maLTSua,
                maXe: Number(maXeSua),
                ngayDi: moment(ngayDiSua, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                gia: Number(GiaSua)
            })
                .then((data) => {
                    setMaLTSua();
                    setMaCXSua();
                    toast.success('S???a chuy???n xe th??nh c??ng!');
                    setMaXeSua();
                    setGiaSua();
                    setNgayDiSua();
                    setIsModalVisibleSua(false);

                    setReloadData(!reloadData);
                })
                .catch((error) => toast.error(error));
        } else toast.error('Vui l??ng nh???p ?????y ????? th??ng tin!');
    };
    const handleCancelSua = () => {
        setIsModalVisibleSua(false);
        console.log(DataTicket.filter((k) => k.maCX == dataTourChecked.maCX).length == 0);
    };
    const handleDeleteTour = () => {
        if (DataTicket.filter((k) => k.maCX == dataTourChecked.maCX).length == 0) {
            deleteDoc(doc(db, 'tour', dataTourChecked.id))
                .then(() => {
                    setReloadData(!reloadData);
                })
                .catch((err) => toast.error(err));
        } else toast.error('Chuy???n xe ???? c?? ng?????i ?????t, kh??ng th??? x??a!');
    };

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet('Chuyenxe')
            .addColumns(columnexport)
            .addDataSource(DataTour, {
                str2Percent: true
            })
            .saveAs('DanhSachChuyenxe.xlsx');
        console.log(excel, 'aa');
    };
    return (
        <div className="admin_tour" style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className="admin_tour_header">
                <Input placeholder="T??m ki???m" onChange={(e) => setFindWithCXe(e.target.value)} />
                <Button type="secondary" onClick={HandleSearch}>
                    <SearchOutlined />
                    T??m
                </Button>
                <Button type="primary" onClick={showModalThem}>
                    <PlusCircleOutlined />
                    Th??m
                </Button>
                <Button type="primary" onClick={showModalSua}>
                    <EditOutlined />
                    S???a
                </Button>
                <Button
                    type="primary"
                    style={{ background: '#5ba75b', border: '1px solid greenyellow' }}
                    onClick={exportExcel}>
                    <ExportOutlined />
                    Xu???t Excel
                </Button>
                <Button danger onClick={handleDeleteTour}>
                    <DeleteOutlined />
                    X??a
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={DataTour}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
            />
            <Modal
                title="Th??m m???i chuy???n xe"
                visible={isModalVisibleThem}
                onOk={handleOkThem}
                onCancel={handleCancelThem}>
                <div>
                    <div>
                        <div>
                            <div> M?? l??? tr??nh:</div>
                            <Select
                                placeholder="M?? l??? tr??nh"
                                style={{
                                    width: 120
                                }}
                                onChange={(value, key) => {
                                    setMaLTAdd(value);
                                }}>
                                {DataRoute.map((k) => (
                                    <Option value={k.ma}>{k.ma}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <div> M?? chuy???n xe:</div>
                            <Input
                                placeholder="Nh???p m?? chuy???n xe"
                                onChange={(e) => {
                                    setMaCXAdd(e.target.value);
                                }}
                                value={maCXAdd}
                            />
                        </div>
                        <div>
                            <div> M?? xe:</div>
                            <Select
                                placeholder="M?? xe"
                                style={{
                                    width: '100%'
                                }}
                                onChange={(value, key) => {
                                    setMaXeAdd(value);
                                }}>
                                {DataCars.map((k) => (
                                    <Option value={k.maXe}>{k.maXe}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <div>Ng??y ??i:</div>
                            <DatePicker
                                disabledDate={(current) => current < moment().subtract(1, 'day')}
                                onChange={(date, dateString) => {
                                    setNgayDiAdd(date);
                                }}
                                format={dateFormatList}
                            />
                        </div>
                        <div>
                            <div>Gi??:</div>
                            <Input
                                type="number"
                                placeholder="Nh???p gi??"
                                onChange={(e) => {
                                    setGiaAdd(e.target.value);
                                }}
                                value={GiaAdd}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal title="S???a chuy???n xe" visible={isModalVisibleSua} onOk={handleOkSua} onCancel={handleCancelSua}>
                <div>
                    <div>
                        <div>
                            <div> M?? l??? tr??nh:</div>
                            <Select
                                placeholder="M?? l??? tr??nh"
                                style={{
                                    width: '100%'
                                }}
                                onChange={(value, key) => {
                                    setMaLTSua(value);
                                }}
                                defaultValue={maLTSua}>
                                {DataRoute.map((k) => (
                                    <Option value={k.ma}>{k.ma}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <div> M?? chuy???n xe:</div>
                            <Input
                                placeholder="Nh???p m?? chuy???n xe"
                                onChange={(e) => {
                                    setMaCXSua(e.target.value);
                                }}
                                value={maCXSua}
                                disabled
                            />
                        </div>
                        <div>
                            <div> M?? xe:</div>
                            <Select
                                placeholder="M?? xe"
                                style={{
                                    width: '100%'
                                }}
                                onChange={(value, key) => {
                                    setMaXeSua(value);
                                }}
                                defaultValue={maXeSua}>
                                {DataCars.map((k) => (
                                    <Option value={k.maXe}>{k.maXe}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <div>Ng??y ??i:</div>
                            <DatePicker
                                disabledDate={(current) => current < moment().subtract(1, 'day')}
                                onChange={(date, dateString) => {
                                    setNgayDiSua(date);
                                }}
                                value={moment(ngayDiSua, 'DD/MM/YYYY')}
                                format={dateFormatList}
                            />
                        </div>
                        <div>
                            <div>Gi??:</div>
                            <Input
                                type="number"
                                placeholder="Nh???p gi??"
                                onChange={(e) => {
                                    setGiaSua(e.target.value);
                                }}
                                value={GiaSua}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Tour;
