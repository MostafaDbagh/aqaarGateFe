"use client";
import React from "react";
import DropdownSelect from "../common/DropdownSelect";

export default function Contact() {
  return (
    <>
      <style jsx>{`
        .contact-image-section {
          position: relative;
          min-height: 500px;
        }
        
        .contact-background-image {
          background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/cities/c1.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 100%;
          height: 710px;
          position: relative;
        }
        
        .contact-background-image::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2));
          z-index: 1;
        }
        
        .image-wrap {
          background-image: url('/images/cities/c2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        @media (max-width: 768px) {
          .contact-image-section {
            min-height: 300px;
          }
          
          .contact-background-image {
            min-height: 300px;
          }
        }
      `}</style>
    <section className="section-top-map style-2">
      <div className="wrap-map">
        <div className="row-height contact-image-section">
          <div className="contact-background-image"></div>
        </div>
      </div>
      <div className="box">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <form
                id="contactform"
                onSubmit={(e) => e.preventDefault()}
                className="form-contact"
              >
                <div className="heading-section">
                  <h2 className="title">We Would Love to Hear From You</h2>
                  <p className="text-1">
                    We'll get to know you to understand your selling goals,
                    explain the selling process so you know what to expect.
                  </p>
                </div>
                <div className="cols">
                  <fieldset>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your name"
                      name="name"
                      id="name"
                      required
                    />
                  </fieldset>
                  <fieldset>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      id="email-contact"
                      required
                    />
                  </fieldset>
                </div>
                <div className="cols">
                  <fieldset className="phone">
                    <label htmlFor="phone">Phone number:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your phone number"
                      name="phone"
                      id="phone"
                      required
                    />
                  </fieldset>
                  <div className="select">
                    <label className="text-1 fw-6 mb-12">
                      What are you interested in?
                    </label>

                    <DropdownSelect
                      options={["Select", "Location", "Rent", "Sale"]}
                      addtionalParentClass=""
                    />
                  </div>
                </div>
                <fieldset>
                  <label htmlFor="message">Your Message:</label>
                  <textarea
                    name="message"
                    cols={30}
                    rows={10}
                    placeholder="Message"
                    id="message"
                    required
                    defaultValue={""}
                  />
                </fieldset>
                <div className="send-wrap">
                  <button
                    className="tf-btn bg-color-primary fw-7 pd-8"
                    type="submit"
                  >
                    Contact our experts
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
