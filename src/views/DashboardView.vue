<template>
  <div class="d-flex">
    <nav class="nav flex-column bg-light p-3" style="min-width: 200px">
      <h4>Dashboard</h4>
      <ul class="nav nav-pills flex-column">
        <li class="nav-item">
          <router-link to="/dashboard/professionals" class="nav-link" active-class="active"
            >Professionals</router-link
          >
        </li>
        <li class="nav-item">
          <button @click="handleLogout" class="btn btn-danger mt-3">Logout</button>
        </li>
        <!-- Add more menu items here as needed -->
      </ul>
    </nav>

    <main class="flex-grow-1 p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  methods: {
    handleLogout() {
      localStorage.removeItem('accessToken')
      this.$router.push('/')
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
</style>
