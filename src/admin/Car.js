import React, { useEffect, useState } from 'react';
import { Button, Table, Modal, Input, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Car.css';
import { toast } from 'react-toastify';
import { Excel } from 'antd-table-saveas-excel';

import { SearchOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const { Option } = Select;
function Car() {
    const [DataCars, setDataCars] = useState([{}]);
    const [DataCarsChecked, setDataCarsChecked] = useState();
    const [findWithMaXe, setFindWithMaXe] = useState();

    const [reloadData, setReloadData] = useState(false);

    //get cars
    const dispatch = useDispatch();
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
    }, [reloadData]);

    //get tour
    const [DataTour, setDataTour] = useState([{}]);
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
    }, []);
    //them
    const [isModalVisibleThem, setIsModalVisibleThem] = useState(false);
    const [addBienSo, setAddBienSo] = useState();
    const [addLoaiXe, setAddLoaiXe] = useState();
    const [addSoLuongGhe, setAddSoLuongGhe] = useState();
    const [addGia, setAddGia] = useState();

    const showModalThem = () => {
        setIsModalVisibleThem(true);
    };

    const handleOkThem = () => {
        if (addBienSo && addGia && addLoaiXe && addSoLuongGhe) {
            addDoc(collection(db, 'bus'), {
                maXe:
                    DataCars.reduce(function (accumulator, element) {
                        return accumulator > element.maXe ? accumulator : element.maXe;
                    }) + 1,
                bienSo: addBienSo,
                gia: Number(addGia),
                loaiXe: addLoaiXe,
                soLuongGhe: Number(addSoLuongGhe)
            })
                .then((data) => {
                    setAddBienSo();
                    setAddLoaiXe();
                    toast.success('Th??m xe th??nh c??ng!');
                    setAddSoLuongGhe();
                    setAddGia();
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
    const [editBienSo, setEditBienSo] = useState();
    const [editLoaiXe, setEditLoaiXe] = useState();
    const [editSoLuongGhe, setEditSoLuongGhe] = useState();
    const [editGia, setEditGia] = useState();
    const showModalSua = () => {
        setIsModalVisibleSua(true);
    };

    const handleOkSua = () => {
        if (editBienSo && editGia && editLoaiXe && editSoLuongGhe) {
            updateDoc(doc(db, 'bus', DataCarsChecked.id), {
                bienSo: editBienSo,
                gia: Number(editGia),
                loaiXe: editLoaiXe,
                soLuongGhe: Number(editSoLuongGhe)
            })
                .then(() => {
                    toast.success('S???a th??ng tin xe th??nh c??ng!');
                    setEditBienSo();
                    setEditLoaiXe();
                    setEditSoLuongGhe();
                    setEditGia();
                    setIsModalVisibleSua(false);

                    setReloadData(!reloadData);
                })
                .catch((err) => toast.error(err));
        } else toast.error('Vui l??ng nh???p ?????y ????? th??ng tin!');
    };

    const handleCancelSua = () => {
        setIsModalVisibleSua(false);
    };

    const columns = [
        {
            title: 'M?? xe',
            dataIndex: 'maXe',
            key: 'maXe'
        },
        {
            title: 'Bi???n s???',
            dataIndex: 'bienSo',
            key: 'bienSo',

            render: (data, record) => {
                return (
                    <div
                        style={{
                            textAlign: 'center',
                            color: '#79aded',
                            border: '1px solid rgb(241, 152, 61)',
                            borderRadius: '5px'
                        }}>
                        {data}
                    </div>
                );
            }
        },
        {
            title: 'S??? l?????ng gh???',
            dataIndex: 'soLuongGhe',
            width: '200px',
            key: 'soLuongGhe'
        },
        {
            title: 'Lo???i xe',
            dataIndex: 'loaiXe',
            key: 'loaiXe'
        },
        {
            title: 'Gi??',
            dataIndex: 'gia',
            key: 'gia',

            render: (data, record) => {
                return (
                    <div style={{ textAlign: 'center', color: '#79aded', border: '1px solid #79aded' }}>{data} VN??</div>
                );
            }
        }
    ];
    const data = [];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows);
            if (selectedRows.length < 2) {
                setDataCarsChecked(selectedRows[0]);
                setEditBienSo(selectedRows[0].bienSo);
                setEditLoaiXe(selectedRows[0].loaiXe);
                setEditSoLuongGhe(selectedRows[0].soLuongGhe);
                setEditGia(selectedRows[0].gia);
            } else toast.warning('Vui l??ng ch??? ch???n 1 xe!');
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name
        })
    };
    const HandleSearch = (e) => {
        //Query
        if (findWithMaXe) {
            onSnapshot(query(collection(db, 'bus'), where('maXe', '==', Number(findWithMaXe))), (snapshot) => {
                let bus = [];
                snapshot.docs.forEach((doc) => {
                    bus.push({ ...doc.data(), id: doc.id });
                });

                setDataCars(bus);
            });
        } else {
            setReloadData(!reloadData);
        }
        console.log(findWithMaXe);
    };

    const columnexport = [
        {
            title: 'M?? xe',
            dataIndex: 'maXe',
            key: 'maXe'
        },
        {
            title: 'Bi???n s???',
            dataIndex: 'bienSo',
            key: 'bienSo'
        },
        {
            title: 'S??? l?????ng gh???',
            dataIndex: 'soLuongGhe',
            key: 'soLuongGhe'
        },
        {
            title: 'Lo???i xe',
            dataIndex: 'loaiXe',
            key: 'loaiXe'
        },
        {
            title: 'Gi??',
            dataIndex: 'gia',
            key: 'gia'
        }
    ];

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet('Xe')
            .addColumns(columnexport)
            .addDataSource(DataCars, {
                str2Percent: true
            })
            .saveAs('DanhSachXe.xlsx');
        console.log(excel, 'aa');
    };

    const handleDeleteCar = () => {
        if (DataTour.filter((k) => k.maXe == DataCarsChecked.maXe).length == 0) {
            deleteDoc(doc(db, 'bus', DataCarsChecked.id))
                .then(() => {
                    setReloadData(!reloadData);
                })
                .catch((err) => toast.error(err));
        } else toast.error('Xe d?? c?? chuy???n xe, kh??ng th??? x??a!');
    };
    return (
        <div className="admin_car" style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className="admin_tour_header">
                <Input placeholder="T??m ki???m" onChange={(e) => setFindWithMaXe(e.target.value)} />
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

                <Button danger onClick={handleDeleteCar}>
                    <DeleteOutlined />
                    X??a
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={DataCars}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
            />
            <Modal title="Th??m m???i xe" visible={isModalVisibleThem} onOk={handleOkThem} onCancel={handleCancelThem}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40%' }}>
                        <p>Bi???n s???:</p>
                        <p>Lo???i xe:</p>
                        <p>S??? l?????ng gh???:</p>
                        <p>Gi??:</p>
                    </div>
                    <div>
                        <Input
                            placeholder="Nh???p bi???n s???"
                            onChange={(e) => {
                                setAddBienSo(e.target.value);
                            }}
                            value={addBienSo}
                        />
                        <Select
                            placeholder="Ch???n lo???i xe"
                            style={{
                                width: 120
                            }}
                            onChange={(value, key) => {
                                setAddLoaiXe(value);
                            }}>
                            <Option value="Gi?????ng n???m">Gi?????ng n???m</Option>
                            <Option value="Gh??? ng???i">Gh??? ng???i</Option>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Nh???p s??? l?????ng gh???"
                            onChange={(e) => {
                                setAddSoLuongGhe(e.target.value);
                            }}
                            value={addSoLuongGhe}
                        />
                        <Input
                            type="number"
                            placeholder="Nh???p gi??"
                            onChange={(e) => {
                                setAddGia(e.target.value);
                            }}
                            value={addGia}
                        />
                    </div>
                </div>
            </Modal>
            {/* s???a */}
            <Modal title="S???a th??ng tin xe" visible={isModalVisibleSua} onOk={handleOkSua} onCancel={handleCancelSua}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '40%' }}>
                        <p>Bi???n s???:</p>
                        <p>Lo???i xe:</p>
                        <p>S??? l?????ng gh???:</p>
                        <p>Gi??:</p>
                    </div>
                    <div>
                        <Input
                            placeholder="Nh???p bi???n s???"
                            value={editBienSo}
                            onChange={(e) => {
                                setEditBienSo(e.target.value);
                            }}
                        />
                        <Select
                            defaultValue={editLoaiXe}
                            style={{
                                width: 120
                            }}
                            onChange={(value, key) => {
                                setEditLoaiXe(value);
                            }}>
                            <Option value="Gi?????ng n???m">Gi?????ng n???m</Option>
                            <Option value="Gh??? ng???i">Gh??? ng???i</Option>
                        </Select>
                        <Input
                            type="number"
                            placeholder="Nh???p s??? l?????ng gh???"
                            value={editSoLuongGhe}
                            onChange={(e) => {
                                setEditSoLuongGhe(e.target.value);
                            }}
                        />
                        <Input
                            type="number"
                            placeholder="Nh???p gi??"
                            value={editGia}
                            onChange={(e) => {
                                setEditGia(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Car;
