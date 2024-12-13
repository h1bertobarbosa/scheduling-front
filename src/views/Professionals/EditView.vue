<template>
  <div class="container mt-5">
    <h2 class="mb-4">Edit Professional</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input type="text" class="form-control" id="name" v-model="formData.name" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Schedule Availability</label>
        <div v-for="(day, index) in formData.scheduleAvailability" :key="index" class="mb-3">
          <div class="input-group mb-2">
            <span class="input-group-text">Day</span>
            <select class="form-select" v-model="day.dayOfWeek">
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <div v-for="(hour, hourIndex) in day.hours" :key="hourIndex" class="input-group mb-2">
            <span class="input-group-text">Start</span>
            <input type="time" class="form-control" v-model="hour.start" required />
            <span class="input-group-text">End</span>
            <input type="time" class="form-control" v-model="hour.end" required />
            <button type="button" class="btn btn-danger" @click="removeHour(index, hourIndex)">
              Remove
            </button>
          </div>
          <button type="button" class="btn btn-secondary" @click="addHour(index)">Add Hour</button>
        </div>
        <button type="button" class="btn btn-secondary" @click="addDay">Add Day</button>
      </div>

      <div class="mb-3">
        <label class="form-label">Enabled</label>
        <input type="checkbox" class="form-check-input" id="enabled" v-model="formData.enabled" />
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Saving...' : 'Save' }}
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'EditProfessional',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const professionalId = route.params.id

    const formData = ref({
      name: '',
      scheduleAvailability: [],
      enabled: false,
    })

    const loading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const fetchProfessional = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/professionals/${professionalId}`)
        formData.value = {
          name: response.data.name,
          scheduleAvailability: response.data.scheduleAvailability,
          enabled: response.data.enabled,
        }
      } catch (error) {
        console.error('Error fetching professional:', error)
        alert('Failed to fetch professional details.')
        router.push('/dashboard/professionals')
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''
      try {
        await axios.patch(`http://localhost:3000/professionals/${professionalId}`, formData.value)
        successMessage.value = 'Professional updated successfully.'
        setTimeout(() => router.push('/dashboard/professionals'), 2000)
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Failed to update professional.'
      } finally {
        loading.value = false
      }
    }

    const addDay = () => {
      formData.value.scheduleAvailability.push({
        dayOfWeek: 'monday',
        hours: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      })
    }

    const addHour = (dayIndex) => {
      formData.value.scheduleAvailability[dayIndex].hours.push({
        start: '08:00',
        end: '12:00',
      })
    }

    const removeHour = (dayIndex, hourIndex) => {
      formData.value.scheduleAvailability[dayIndex].hours.splice(hourIndex, 1)
    }

    onMounted(() => {
      fetchProfessional()
    })

    return {
      formData,
      loading,
      errorMessage,
      successMessage,
      handleSubmit,
      addDay,
      addHour,
      removeHour,
    }
  },
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
