import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Menu from '../header/Menu'
import HeaderHomeAccount from '../homeAccount/HeaderHomeAccount'

function Admin() {
  return (
    <div>        
   <Link to='/admin/user'>User</Link>
   </div>
  )
}

export default Admin