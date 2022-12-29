import React, { useEffect, useState } from 'react';
import { Avatar, Button, Table, Input, Select, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { setCars } from '../features/carsSlice';
import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import './Route.css';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { toast } from 'react-toastify';
const { Option } = Select;

function Route() {
    const [DataRoute, setDataRoute] = useState([{}]);
    const [reloadData, setReloadData] = useState(false);
    const [DataRouteSelectSearch, setDataRouteSelectSearch] = useState([{}]);

    //get route
    const dispatch = useDispatch();
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
                setDataRouteSelectSearch(_route);
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

    const columns = [
        {
            title: 'Mã lộ trình',
            dataIndex: 'ma'
        },

        {
            title: 'Nơi đi',
            dataIndex: 'noiDi'
        },
        {
            title: 'Nơi đến',
            dataIndex: 'noiDen'
        },

        {
            title: 'Khoảng cách',
            dataIndex: 'khoangCach',
            render: (data, record) => {
                return <div style={{ color: 'rgb(191 23 72)' }}>{data} Km</div>;
            }
        }
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
                }
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
                }
            }
        ]
    };

    const [findWithRoute, setFindWithRoute] = useState();

    const HandleSearch = (e) => {
        //Query
        onSnapshot(query(collection(db, 'route'), where('ma', '==', findWithRoute)), (snapshot) => {
            let bus = [];
            snapshot.docs.forEach((doc) => {
                bus.push({ ...doc.data(), id: doc.id });
            });

            setDataRoute(bus);
        });
        console.log(findWithRoute);
    };

    //them
    const [isModalVisibleThem, setIsModalVisibleThem] = useState(false);
    const [maLTAdd, setMaLTAdd] = useState();
    const [noiDiAdd, setNoiDiAdd] = useState();
    const [noiDenAdd, setNoiDenAdd] = useState();
    const [khoangCachAdd, setKhoangCachAdd] = useState();

    const showModalThem = () => {
        setIsModalVisibleThem(true);
    };
    const handleOkThem = () => {
        if (maLTAdd && noiDiAdd && noiDenAdd && khoangCachAdd) {
            addDoc(collection(db, 'route'), {
                ma: maLTAdd,
                noiDi: noiDiAdd,
                noiDen: noiDenAdd,
                khoangCach: khoangCachAdd
            })
                .then((data) => {
                    setMaLTAdd();
                    setNoiDiAdd();
                    toast.success('Thêm lộ trình thành công!');
                    setNoiDenAdd();
                    setKhoangCachAdd();
                    setIsModalVisibleThem(false);

                    setReloadData(!reloadData);
                })
                .catch((error) => toast.error(error));
        } else toast.error('Vui lòng nhập đầy đủ thông tin!');
    };
    const handleCancelThem = () => {
        setIsModalVisibleThem(false);
    };
    return (
        <div className="admin_route" style={{ padding: '36px 10px 10px 10px', width: '100%' }}>
            <div className="admin_tour_header">
                <Select
                    showSearch
                    style={{ width: '400px !important' }}
                    placeholder="Mã lộ trình"
                    onChange={(value, key) => {
                        setFindWithRoute(value);
                    }}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}>
                    {DataRouteSelectSearch.map((k, key) => (
                        <Option key={key} value={k.ma}>
                            {k.ma}
                        </Option>
                    ))}
                    {/* <Option key={1} value='DakLak-SaiGon'>DakLak-SaiGon</Option>
          <Option key={2} value='SaiGon-DakLak'>SaiGon-DakLak</Option> */}
                </Select>
                <Button type="secondary" onClick={HandleSearch}>
                    <SearchOutlined />
                    Tìm
                </Button>
                <Button type="primary" onClick={showModalThem}>
                    <PlusCircleOutlined />
                    Thêm
                </Button>
                <Button type="primary">
                    <EditOutlined />
                    Sửa
                </Button>
                <Button danger>
                    <DeleteOutlined />
                    Xóa
                </Button>
            </div>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={DataRoute}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }}
            />
            <Modal title="Sửa lộ trình" visible={isModalVisibleThem} onOk={handleOkThem} onCancel={handleCancelThem}>
                <div>
                    <div>
                        <div>
                            <div> Mã lộ trình:</div>
                            <Input
                                placeholder="Mã lộ trình"
                                onChange={(e) => {
                                    setMaLTAdd(e.target.value);
                                }}
                                value={maLTAdd}
                            />
                        </div>
                        <div>
                            <div> Nơi đi:</div>
                            <Input
                                placeholder="Nơi đi"
                                onChange={(e) => {
                                    setNoiDiAdd(e.target.value);
                                }}
                                value={noiDiAdd}
                            />
                        </div>
                        <div>
                            <div> Nơi đến:</div>
                            <Input
                                placeholder="Nơi đến"
                                onChange={(e) => {
                                    setNoiDenAdd(e.target.value);
                                }}
                                value={noiDenAdd}
                            />
                        </div>
                        <div>
                            <div>Khoảng cách:</div>
                            <Input
                                placeholder="Khoảng cách"
                                onChange={(e) => {
                                    setKhoangCachAdd(e.target.value);
                                }}
                                value={khoangCachAdd}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Route;
