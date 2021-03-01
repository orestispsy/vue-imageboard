new Vue({
    el: ".main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        password: "",
    },
    mounted: function () {
        var self = this;
        axios
            .get("/imageboard")
            .then(function (response) {
                console.log("response", response.data);
                self.images = response.data.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
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
            console.log(
                "title: ",
                this.title,
                "description: ",
                this.description,
                "username: ",
                this.username,
                "file: ",
                this.file
            );
            var self = this;
            axios
                .post("/upload", formData)
                .then(function (response) {
                    console.log(
                        "response from post req: ",
                        response.data.uploadedFile
                    );
                    self.images.unshift(response.data.uploadedFile);
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                });
        },
        handleChange: function (e) {
            console.log("e.target.files[0]: ", e.target.files[0]);
            console.log("handle change is running!");
            this.file = e.target.files[0];
        },
    },
});
