<template>
  <div class="container">
    <div class="content">

      <div>
        <input v-model="nameCountry" type="text" class="searchCountry" placeholder="Find a country...">
        <div class="title">Countries List</div>
        <div v-if="filteredCountries.length === 0 && nameCountry">No countries found</div>
        <div>
          <div v-for="(country, index) in filteredCountries" :key="index" class="country-all">
            <NuxtLink :to="`/country/${country.countryCode}?name=${country.name}`">{{ country.name }}</NuxtLink>
          </div>
        </div>
      </div>

      <div>
        <div class="title">Random Countries Widget</div>
        <div class="country-random-block">
          <div v-for="(country, index) in countriesData" :key="index" class="country-random">
            <div class="country-title">{{ country.name }}</div>
            <div v-for="(country, index) in holidays" :key="index">
              <div v-for="(holiday, i) in country.holidays" :key="i" class="position-el-flex">
                <div class="random-country-title">Next holiday:</div>
                <div>{{ holiday.localName }}</div>
                <div class="random-country-title">Date:</div>
                <div>{{ holiday.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'home-page',
  data() {
    return {
      nameCountry: '',
      countriesData: [],
      data: [],
      holidays: [],
    }
  },
  computed: {
    filteredCountries() {
      if (this.data.length === 0) return [];

      return this.data.filter(country =>
          country.name.toLowerCase().includes(this.nameCountry.toLowerCase())
      );
    }
  },
  async mounted() {
    const config = useRuntimeConfig();
    //All Available Countries
    const responseAvailableCountries = await fetch(`${config.public.VUE_BASE_API_URL}/AvailableCountries`, {
      method: 'GET',
    });
    this.data = await responseAvailableCountries.json();

    const indexRandom1 = this.getRandomArbitrary(0, this.data.length)
    const indexRandom2 = this.getRandomArbitrary(0, this.data.length)
    const indexRandom3 = this.getRandomArbitrary(0, this.data.length)
    this.countriesData = [
      this.data[indexRandom1],
      this.data[indexRandom2],
      this.data[indexRandom3],
    ]

    //Holidays
    const holidayRequests = this.countriesData.map(async (country) => {
      const responseHolidays = await fetch(`${config.public.VUE_BASE_API_URL}/NextPublicHolidays/${country.countryCode}`, {
        method: 'GET'
      });
      const holidayData = await responseHolidays.json();
      return {
        holidays: holidayData
      };
    });
    this.holidays = await Promise.all(holidayRequests);
  },

  methods: {
    getRandomArbitrary(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
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
    width: 80%;
    background-color: #f2f2f2;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 20px;
    margin: 20px;

    .searchCountry {
      width: 230px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid grey;
      outline: none;
      transition: .5s;
      box-sizing: border-box;

      &:focus {
        border: 1px solid grey;
        outline: none;
        transition: .3s;
        padding: 0 10px;
      }

      &::placeholder {
        font-family: "Montserrat", sans-serif;
        font-weight: 300;
        padding: 3px;
      }
    }

    .title {
      font-weight: 400;
      margin: 20px 0 20px 0;
    }

    .country-all {
      border: 1px solid grey;
      padding: 10px;
      margin: 10px 0 10px 0;
    }

    .country-random-block {
      border: 1px solid grey;

      .country-random {
        border: 1px solid grey;
        margin: 20px;
        padding: 10px;

        .position-el-flex {
          display: flex;
          align-items: center;
          margin: 10px 0;

          .random-country-title {
            font-size: 18px;
            margin: 0 10px 0 20px;
            color: #7788f9;
          }
        }

        .country-title {
          color: blue;
          font-size: 20px;
        }
      }
    }
  }


}


</style>