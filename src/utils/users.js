const users =[]

const addUser = ({ id, username, Room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    //validate the data
    if(!username || !Room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.Room === Room && user.username ===username 
    })

    //validate username
    if(existingUser) {
        return {
            error: 'username is in use!'
        }
    }

    //store user
    const user = { id, username, Room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if(index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (Room) => {
    Room = Room.trim().toLowerCase()
    return users.filter((user) => user.Room ===Room)
}
            // addUser({
            //     id: 2,
            //     username: 'divy',
            //     Room: 'butani'
            // })

            // addUser({
            //     id: 23,
            //     username: 'raj',
            //     Room: 'butani'
            // })

            // addUser({
            //     id: 263,
            //     username: 'raj',
            //     Room: 'Center City'
            // })

            // const user = getUser(23)
            // console.log(user)

            // const userList = getUserInRoom('butani')
            // console.log(userList)       

// const removedUser = removeUser(2)
// console.log(removedUser)
// console.log(users)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
