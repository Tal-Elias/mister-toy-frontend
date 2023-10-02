
import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { login, signup } from '../../store/actions/user.actions'
import { userService } from '../../services/user.service'

export function LoginSignup() {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    const [isSignupState, setIsSignupState] = useState(false)

    function handleCredentialsChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials(credentials => ({ ...credentials, [field]: value }))
    }

    async function onSubmit(ev) {
        ev.preventDefault();

        try {
            if (isSignupState) {
                const user = await signup(credentials)
                showSuccessMsg(`Welcome ${user.fullname}`)
            } else {
                const user = await login(credentials)
                showSuccessMsg(`Hi again ${user.fullname}`)
            }
        } catch (err) {
            console.error('Error:', err)
            showErrorMsg(isSignupState ? 'Cannot signup' : 'Cannot login')
        }
    }

    function onToggleSignupState() {
        setIsSignupState(isSignupState => !isSignupState)
    }

    const { username, password, fullname } = credentials

    return (
        <div className="login-page">

            <form className="login-form" onSubmit={onSubmit}>
                <input
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Username"
                    onChange={handleCredentialsChange}
                    required
                    autoFocus
                />

                <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Password"
                    onChange={handleCredentialsChange}
                    required
                />

                {isSignupState && <input
                    type="text"
                    name="fullname"
                    value={fullname}
                    placeholder="Full name"
                    onChange={handleCredentialsChange}
                    required
                />}

                <button>{isSignupState ? 'Signup' : 'Login'}</button>
            </form>

            <div className="btns">
                <a href="#" onClick={onToggleSignupState}>
                    {isSignupState ? 'Already a member? Login' : 'New user? Signup here'}
                </a >
            </div>
        </div >
    )
}

