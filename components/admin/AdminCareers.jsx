"use client";
import React, { useState } from "react";
import { useAdminCareers, useCareerMutations } from "@/apis/hooks";
import LocationLoader from "@/components/common/LocationLoader";
import Toast from "@/components/common/Toast";
import styles from "./AdminCareers.module.css";

const initialFormState = {
  title: "",
  title_ar: "",
  department: "",
  department_ar: "",
  location: "",
  location_ar: "",
  salary: "",
  salary_ar: "",
  description: "",
  description_ar: "",
  status: "published"
};

function CareerFormFields({ formData, setFormData, styles }) {
  return (
    <>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Title (EN) *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
            placeholder="e.g. Senior Real Estate Agent"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Title (AR)</label>
          <input
            type="text"
            value={formData.title_ar}
            onChange={(e) => setFormData((p) => ({ ...p, title_ar: e.target.value }))}
            placeholder="المسمى بالعربية"
            dir="rtl"
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Department (EN) *</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
            placeholder="e.g. Sales"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Department (AR)</label>
          <input
            type="text"
            value={formData.department_ar}
            onChange={(e) => setFormData((p) => ({ ...p, department_ar: e.target.value }))}
            placeholder="القسم"
            dir="rtl"
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Location (EN) *</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
            placeholder="e.g. Dubai, UAE"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Location (AR)</label>
          <input
            type="text"
            value={formData.location_ar}
            onChange={(e) => setFormData((p) => ({ ...p, location_ar: e.target.value }))}
            placeholder="الموقع"
            dir="rtl"
          />
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label>Salary (EN)</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))}
            placeholder="e.g. Competitive"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Salary (AR)</label>
          <input
            type="text"
            value={formData.salary_ar}
            onChange={(e) => setFormData((p) => ({ ...p, salary_ar: e.target.value }))}
            placeholder="الراتب"
            dir="rtl"
          />
        </div>
      </div>
      <div className={styles.formGroup}>
        <label>Description (EN)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          placeholder="Job description..."
          rows={3}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Description (AR)</label>
        <textarea
          value={formData.description_ar}
          onChange={(e) => setFormData((p) => ({ ...p, description_ar: e.target.value }))}
          placeholder="وصف الوظيفة"
          rows={3}
          dir="rtl"
        />
      </div>
      <div className={styles.formGroup}>
        <label>Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </>
  );
}

export default function AdminCareers() {
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
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" });

  const { data: careersData, isLoading, isError, refetch } = useAdminCareers(filters);
  const {
    createCareer,
    updateCareer,
    deleteCareer,
    isCreating,
    isUpdating,
    isDeleting
  } = useCareerMutations();

  const careers = careersData?.data ?? [];
  const pagination = careersData?.pagination ?? {};

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

  const openEditModal = (career) => {
    setSelectedCareer(career);
    setFormData({
      title: career.title || "",
      title_ar: career.title_ar || "",
      department: career.department || "",
      department_ar: career.department_ar || "",
      location: career.location || "",
      location_ar: career.location_ar || "",
      salary: career.salary || "",
      salary_ar: career.salary_ar || "",
      description: career.description || "",
      description_ar: career.description_ar || "",
      status: career.status || "published"
    });
    setEditModalOpen(true);
  };

  const openDeleteModal = (career) => {
    setSelectedCareer(career);
    setDeleteModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.department?.trim() || !formData.location?.trim()) {
      showToast("Title, department, and location are required", "error");
      return;
    }
    try {
      createCareer(formData, {
        onSuccess: () => {
          showToast("Career created successfully");
          setCreateModalOpen(false);
          setFormData(initialFormState);
          refetch();
        },
        onError: (err) => {
          showToast(err?.message || "Failed to create career", "error");
        }
      });
    } catch (err) {
      showToast(err?.message || "Failed to create career", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCareer?._id || !formData.title?.trim() || !formData.department?.trim() || !formData.location?.trim()) {
      showToast("Title, department, and location are required", "error");
      return;
    }
    try {
      updateCareer(
        { id: selectedCareer._id, data: formData },
        {
          onSuccess: () => {
            showToast("Career updated successfully");
            setEditModalOpen(false);
            setSelectedCareer(null);
            refetch();
          },
          onError: (err) => {
            showToast(err?.message || "Failed to update career", "error");
          }
        }
      );
    } catch (err) {
      showToast(err?.message || "Failed to update career", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedCareer?._id) return;
    try {
      deleteCareer(selectedCareer._id, {
        onSuccess: () => {
          showToast("Career deleted successfully");
          setDeleteModalOpen(false);
          setSelectedCareer(null);
          refetch();
        },
        onError: (err) => {
          showToast(err?.message || "Failed to delete career", "error");
        }
      });
    } catch (err) {
      showToast(err?.message || "Failed to delete career", "error");
    }
  };

  if (isLoading && careers.length === 0) {
    return (
      <div className={styles.loaderContainer}>
        <LocationLoader message="Loading careers..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Careers Management</h1>
        <button className={styles.btnAdd} onClick={openCreateModal}>
          <i className="icon-plus" /> Add Career
        </button>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title, department, location..."
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
        </select>
      </div>

      {isError && (
        <div className={styles.error}>
          Failed to load careers. <button onClick={() => refetch()}>Retry</button>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {careers.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No careers found. Click &quot;Add Career&quot; to create one.
                </td>
              </tr>
            ) : (
              careers.map((career) => (
                <tr key={career._id}>
                  <td>{career.title}</td>
                  <td>{career.department}</td>
                  <td>{career.location}</td>
                  <td>{career.salary || "—"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        career.status === "published" ? styles.badgePublished : styles.badgeDraft
                      }`}
                    >
                      {career.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => openEditModal(career)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => openDeleteModal(career)}
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
              <h2>Add Career</h2>
              <button className={styles.modalClose} onClick={() => setCreateModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className={styles.modalBody}>
                <CareerFormFields formData={formData} setFormData={setFormData} styles={styles} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnCancel} onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnSubmit} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Career"}
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
              <h2>Edit Career</h2>
              <button className={styles.modalClose} onClick={() => setEditModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className={styles.modalBody}>
                <CareerFormFields formData={formData} setFormData={setFormData} styles={styles} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.btnCancel} onClick={() => setEditModalOpen(false)}>
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
              <h2>Delete Career</h2>
              <button className={styles.modalClose} onClick={() => setDeleteModalOpen(false)}>
                <i className="icon-close" />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete &quot;{selectedCareer?.title}&quot;? This action cannot be undone.
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
