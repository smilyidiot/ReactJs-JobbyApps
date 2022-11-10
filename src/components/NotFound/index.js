import Header from '../Header'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <Header />
    <div className="content">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        className="image"
        alt="not found"
      />
      <h1 className="heading">Page Not Found</h1>
      <p className="para">
        we’re sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFound
