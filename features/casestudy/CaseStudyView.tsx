
import React from 'react';
// Fix: Use namespace import for react-router-dom to resolve export issues.
import * as ReactRouterDOM from 'react-router-dom';
import StaticPageLayout from '../../components/layout/StaticPageLayout';

const CaseStudyView: React.FC = () => {
  const { useParams, Link } = ReactRouterDOM;
  const { slug } = useParams();

  // In a real app, you would fetch data based on the slug.
  const caseStudyData = {
    title: "Case Study: Improving Compliance by 25%",
    content: `
      <p>A leading financial services firm integrated VeriClear into their quality assurance workflow. By leveraging real-time agent assistance and comprehensive batch analysis, they were able to identify and rectify compliance gaps proactively.</p>
      <h2>The Challenge</h2>
      <p>The firm was struggling with inconsistent script adherence and a high rate of non-compliant calls, leading to potential regulatory risks. Their manual audit process was slow and could only cover a small fraction of total calls.</p>
      <h2>The Solution</h2>
      <p>VeriClear's Live Call Analysis provided immediate feedback to agents, while the Batch Analysis tool allowed auditors to process thousands of calls overnight. The AI-powered function calling helped agents access correct information instantly, reducing errors.</p>
      <h2>The Results</h2>
      <ul>
        <li>A <strong>25% increase</strong> in overall compliance rates within the first quarter.</li>
        <li>A <strong>40% reduction</strong> in critical compliance failures.</li>
        <li>A <strong>15-point increase</strong> in average agent performance scores.</li>
      </ul>
    `
  };

  return (
    <StaticPageLayout title={caseStudyData.title}>
      <div dangerouslySetInnerHTML={{ __html: caseStudyData.content }} />
      <p className="mt-8">Current slug: <strong>{slug}</strong></p>
      <Link to="/" className="mt-8 inline-block">← Back to Home</Link>
    </StaticPageLayout>
  );
};

export default CaseStudyView;
