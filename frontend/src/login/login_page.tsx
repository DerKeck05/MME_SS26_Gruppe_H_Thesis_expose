function LoginPage () {
    return ( 
        <div> 
            <h1> Login Page</h1>
        </div>
    )
}

export default LoginPage;

function Form() {
    const ageInputId = useID();
    return ( 
        <>
        <label>
            Email:
            <input name= "EMAIL"/>
            </label></>
            <hr /> 
             <label>
            <Password></Password>:
            <input name= ">PASSWORD"/>
            </label></>
    )
}