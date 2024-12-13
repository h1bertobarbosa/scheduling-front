<template>
  <div class="container mt-5">
    <h2 class="mb-4">Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" v-model="credentials.email" required />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="credentials.password"
          required
        />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>

      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      loading: false,
      errorMessage: '',
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.errorMessage = ''
      try {
        const response = await axios.post('http://localhost:3000/auth/login', this.credentials)
        const accessToken = response.data.accessToken
        // Save the access token to localStorage
        localStorage.setItem('accessToken', accessToken)
        alert('Login successful! Redirecting to dashboard.')
        this.router.push('/dashboard') // Redirect to dashboard
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 400px;
}
</style>
