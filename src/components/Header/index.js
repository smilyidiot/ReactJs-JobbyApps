import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {MdHome, MdWork} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      <div className="large-container">
        <ul className="large-list">
          <li className="list-item">
            <Link to="/" className="link">
              Home
            </Link>
          </li>
          <li className="list-item">
            <Link to="/jobs" className="link">
              Jobs
            </Link>
          </li>
        </ul>
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
      <ul className="small-list">
        <li className="small-list-item">
          <Link to="/" className="small-link">
            <MdHome className="icons" />
          </Link>
        </li>
        <li className="small-list-item">
          <Link to="/jobs" className="small-link">
            <MdWork className="icons" />
          </Link>
        </li>
        <li className="small-list-item">
          <button type="button" className="logout-icon" onClick={onLogout}>
            <FiLogOut className="icons" />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
