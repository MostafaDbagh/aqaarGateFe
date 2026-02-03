"use client";

import React, { useState, useEffect } from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import Header1 from "@/components/headers/Header1";
import Footer1 from "@/components/footers/Footer1";
import Cta from "@/components/common/Cta";
import Breadcumb from "@/components/common/Breadcumb";
import { useTranslations } from 'next-intl';

function getApiUrl() {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:5500/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://aqaargatebe2.onrender.com/api';
}

export default function BlogDetailClient({ id }) {
  const t = useTranslations('blog');
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchBlog() {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`${getApiUrl()}/blog/${id}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (cancelled) return;
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        const blogData = data?.data || data;
        setBlog(blogData);
      } catch (err) {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchBlog();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div id="wrapper">
        <Header1 />
        <div className="main-content" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-muted">{t('loading') || 'Loading...'}</p>
        </div>
        <Footer1 />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div id="wrapper">
        <Header1 />
        <div className="main-content" style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <h2 className="mb-3">{t('notFound') || 'Blog post not found'}</h2>
          <Link href="/blog-grid" className="tf-btn style-2">
            {t('backToBlog') || 'Back to Blog'}
          </Link>
        </div>
        <Footer1 />
      </div>
    );
  }

  const imageSrc = blog.imageSrc || '/images/section/blog-bg.jpg';
  const imageUrl = imageSrc.startsWith('http') ? imageSrc : imageSrc;

  return (
    <div id="wrapper">
      <Header1 />
      <div className="main-content">
        <Breadcumb pageName={blog.title} />
        <section className="section-blog-details tf-spacing-1">
          <div className="tf-container">
            <div className="row">
              <div className="col-12">
                <article className="blog-article-item">
                  <div className="image-wrap mb-4">
                    <Image
                      src={imageUrl}
                      alt={blog.title || 'Blog image'}
                      width={1200}
                      height={630}
                      className="w-100"
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                      unoptimized={imageUrl.startsWith('http')}
                    />
                    {blog.tag && (
                      <div className="box-tag mt-3">
                        <span className="tag-item text-4 text_white fw-6">{blog.tag}</span>
                      </div>
                    )}
                  </div>
                  <div className="article-content">
                    <h1 className="title mb-4">{blog.title}</h1>
                    {blog.author?.name && (
                      <p className="text-muted mb-3">
                        {t('by') || 'By'} {blog.author.name}
                        {blog.publishedAt && (
                          <span className="ms-2">
                            • {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    )}
                    {blog.excerpt && (
                      <p className="text-1 mb-4 fw-5">{blog.excerpt}</p>
                    )}
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: blog.content || '' }}
                      style={{ lineHeight: 1.8 }}
                    />
                  </div>
                </article>
                <div className="mt-5">
                  <Link href="/blog-grid" className="tf-btn style-border pd-10">
                    ← {t('backToBlog') || 'Back to Blog'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Cta />
      </div>
      <Footer1 />
    </div>
  );
}
