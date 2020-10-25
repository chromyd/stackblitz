import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue'
import { fromFetch } from 'rxjs/fetch'
import { mergeMap } from 'rxjs/operators'

Vue.use(BootstrapVue);

let app = new Vue({
  el: '#app',
  data: {
    title: '',
    errorMessage: '',
    fields: ['Title', 'Year', 'Type'],
    movies: [],
    mode: 'table',
    options: [
      { text: 'Table', value: 'table' },
      { text: 'Cards', value: 'cards' },
    ]
  },
  methods: {
    search: function () {
      this.imdbQuery();
    },
    imdbQuery: function () {
      fromFetch(`https://www.omdbapi.com/?s=${this.title}&apikey=32e78858`)
        .pipe(
          mergeMap((response) => response.json())
        )
        .subscribe((data) => {
          if (data.Response === "False") {
            throw data.Error;
          }
          console.table(data.Search);
          this.movies = data.Search.map(movie => ({ ...movie, poster: movie.Poster.replace("N/A", "https://source.unsplash.com/O3Vn2Dp1YSU/200x300") }))
        },
        (error) => {
          console.error(error);
          this.errorMessage = '' + error;
          this.movies = [];
        })
    }
  }
})