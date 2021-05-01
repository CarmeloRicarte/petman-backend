
const getReviews = require('google-reviews-web-scraper/src/getReviews');


const obtenerReviews = async (req, res) => {
    try {
        const reviews = await getReviews("https://www.google.com/maps/place/Piensos+Sergio+Rocamora/@38.1771591,-0.8788264,17z/data=!3m1!4b1!4m5!3m4!1s0xd63bd055c34752f:0x831381b48ee28acc!8m2!3d38.1771591!4d-0.8766377");
        res.json(reviews);
    } catch (error) {
        console.error(error);
    }



}

module.exports = {
    obtenerReviews
}