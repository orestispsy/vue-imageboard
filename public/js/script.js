Vue.component("card-component", {
    template: "#individual-image",
    data: function () {
        return {
            url: "",
            username: "",
            title: "",
            description: "",
            created_at: "",
        };
    },
    props: ["cardId"],
    mounted: function () {
        console.log("Selected Card Id", this.cardId);
        var self = this;
        axios
            .get("/imageboard/" + this.cardId)
            .then(function (response) {
                console.log(response.data);
                self.url = response.data[0].url;
                self.username = response.data[0].username;
                self.title = response.data[0].title;
                self.description = response.data[0].description;
                self.created_at = response.data[0].created_at;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        unPop: function () {
            this.$emit("remove");
            location.href = location.origin;
        },
    },
    watch: {
        cardId: function () {
        console.log("Selected Card Id", this.cardId);
        var self = this;
        axios
            .get("/imageboard/" + this.cardId)
            .then(function (response) {
                console.log(response.data);
                self.url = response.data[0].url;
                self.username = response.data[0].username;
                self.title = response.data[0].title;
                self.description = response.data[0].description;
                self.created_at = response.data[0].created_at;
            })
            .catch(function (err) {
                console.log("error in axios", err);
                self.$emit("remove"); 
                location.href = location.origin;
            });
    }
    },
});

Vue.component("comments-component", {
    template: "#comments-template",
    data: function () {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imgId"],
    mounted: function () {
        console.log("Selected Image Id", this.imgId);
        var self = this;
        axios
            .get("/comments/" + this.imgId)
            .then(function (response) {
                console.log("COMMENTS RESPONSE DATA", response.data);
                self.comments = response.data;
            })
            .catch(function (err) {
                console.log("error in axios", err);
            });
    },
    methods: {
        handleCommentsClick: function (e) {
            const commentData = {
                username: this.username,
                comment: this.comment,
                img_id: this.imgId,
            };
            console.log("comment data", commentData);
            var self = this;
            axios
                .post("/addcomment", commentData)
                .then(function (response) {
                    self.comments.unshift(response.data.postedComment);
                    self.username = "";
                    self.comment = "";
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                   
                });
        },
    },
    watch: {
        imgId: function () {
            console.log("Selected Image Id in Watcher", this.imgId);
            var self = this;
            axios
                .get("/comments/" + this.imgId)
                .then(function (response) {
                    console.log("COMMENTS RESPONSE DATA", response.data);
                    self.comments = response.data;
                })
                .catch(function (err) {
                    console.log("error in axios", err);
                });
        },
    },
});

new Vue({
    el: ".main",
    data: {
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        password: "",
        cardSelectedId: location.hash.slice(1),
        seen: !location.hash.slice(1),
        more: !location.hash.slice(1),
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

        window.addEventListener("hashchange", function () {
            self.cardSelectedId = location.hash.slice(1);
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
                    self.title = "";
                    self.description = "";
                    self.username = "";
                    document.querySelector('input[type="file"]').value = "";
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
        selectCard: function (id) {
            this.cardSelectedId = id;
            this.seen = false;
            this.more = false;
        },
        closeCard: function () {
            this.cardSelectedId = null;
            this.seen = true;
            this.more = true;
        },
        moreResults: function () {
            var self = this;
            axios
                .get("/get-next/" + this.images[this.images.length - 1].id)
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {
                        self.images.push(response.data[i]);
                    }
                    if (!response.data[1]) {
                        self.more = false;
                    }
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                });
        },
    },
});
