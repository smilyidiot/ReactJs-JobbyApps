import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn, MdWork} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import './index.css'

class JobDetails extends Component {
  state = {
    status: 'INITIAL',
    jobItemDetails: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      //   const {job_details} = data
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        companyWebsiteUrl: data.job_details.company_website_url,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,

        skills: data.job_details.skills.map(eachValue => ({
          imageUrl: eachValue.image_url,
          name: eachValue.name,
        })),

        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
      }

      //   const {similar_jobs} = data
      const similarJobs = data.similar_jobs.map(eachValue => ({
        companyLogoUrl: eachValue.company_logo_url,
        employmentType: eachValue.employment_type,
        id: eachValue.id,
        jobDescription: eachValue.job_description,
        location: eachValue.location,
        rating: eachValue.rating,
        title: eachValue.title,
      }))

      const jobItem = {jobDetail: jobDetails, similarJob: similarJobs}
      this.setState({jobItemDetails: jobItem, status: 'SUCCESS'})
    } else {
      this.setState({jobItemDetails: '', status: 'FAILURE'})
    }
  }

  getItemView = () => {
    const {status, jobItemDetails} = this.state
    switch (status) {
      case 'SUCCESS':
        if (jobItemDetails.length !== 0) {
          return this.successItemView()
        }
        return this.failureItemView()
      case 'FAILURE':
        return this.failureItemView()
      default:
        return this.loaderView()
    }
  }

  successItemView = () => {
    const {jobItemDetails} = this.state
    const {jobDetail, similarJob} = jobItemDetails
    const {skills, lifeAtCompany} = jobDetail

    return (
      <div className="success-container">
        <div className="top">
          <div className="icon-container">
            <img
              src={jobDetail.companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="role-container">
              <h1 className="role-names">{jobDetail.title}</h1>
              <div className="rating-container">
                <BsStarFill className="star-image" />
                <p className="rating">{jobDetail.rating}</p>
              </div>
            </div>
          </div>
          <div className="middle">
            <div className="location-container">
              <div className="icon-container">
                <MdLocationOn className="md-icon" />
                <p className="icon-name">{jobDetail.location}</p>
              </div>
              <div className="icon-container">
                <MdWork className="md-icon" />
                <p className="icon-name">{jobDetail.employmentType}</p>
              </div>
            </div>
            <p className="salary">{jobDetail.packagePerAnnum}</p>
          </div>
          <hr />
          <div className="desc-container">
            <h1 className="description-heading">Description</h1>
            <a href={jobDetail.companyWebsiteUrl} target="__blank">
              <p className="violet-text">
                Visit <BiLinkExternal className="visit" />
              </p>
            </a>
          </div>
          <p className="description-para">{jobDetail.jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">
            {skills.map(item => (
              <li className="skill-item" key={item.name}>
                <img
                  src={item.imageUrl}
                  className="skill-image"
                  alt={item.name}
                />
                <p className="skill-name">{item.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="life-at-company-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="life-at-company-description">
              {lifeAtCompany.description}
            </p>
            <img
              src={lifeAtCompany.imageUrl}
              className="life-at-company-image"
              alt="life at company"
            />
          </div>
        </div>
        <div className="bottom">
          <h1 className="similar-heading">Similar Jobs</h1>
          <ul className="similar-list">
            {similarJob.map(item => (
              <li className="similar-card" key={item.id}>
                <div className="icon-container">
                  <img
                    src={item.companyLogoUrl}
                    className="company-logo"
                    alt="similar job company logo"
                  />
                  <div className="role-container">
                    <h1 className="role">{item.title}</h1>
                    <div className="rating-container">
                      <BsStarFill className="star-image" />
                      <p className="rating">{item.rating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="description">Description</h1>
                <p className="description-para">{item.jobDescription}</p>
                <div className="job-middle-container">
                  <div className="location-holder">
                    <div className="icon-container">
                      <MdLocationOn className="md-icons" />
                      <p className="icon-names">{item.location}</p>
                    </div>
                    <div className="icon-container">
                      <MdWork className="md-icons" />
                      <p className="icon-names">{item.employmentType}</p>
                    </div>
                  </div>
                  <p className="salary">{item.packagePerAnnum}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  failureItemView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.tryAgain}>
        Retry
      </button>
    </div>
  )

  tryAgain = () => {
    this.setState({status: 'INITIAL'}, this.getJobItemDetails)
  }

  loaderView = () => (
    <div className="loader-container">
      <div className="loader" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  render() {
    return (
      <div className="main-container">
        <Header />
        {this.getItemView()}
      </div>
    )
  }
}

export default JobDetails
