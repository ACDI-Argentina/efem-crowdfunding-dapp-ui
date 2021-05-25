import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => (
  <div className="container-fluid page-layout dashboard-table-view">
    <div className="row">
      <div className="col-md-10 m-auto">
        <h1>Privacy Policy</h1>
        <p>
          <i>Last update: 25th of May 2021</i>
        </p>
        <h1>1. Personal data we process</h1>
        <p>Give4Forest only processes personal data regarding:</p>
        <ul>
          <li>Give4Forest users: professional contact data as necessary to use the dapp.</li>
          <li>
            Give4Forest blog and newsletter subscribers: particularly, we collect their email address, first
            and last name.
          </li>
          <li>
            Give4Forest contributors and donors: Give4Forest on request provides donation receipts to those
            individual and corporate donors that wish to contribute to realize the foundation’s
            mission. For this reason, all the data collected on the donor will be used to issue the
            donation receipt following our fund management policy.
          </li>
        </ul>
        <h1>2. Legal basis</h1>
        <p>Give4Forest processes personal data to the extent that at least one of the following applies:</p>
        <ol>
          <li>The Data Subject has given consent for one or more specific purposes.</li>
          <li>
            Processing is necessary for the performance of the Give4Forest dapp with the Data Subjects.
          </li>
          <li>Processing is necessary to comply with our legal obligations.</li>
        </ol>
        <h1>3. Disclosure to other recipients</h1>
        <p>
          Give4Forest does not share the personal data of the Data Subjects with any third party, other than
          to Give4Forest providers to the extent necessary to access the dapp or to competent authorities if
          required under a mandatory regulation or requirement.
        </p>
        <h1>4. Data retention period</h1>
        <p>
          Give4Forest only retains personal data for so long as necessary or to comply with a legal
          obligation.
        </p>
        <h1>5. Security</h1>
        <p>
          We implement appropriate and reasonable technical and organizational measures to ensure a
          level of security appropriate to the risk, including blockchain technology, to help
          protect information from unauthorized access, destruction, use, modification, or
          disclosure. However security is not guaranteed.
        </p>
        <h1>6. Data Subjects’ rights</h1>
        <p>
          Data Subjects can exercise their rights addressing their queries to Give4Forest (
          <a href="mailto:give4forest@acdi.org.ar">give4forest@acdi.org.ar</a>) were they can request access to
          and rectification of personal data or restriction of processing or to object to
          processing.
        </p>
        <h1>7. Cookies</h1>
        <p>
          Give4Forest collects information from running the Give4Forest Website (as described in our{' '}
          <Link to="/termsandconditions">Terms and Conditions</Link>) and uses information, provided
          to us by you. When you visit the Website, we collect information sent to us by your
          computer, mobile phone, or other access device. This information may include your IP
          address, device information including, but not limited to, identifier, name, and type,
          operating system, mobile network information and standard web log information, such as
          your browser type, and the pages you accessed on our Website. When you use a
          location-enabled device with our Website, we may collect geographical location data or use
          various means to determine the location, such as sensor data from your device that may,
          for instance, provide data on nearby cell towers and Wi-Fi access spots. However, we will
          not release your personally-identifying information to any third party without your
          consent, except as set forth herein.
        </p>
        <p>
          When you access the Website, we may place small data files called cookies on your computer
          or other device. We use these technologies to recognize you as our user; customize our
          Website; measure promotional effectiveness and collect information about your computer or
          other access device to mitigate risk, help prevent fraud, and promote trust and safety.
        </p>
        <p>
          In principle we do not, but we may store and process your personal information on our
          servers, where our facilities or our service providers are located. We protect your
          information using physical, technical, and administrative security measures to reduce the
          risks of loss, misuse, unauthorized access, disclosure, and alteration. Some of the
          safeguards we use are firewalls and data encryption, physical access controls to our data
          centers, and information access authorization controls.
        </p>
        <p>
          We also authorize access to personal information only for those employees who require it
          to fulfil their job responsibilities. All our physical, electronic, and procedural
          safeguards are designed to comply with applicable laws and regulations. Data may from time
          to time be stored also in other locations.
        </p>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
