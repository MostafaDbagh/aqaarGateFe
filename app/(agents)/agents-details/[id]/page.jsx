import AgentDetails from "@/components/agents/AgentDetails";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import { notFound } from "next/navigation";
import React from "react";

// Disable static generation for dynamic routes to avoid build errors
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Helper function to validate ID format
// Accepts MongoDB ObjectId (24 hex) or other valid string IDs
function isValidId(id) {
  // Must be a non-empty string
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  // Accept any non-empty string (MongoDB ObjectId, UUID, or other formats)
  // The API will validate the actual format
  return id.trim().length > 0;
}

// Helper function to fetch agent from API
async function fetchAgent(id) {
  // Validate ID format first
  if (!id || !isValidId(id)) {
    return null; // Invalid ID format, return null to trigger 404
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/agents/${id}`, {
        next: { revalidate: 60 }, // Revalidate every minute
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      // If response is not ok (400, 404, 500, etc.), return null to trigger 404
      if (!response.ok) {
        return null; // Any error = agent not found = 404
      }

      // Try to parse response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not valid JSON, return null
        return null;
      }

      const agent = data?.data || data;
      
      // Check if agent exists and is not blocked
      if (!agent || agent.isBlocked === true) {
        return null;
      }

      // Check if agent has required fields (valid agent)
      if (!agent._id && !agent.id) {
        return null;
      }

      return agent;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      // If fetch fails (network error, timeout, abort, etc.), return null
      return null;
    }
  } catch (error) {
    // If anything else fails, return null to trigger 404
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const agent = await fetchAgent(id);
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
  const url = `${baseUrl}/agents-details/${id}`;
  
  const title = agent 
    ? `${agent.fullName || agent.username || 'Real Estate Agent'} - ${agent.companyName || agent.company || 'AqaarGate'} | AqaarGate`
    : "Agents Details || AqaarGate - Real Estate React Nextjs Template";
  
  const description = agent
    ? `Contact ${agent.fullName || agent.username || 'our real estate agent'} at ${agent.companyName || agent.company || 'AqaarGate'}. ${agent.description ? agent.description.substring(0, 120) + '...' : 'Expert real estate services in Syria and Lattakia.'}`
    : "AqaarGate - Real Estate React Nextjs Template";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AqaarGate Real Estate",
      locale: "en_US",
      images: [{ url: `${baseUrl}/images/logo/og.png`, width: 1200, height: 630, alt: "AqaarGate Real Estate", type: "image/png" }],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [`${baseUrl}/images/logo/og.png`],
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;

  // Fetch agent server-side to check if it exists
  const agent = await fetchAgent(id);

  // If agent doesn't exist or is blocked, return 404
  if (!agent) {
    notFound();
  }

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="page-content">
          <Breadcumb pageName="Agents Details" />
          <AgentDetails agentId={id} />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}
