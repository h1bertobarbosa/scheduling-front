<template>
  <div class="d-flex">
    <main class="flex-grow-1 p-4">
      <h2>Professionals</h2>
      <router-link to="/dashboard/professionals/new" class="btn btn-primary"
        >Create New</router-link
      >
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="professional in professionals" :key="professional.id">
            <td>{{ professional.name }}</td>
            <td>{{ professional.enabled ? 'Active' : 'Inactive' }}</td>
            <td>{{ formatDate(professional.createdAt) }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="viewProfessional(professional.id)">
                <i class="bi bi-eye"></i> View
              </button>
              <router-link
                :to="`/dashboard/professionals/${professional.id}/edit`"
                class="btn btn-sm btn-warning"
              >
                <i class="bi bi-pencil-square"></i> Edit
              </router-link>
              <button class="btn btn-sm btn-danger" @click="confirmDelete(professional.id)">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="fetchProfessionals(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="fetchProfessionals(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="fetchProfessionals(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>

      <!-- Modal -->
      <div
        class="modal fade"
        tabindex="-1"
        :class="{ show: showModal }"
        style="display: block"
        v-if="showModal"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Professional Details</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <p><strong>Name:</strong> {{ selectedProfessional?.name }}</p>
              <p>
                <strong>Status:</strong> {{ selectedProfessional?.enabled ? 'Active' : 'Inactive' }}
              </p>
              <p><strong>Schedule Availability:</strong></p>
              <ul>
                <li v-for="(day, index) in selectedProfessional?.scheduleAvailability" :key="index">
                  {{ day.dayOfWeek }}:
                  <ul>
                    <li v-for="(hour, hourIndex) in day.hours" :key="hourIndex">
                      {{ hour.start }} - {{ hour.end }}
                    </li>
                  </ul>
                </li>
              </ul>
              <p><strong>Created At:</strong> {{ formatDate(selectedProfessional?.createdAt) }}</p>
              <p><strong>Updated At:</strong> {{ formatDate(selectedProfessional?.updatedAt) }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <!-- Modal for Delete Confirmation -->
      <div
        class="modal fade"
        tabindex="-1"
        :class="{ show: showDeleteModal }"
        style="display: block"
        v-if="showDeleteModal"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="btn-close" @click="closeDeleteModal"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete this professional?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
                Cancel
              </button>
              <button type="button" class="btn btn-danger" @click="deleteProfessional">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfessionalsList',
  data() {
    return {
      professionals: [],
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      showModal: false,
      selectedProfessional: null,
      showDeleteModal: false,
      deleteId: null,
    }
  },
  mounted() {
    this.fetchProfessionals(this.currentPage)
  },
  methods: {
    async fetchProfessionals(page) {
      try {
        const response = await axios.get('http://localhost:3000/professionals', {
          params: {
            page,
            'per-page': this.perPage,
          },
        })

        this.professionals = response.data.data
        this.currentPage = page
        this.totalPages = Math.ceil(response.data.meta.total / this.perPage)
      } catch (error) {
        console.error('Error fetching professionals:', error)
        alert('Failed to fetch professionals.')
      }
    },
    async viewProfessional(id) {
      try {
        const response = await axios.get(`http://localhost:3000/professionals/${id}`)
        this.selectedProfessional = response.data
        this.showModal = true
      } catch (error) {
        console.error('Error fetching professional details:', error)
        alert('Failed to fetch professional details.')
      }
    },
    confirmDelete(id) {
      this.deleteId = id
      this.showDeleteModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedProfessional = null
    },
    async deleteProfessional() {
      try {
        await axios.delete(`http://localhost:3000/professionals/${this.deleteId}`)
        this.showDeleteModal = false
        this.deleteId = null
        this.fetchProfessionals(this.currentPage)
      } catch (error) {
        console.error('Error deleting professional:', error)
        alert('Failed to delete professional.')
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.deleteId = null
    },
    formatDate(dateString) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
  },
}
</script>

<style scoped>
.d-flex {
  min-height: 100vh;
}
nav {
  border-right: 1px solid #ddd;
}
.flex-grow-1 {
  background: #f8f9fa;
}
.table {
  margin-bottom: 1rem;
}
.pagination {
  justify-content: center;
}
.modal {
  background: rgba(0, 0, 0, 0.5);
}
.modal-content {
  max-width: 500px;
  margin: auto;
}
</style>
