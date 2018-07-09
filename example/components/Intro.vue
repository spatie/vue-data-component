<template>
    <div class="mb-16 max-w-sm mx-auto text-center">
        <div class="text-lg mb-6">
            <slot></slot>
        </div>
        <p class="text-grey-dark italic mb-0">
            View this example's source code on <a :href="sourceUrl" target="_blank">GitHub</a>
        </p>
    </div>
</template>

<script>
export default {
    data: () => ({
        sourceUrl: '#',
    }),

    mounted() {
        this.sourceUrl = `https://github.com/spatie/vue-data-component/tree/master/example/pages${
            window.location.pathname
        }.vue`;
    },
};
</script>


<style scoped>
a {
    text-decoration: underline;
}

p {
    margin-bottom: 1rem;
}
</style>
