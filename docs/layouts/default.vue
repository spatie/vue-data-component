<template>
    <div class="p-8 flex min-h-screen">
        <nav class="w-1/5 pt-2 pr-4 font-sans text-sm">
            <h2 class="text-grey-dark font-bold mb-4">
                Vue Data Component
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="/">Introduction</nuxt-link></li>
                <li><nuxt-link to="#">Postcardware</nuxt-link></li>
                <li><nuxt-link to="#">Installation and setup</nuxt-link></li>
                <li><nuxt-link to="#">About Spatie</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Fetching data
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="#">Overview</nuxt-link></li>
                <li><nuxt-link to="#">Fetching with AJAX</nuxt-link></li>
                <li><nuxt-link to="#">Using a local Array</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Querying data
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="#">Overview</nuxt-link></li>
                <li><nuxt-link to="#">Filtering</nuxt-link></li>
                <li><nuxt-link to="#">Sorting</nuxt-link></li>
                <li><nuxt-link to="#">Pagination</nuxt-link></li>
                <li><nuxt-link to="#">Query strings</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Performance
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="#">Debouncing data fetches</nuxt-link></li>
                <li><nuxt-link to="#">Indicating slow requests</nuxt-link></li>
                <li><nuxt-link to="#">Passing initial data</nuxt-link></li>
                <li><nuxt-link to="#">Avoiding layout jumps on first load</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Helper components
            </h2>
            <ul class="mb-8">
                <li><nuxt-link to="#">DataFilterFacet</nuxt-link></li>
                <li><nuxt-link to="#">DataSortToggle</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Resources
            </h2>
            <ul>
                <li><nuxt-link to="/ajax-card-layout">API reference</nuxt-link></li>
            </ul>
            <h2 class="text-grey-dark">
                Examples
            </h2>
            <ul>
                <li><nuxt-link to="/ajax-card-layout">AJAX card layout</nuxt-link></li>
                <li><nuxt-link to="/prerendered-card-layout">Prerendered AJAX card layout</nuxt-link></li>
            </ul>
        </nav>
        <div class="w-4/5 bg-white p-8 pt-16 flex-1">
            <h1 class="text-3xl font-bold mb-8 text-black text-center">
                {{ title }}
            </h1>
            <nuxt/>
        </div>
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
