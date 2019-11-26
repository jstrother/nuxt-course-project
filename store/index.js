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
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id);
        state.loadedPosts[postIndex] = editedPost;
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
      },
      addPost({ commit }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return axios.post('https://nuxt-course-project-daaed.firebaseio.com/posts.json', createdPost)
        .then(res => {
          commit('addPost', {...createdPost, id: res.data.name});
        })
        .catch(error => {
          console.log(error);
        });
      },
      editPost({ commit }, editedPost) {
        return axios.put(`https://nuxt-course-project-daaed.firebaseio.com/posts/${editedPost.id}.json`, editedPost)
        .then(res => {
          commit('editPost', editedPost);
        })
        .catch(error => console.log(error));
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
