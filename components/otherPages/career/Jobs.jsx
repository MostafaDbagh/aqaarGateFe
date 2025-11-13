import React from "react";

export default function Jobs() {
  // Toggle this to show/hide job listings
  const showJobListings = false; // Set to true when you have jobs to display

  return (
    <section className="section-career tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            {/* Conditional rendering for header and content */}
            {showJobListings ? (
              <>
                <div className="heading-section text-center mb-48">
                  <h2
                    className="title wow animate__fadeInUp animate__animated"
                    data-wow-duration="1s"
                    data-wow-delay="0s"
                  >
                    Best Job For You At Proty
                  </h2>
                  <p
                    className="text-1 wow animate__fadeInUp animate__animated"
                    data-wow-duration="1s"
                    data-wow-delay="0s"
                  >
                    We connect you directly to the person that knows the most about
                    a property for sale, <br />
                    the listing agent.
                  </p>
                </div>
                <div className="tf-grid-layout-2 mb-48">
                  {careerData.map((item, index) => (
                    <div
                      key={index}
                      className={`career-item wow animate__${item.animation} animate__animated`}
                      data-wow-duration="1s"
                      data-wow-delay="0s"
                    >
                      <div className="content">
                        <h5 className="lh-28 name">{item.title}</h5>
                        <ul className="list-info">
                          <li className="text-4">
                            <i className="icon-bag" />
                            {item.department}
                          </li>
                          <li className="text-4">
                            <i className="icon-location" />
                            {item.location}
                          </li>
                          <li className="text-4">
                            <i className="icon-money" />
                            <span className="fw-7 text-color-primary">
                              {item.salary}
                            </span>
                            Month
                          </li>
                        </ul>
                      </div>
                      <a href="#" className="tf-btn style-border pd-10">
                        Apply now
                      </a>
                    </div>
                  ))}
                </div>
                <a href="#" className="tf-btn bg-color-primary fw-7 pd-16 mx-auto">
                  Load more
                </a>
              </>
            ) : (
              /* Career page placeholder with same design as original header */
              <div className="heading-section text-center mb-48">
                <h2
                  className="title wow animate__fadeInUp animate__animated"
                  data-wow-duration="1s"
                  data-wow-delay="0s"
                >
                  Join Our Growing Team at Proty
                </h2>
                <p
                  className="text-1 wow animate__fadeInUp animate__animated"
                  data-wow-duration="1s"
                  data-wow-delay="0s"
                >
                  We're building something amazing in real estate, and we're looking for talented individuals to join our journey. <br />
                  While we're not currently hiring, we're always excited to connect with potential future team members.
                </p>
                
                {/* Enhanced message with icons and styling */}
                <div className="mt-5">
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="career-info-box" style={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '40px',
                        border: '1px solid #e9ecef'
                      }}>
                        <div className="mb-4">
                          <i 
                            className="icon-bag" 
                            style={{ 
                              fontSize: '48px', 
                              color: '#ff6b35',
                              marginBottom: '20px',
                              display: 'block'
                            }} 
                          />
                        </div>
                        <h4 
                          className="mb-3"
                          style={{ 
                            color: '#333',
                            fontSize: '24px',
                            fontWeight: '600'
                          }}
                        >
                          No Open Positions Right Now
                        </h4>
                        <p 
                          className="mb-4"
                          style={{ 
                            fontSize: '16px',
                            color: '#666',
                            lineHeight: '1.6'
                          }}
                        >
                          We're focused on growing our platform and serving our clients better. 
                          Check back regularly as we expand our team with exciting opportunities 
                          in real estate, technology, and customer service.
                        </p>
                        <div 
                          className="mt-4"
                          style={{ 
                            fontSize: '14px',
                            color: '#999'
                          }}
                        >
                          <i className="icon-mail me-2" />
                          Want to be the first to know about new openings? 
                          <a href="/contact" className="text-color-primary ms-1">
                            Get in touch
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
