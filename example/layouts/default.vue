<template>
    <div class="max-w-xl mx-auto py-4 flex min-h-screen">
        <nav class="w-1/5 pt-8 text-xl">
            <ul class="mb-8">
                <li><nuxt-link to="/">Home</nuxt-link></li>
            </ul>
            <h2 class="mb-1 text-grey-dark">
                Examples
            </h2>
            <ul>
                <li><nuxt-link to="/ajax-cards">Ajax cards layout</nuxt-link></li>
                <li><nuxt-link to="/ajax-table">Ajax table layout</nuxt-link></li>
            </ul>
        </nav>
        <div class="bg-white p-8 pt-16 flex-1">
            <h1 class="text-3xl font-bold mb-16 text-center">
                {{ title }}
            </h1>
            <nuxt/>
        </div>
    </div>
</template>

<script>
export default {
    head: {
        link: [
            // { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Crimson+Text:400,400i,700,700i' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Neuton:400,400i,700' },
            { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css' },
        ],
    },

    computed: {
        title() {
            return this.$route.matched[0]
                ? this.$route.matched[0].components.default.options.title
                : '';
        },
    },
}
</script>

<style global>
    * {
        position: relative;
        box-sizing: inherit;
        margin: 0;
        padding: 0;
        color: inherit;
        font: inherit;
    }

    *:after,
    *:before {
        box-sizing: inherit;
    }

    html {
        box-sizing: border-box;
    }

    body {
        background-color: #f5f5f5;
        font-family: 'Neuton';
    }

    h1 {
        font-size: inherit; /* Reset normalize 2em */
    }

    a {
        text-decoration: none;
    }

    ol,
    ul {
        list-style: none;
    }

    img,
    svg {
        vertical-align: middle;
    }

    .transition {
        transition: all 0.2s ease-in-out;
    }
</style>

