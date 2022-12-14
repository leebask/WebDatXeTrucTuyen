import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import logoVN from '../images/vn.webp';
import logoAnh from '../images/anh.webp';
import Car4 from '../images/4cho.png';
import Car16 from '../images/16cho.png';
import Car32 from '../images/xe32cho.png';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import './HomeAccount.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../features/userSlice';
import { setCars, selectCars } from '../features/carsSlice';
import Cars from './Cars';
import { auth } from '../firebase';
import SelectTextFields from './SelectTextFields';
import { Pagination } from '@mui/material';
import Footer from '../footer/Footer';
//DB
import { db } from '../firebase';
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { selectCartour, setCartour } from '../features/cartourSlice';
import { setticket } from '../features/ticketSlice';

import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { doc, onSnapshot, query, where } from 'firebase/firestore';
import { PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { Input, Select } from 'antd';
import PayPal from '../paypal/PayPal';
const { Option } = Select;

function HomeAccount({ isMenuOpen, setIsMenuOpen }) {
    const [checkout, setCheckOut] = useState(false);
    const user = useSelector(selectUser);
    const cars = useSelector(selectCars);
    const tours = useSelector(selectCartour);

    const [reloadData, setReloadData] = React.useState(false);

    const [dayTourSearch, setDayTourSearch] = React.useState(null);

    const [openDieuPhoi, setOpenDieuPhoi] = React.useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [DataCars, setDataCars] = useState({});
    const [DataRoute, setDataRoute] = useState({});
    const [DataRouteDieuPhoi, setDataRouteDieuPhoi] = useState();

    const [DataTour, setDataTour] = useState({});
    const [SelectedDataRoute, setSelectedDataRoute] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //get cars
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
                    _cars.reduce(
                        (obj, t) => ({
                            ...obj,
                            [t.maXe]: t
                        }),
                        {}
                    )
                );

                setError(null);
            } catch (err) {
                setError(err.message);
                setDataCars({});
            } finally {
                setLoading(false);
            }
        };

        getDataCars();
    }, [reloadData]);

    //get tour
    useEffect(() => {
        const getDataTour = async () => {
            try {
                let _tour = await getDocs(collection(db, 'tour'));
                _tour = _tour.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('tour', _tour);
                dispatch(setCartour(_tour));
                setDataTour(
                    _tour.reduce(
                        (obj, t) => ({
                            ...obj,
                            [t.maCX]: t
                        }),
                        {}
                    )
                );

                setError(null);
            } catch (err) {
                setError(err.message);
                setDataTour({});
            } finally {
                setLoading(false);
            }
        };
        getDataTour();
    }, [reloadData]);

    //get l??? tr??nh
    useEffect(() => {
        const getDataRoute = async () => {
            try {
                let _route = await getDocs(collection(db, 'route'));
                _route = _route.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('route', _route);
                //  dispatch(setDataRoute(_route))
                setDataRouteDieuPhoi(_route);
                setDataRoute(
                    _route.reduce(
                        (obj, t) => ({
                            ...obj,
                            [t.ma]: t
                        }),
                        {}
                    )
                );

                setError(null);
            } catch (err) {
                setError(err.message);
                setDataRoute({});
            } finally {
                setLoading(false);
            }
        };
        getDataRoute();
    }, []);

    const logoutOfApp = () => {
        auth.signOut()
            .then(() => {
                dispatch(logout());
                navigate('/');
            })
            .catch((error) => alert(error.message));
    };

    const handleSelectRoute = (e) => {
        setSelectedDataRoute(e.target.value);
    };

    // Get ticket API
    const [DataTicket, setDataTicket] = React.useState([]);
    //get Ticket
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        const getDataTicket = async () => {
            try {
                let _ticket = await getDocs(collection(db, 'ticket'));
                _ticket = _ticket.docs.map((t) => ({
                    ...t.data(),
                    id: t.id
                }));
                console.log('ticket', _ticket);

                dispatch(setticket(_ticket));
                setDataTicket(_ticket);
                setError(null);
            } catch (err) {
                setError(err.message);
                setDataTicket([]);
            } finally {
                setLoading(false);
            }
        };
        getDataTicket();
    }, [reloadData, open]);

    //L???ch s??? ticket

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    //huy ve
    const removeTicket = (id) => () => {
        updateDoc(doc(db, 'ticket', id), {
            trangThai: -1
        })
            .then(() => toast.success('H???y v?? th??nh c??ng!'))
            .catch((err) => toast.error(err));
    };

    const exportPDF = (ticketID) => {
        let element = document.getElementById(ticketID);
        // xoa_dau(element.toString())
        savePDF(element, {
            paperSize: 'auto',
            margin: 40,
            fileName: `VeXe ${ticketID}`
        });
        console.log(element);
    };
    // dieu phoi
    const [textLoTrinh, setTextLoTrinh] = React.useState();
    const [textNgayDi, setTextNgayDi] = React.useState(null);

    const handleOpenDieuPhoi = () => {
        setOpenDieuPhoi(true);
    };
    const handleCloseDieuPhoi = () => {
        setOpenDieuPhoi(false);
    };
    const handleConfirmDieuPhoi = () => {
        if (textLoTrinh && textNgayDi) {
            addDoc(collection(db, 'dispatcher'), {
                maCX: textLoTrinh,
                email: user.email,
                ngayDi: textNgayDi.format('DD/MM/YYYY'),
                trangThai: 1
            })
                .then((data) => {
                    setTextLoTrinh();
                    setTextNgayDi(null);
                    toast.success('Y??u c???u ??i???u ph???i th??nh c??ng!');
                    setOpenDieuPhoi(false);
                })
                .catch((error) => toast.error(error));
        } else toast.warning('Vui l??ng nh???p ????? th??ng tin!');
        console.log(
            textLoTrinh,
            textNgayDi,
            DataRouteDieuPhoi.map((k) => k.ma)
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="homeAccount">
                {/* phonenumber */}

                <div className="homeAccount__header">
                    <div className="homeAccount__logo">
                        <Link to="/">
                            <img className="homeAccount__logoImg" src={logo} alt="" />
                        </Link>
                    </div>
                    <div className="homeAccount__links">
                        <Link
                            to="/homeaccount"
                            className={window.location.href.split('/')[3] == 'homeaccount' && 'onclick_header__home'}>
                            home
                        </Link>
                        <Link to="/nhaxe">nh?? xe</Link>
                        <Link to="/cartour">chuy???n xe</Link>
                        <Link to="/contact">Li??n h???</Link>
                        <Link to="/account">T??i kho???n</Link>
                        <Link
                            to="/admin"
                            className={window.location.href.split('/')[3] == 'admin' && 'onclick_header__Admin'}>
                            Admin
                        </Link>
                    </div>
                    <div className="homeAccount__right">
                        <div className={isMenuOpen ? 'homeAccount_imgtrans--hidden' : ''}>
                            <img
                                className="homeAccount__logoNation"
                                src={logoVN}
                                alt=""
                                onClick={() =>
                                    console.log(
                                        Object.keys(DataTour).filter(
                                            (maCX) =>
                                                (!SelectedDataRoute ||
                                                    DataTour[maCX]?.maLT === DataRoute[SelectedDataRoute]?.ma) &&
                                                (!dayTourSearch ||
                                                    DataTour[maCX]?.ngayDi === dayTourSearch.format('DD/MM/YYYY'))
                                        )
                                    )
                                }
                            />

                            <img
                                className="homeAccount__logoNation"
                                src={logoAnh}
                                alt=""
                                onClick={() => console.log(DataRoute[SelectedDataRoute]?.ma)}
                            />
                        </div>
                        <div className={isMenuOpen ? 'homeAccount_imgtrans--hidden' : ''}>
                            <Link to="/login" onClick={logoutOfApp} className="homeAccount__btnLogin">
                                ????ng xu???t
                            </Link>
                        </div>
                    </div>

                    <div className="homeAccount__menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <CloseIcon className="homeAccount__closeMenu" /> : <MenuIcon />}
                    </div>
                </div>
                <div className="homeAccount__info">
                    <div className="homeAccount__person">
                        <h4>{'Ch??o ' + user?.displayName}</h4>
                    </div>
                    <div className="homeAccount__right">
                        <div
                            style={{
                                texDecoration: 'none',
                                textTransform: 'uppercase',
                                color: 'black',
                                display: 'flex',
                                fontWeight: '500',
                                fontSize: '15px',
                                zIndex: '0',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                            onClick={handleOpenDieuPhoi}>
                            Y??u c???u ??i???u ph???i xe
                        </div>
                        <Link
                            to=""
                            onClick={
                                handleOpen
                                // handleTestFirebase
                            }>
                            {' '}
                            L???ch s???
                        </Link>
                        <Link to="/" className="logout">
                            tho??t
                            <LogoutIcon />
                        </Link>
                    </div>
                </div>
                <select
                    className="cars__choose choosetour"
                    defaultValue=""
                    label="Ch???n chuy???n"
                    onChange={handleSelectRoute}>
                    <option value="" disabled>
                        Ch???n chuy???n
                    </option>
                    <option value="">T???t c???</option>
                    {Object.keys(DataRoute).map((k) => {
                        const route = DataRoute[k];
                        return (
                            <option key={k} value={route.ma}>
                                {route.noiDi} - {route.noiDen}
                            </option>
                        );
                    })}
                </select>
                <br />
                <br />

                <DatePicker
                    classes={{
                        input: 'search__date'
                    }}
                    label="Ch???n ng??y ??i"
                    value={dayTourSearch}
                    onChange={(newValue) => {
                        // console.log(newValue.format('DD/MM/YYYY'));
                        setDayTourSearch(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
                <div className="homeAccount__cars">
                    {Object.keys(DataTour)
                        .filter(
                            (maCX) =>
                                (!SelectedDataRoute ||
                                    DataTour[maCX]?.maLT.toLowerCase() ===
                                        DataRoute[SelectedDataRoute]?.ma.toLowerCase()) &&
                                (!dayTourSearch || DataTour[maCX]?.ngayDi === dayTourSearch.format('DD/MM/YYYY'))
                        )
                        .map((maCX) => {
                            //
                            const car = DataCars[DataTour[maCX]?.maXe];
                            console.log('test macx', DataCars[DataTour[maCX]?.maXe]);
                            return (
                                <Cars
                                    key={maCX}
                                    imgSrc={
                                        car?.soLuongGhe < 28
                                            ? 'https://hyundaivn.com/library/module_new/hyundai-universe-40-giuong-g42-410_s1002.png'
                                            : 'http://dulichviet.com.vn/images/2012/11/thue-xe-isuzu-samco-35-cho-di-long-ho-vinh-long_du-lich-viet.jpg'
                                    }
                                    maXe={car?.maXe}
                                    bienSo={car?.bienSo}
                                    loaiXe={car?.loaiXe}
                                    soLuongGhe={car?.soLuongGhe}
                                    gia={car?.gia}
                                    // tour={DataTour[maCX]}
                                    tour={DataTour[maCX]}
                                    DataTicket={DataTicket.filter((ticket) => ticket.trangThai !== -1)}
                                    setReloadData={setReloadData}
                                    reloadData={reloadData}
                                    // typeCar={car.Name}
                                    // infoText={car.Desc}
                                    // bookCar4
                                />
                            );
                        })}
                    {/* <Cars
          imgSrc={Car4}
          typeCar='4 Gh???'
          infoText="Th??ch h???p di chuy???n c???p ????i , t???c ????? ????a kh??ch r???t nhanh"
          bookCar4
          
        />
        <Cars
          imgSrc={Car16}
          typeCar='16 Gh???'
          infoText="Th??ch h???p di chuy???n gia ????nh v???i s??? c?? ?????ng ti???n l???i"

        />
        <Cars
          imgSrc={Car32}
          typeCar='32 Gh???'
          infoText="Th??ch h???p di chuy???n c???p ????i , t???c ????? ????a kh??ch r???t nhanh"
          
        /> */}
                </div>

                {/* <Pagination count={10} color="primary" /> */}

                {/* connect */}

                <Footer />
                <Modal
                    // style={{ overflow: "scroll" ,maxHeight: "100vh"}}
                    classes={{
                        root: 'css-6z8jno'
                    }}
                    // hideBackdrop
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description">
                    <Box sx={{ width: 200 }}>
                        {}

                        {DataTicket.filter((ticket) => ticket.email === user?.email).map((ticket) => (
                            <div key={ticket.maVe} style={{ fontFamily: '"DejaVu Sans", "Arial", sans-serif' }}>
                                {/* <div >
                    <h2 style={{ color: "green" }} id="child-modal-title">M?? v??:  {ticket.maVe}</h2>
                    <p id="child-modal-description">
                      Ng??y ?????t:  {ticket.ngayDat}
                    </p>
                    <p id="child-modal-description">
                      Ng??y ??i: {DataTour[ticket.maCX]?.ngayDi}
                    </p>
                    <p id="child-modal-description">
                      M?? gh???:  {ticket.maGhe}
                    </p>
                    <p id="child-modal-description">
                      Gi?? ti???n: {DataTour[ticket.maCX]?.gia} VN??
                    </p>
                    <p id="child-modal-description">
                      Tr???ng th??i: {ticket.trangThai === 1 ? "???? ?????t" : "???? h???y"}
                    </p>
                  </div> */}
                                {/* D??ng ????? in */}
                                <div id={ticket.maVe}>
                                    <h2 style={{ color: 'green' }} id="child-modal-title">
                                        MA VE: {ticket.maVe}
                                    </h2>
                                    <p id="child-modal-description" onClick={() => console.log(ticket)}>
                                        Ma chuyen: {ticket.maCX}
                                    </p>
                                    <p id="child-modal-description" onClick={() => console.log(ticket)}>
                                        Email: {ticket.email}
                                    </p>
                                    <p id="child-modal-description" onClick={() => console.log(ticket)}>
                                        SDT: {ticket.sdt}
                                    </p>
                                    <p id="child-modal-description" onClick={() => console.log(ticket)}>
                                        Ngay dat: {ticket.ngayDat}
                                    </p>
                                    <p id="child-modal-description">Ngay di: {DataTour[ticket.maCX]?.ngayDi}</p>
                                    <p id="child-modal-description">Ma ghe: {ticket.maGhe}</p>
                                    <p id="child-modal-description">Gia tien: {DataTour[ticket.maCX]?.gia} VND</p>
                                    <p id="child-modal-description">
                                        Trang thai: {ticket.trangThai === 1 ? 'Da dat' : 'Da huy'}
                                    </p>
                                </div>
                                {ticket.trangThai !== -1 && (
                                    <button
                                        style={{ backgroundColor: '#faf21e', marginRight: '16px' }}
                                        onClick={() => exportPDF(ticket.maVe)}>
                                        In V??
                                    </button>
                                )}

                                {ticket.trangThai !== -1 && (
                                    <button
                                        style={{ backgroundColor: 'red', color: 'white', marginRight: '16px' }}
                                        onClick={removeTicket(ticket.id)}>
                                        H???y
                                    </button>
                                )}
                                <br />
                                {
                                    ticket.trangThai !== -1 && (
                                        <PayPal
                                            gia={DataTour[ticket.maCX]?.gia}
                                            note={`${DataTour[ticket.maCX]?.ngayDi}_${ticket.maGhe}_${ticket.maCX}`}
                                        />
                                    )
                                    //       (checkout ? (
                                    //         <PayPal />
                                    //       ) : (
                                    //         <button style={{ backgroundColor: "blue", color: 'white' }}
                                    //         onClick={() => {
                                    //           setCheckOut(true);
                                    //         }}>Thanh to??n PayPal</button>

                                    //   )
                                    // )
                                }
                                <br />
                            </div>
                        ))}

                        <Button onClick={handleClose}>????ng</Button>
                    </Box>
                </Modal>
                <Modal
                    style={{ height: '200px !important' }}
                    classes={{
                        root: 'css-6z8jno'
                    }}
                    // hideBackdrop
                    open={openDieuPhoi}
                    onClose={handleCloseDieuPhoi}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description">
                    <Box sx={{ width: 200 }}>
                        <div>
                            <div>Email:</div>
                            <Input readOnly={true} value={user?.email}></Input>
                        </div>
                        <div>
                            <div>Ch???n tuy???n:</div>
                            <select
                                className="cars__choose choosetour"
                                // showSearch
                                // placeholder="Chuy???n"
                                onChange={(e) => {
                                    setTextLoTrinh(e.target.value);
                                }}
                                // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                <option key={1} value="">
                                    Ch???n chuy???n
                                </option>

                                {DataRouteDieuPhoi?.map((k) => (
                                    <option key={k.ma} value={k.ma}>
                                        {k.noiDi} - {k.noiDen}
                                    </option>
                                ))}
                                {/* <option key={1} value='DakLak-SaiGon'>DakLak-SaiGon</option>
                <option key={2} value='SaiGon-DakLak'>SaiGon-DakLak</option> */}
                            </select>
                        </div>
                        <div>
                            <div style={{ marginBottom: '5px' }}>Ng??y ??i:</div>
                            <DatePicker
                                value={textNgayDi}
                                label="Ch???n ng??y ??i"
                                onChange={(newValue) => {
                                    // console.log(newValue.format('DD/MM/YYYY'));
                                    setTextNgayDi(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}></DatePicker>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                margin: '15px'
                            }}>
                            <Button variant="outlined" onClick={handleCloseDieuPhoi}>
                                ????ng
                            </Button>
                            <Button variant="contained" onClick={handleConfirmDieuPhoi}>
                                X??c nh???n
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </LocalizationProvider>
    );
}

export default HomeAccount;
