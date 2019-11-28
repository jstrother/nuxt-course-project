<template>
  <div class="new-post-form">
    <AdminPostForm @submit="onSubmitted" />
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: 'auth',
  methods: {
    onSubmitted(postData) {
      this.$store.dispatch('addPost', postData)
      .then(() => {
        this.$router.push('/admin');
      })
      .catch(error => console.log(error));
    }
  }
}
</script>

<style scoped>
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>
