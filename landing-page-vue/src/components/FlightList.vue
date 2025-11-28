<template>
  <div>
    <div v-if="loading" class="text-gray-500">Loading flights...</div>
    <div v-else-if="error" class="text-red-600">Error: {{ error }}</div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto border border-gray-200 text-sm">
          <thead class="bg-gray-100 text-left">
            <tr>
              <th class="px-4 py-2 border">ID</th>
              <th class="px-4 py-2 border">Flight</th>
              <th class="px-4 py-2 border">ICAO</th>
              <th class="px-4 py-2 border">Latitude</th>
              <th class="px-4 py-2 border">Longitude</th>
              <th class="px-4 py-2 border">Altitude (ft)</th>
              <th class="px-4 py-2 border">Speed (knots)</th>
              <th class="px-4 py-2 border">Heading (°)</th>
              <th class="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="flight in flights"
              :key="flight.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-2 border">{{ flight.id }}</td>
              <td class="px-4 py-2 border">{{ flight.flight }}</td>
              <td class="px-4 py-2 border">{{ flight.icao }}</td>
              <td class="px-4 py-2 border">{{ flight.latitude.toFixed(5) }}</td>
              <td class="px-4 py-2 border">{{ flight.longitude.toFixed(5) }}</td>
              <td class="px-4 py-2 border">{{ flight.altitude }}</td>
              <td class="px-4 py-2 border">{{ flight.speed }}</td>
              <td class="px-4 py-2 border">{{ flight.heading }}</td>
              <td class="px-4 py-2 border">{{ formatTimestamp(flight.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flights: [],
      loading: true,
      error: null
    };
  },
  methods: {
    formatTimestamp(iso) {
      const date = new Date(iso);
      return date.toLocaleString();
    }
  },
    mounted() {
    const fetchFlights = () => {
        fetch("/api/flights/getall/200")
        .then((res) => {
            if (!res.ok) throw new Error("Network error");
            return res.json();
        })
        .then((data) => {
            this.flights = data;
            this.loading = false;
        })
        .catch((err) => {
            this.error = err.message;
            this.loading = false;
        });
    };

    // Initial fetch
    fetchFlights();

    // Auto-refresh every 10 min
    this.intervalId = setInterval(fetchFlights, 60000 * 10);
    },
    beforeUnmount() {
    clearInterval(this.intervalId);
    }
};
</script>
