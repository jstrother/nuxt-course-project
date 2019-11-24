<template>
  <div class="posts-page">
    <PostList :posts="loadedPosts"/>
  </div>
</template>

<script scoped>
import PostList from '@/components/Posts/PostList';
import { reject } from 'q';

export default {
  components: {
    PostList
  },
  fetch(context) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          loadedPosts: [
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
          ]
        });
      }, 1500);
    })
    .then(data => {
      context.store.commit('setPosts', data.loadedPosts);
    })
    .catch(error => {
      context.error(new Error(error));
    });
  },
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts;
    }
  }
}
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
