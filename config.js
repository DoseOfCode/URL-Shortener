module.exports = {
    express: {
        listening_port: 3001,
        frontend_address: "http://localhost:3000"
    },
    mongoose: {
        address: "mongodb://127.0.0.1:27017/",
        database: "url-shortener"
    }
}