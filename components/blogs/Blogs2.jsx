"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useBlogs } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import styles from "./Blogs2.module.css";

function formatBlogDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blogs2() {
  const t = useTranslations("blog");
  const locale = useLocale();
  const { data, isLoading, isError, refetch } = useBlogs({
    limit: 100,
    sortBy: "publishedAt",
    sortOrder: "desc",
  });

  const blogs = data?.data ?? [];
  const isRtl = locale === "ar";

  if (isLoading) {
    return (
      <section className="section-blog-grid">
        <div className="tf-container">
          <div className={styles.loaderWrap}>
            <LocationLoader />
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-blog-grid">
        <div className="tf-container">
          <div className={styles.emptyWrap}>
            <p>{t("errorLoading") || "Failed to load blogs."}</p>
            <button type="button" className="tf-btn style-2" onClick={() => refetch()}>
              {t("retry") || "Retry"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="section-blog-grid">
        <div className="tf-container">
          <div className={styles.emptyWrap}>
            <p>{t("noBlogs") || "No blog posts yet. Check back soon."}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-blog-grid">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className={`grid-layout-3 ${styles.grid}`}>
              {blogs.map((blog) => {
                const title = isRtl && blog.title_ar ? blog.title_ar : blog.title;
                const excerpt = isRtl && blog.excerpt_ar ? blog.excerpt_ar : blog.excerpt;
                const tagLabel = isRtl && blog.tag_ar ? blog.tag_ar : blog.tag;
                const imageSrc = blog.imageSrc || "/images/section/blog-bg.jpg";
                const href = `/blog-details/${blog._id}`;

                return (
                  <div
                    key={blog._id}
                    className={`blog-article-item style-2 hover-img ${styles.card}`}
                    dir={isRtl ? "rtl" : "ltr"}
                  >
                    <div className="image-wrap">
                      <Link href={href} className={styles.imageLink}>
                        <Image
                          className="lazyload"
                          src={imageSrc}
                          alt={title || "Blog"}
                          width={400}
                          height={260}
                          unoptimized={imageSrc.startsWith("http")}
                        />
                      </Link>
                      {tagLabel && (
                        <div className="box-tag">
                          <span className="text-4 text_white fw-6">{tagLabel}</span>
                        </div>
                      )}
                    </div>
                    <div className="article-content">
                      <div className="time">
                        <i className="icon-clock" />
                        <p className="fw-5">{formatBlogDate(blog.publishedAt || blog.createdAt)}</p>
                      </div>
                      <h4 className="title">
                        <Link href={href} className="line-clamp-2">
                          {title || t("untitled") || "Untitled"}
                        </Link>
                      </h4>
                      {excerpt && (
                        <p className="description line-clamp-3">{excerpt}</p>
                      )}
                      <Link href={href} className="tf-btn-link">
                        <span>{t("readMore") || "Read More"}</span>
                        <i className="icon-circle-arrow" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
