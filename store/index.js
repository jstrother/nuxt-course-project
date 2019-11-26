import Vuex from 'vuex';
import { Promise } from 'q';

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
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            commit('setPosts', [
              {
                id: 1,
                title: 'First Post',
                previewText: 'This is my first post',
                thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
              },
              {
                id: 2,
                title: 'Second Post',
                previewText: 'This is my second post',
                thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
              },
              {
                id: 3,
                title: 'Third Post',
                previewText: 'This is my third post',
                thumbnail: 'https://static.pexels.com/photos/270348/pexels-photo-270348.jpeg'
              }
            ]);
            resolve();
          }, 1500);
        })
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
