<template>
    <div class="max-w-2xl mx-auto py-4 flex min-h-screen">
        <nav class="w-1/5 pt-8 pr-4 font-sans text-sm">
            <h2 class="text-grey-dark font-bold mb-4">
                Vue Data Component
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="/">Introduction</nuxt-link></li>
                <li><nuxt-link to="#">Postcardware</nuxt-link></li>
                <li><nuxt-link to="#">Requirements</nuxt-link></li>
                <li><nuxt-link to="#">High level overview</nuxt-link></li>
                <li><nuxt-link to="#">Installation and setup</nuxt-link></li>
                <li><nuxt-link to="#">About Spatie</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Manipulating data
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="#">Filter</nuxt-link></li>
                <li><nuxt-link to="#">Sort</nuxt-link></li>
                <li><nuxt-link to="#">Pagination</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Examples
            </h2>
            <ul>
                <li><nuxt-link to="/ajax-card-layout">Ajax card layout</nuxt-link></li>
                <li><nuxt-link to="/prerendered-card-layout">Prerendered card layout</nuxt-link></li>
            </ul>
        </nav>
        <div class="bg-white p-8 pt-16 flex-1">
            <h1 class="text-3xl font-bold mb-8 text-black text-center">
                {{ title }}
            </h1>
            <nuxt/>
        </div>
        <div class="w-1/5"></div>
    </div>
</template>

<script>
export default {
    computed: {
        title() {
            return this.$route.matched[0]
                ? this.$route.matched[0].components.default.options.title
                : '';
        },
    },
};
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

*:focus {
    outline: none !important;
    background: #fff9c2;
}

html {
    box-sizing: border-box;
}

body {
    background-color: #f5f5f5;
    font-family: 'Amiri';
    line-height: 1.5;
    color: #3d4852;
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

.fit-cover {
    object-fit: cover;
}

.transition {
    transition: all 0.2s ease-in-out;
}
</style>
