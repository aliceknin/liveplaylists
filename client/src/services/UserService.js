class UserService {
    
    getProof() {
        return fetch('/proof', {})
        .then(response => {
            let r = response.json();
            console.log(r);
            return r;
        });
    }

}

export default UserService;