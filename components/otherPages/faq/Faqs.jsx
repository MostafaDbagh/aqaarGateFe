import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Faqs() {
  return (
    <section className="section-faq">
      <div className="tf-container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <div className="heading-section mb-48">
              <h2 className="title">Frequently Asked Questions</h2>
            </div>
            <div className="tf-faq mb-49">
              <h3 className="fw-8 title mb-24">Overview</h3>
              <ul className="box-faq" id="wrapper-faq">
                <li className="faq-item active">
                  <a
                    href="#accordion-faq-one"
                    className="faq-header h6"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-one"
                  >
                    Why Choose Our Service?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-one"
                    className="collapse show"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      Discover a modern and elegant way to showcase real estate in Syria. Our platform is designed to present every property with clarity, sophistication, and professionalism, ensuring that all details about the property and its owner are easily accessible — no extra explanations needed.
                      <br /><br />
                      We do not act as intermediaries between buyers and sellers. Our role is simply to provide a trusted, transparent space where listings can be displayed beautifully and efficiently.
                      <br /><br />
                      Whether you're in Syria or living abroad, our platform makes it easy to browse, explore, and choose your future home from anywhere in the world. With a sleek design and user-friendly experience, finding your dream property has never been simpler.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-two"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-two"
                  >
                    How Secure Are Your Services?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-two"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      Your security is our top priority. We use advanced technologies to keep your data and account safe, including password encryption with bcrypt, JWT authentication, and protected APIs. Access to features and data is controlled through role-based permissions (for users and agents), and all communications occur over secure HTTPS connections. We also ensure secure token storage and transmission to maintain complete protection at every step.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-three"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-three"
                  >
                    Customer Support Service
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-three"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      We're here for you — anytime, anywhere. Our customer support team is available 24/7, ready to help with any inquiries or issues you may have. You can also reach us through our dedicated complaints email, and we'll make sure to respond within 24 hours.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion-faq-four"
                  >
                    How Can I Update My Account Information?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq"
                  >
                    <p className="faq-body">
                      Updating your account information is quick, simple, and secure. You can easily make any changes directly through your user dashboard, and no additional approval is required.
                      <br /><br />
                      If any major updates or changes occur, we'll make sure to notify you in advance via in-app notifications and email alerts, so you're always informed and up to date with your account details.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="tf-faq mb-49">
              <h3 className="fw-8 title mb-24">Costs and Payments</h3>
              <ul className="box-faq" id="wrapper-faq-2">
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-one"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-one"
                  >
                    How Do You Calculate Fees?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-one"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      Good news! Our platform is completely free for the first six months. If we introduce any fees in the future, we'll give you a full month's notice via email and our communication channels, so you'll always be informed in advance.
                    </p>
                  </div>
                </li>
                <li className="faq-item active">
                  <a
                    href="#accordion2-faq-two"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-two"
                  >
                    How Do I Pay My Invoices?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-two"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      You can pay your invoices via bank transfer through Al-Haram or any money transfer center. Once the payment is confirmed, your points will be added to your account. You can also pay using Sertel Cash or MTN Cash. This process is fast and usually takes no more than 3 hours.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-four"
                  >
                    Are There Any Hidden Fees Not Displayed In The Pricing
                    Table?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      No, there are no hidden fees on our platform. Everything is transparent and clearly displayed, which is one of the key standards we pride ourselves on. We do not take any commission between buyers and sellers—we simply provide a modern, professional platform to showcase properties and holiday homes. If any changes occur, all users will be notified at least one month in advance.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-five"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-five"
                  >
                    What Is The Refund Procedure?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-five"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      This feature will be available soon. We'll provide full details on how to request a refund once it's launched.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion2-faq-six"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion2-faq-six"
                  >
                    Is There Financial Or Accounting Support?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion2-faq-six"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-2"
                  >
                    <p className="faq-body">
                      Absolutely! Our dedicated financial support team is here to help. Rest assured, your funds and points are always safe and fully protected.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="tf-faq">
              <h3 className="fw-8 title mb-24">Safety and Security</h3>
              <ul className="box-faq" id="wrapper-faq-3">
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-one"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-one"
                  >
                    What Languages Does Your Service Support?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-one"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      Our service currently supports English, and Arabic will be available soon.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-three"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-three"
                  >
                    What Are The Safety Features Of Your System?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-three"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      Our platform implements comprehensive security protocols to protect users and data:
                      <br /><br />
                      <strong>JWT-Based Authentication:</strong> Secure and stateless user sessions.
                      <br /><br />
                      <strong>Encrypted Password Storage:</strong> Passwords stored using strong hashing algorithms.
                      <br /><br />
                      <strong>Authorized API Access:</strong> Protected API endpoints requiring valid tokens.
                      <br /><br />
                      <strong>Role-Based Access Control (RBAC):</strong> Fine-grained permissions for agents and regular users.
                      <br /><br />
                      <strong>HTTPS Data Transmission:</strong> All data transmitted securely over encrypted channels.
                      <br /><br />
                      <strong>Authorization Enforcement:</strong> Users can only access or modify their own resources.
                      <br /><br />
                      <strong>Secure Critical Operations:</strong> Sensitive actions like creating, updating, or deleting listings require verified authentication.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-four"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-four"
                  >
                    How Can I Request New Features?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-four"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      We love hearing from you! Whether it's a suggestion or constructive feedback, your ideas help us make the platform better. You can share your requests in any of these ways:
                      <br /><br />
                      <strong>Call Us:</strong> Reach us at the phone number listed on our Contact Us page.
                      <br /><br />
                      <strong>Email Us:</strong> Send your ideas to the email address on the same page.
                      <br /><br />
                      <strong>Submit a Form:</strong> Fill out the form on our website to send your feature request or suggestion directly.
                      <br /><br />
                      Your feedback matters, and we're always excited to bring new features to life based on what our users need!
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-five"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-five"
                  >
                    Is My Data Protected?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-five"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      Absolutely! Your data is safe with us. Passwords are securely hashed, all communications are encrypted, and only authorized users can access sensitive info. From personal details to property listings, we use multiple layers of security to keep your information private and protected.
                    </p>
                  </div>
                </li>
                <li className="faq-item">
                  <a
                    href="#accordion3-faq-six"
                    className="faq-header h6 collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    aria-controls="accordion3-faq-six"
                  >
                    Having Technical Issues?
                    <i className="icon-CaretDown" />
                  </a>
                  <div
                    id="accordion3-faq-six"
                    className="collapse"
                    data-bs-parent="#wrapper-faq-3"
                  >
                    <p className="faq-body">
                      Report it quickly via phone, email, or our website form, and our team will help you get back on track.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
  
        </div>
      </div>
    </section>
  );
}
