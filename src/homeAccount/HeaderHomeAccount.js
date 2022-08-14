import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import logoVN from '../images/vn.webp'
import logoAnh from '../images/anh.webp'

import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import LogoutIcon from '@material-ui/icons/ExitToApp'

import './HomeAccount.css'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '../features/userSlice'
import Cars from './Cars'
import { auth } from '../firebase'
import SelectTextFields from './SelectTextFields'



function HeaderHomeAccount({isMenuOpen,setIsMenuOpen}) {
    const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const logoutOfApp = () => {
    auth
      .signOut()
      .then(() => {
        dispatch(logout())
        navigate('/')
      })
      .catch((error) => alert(error.message))
  }
  return (
    <div className="homeAccount__header">
            <div className="homeAccount__logo">
            <Link to='/homeaccount'>
                <img className='homeAccount__logoImg' 
                     src={logo}
                     alt=''
                />
            </Link>
            </div>
            <div className='homeAccount__links'>
            <Link to='/homeaccount'>home</Link>
            <Link to='/nhaxe'className={window.location.href.split('/')[3]=='nhaxe'&&'onclick_header__nhaxe'}>nhà xe</Link>
            <Link to='/cartour'className={window.location.href.split('/')[3]=='cartour'&&'onclick_header__chuyenxe'}>chuyến xe</Link>
            <Link to='/contact'className={window.location.href.split('/')[3]=='contact'&&'onclick_header__lienhe'}>Liên hệ</Link>
            <Link to='/account'className={window.location.href.split('/')[3]=='account'&&'onclick_header__taikhoan'}>Tài khoản</Link>
            <Link to='/admin'className={window.location.href.split('/')[3]=='admin'&&'onclick_header__Admin'}>Admin</Link>
            </div>
            <div className='homeAccount__right'>
            
            <div className={isMenuOpen?'homeAccount_imgtrans--hidden':""}> 
                <img className='homeAccount__logoNation' 
                     src={logoVN}
                     alt=''/>
            
                <img className='homeAccount__logoNation' 
                     src={logoAnh}
                     alt=''onClick={()=> console.log('a')}/>
            </div>
            <div className={isMenuOpen ? 'homeAccount_imgtrans--hidden':""}>
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
  )
}

export default HeaderHomeAccount