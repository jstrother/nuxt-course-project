import Vuex from 'vuex';
import Cookie from 'js-cookie';

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
      },
      clearToken(state) {
        state.token = null;
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
      authenticateUser({ commit, dispatch }, authData) {
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
          const token = result.idToken;
          const tokenExpiration = new Date().getTime() + Number.parseInt(result.expiresIn) * 1000;

          commit('setToken', token);

          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiration', tokenExpiration);

          Cookie.set('token', token);
          Cookie.set('tokenExpiration', tokenExpiration);

          return this.$axios.$post('http://localhost:3000/api/track-data', {
            data: 'Authenticated'
          })
          .catch(error => console.log(error));
        })
        .catch(error => {
          console.log(error);
        });
      },
      initAuth({ commit, dispatch }, req) {
        let token;
        let expirationDate;
        if (req) {
          if(!req.headers.cookie) {
            return;
          }
          const tokenCookie = req.headers.cookie.split(';').find(key => key.trim().startsWith('token='));
          if (!tokenCookie) {
            return;
          }
          token = tokenCookie.split('=')[1];

          const expirationCookie = req.headers.cookie.split(';').find(key => key.trim().startsWith('tokenExpiration='));
          if (!expirationCookie) {
            return;
          }
          expirationDate = Number.parseInt(expirationCookie.split('=')[1]);
        } else if (process.client) {
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');
        }
        if (new Date().getTime() > expirationDate || !token) {
          console.log('No token or invalid token');
          dispatch('logout');
          return;
        }
        commit('setToken', token);
      },
      logout({ commit }) {
        commit('clearToken');
        Cookie.remove('token');
        Cookie.remove('tokenExpiration');
        if(process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
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
