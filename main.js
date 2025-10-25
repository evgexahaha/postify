const host = 'https://postifyapi/api';

const app = Vue.createApp({
    data() {
        return {
            page: 'mainPage',
            posts: null,
            post: null,
            registerForm: {
                name: null,
                email: null,
                password: null,
            },
            loginForm: {
                email: null,
                password: null,
            },
            storeForm: {
                title: null,
                description: null,
                photo: null,
            },
            commentForm: {
                comment: null,
            },
            userPosts: null,
            comments: null,
            api_token: localStorage.getItem('api_token'),
        }
    },
    methods: {
        // Отображение всех постов
        allPosts() {
            const raw = "";

            const requestOptions = {
                method: "GET",
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/posts`)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.posts = result.data.posts;
                })
                .catch((error) => console.error(error));
        },

        // Отображение поста по id
        loadPost(id) {
            const raw = "";

            const requestOptions = {
                method: "GET",
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/posts/${id}`)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.allComments(id);
                    this.post = result.data.post;
                    this.page = 'postPage';
                })
                .catch((error) => console.error(error));
        },

        // Регистрация
        register() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "name": this.registerForm.name,
                "email": this.registerForm.email,
                "password": this.registerForm.password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/register`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.page = 'loginPage';
                    this.registerForm.name = null;
                    this.registerForm.email = null;
                    this.registerForm.password = null;
                })
                .catch((error) => console.error(error));
        },

        // Авторизация
        login() {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "email": this.loginForm.email,
                "password": this.loginForm.password
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/login`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    if (result.data.api_token) {
                        this.loginForm.email = null;
                        this.loginForm.password = null;

                        localStorage.setItem('api_token', result.data.api_token);
                        localStorage.setItem('name', result.data.name);

                        this.api_token = result.data.api_token;

                        this.profile();
                        this.page = 'profilePage';
                    } else {
                        alert('Неправильный email или пароль!');
                    }
                })
                .catch((error) => console.error(error));
        },

        // Выход
        logout() {
            localStorage.removeItem('api_token');
            localStorage.removeItem('name');
            this.api_token = null;
            this.userPosts = null;
            this.page = 'loginPage';
        },

        // Создание поста
        store() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.api_token}`);

            const formdata = new FormData();
            formdata.append("title", this.storeForm.title);
            formdata.append("description", this.storeForm.description);
            formdata.append("photo_url", this.$refs.photo.files[0]);

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: formdata,
                redirect: "follow"
            };

            fetch(`${host}/post/new`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    this.storeForm.title = null;
                    this.storeForm.description = null;
                    this.$refs.photo.files[0] = null;

                    this.allPosts();
                    this.profile();
                    this.page = 'profilePage';
                })
                .catch((error) => console.error(error));
        },

        // Удаление поста
        destroy(id) {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.api_token}`);

            const raw = "";

            const requestOptions = {
                method: "DELETE",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/post/${id}/delete`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.allPosts();
                    this.profile();

                    this.page = 'profilePage';
                })
                .catch((error) => console.error(error));
        },

        // Просмотр профиля
        profile() {
            const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${this.api_token}`);

            const raw = "";

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/profile`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.userPosts = result.data.userPosts;
                })
                .catch((error) => console.error(error));
        },

        // Обновление поста
        updatePost(id) {

        },

        // Отображение всех комментариев
        allComments(id) {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            fetch(`${host}/post/${id}/comments`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    // console.log(result);
                    this.comments = result.data.comments;
                })
                .catch((error) => console.error(error));
        },

        // Добавление комментария
        addComment(id) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", `Bearer ${this.api_token}`);

            const raw = JSON.stringify({
                "comment": this.commentForm.comment
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch(`${host}/post/${id}/comment/new`, requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                    this.allComments(id);
                    this.commentForm.comment = null;
                })
                .catch((error) => console.error(error));
        },
    },
    mounted() {
        this.allPosts();
        if (this.api_token) {
            this.profile();
        }
    }
}).mount('#app');