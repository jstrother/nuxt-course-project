<template>
  <div class="new-post-form">
    <AdminPostForm @submit="onSubmitted" />
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm';

export default {
  layout: 'admin',
  components: {
    AdminPostForm
  },
  methods: {
    onSubmitted(postData) {
      
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
