import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import {BsSearch, BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'

import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    status: 'IN_PROGRESS',
    profileData: {},
    jobData: {},

    checkboxArray: [],
    searchInput: '',
    radioValue: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      const newData = {
        name: data.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({profileData: newData})
    }
  }

  getJobDetails = async () => {
    const {checkboxArray, searchInput, radioValue} = this.state

    const checkboxInput =
      checkboxArray.length !== 0 ? checkboxArray.join(',') : ''

    const token = Cookies.get('jwt_token')
    const jobDetailsUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInput}&minimum_package=${radioValue}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(jobDetailsUrl, options)
    const data = await response.json()

    console.log('jobDetails', data)
    if (response.ok) {
      // company_logo_url: "https://assets.ccbp.in/frontend/react-js/jobby-app/netflix-img.png"
      // employment_type: "Internship"
      // id: "bb95e51b-b1b2-4d97-bee4-1d5ec2b96751"
      // job_description: "We are looking for a DevOps Engineer with a minimum of 5 years of industry experience, preferably working in the financial IT community. The position in the team is focused on delivering exceptional services to both BU and Dev partners to minimize/avoid any production outages. The role will focus on production support."
      // location: "Delhi"
      // package_per_annum: "10 LPA"
      // rating: 4
      // title: "Devops Engineer"
      const {jobs} = data
      const newDetails = jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({status: 'SUCCESS', jobData: newDetails})
    } else {
      this.setState({status: 'FAILURE', jobData: ''})
    }
  }

  successProfileView = () => {
    const {profileData, searchInput} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div>
        <div className="small-searchbar">
          <input
            type="search"
            className="search-bar"
            value={searchInput}
            placeholder="Search"
            onChange={this.onSearch}
            onKeyDown={this.searchKeyDown}
          />
          <button
            type="button"
            testid="searchButton"
            className="search-button"
            onClick={this.getJobDetails}
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
        <div className="success-profile">
          <img src={profileImageUrl} className="profile-image" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
      </div>
    )
  }

  onSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  searchKeyDown = event => {
    if (event === 'Enter') {
      this.getJobDetails()
    }
  }

  failureProfileView = () => (
    <div className="failure-container">
      <button
        className="failure-retry-button"
        type="button"
        onClick={this.retry}
      >
        Retry
      </button>
    </div>
  )

  retry = () => this.getProfileDetails()

  checkboxEvent = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          checkboxArray: [...prevState.checkboxArray, event.target.value],
        }),
        this.getJobDetails,
      )
    } else {
      this.setState(
        prevState => ({
          checkboxArray: prevState.checkboxArray.filter(
            eachItem => eachItem !== event.target.value,
          ),
        }),
        this.getJobDetails,
      )
    }
  }

  radioEvent = event => {
    if (event.target.checked) {
      this.setState({radioValue: event.target.value}, this.getJobDetails)
    }
  }

  getJobView = () => {
    const {status, jobData} = this.state
    switch (status) {
      case 'SUCCESS':
        if (jobData.length !== 0) {
          return this.successJobView()
        }
        return this.noJobView()
      case 'FAILURE':
        return this.failureJobView()
      default:
        return this.loaderView()
    }
  }

  successJobView = () => {
    const {jobData} = this.state
    return (
      <ul className="job-success-container">
        {jobData.map(each => (
          <li className="job-item" key={each.id}>
            <Link to={`/jobs/${each.id}`} className="link">
              <div className="icon-container">
                <img
                  src={each.companyLogoUrl}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="role-container">
                  <h1 className="role">{each.title}</h1>
                  <div className="rating-container">
                    <BsStarFill className="star-image" />
                    <p className="rating">{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="middle-container">
                <div className="location-container">
                  <div className="icon-container">
                    <MdLocationOn />
                    <p className="icon-name">{each.location}</p>
                  </div>
                  <div className="icon-container">
                    <MdWork />
                    <p className="icon-name">{each.employmentType}</p>
                  </div>
                </div>
                <p className="salary">{each.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="description">Description</h1>
              <p className="description-para">{each.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  noJobView = () => (
    <div className="no-job-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-job-image"
        alt="no jobs"
      />
      <h1 className="no-job-heading">No Jobs Found</h1>
      <p className="no-job-description">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  failureJobView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for{' '}
      </p>
      <button
        type="button"
        className="failure-retry-button"
        onClick={this.tryAgain}
      >
        Retry
      </button>
    </div>
  )

  tryAgain = () => {
    this.setState({status: 'INITIAL'}, this.getJobDetails)
  }

  loaderView = () => (
    <div className="full-loader-container">
      <div className="loader-container" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  render() {
    const {profileData, searchInput} = this.state
    return (
      <div className="main-container">
        <Header />
        <div className="jobs-container">
          <div className="filter-container">
            {profileData !== null
              ? this.successProfileView()
              : this.failureProfileView()}
            <hr />
            <h1 className="filter-name">Type of Employment</h1>
            <ul className="checkbox-filter-list">
              {employmentTypesList.map(each => (
                <li className="checkbox-holder" key={each.label}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.checkboxEvent}
                  />
                  <label htmlFor={each.employmentTypeId} className="label">
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
            <hr />
            <h1 className="filter-name">Salary Range</h1>
            <ul className="radio-filter-list">
              {salaryRangesList.map(item => (
                <li className="radio-holder" key={item.label}>
                  <input
                    type="radio"
                    className="radio"
                    id={item.salaryRangeId}
                    value={item.salaryRangeId}
                    name="salary-radio"
                    onChange={this.radioEvent}
                  />
                  <label htmlFor={item.salaryRangeId} className="label">
                    {item.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="job-view-container">
            <div className="large-searchbar">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onSearch}
                onKeyDown={this.getJobDetails}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.getJobDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getJobView()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
