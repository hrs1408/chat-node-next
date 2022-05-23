/** @type {import('next').NextConfig} */
const withImage = require("next-images");
const path = require("path");

module.exports = withImage({
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")]
    },
    reactStrictMode: true,
    env: {
        URL_SERVER: process.env.URL_SERVER,
        URL_CLIENT: process.env.URL_CLIENT,
        URL_API: process.env.URL_API,
        URL_LOGIN_GOOGLE: process.env.URL_LOGIN_GOOGLE,
        URL_LOGIN_GOOGLE_CALLBACK: process.env.URL_LOGIN_GOOGLE_CALLBACK,
        URL_LOGIN_FACEBOOK: process.env.URL_LOGIN_FACEBOOK,
        URL_LOGIN_FACEBOOK_CALLBACK: process.env.URL_LOGIN_FACEBOOK_CALLBACK
    },
    images: {
        domains: ['localhost']
    }

})
