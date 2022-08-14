import React from 'react'
import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Menu from '../header/Menu'
import HeaderHomeAccount from '../homeAccount/HeaderHomeAccount'
import Nhaxe from '../homeAccount/Nhaxe'

function Admin() {
  return (
    <div>
      <Routes>
        <Route path="user" element={<Nhaxe />}></Route>
      </Routes>
      <Link to='/admin/user'>User</Link>
    </div>
  )
}

export default Admin