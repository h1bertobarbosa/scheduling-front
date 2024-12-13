<template>
  <div class="container mt-5">
    <h2 class="mb-4">Register Professional</h2>
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

export default {
  name: 'RegisterProfessional',
  data() {
    return {
      formData: {
        name: '',
        scheduleAvailability: [
          {
            dayOfWeek: 'monday',
            hours: [
              {
                start: '08:00',
                end: '12:00',
              },
            ],
          },
        ],
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
        const response = await axios.post('http://localhost:3000/professionals', this.formData)
        this.successMessage = `Professional registered successfully: ${response.data.name}`
        this.resetForm()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Registration failed.'
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.formData = {
        name: '',
        scheduleAvailability: [
          {
            dayOfWeek: 'monday',
            hours: [
              {
                start: '08:00',
                end: '12:00',
              },
            ],
          },
        ],
      }
    },
    addDay() {
      this.formData.scheduleAvailability.push({
        dayOfWeek: 'monday',
        hours: [
          {
            start: '08:00',
            end: '12:00',
          },
        ],
      })
    },
    addHour(dayIndex) {
      this.formData.scheduleAvailability[dayIndex].hours.push({
        start: '08:00',
        end: '12:00',
      })
    },
    removeHour(dayIndex, hourIndex) {
      this.formData.scheduleAvailability[dayIndex].hours.splice(hourIndex, 1)
    },
  },
}
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
