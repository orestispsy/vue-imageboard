Vue.component("card-component", {
    template: "#individual-image",
    data: function () {
        return {
            url: "",
            username: "",
            title: "",
            description: "",
            created_at: ""
        };
    },
    props: ["cardId"],
    mounted: function () {
       console.log("Selected Card Id", this.cardId)
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
            this.$emit("remove")
        }
    }
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
                console.log("COMMENTS RESPONSE DATA",response.data);
                self.comments=response.data
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
                img_id: this.imgId
            }
            console.log("comment data", commentData)
            var self = this;
            axios
                .post("/addcomment", commentData)
                .then(function (response) {
                    
                    self.comments.unshift(response.data.postedComment);
                    self.username = ""
                    self.comment = ""
 
                })
                .catch(function (err) {
                    console.log("error from post req", err);
                });
            }
      
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
        cardSelected: null,

        seen: true
    },
    mounted: function () {
        var self = this;
        axios
            .get("/imageboard")
            .then(function (response) {
                console.log("response", response.data);
                self.images = response.data
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
                    self.title="";
                    self.description="";
                    self.username="";
                    self.file="";
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
        selectCard: function(id) {

            this.cardSelected=id;
             this.seen = false;
        },
        closeCard: function() {

            this.cardSelected = null;
            this.seen = true;
        },
    },
});
