<template>
  <div class="container mt-5">
    <h2 class="mb-4">Register</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="companyName" class="form-label">Company Name</label>
        <input
          type="text"
          class="form-control"
          id="companyName"
          v-model="formData.companyName"
          required
        />
      </div>

      <div class="mb-3">
        <label for="companyDocument" class="form-label">Company Document</label>
        <input
          type="text"
          class="form-control"
          id="companyDocument"
          v-model="formData.companyDocument"
          required
        />
      </div>

      <div class="mb-3">
        <label for="userName" class="form-label">User Name</label>
        <input
          type="text"
          class="form-control"
          id="userName"
          v-model="formData.userName"
          required
        />
      </div>

      <div class="mb-3">
        <label for="userEmail" class="form-label">User Email</label>
        <input
          type="email"
          class="form-control"
          id="userEmail"
          v-model="formData.userEmail"
          required
        />
      </div>

      <div class="mb-3">
        <label for="userPassword" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="userPassword"
          v-model="formData.userPassword"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        companyName: '',
        companyDocument: '',
        userName: '',
        userEmail: '',
        userPassword: '',
      },
      loading: false,
      errorMessage: '',
      successMessage: '',
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''
      try {
        const response = await axios.post('http://localhost:3000/auth/register', this.formData)
        this.successMessage = `User registered successfully: ${response.data.name}`
        this.formData = {
          companyName: '',
          companyDocument: '',
          userName: '',
          userEmail: '',
          userPassword: '',
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Registration failed.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
