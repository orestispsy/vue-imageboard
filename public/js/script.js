new Vue({
    el: "#main",
    data: {
        images: [],
    },
    mounted: function () {

        var self = this;
        axios
            .get("/imageboard")
            .then(function (response) {   
                console.log("response", response.data);
                self.images = response.data;       
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
 
});
