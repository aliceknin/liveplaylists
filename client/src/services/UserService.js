class UserService {
    
    getProof() {
        return fetch('/proof', {})
        .then(response => {
            let r = response.json();
            console.log(r);
            return r;
        });
    }

    login() {
        console.log('I even called the service');
        return fetch('/auth/spotify', {})
        .then(response => {
            console.log(response);
            let r = response.json();
            console.log(r);
        });
    }

    getLoggedInUser() {
        return fetch('/auth/user', {})
        .then(response => {
            let r = response.json();
            console.log(r);
            return r;
        });
    }

    logout() {
        return fetch('/auth/logout', {})
        // .then(response =>{
        //     return response.json();
        // });
    }

}

export default UserService;