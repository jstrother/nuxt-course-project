import Vuex from 'vuex';

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
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
      },
      setToken(state, token) {
        state.token = token;
      }
    },
    actions: {
      nuxtServerInit({ commit }, context) {
        return context.app.$axios.$get('/posts.json')
        .then(data => {
          const postsArray = [];
          for (const key in data) {
            postsArray.push({...data[key], id: key});
          }
          commit('setPosts', postsArray);
        })
        .catch(error => context.error(error));
      },
      setPosts({ commit }, posts) {
        commit('setPosts', posts);
      },
      addPost({ commit, state }, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        };
        return this.$axios.$post(`/posts.json?auth=${state.token}`, createdPost)
        .then(data => {
          commit('addPost', {...createdPost, id: data.name});
        })
        .catch(error => {
          console.log(error);
        });
      },
      editPost({ commit, state }, editedPost) {
        return this.$axios.$put(`/posts/${editedPost.id}.json?auth=${state.token}`, editedPost)
        .then(() => {
          commit('editPost', editedPost);
        })
        .catch(error => console.log(error));
      },
      authenticateUser({ commit }, authData) {
        let authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.firebaseAPIKey}`
        if (!authData.isLogin) {
          authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.firebaseAPIKey}`
        }
        return this.$axios.$post(authURL, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(result => {
          commit('setToken', result.idToken);
        })
        .catch(error => {
          console.log(error);
        });
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }
  });
};

export default createStore;
