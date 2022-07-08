import React,{useState} from 'react'
import FirebaseAuthService from '../FirebaseAuthService'

function LoginForm({existingUser}) {
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const handleSubmit=async(event)=>{
        event.preventDefault()
        try {
            await FirebaseAuthService.loginUser(username,password)
            setusername("")
            setpassword("")
        } catch (error) {
            alert(error.message)
        }
    }

    const handleLogout=()=>{
        FirebaseAuthService.logoutUser()
    }

    const onChangeHandler =(name, event)=>{
        if(name === "email"){
            // console.log(event.target.value)
            return setusername(event.target.value)
        }else{
            
            return setpassword(event.target.value)
        }
    }
    const handleSendResetPasswordEmail=async()=>{
        if(!username){
            alert("Email required")
            return
        }
        try {
            await FirebaseAuthService.sendPasswordResetEmail(username)
            alert("reset password request submitted")
        } catch (error) {
            alert(error.message)
        }
    }

    const handleLoginWithGoogle =async()=>{
        try {
            await FirebaseAuthService.loginWithGoogle()
        } catch (error) {
            alert(error.message)
        }
    }
  return (
    <div className='login-form-container'>
        {
            existingUser ? (<div className='row'>
                <h3>Welcome, {existingUser.email}</h3>
                <button type='button' className='primary-button' onClick={handleLogout}>Logout</button>
            </div>):(<form onSubmit={handleSubmit} className="login-form">
                <label className='input-label login-label'>
                    Username (email):
                    <input
                    type="email"
                    required
                    value={username}
                    onChange={(e)=>{
                        onChangeHandler("email",e)
                    }}
                    // className="input-text"
                    />
                </label>
                <label className='input-label login-label'>
                    Password:
                    <input
                    type="password"
                    required
                    value={password}
                    onChange={(e)=>{
                        onChangeHandler("password",e)
                    }}
                    // className="input-text"
                    />
                </label>
                <div className='button-box'>
                    <button className='primary-button'>Login</button>
                    <button type='button' onClick={handleSendResetPasswordEmail} className="primary-button">Reset Password</button>
                    <button type='button' onClick={handleLoginWithGoogle} className="primary-button">Login With Google</button>
                </div>
            </form>)
        }
    </div>
  )
}

export default LoginForm