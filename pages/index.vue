<template>
  <main class="px-20 py-10 bg-orange-100 h-screen overflow-hidden overflow-y-scroll">
    <h4 class="text-center text-3xl font-semibold text-orange-800">Products</h4>
    <div class="flex justify-center items-center mt-4">
      <select
        id="countries"
        @change="selectCategory($event)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option selected disabled>Choose a category</option>
        <option
          v-for="(i, index) in categories"
          :key="index">
            {{ i }}
          </option>
      </select>
    </div>
    <div class="flex flex-col md:flex-col lg:flex-row flex-wrap mt-2 w-full justify-center gap-2">
      <div class="relative w-full md:w-1/2 lg:w-[24%] mt-3" v-for="product in filteredList" :key="product.name">
        <img
          :src="product.image"
          class="object-cover w-full md:w-full h-full md:h-full lg:h-64"
          @error="loadFakeImage"
         />
        <div class="absolute bottom-0 right-0 left-0 bg-black/80 mx-auto py-2">
        <div class="!text-center">
          <p class="text-white text-sm">{{ product.name }}</p>
          <p class="text-white text-sm ">$ {{ product.price }}</p>
        </div>
      </div>
    </div>
    </div>
    <div class="mt-16 mb-6">
      <div class="flex justify-center items-center">
        <div v-for="(item, index) in pages" :key="index">
          <span
            @click="onClickPage(item.name)"
            :class="[
            currentPage === item.name ?
            'cursor-pointer border border-gray-800 rounded py-2 px-4 mx-3 text-red-600'
            :
            'cursor-pointer border border-gray-800 rounded py-2 px-4 mx-3']"
          >
            {{ item.name }}
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import http from '~/utils/ApiRequest'

export default Vue.extend({
  name: 'IndexPage',
  data: () => ({
    allCats: [] as Array<any>,
    maxVisibleButtons: 2,
    perPage: 10,
    currentPage: 1,
    totalPages: 0,
    category: '',
    pagination: [
      {
        page: 1
      },
      {
        page: 2
      },
      {
        page: 3
      },
    ] as Array<any>
  }),
  async fetch() {
    const data = {
      page: this.currentPage
    }
    await this.fetchAllCatImages(data)
  },
  computed: {
    filteredList() {
      if(this.category !== '') {
        return this.allCats.filter(c => c.catname === this.category)
      } else {
        return [...new Set(this.allCats)]
      }
    },
    categories() {
      const list = this.allCats ? this.allCats.map((item: any) => {
        return item.catname
      }) : []
      return [...new Set(list)];
    },
    startPage() {
      // When on the first page
      if (this.currentPage === 1) {
        return 1;
      }

      // When on the last page
      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons;
      }

      // When inbetween
      return this.currentPage - 1;
    },
    pages() {
      const range = [];

      for (
        let i: any = this.startPage;
        i <= Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage
        });
      }

      return range;
    },
  },
  methods: {
    loadFakeImage() {
      return 'https://res.cloudinary.com/doigweh6x/image/upload/v1658225182/cld-sample-2.jpg'
    },
    selectCategory(event: any) {
      this.category = event.target.value
    },
    fetchAllCatImages(data: any) {
      return new Promise((resolve, reject) => {
        http.get('products', {
          params: {
            ...data
          }
        })
          .then((response: any) => {
            this.allCats = response.data
            this.totalPages = response.total
            resolve(response);
          })
          .catch((error: any) => {
            reject(error);
          })
      })
    },
    async onClickPage(page: any) {
      this.currentPage = page.name;
      await this.fetchAllCatImages({ page: this.currentPage})
    }
  }
})
</script>
