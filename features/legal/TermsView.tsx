import React from 'react';
import StaticPageLayout from '../../components/layout/StaticPageLayout';

const TermsView: React.FC = () => {
  return (
    <StaticPageLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the VeriClear application (the "Service") operated by us.
        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
      </p>
      <ul>
        <li>
          <h3>Accounts</h3>
          <p>
            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
        </li>
        <li>
          <h3>Intellectual Property</h3>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of VeriClear and its licensors.
          </p>
        </li>
        <li>
          <h3>Termination</h3>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </li>
      </ul>
    </StaticPageLayout>
  );
};

export default TermsView;