import React from 'react';
import StaticPageLayout from '../../components/layout/StaticPageLayout';

const CookiePolicyView: React.FC = () => {
  return (
    <StaticPageLayout title="Cookie Policy">
       <p>Last updated: {new Date().toLocaleDateString()}</p>
       <p>VeriClear ("us", "we", or "our") uses cookies on our application (the "Service"). By using the Service, you consent to the use of cookies.</p>
       
       <ol>
         <li>
           <h3>What are cookies</h3>
           <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
         </li>
         <li>
           <h3>How VeriClear uses cookies</h3>
           <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences.</p>
           <p>We use essential cookies to authenticate users and prevent fraudulent use of user accounts. We do not use advertising or tracking cookies.</p>
         </li>
       </ol>
    </StaticPageLayout>
  );
};

export default CookiePolicyView;