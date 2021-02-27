new Vue({
    el: ".main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null
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
    methods: {
        handleClick: function (e) {
            // e.preventDefault()
            var formData = new FormData();
            formData.append("title", this.title);
            formData.append("description", this.description);
            formData.append("username", this.username);
            formData.append("file", this.file);
            // console.log("this.title: ", this.title);
            // console.log("this.description: ", this.description);
            // console.log("this.username: ", this.username);
            // console.log("this.file: ", this.file);
            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log("response from post req: ", response);
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                });
        },
        handleChange: function (e) {
            console.log("e.target.files[0]: ", e.target.files[0]);
            console.log("handle change is running!");
            this.file = e.target.files[0];
        }
    }
});
