"use client";
import React, { useState } from "react";
import { useAdminBlogs, useBlogMutations } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import Toast from "@/components/common/Toast";
import styles from "./AdminBlogs.module.css";

const TAG_OPTIONS = [
  "Real Estate",
  "News",
  "Investment",
  "Market Updates",
  "Buying Tips",
  "Interior Inspiration",
  "Investment Insights",
  "Home Construction",
  "Legal Guidance",
  "Community Spotlight"
];

const CATEGORY_OPTIONS = ["Property", "Market", "Investment", "Tips", "News", "Legal"];

const initialFormState = {
  title: "",
  title_ar: "",
  content: "",
  content_ar: "",
  excerpt: "",
  excerpt_ar: "",
  imageSrc: "",
  tag: "",
  tag_ar: "",
  category: "",
  category_ar: "",
  author: {
    name: "Admin",
    name_ar: "",
    email: ""
  },
  seo: {
    metaTitle: "",
    metaTitle_ar: "",
    metaDescription: "",
    metaDescription_ar: ""
  },
  status: "draft",
  featured: false
};

function BlogFormFields({ formData, setFormData, styles: formStyles }) {
  const setAuthor = (key, value) => {
    setFormData((p) => ({
      ...p,
      author: { ...p.author, [key]: value }
    }));
  };
  const setSeo = (key, value) => {
    setFormData((p) => ({
      ...p,
      seo: { ...(p.seo || {}), [key]: value }
    }));
  };

  return (
    <>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Title (EN) *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="Blog title in English"
            maxLength={200}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label>Title (AR)</label>
          <input
            type="text"
            value={formData.title_ar}
            onChange={(e) => setFormData((p) => ({ ...p, title_ar: e.target.value }))}
            placeholder="العنوان بالعربية"
            dir="rtl"
            maxLength={200}
          />
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label>Content (EN) *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
          placeholder="Blog content in English..."
          rows={5}
        />
      </div>
      <div className={formStyles.formGroup}>
        <label>Content (AR)</label>
        <textarea
          value={formData.content_ar}
          onChange={(e) => setFormData((p) => ({ ...p, content_ar: e.target.value }))}
          placeholder="المحتوى بالعربية"
          rows={5}
          dir="rtl"
        />
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Excerpt (EN)</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData((p) => ({ ...p, excerpt: e.target.value }))}
            placeholder="Short excerpt..."
            rows={2}
            maxLength={500}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label>Excerpt (AR)</label>
          <textarea
            value={formData.excerpt_ar}
            onChange={(e) => setFormData((p) => ({ ...p, excerpt_ar: e.target.value }))}
            placeholder="مقتطف قصير"
            rows={2}
            dir="rtl"
            maxLength={500}
          />
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label>Image URL</label>
        <input
          type="url"
          value={formData.imageSrc}
          onChange={(e) => setFormData((p) => ({ ...p, imageSrc: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Tag (EN)</label>
          <select
            value={formData.tag}
            onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
          >
            <option value="">— Select —</option>
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.formGroup}>
          <label>Tag (AR)</label>
          <input
            type="text"
            value={formData.tag_ar}
            onChange={(e) => setFormData((p) => ({ ...p, tag_ar: e.target.value }))}
            placeholder="الوسم بالعربية"
            dir="rtl"
          />
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Category (EN)</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">— Select —</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className={formStyles.formGroup}>
          <label>Category (AR)</label>
          <input
            type="text"
            value={formData.category_ar}
            onChange={(e) => setFormData((p) => ({ ...p, category_ar: e.target.value }))}
            placeholder="الفئة بالعربية"
            dir="rtl"
          />
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Author name (EN)</label>
          <input
            type="text"
            value={formData.author?.name ?? ""}
            onChange={(e) => setAuthor("name", e.target.value)}
            placeholder="Author name"
          />
        </div>
        <div className={formStyles.formGroup}>
          <label>Author name (AR)</label>
          <input
            type="text"
            value={formData.author?.name_ar ?? ""}
            onChange={(e) => setAuthor("name_ar", e.target.value)}
            placeholder="اسم الكاتب"
            dir="rtl"
          />
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label>Author email</label>
        <input
          type="email"
          value={formData.author?.email ?? ""}
          onChange={(e) => setAuthor("email", e.target.value)}
          placeholder="author@example.com"
        />
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Meta title (EN)</label>
          <input
            type="text"
            value={formData.seo?.metaTitle ?? ""}
            onChange={(e) => setSeo("metaTitle", e.target.value)}
            placeholder="SEO meta title"
          />
        </div>
        <div className={formStyles.formGroup}>
          <label>Meta title (AR)</label>
          <input
            type="text"
            value={formData.seo?.metaTitle_ar ?? ""}
            onChange={(e) => setSeo("metaTitle_ar", e.target.value)}
            placeholder="عنوان ميتا"
            dir="rtl"
          />
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Meta description (EN)</label>
          <textarea
            value={formData.seo?.metaDescription ?? ""}
            onChange={(e) => setSeo("metaDescription", e.target.value)}
            placeholder="SEO meta description"
            rows={2}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label>Meta description (AR)</label>
          <textarea
            value={formData.seo?.metaDescription_ar ?? ""}
            onChange={(e) => setSeo("metaDescription_ar", e.target.value)}
            placeholder="وصف ميتا"
            rows={2}
            dir="rtl"
          />
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
            />
            Featured
          </label>
        </div>
      </div>
    </>
  );
}

export default function AdminBlogs() {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    page: 1,
    limit: 20
  });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const { data: blogsData, isLoading, isError, refetch } = useAdminBlogs(filters);
  const {
    createBlog,
    updateBlog,
    deleteBlog,
    isCreating,
    isUpdating,
    isDeleting
  } = useBlogMutations();

  const blogs = blogsData?.data ?? [];
  const pagination = blogsData?.pagination ?? {};

  const showToast = (message, type = "success") => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast({ isVisible: false, message: "", type: "success" }), 3000);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const openCreateModal = () => {
    setFormData(initialFormState);
    setCreateModalOpen(true);
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || "",
      title_ar: blog.title_ar || "",
      content: blog.content || "",
      content_ar: blog.content_ar || "",
      excerpt: blog.excerpt || "",
      excerpt_ar: blog.excerpt_ar || "",
      imageSrc: blog.imageSrc || "",
      tag: blog.tag || "",
      tag_ar: blog.tag_ar || "",
      category: blog.category || "",
      category_ar: blog.category_ar || "",
      author: {
        name: blog.author?.name || "Admin",
        name_ar: blog.author?.name_ar || "",
        email: blog.author?.email || ""
      },
      seo: {
        metaTitle: blog.seo?.metaTitle || "",
        metaTitle_ar: blog.seo?.metaTitle_ar || "",
        metaDescription: blog.seo?.metaDescription || "",
        metaDescription_ar: blog.seo?.metaDescription_ar || ""
      },
      status: blog.status || "draft",
      featured: blog.featured || false
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const hasTitle = (d) =>
    (d.title && d.title.trim()) || (d.title_ar && d.title_ar.trim());
  const hasContent = (d) =>
    (d.content && d.content.trim()) || (d.content_ar && d.content_ar.trim());

  const cleanPayload = (data) => {
    const p = {
      ...data,
      author: data.author,
      seo: Object.keys(data.seo || {}).some((k) => data.seo[k]) ? data.seo : undefined
    };
    if (p.tag === "") delete p.tag;
    if (p.category === "") delete p.category;
    return p;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!hasTitle(formData) || !hasContent(formData)) {
      showToast("At least one of Title (EN/AR) and one of Content (EN/AR) is required", "error");
      return;
    }
    try {
      const payload = cleanPayload(formData);
      createBlog(payload, {
        onSuccess: () => {
          showToast("Blog created successfully");
          setCreateModalOpen(false);
          setFormData(initialFormState);
          refetch();
        },
        onError: (err) => {
          showToast(err?.message || "Failed to create blog", "error");
        }
      });
    } catch (err) {
      showToast(err?.message || "Failed to create blog", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBlog?._id || !hasTitle(formData) || !hasContent(formData)) {
      showToast("At least one of Title (EN/AR) and one of Content (EN/AR) is required", "error");
      return;
    }
    try {
      const payload = cleanPayload(formData);
      updateBlog(
        { id: selectedBlog._id, data: payload },
        {
          onSuccess: () => {
            showToast("Blog updated successfully");
            setEditModalOpen(false);
            setSelectedBlog(null);
            refetch();
          },
          onError: (err) => {
            showToast(err?.message || "Failed to update blog", "error");
          }
        }
      );
    } catch (err) {
      showToast(err?.message || "Failed to update blog", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog?._id) return;
    try {
      deleteBlog(selectedBlog._id, {
        onSuccess: () => {
          showToast("Blog deleted successfully");
          setDeleteModalOpen(false);
          setSelectedBlog(null);
          refetch();
        },
        onError: (err) => {
          showToast(err?.message || "Failed to delete blog", "error");
        }
      });
    } catch (err) {
      showToast(err?.message || "Failed to delete blog", "error");
    }
  };

  const displayTitle = (blog) =>
    blog.title || blog.title_ar || "Untitled";

  if (isLoading && blogs.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading blogs..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Blogs Management</h1>
        <button className={styles.btnAdd} onClick={openCreateModal}>
          <i className="icon-plus" /> Create Blog
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title or content..."
          className={styles.searchInput}
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <select
          className={styles.selectInput}
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {isError && (
        <div className={styles.error}>
          Failed to load blogs. <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Tag</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No blogs found. Click &quot;Create Blog&quot; to add one.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{displayTitle(blog)}</td>
                  <td>{blog.tag || blog.tag_ar || "—"}</td>
                  <td>{blog.category || blog.category_ar || "—"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        blog.status === "published"
                          ? styles.badgePublished
                          : blog.status === "archived"
                            ? styles.badgeArchived
                            : styles.badgeDraft
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td>{blog.featured ? "Yes" : "—"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => openEditModal(blog)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => openDeleteModal(blog)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={filters.page <= 1}
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className={styles.pageBtn}
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setCreateModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Create Blog</h2>
              <button className={styles.modalClose} onClick={() => setCreateModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className={styles.modalBody}>
                <BlogFormFields formData={formData} setFormData={setFormData} styles={styles} />
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnSubmit} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setEditModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Edit Blog</h2>
              <button className={styles.modalClose} onClick={() => setEditModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className={styles.modalBody}>
                <BlogFormFields formData={formData} setFormData={setFormData} styles={styles} />
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnSubmit} disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setDeleteModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Delete Blog</h2>
              <button className={styles.modalClose} onClick={() => setDeleteModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete &quot;{displayTitle(selectedBlog)}&quot;? This
                action cannot be undone.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>
              <button
                className={`${styles.btn} ${styles.btnDelete}`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ isVisible: false, message: "", type: "success" })}
        />
      )}
    </div>
  );
}
