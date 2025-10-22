import React from 'react';
import StaticPageLayout from '../../components/layout/StaticPageLayout';

const AIEthicsView: React.FC = () => {
  return (
    <StaticPageLayout title="AI Ethics Statement">
      <p>At TEKGUYZ, we recognize that the power of Artificial Intelligence comes with a profound responsibility. We are committed to developing and deploying AI solutions that are not only innovative but also ethical, transparent, and beneficial to society. Our commitment to responsible AI is built on the following core principles:</p>
      
      <ol>
        <li>
          <h3>Fairness and Inclusivity</h3>
          <p>We strive to build AI systems that are fair and equitable. We are dedicated to identifying and mitigating harmful biases in our data and models to ensure our technology does not perpetuate societal inequities. Our solutions are designed to be accessible and beneficial to people from all backgrounds.</p>
        </li>
        <li>
          <h3>Transparency and Explainability</h3>
          <p>We believe in the importance of understanding how AI systems make decisions. We are committed to making our AI solutions as transparent as possible, providing clear explanations for their outputs and behaviors where feasible. This helps build trust and allows for meaningful human oversight.</p>
        </li>
        <li>
          <h3>Human Oversight</h3>
          <p>Every AI-generated insight and recommendation within VeriClear is subject to human review. The platform is a tool to assist auditors, providing them with data and suggestions to make more informed decisions. The ultimate authority and responsibility for any audit conclusion rests with the human user.</p>
        </li>
      </ol>
    </StaticPageLayout>
  );
};

export default AIEthicsView;