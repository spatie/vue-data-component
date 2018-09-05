module.exports = {
    css: [{ src: '~/node_modules/tailwindcss/dist/tailwind.css', lang: 'css' }],

    head: {
        link: [
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css?family=Amiri:400,400i,700',
            },
        ],
    },

    plugins: ['~/plugins/global.js'],
};
