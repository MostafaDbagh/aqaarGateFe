import BlogDetailClient from "@/components/blogs/BlogDetailClient";
import { getTranslations } from 'next-intl/server';
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aqaargate.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5500/api' : 'https://aqaargatebe2.onrender.com/api');

export async function generateMetadata({ params }) {
  const { id, locale } = await params;
  const url = `${baseUrl}/${locale}/blog-details/${id}`;

  try {
    const res = await fetch(`${apiUrl}/blog/${id}`, {
      next: { revalidate: 3600 },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return {
        title: 'Blog Post | AqaarGate Real Estate',
        alternates: { canonical: url },
      };
    }
    const blog = await res.json();
    const data = blog?.data || blog;
    const title = data?.seo?.metaTitle || data?.title || 'Blog Post';
    const description = data?.seo?.metaDescription || data?.excerpt || data?.content?.substring(0, 160) || 'Syria and Lattakia real estate blog.';
    const imageSrc = data?.imageSrc || '/images/section/blog-bg.jpg';
    const imageUrl = imageSrc.startsWith('http') ? imageSrc : `${baseUrl}${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`;

    return {
      title: `${title} | AqaarGate`,
      description,
      keywords: data?.seo?.keywords || ['syria real estate', 'lattakia real estate', 'property blog'],
      alternates: { canonical: url },
      openGraph: {
        title: `${title} | AqaarGate`,
        description,
        url,
        type: 'article',
        images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | AqaarGate`,
        description,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: 'Blog Post | AqaarGate Real Estate',
      alternates: { canonical: url },
    };
  }
}

export default async function page({ params }) {
  const { id } = await params;
  const t = await getTranslations('blog');

  return <BlogDetailClient id={id} />;
}
