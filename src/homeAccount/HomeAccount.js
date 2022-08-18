import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import logoVN from '../images/vn.webp'
import logoAnh from '../images/anh.webp'
import Car4 from '../images/4cho.png'
import Car16 from '../images/16cho.png'
import Car32 from '../images/xe32cho.png'



import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import LogoutIcon from '@material-ui/icons/ExitToApp'

import './HomeAccount.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../features/userSlice'
import { setCars, selectCars } from '../features/carsSlice'
import Cars from './Cars'
import { auth } from '../firebase'
import SelectTextFields from './SelectTextFields'
import { Pagination } from '@mui/material'
import Footer from '../footer/Footer'
//DB
import { db } from '../firebase'
import { collection, getDocs, updateDoc } from 'firebase/firestore'
import { selectCartour, setCartour } from '../features/cartourSlice'
import { setticket } from '../features/ticketSlice'

import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { doc, onSnapshot, query, where } from "firebase/firestore";
function HomeAccount({ isMenuOpen, setIsMenuOpen, }) {

  const user = useSelector(selectUser)
  const cars = useSelector(selectCars)
  const tours = useSelector(selectCartour)

  const [reloadData, setReloadData] = React.useState(false);

  const [dayTourSearch, setDayTourSearch] = React.useState(null);


  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [DataCars, setDataCars] = useState({});
  const [DataRoute, setDataRoute] = useState({});

  const [DataTour, setDataTour] = useState({});
  const [SelectedDataRoute, setSelectedDataRoute] = useState("");


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //get cars
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
        setDataCars(_cars.reduce((obj, t) => ({
          ...obj,
          [t.maXe]: t
        }), {}));

        setError(null);

      } catch (err) {
        setError(err.message);
        setDataCars({});
      } finally {
        setLoading(false);
      }
    }

    getDataCars()
  }, [reloadData])


  //get tour
  useEffect(() => {
    const getDataTour = async () => {
      try {
        let _tour = await getDocs(collection(db, 'tour'))
        _tour = _tour.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('tour', _tour)
        dispatch(setCartour(_tour))
        setDataTour(_tour.reduce((obj, t) => ({
          ...obj,
          [t.maCX]: t
        }), {}));

        setError(null);
      } catch (err) {
        setError(err.message);
        setDataTour({});
      } finally {
        setLoading(false);
      }
    }
    getDataTour()
  }, [reloadData])


  //get lộ trình
  useEffect(() => {
    const getDataRoute = async () => {
      try {
        let _route = await getDocs(collection(db, 'route'))
        _route = _route.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('route', _route)
        //  dispatch(setDataRoute(_route))
        setDataRoute(_route.reduce((obj, t) => ({
          ...obj,
          [t.ma]: t
        }), {}));

        setError(null);
      } catch (err) {
        setError(err.message);
        setDataRoute({});
      } finally {
        setLoading(false);
      }
    }
    getDataRoute()
  }, [])

  const logoutOfApp = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(logout())
        navigate('/')
      })
      .catch((error) => alert(error.message))
  }

  const handleSelectRoute = e => {
    setSelectedDataRoute(e.target.value)
  }

  // Get ticket API
  const [DataTicket, setDataTicket] = React.useState([]);
  //get Ticket
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    const getDataTicket = async () => {
      try {

        let _ticket = await getDocs(collection(db, 'ticket'))
        _ticket = _ticket.docs.map(t => ({
          ...t.data(),
          id: t.id
        }))
        console.log('ticket', _ticket)

        dispatch(setticket(_ticket))
        setDataTicket(_ticket);
        setError(null);
      } catch (err) {
        setError(err.message);
        setDataTicket([]);
      } finally {
        setLoading(false);
      }
    }
    getDataTicket()
  }, [reloadData, open])

  //Lịch sử ticket


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
      .then(() => toast.success('Hủy vé thành công!'))
      .catch(err => toast.error(err))
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <div className="homeAccount">
        {/* phonenumber */}


        <div className="homeAccount__header">
          <div className="homeAccount__logo">
            <Link to='/'>
              <img className='homeAccount__logoImg'
                src={logo}
                alt=''
              />
            </Link>
          </div>
          <div className='homeAccount__links'>
            <Link to='/homeaccount' className={window.location.href.split('/')[3] == 'homeaccount' && 'onclick_header__home'}>home</Link>
            <Link to='/nhaxe'>nhà xe</Link>
            <Link to='/cartour'>chuyến xe</Link>
            <Link to='/contact'>Liên hệ</Link>
            <Link to='/account'>Tài khoản</Link>
            <Link to='/admin' className={window.location.href.split('/')[3] == 'admin' && 'onclick_header__Admin'}>Admin</Link>
          </div>
          <div className='homeAccount__right'>

            <div className={isMenuOpen ? 'homeAccount_imgtrans--hidden' : ""}>
              <img className='homeAccount__logoNation'
                src={logoVN}
                alt=''
                onClick={() => console.log(Object.keys(DataTour).filter(maCX =>
                  (!SelectedDataRoute || DataTour[maCX]?.maLT === DataRoute[SelectedDataRoute]?.ma) &&
                  (!dayTourSearch || DataTour[maCX]?.ngayDi === dayTourSearch.format('DD/MM/YYYY'))
                ))}
              />

              <img className='homeAccount__logoNation'
                src={logoAnh}
                alt='' onClick={() => console.log(DataRoute[SelectedDataRoute]?.ma)} />
            </div>
            <div className={isMenuOpen ? 'homeAccount_imgtrans--hidden' : ""}>
              <Link to='/login' onClick={logoutOfApp}
                className='homeAccount__btnLogin'>Đăng xuất</Link>
            </div>
          </div>

          <div
            className='homeAccount__menu'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <CloseIcon className='homeAccount__closeMenu' /> : <MenuIcon />}
          </div>

        </div>
        <div className="homeAccount__info">
          <div className="homeAccount__person">
            <h4>{"Chào " + user?.displayName}</h4>
          </div>
          <div className="homeAccount__right">
            <div style={{
              texDecoration: 'none',
              textTransform: 'uppercase',
              color: 'black',
              display: 'flex',
              fontWeight: '500',
              fontSize: '15px',
              zIndex: '0',
              position: 'relative'
            }}>Yêu cầu điều phối xe</div>
            <Link to='' onClick={
              handleOpen
              // handleTestFirebase
            }> Lịch sử</Link>
            <Link to='/' className='logout'>
              thoát
              <LogoutIcon />
            </Link>
          </div>
        </div>
        <select className="cars__choose choosetour" defaultValue="" label="Chọn chuyến" onChange={handleSelectRoute}>
          <option value="" disabled >Chọn chuyến</option>
          <option value=""  >Tất cả</option>
          {Object.keys(DataRoute).map(k => {
            const route = DataRoute[k];
            return (
              <option key={k} value={route.ma}>{route.noiDi} - {route.noiDen}</option>
            )
          })}


        </select>
        <br />
        <br />

        <DatePicker

          classes={{
            input: 'search__date'
          }}
          label="Chọn ngày đi"
          value={dayTourSearch}
          onChange={(newValue) => {
            // console.log(newValue.format('DD/MM/YYYY'));
            setDayTourSearch(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        <div className="homeAccount__cars">
          {Object.keys(DataTour).filter(maCX =>
            (!SelectedDataRoute || DataTour[maCX]?.maLT.toLowerCase() === DataRoute[SelectedDataRoute]?.ma.toLowerCase()) &&
            (!dayTourSearch || DataTour[maCX]?.ngayDi === dayTourSearch.format('DD/MM/YYYY'))
          ).map(maCX => {// 
            const car = DataCars[DataTour[maCX]?.maXe]
            console.log("test macx", DataCars[DataTour[maCX]?.maXe])
            return (
              <Cars
                key={maCX}

                imgSrc={car?.soLuongGhe < 28 ? "https://hyundaivn.com/library/module_new/hyundai-universe-40-giuong-g42-410_s1002.png" : "http://dulichviet.com.vn/images/2012/11/thue-xe-isuzu-samco-35-cho-di-long-ho-vinh-long_du-lich-viet.jpg"}
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
            )
          })}
          {/* <Cars
          imgSrc={Car4}
          typeCar='4 Ghế'
          infoText="Thích hợp di chuyển cặp đôi , tốc độ đưa khách rất nhanh"
          bookCar4
          
        />
        <Cars
          imgSrc={Car16}
          typeCar='16 Ghế'
          infoText="Thích hợp di chuyển gia đình với sự cơ động tiện lợi"

        />
        <Cars
          imgSrc={Car32}
          typeCar='32 Ghế'
          infoText="Thích hợp di chuyển cặp đôi , tốc độ đưa khách rất nhanh"
          
        /> */}
        </div>


        {/* <Pagination count={10} color="primary" /> */}





        {/* connect */}

        <Footer />
        <Modal
          // style={{ overflow: "scroll" ,maxHeight: "100vh"}}
          classes={{
            root: "css-6z8jno"
          }}
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ width: 200 }}>
            {

            }

            {
              DataTicket.filter((ticket) => ticket.email === user?.email).map(ticket =>
                <div key={ticket.maVe}>
                  <h2 id="child-modal-title">Mã vé:  {ticket.maVe}</h2>
                  <p id="child-modal-description">
                    Ngày đặt:  {ticket.ngayDat}
                  </p>
                  <p id="child-modal-description">
                    Ngày đi: {DataTour[ticket.maCX]?.ngayDi}
                  </p>
                  <p id="child-modal-description">
                    Mã ghế:  {ticket.maGhe}
                  </p>
                  <p id="child-modal-description">
                    Giá tiền: {DataTour[ticket.maCX]?.gia} VNĐ
                  </p>
                  <p id="child-modal-description">
                    Trạng thái: {ticket.trangThai === 1 ? "Đã đặt" : "Đã hủy"}
                  </p>
                  {ticket.trangThai !== -1 && <button style={{ backgroundColor: "red" }} onClick={removeTicket(ticket.id)}>Hủy</button>}

                  <br />
                </div>

              )
            }


            <Button onClick={handleClose}>Đóng</Button>

          </Box>
        </Modal>

      </div>
    </LocalizationProvider >
  )
}

export default HomeAccount