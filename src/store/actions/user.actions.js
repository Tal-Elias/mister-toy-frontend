import { socketService } from "../../services/socket.service.js"
import { userService } from "../../services/user.service.js"
import { LOADING_DONE, LOADING_START } from "../reducers/system.reducer.js"
import { CLEAR_CART } from "../reducers/toy.reducer.js"
import { REMOVE_USER, SET_USER, SET_USERS, SET_USER_SCORE, SET_WATCHED_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export async function loadUsers() {
    try {
        store.dispatch({ type: LOADING_START })
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
}

export async function login(credentials) {
    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('user actions -> Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('user actions -> Cannot signup', err)
        throw err
    }
}

export async function logout() {
    try {
        await userService.logout()
        store.dispatch({ type: SET_USER, user: null })
        socketService.logout()
    } catch (err) {
        console.error('user actions -> Cannot logout:', err)
        throw err
    }
}

export async function checkout(diff) {
    try {
        const newScore = await userService.updateScore(diff)
        store.dispatch({ type: CLEAR_CART })
        store.dispatch({ type: SET_USER_SCORE, score: newScore })
    } catch (err) {
        console.error('user actions -> Cannot checkout:', err)
        throw err
    }
}

export async function loadUser(userId) {
    try {
        const user = await userService.getById(userId);
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
}