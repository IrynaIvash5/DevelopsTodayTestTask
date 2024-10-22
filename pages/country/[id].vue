<template>
  <div class="container">
    <div class="content">
      <h1>{{ this.countryName }}</h1>
      <div>
        <div v-if="holidays.length === 0">No holidays found for this country.</div>
        <div v-for="(holiday, index) in holidays" :key="index" class="wrapper-info">
          <div class="holiday-country">Next holiday:</div>
          <div>{{ holiday.localName }}</div>
          <div class="holiday-country">Date:</div>
          <div>{{ holiday.date }}</div>
        </div>
      </div>

      <div class="year-buttons">
        <button v-for="year in years"
                :key="year"
                class="year-button"
                :class="{ active: year === currentYear }"
                @click="fetchHolidays(year)"
        >{{ year }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';

export default {
  data() {
    return {
      holidays: [],
      countryName: '',
      years: Array.from({length: 11}, (_, index) => 2020 + index),
      currentYear: new Date().getFullYear(),
    };
  },
  async mounted() {
    const route = useRoute();
    this.countryCode = route.params.id;
    this.countryName = new URLSearchParams(window.location.search).get('name');
    await this.fetchHolidays(this.currentYear);
  },
  methods: {
    async fetchHolidays(year) {
      const config = useRuntimeConfig();
      try {
        const responseHolidays = await fetch(`${config.public.VUE_BASE_API_URL}/PublicHolidays/${year}/${this.countryCode}`, {
          method: 'GET',
        });

        if (!responseHolidays.ok) {
          throw new Error('Network response was not ok');
        }

        this.holidays = await responseHolidays.json();
      } catch (error) {
        console.error("Error fetching holidays:", error);
        this.holidays = [];
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

.container {
  display: flex;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;

  .content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 80%;
    background-color: #f2f2f2;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    margin: 20px;

    .wrapper-info {
      border: 1px solid grey;
      display: flex;
      margin: 20px 0 20px;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;

      .holiday-country {
        font-size: 18px;
        margin: 0 10px 0 20px;
        color: #7788f9;
      }
    }

    .year-buttons {
      display: flex;
      justify-content: space-between;

      .year-button {
        width: 130px;
        box-sizing: border-box;
        height: 40px;
        transition: .3s;
        cursor: pointer;

        &:hover {
          background-color: #b4b3b3;
          border: none;
          border-radius: 5px;
        }
      }

      .year-button.active {
        background-color: #7788f9;
        color: white;
        border-radius: 5px;
        border: none;
        transition: .3s;

        &:hover {
          background-color: #8da5ee;
          border: none;
        }
      }
    }
  }
}
</style>
