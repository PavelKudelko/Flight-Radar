<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">FlightRadar APIs</h1>
    <!-- <img
      src="./assets/tamk-logo.png"
      alt="TAMK logo"
      class="w-40 mb-6"
    /> -->
    <div class="mb-6 text-gray-700 text-base space-y-4 leading-relaxed">
      <p>
        Welcome to the <strong>TAMK FlightRadar APIs</strong> page.
        These APIs provide <em>real-time and historical aircraft position data</em> for flight tracking and analysis.
      </p>
      <p>
        The data is collected using TAMK’s own FlightRadar station powered by a
        <strong>Raspberry Pi 4</strong> and <strong>Jetvision A3 antenna</strong>.
      </p>
      <p>Here you will find:</p>
      <ul class="list-disc list-inside">
        <li>The latest 200 live aircraft records</li>
        <li>Links to our REST and GraphQL API documentation</li>
      </ul>
      <p>
        <strong>Project contributors:</strong><br />
        Pavel Kudelko<br />
        Md Abdur Rahim<br />
        Phat Vo
      </p>
      <p>
        If you encounter issues or have improvement suggestions, please contact:<br />
        <a href="mailto:pavel.kudelko@tuni.fi" class="text-blue-600 hover:underline">
          Pavel Kudelko &lt;pavel.kudelko@tuni.fi&gt;
        </a>
      </p>
    </div>
    <div class="mb-8 flex gap-4">
      <a
        href="/docs/graphql/index.html"
        target="_blank"
        rel="noopener"
        class="px-4 py-2 bg-blue-600 text-white font-medium rounded shadow hover:bg-blue-700 transition"
      >
        📘 GraphQL API Docs
      </a>
      <a
        href="/docs/rest-api/index.html"
        target="_blank"
        rel="noopener"
        class="px-4 py-2 bg-green-600 text-white font-medium rounded shadow hover:bg-green-700 transition"
      >
        📘 REST API Docs (Swagger UI)
      </a>
    </div>
    <FlightList />
  </div>
</template>

<script>
import FlightList from './components/FlightList.vue';

export default {
  components: {
    FlightList
  }
};
</script>
