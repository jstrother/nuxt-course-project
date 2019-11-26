import Vuex from 'vuex';
import axios from 'axios';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: []
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return axios.get('https://nuxt-course-project-daaed.firebaseio.com/posts.json')
        .then(res => {
          const postsArray = [];
          for (const key in res.data) {
            postsArray.push({...res.data[key], id: key});
          }
          commit('setPosts', postsArray);
        })
        .catch(error => context.error(error));
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      }
    }
  });
};

export default createStore;
