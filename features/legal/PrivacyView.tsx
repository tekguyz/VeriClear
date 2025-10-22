
import React from 'react';
import StaticPageLayout from '../../components/layout/StaticPageLayout';

const PrivacyView: React.FC = () => {
  return (
    <StaticPageLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
      </p>
      <h2>1. Information Collection and Use</h2>
      <p>
        We collect several different types of information for various purposes to provide and improve our Service to you. This may include, but is not limited to, email address, first name and last name, and usage data.
      </p>
      <h2>2. Data Use</h2>
      <p>
        VeriClear uses the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, to allow you to participate in interactive features of our Service when you choose to do so, and to provide customer care and support.
      </p>
      <h2>3. Security of Data</h2>
      <p>
        The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
      </p>
    </StaticPageLayout>
  );
};

export default PrivacyView;